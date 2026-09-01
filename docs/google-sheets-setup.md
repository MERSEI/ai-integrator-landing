# Подключение Google-таблицы для лидов

Лиды с форм сайта пишутся в таблицу через **Apps Script Web App** — скрипт живёт
внутри самой таблицы, поэтому не нужен ни Google Cloud, ни сервис-аккаунт.

Займёт ~5 минут.

---

## Шаг 1. Создать скрипт в таблице

Открой [таблицу](https://docs.google.com/spreadsheets/d/1v2_l2YfRr4sie83cK2j-icd5CL-Epp9MM7AW79MoZlY/edit)
→ меню **Расширения** → **Apps Script**.

Удали всё, что там есть, и вставь код ниже.

> ⚠️ **Копируй только сам код** — без строк с обратными кавычками (` ``` `) в
> начале и конце. Это разметка markdown, а не JavaScript: если она попадёт в
> редактор, скрипт не скомпилируется и веб-апп будет молча отдавать ошибку на
> каждый запрос. Готовый файл начинается с `const SECRET` и заканчивается `}`.

```javascript
// Секрет должен совпадать с GOOGLE_SHEETS_WEBHOOK_SECRET в Vercel.
// Придумай любую длинную строку и подставь её сюда.
const SECRET = 'ЗАМЕНИ_НА_СВОЙ_СЕКРЕТ';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (SECRET && data.secret !== SECRET) {
      return ContentService.createTextOutput('forbidden');
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    // Первый запуск: проставляем заголовки колонок.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Дата', 'Email', 'Имя', 'Компания', 'Источник',
        'Созвон', 'Часовой пояс', 'Канал связи', 'Контакт', 'Интерес', 'Комментарий',
      ]);
      sheet.getRange(1, 1, 1, 11).setFontWeight('bold');
    }

    sheet.appendRow([
      data.ts ? new Date(data.ts) : new Date(),
      data.email || '',
      data.name || '',
      data.company || '',
      data.source || '',
      // Колонки ниже заполняются только заявками с формы записи на созвон.
      data.slot ? new Date(data.slot) : '',
      data.timezone || '',
      data.channel || '',
      data.contact || '',
      data.interest || '',
      data.note || '',
    ]);

    return ContentService.createTextOutput('ok');
  } catch (err) {
    return ContentService.createTextOutput('error: ' + err.message);
  }
}
```

Замени `ЗАМЕНИ_НА_СВОЙ_СЕКРЕТ` на любую длинную случайную строку и сохрани
(иконка дискеты или Ctrl+S).

**Проверь, что код валиден:** после сохранения в выпадающем списке функций
сверху должен появиться `doPost`. Если список пустой — в файле синтаксическая
ошибка (чаще всего — случайно скопированные ` ``` `).

## Шаг 2. Опубликовать как веб-приложение

В Apps Script: **Deploy** (Развернуть) → **New deployment** (Новое развёртывание).

- Шестерёнка рядом с "Select type" → **Web app**
- **Execute as**: `Me` (от моего имени)
- **Who has access**: `Anyone` (Все) — обязательно, иначе сайт не достучится
- Нажми **Deploy**

Google попросит разрешения — подтверди (появится экран "Google hasn't verified
this app" → *Advanced* → *Go to ... (unsafe)*; это твой собственный скрипт).

Скопируй **Web app URL** — он вида
`https://script.google.com/macros/s/AKfy.../exec`

## Шаг 3. Прописать переменные окружения

Добавь две переменные **в том хостинге, где реально работает сайт**:

| Переменная | Значение |
|---|---|
| `GOOGLE_SHEETS_WEBHOOK_URL` | URL из шага 2 |
| `GOOGLE_SHEETS_WEBHOOK_SECRET` | тот же секрет, что в скрипте |

- **Vercel**: Settings → Environment Variables, отметить все окружения
  (Production / Preview / Development).
- **Railway**: сервис → Variables.

> ⚠️ Если сайт задеплоен и туда, и туда — переменные нужны **в обоих местах**.
> Наборы переменных у деплоев независимые, и форма на домене Vercel не увидит
> то, что прописано в Railway (и наоборот).

## Шаг 4. Передеплоить

Переменные окружения подхватываются только новым деплоем:

- **Vercel**: Deployments → у последнего меню «…» → **Redeploy**.
- **Railway**: сервис пересобирается сам после сохранения переменных; если нет —
  **Deploy** вручную.

---

## Проверка

Отправь тестовый email через форму на сайте — строка должна появиться в таблице
в течение пары секунд.

Если строки нет — смотри логи рантайма (Vercel: Deployments → деплой → Runtime
Logs; Railway: вкладка Logs) и ищи префикс `[sheets]`:

| В логах | Причина |
|---|---|
| `GOOGLE_SHEETS_WEBHOOK_URL не задан` | переменная не долетела до этого деплоя — не сохранена или не было редеплоя |
| `неожиданный ответ Apps Script: forbidden` | секрет в скрипте и в переменной не совпадают |
| `неожиданный ответ` с HTML внутри | при деплое выбран доступ не `Anyone` — Google отдаёт страницу логина |
| `error: ...` | исключение внутри скрипта |
| ничего с `[sheets]` вообще | запрос ушёл на другой хостинг — проверь, на каком домене отправлял форму |

Можно проверить сам веб-апп в обход сайта — из терминала:

```bash
curl -L -X POST -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","source":"curl","secret":"ТВОЙ_СЕКРЕТ"}' \
  "ТВОЙ_WEB_APP_URL"
```

Ответ `ok` и новая строка в таблице — скрипт исправен, проблема на стороне
переменных сайта. Ответ `forbidden` — не совпал секрет. HTML — не тот доступ.

## Если что-то менял в скрипте

После правки кода Apps Script нужно **заново развернуть**: Deploy → Manage
deployments → карандаш → Version: *New version* → Deploy. Без этого правки не
попадут в опубликованный веб-апп.

---

## Заявки на созвон

С сентября 2026 в финальном CTA есть вторая форма — выбор дня и времени созвона
(`/api/book-call`). Она пишется в ту же таблицу, но приносит шесть дополнительных
полей: `Созвон` (момент в часовом поясе лида), `Часовой пояс`, `Канал связи`
(telegram/email/phone/whatsapp), `Контакт`, `Интерес` и `Комментарий`.

Если скрипт в таблице остался старый (5 колонок), сайт не сломается — Apps Script
просто проигнорирует лишние поля, и запись о созвоне попадёт в таблицу без деталей
времени. Чтобы их видеть, замените код скрипта на версию выше и **сделайте новый
деплой** (Deploy → Manage deployments → карандаш → New version): без нового деплоя
правки кода на боевой URL не попадают. Заголовки колонок дописываются только в
пустой таблице — в уже заполненную допишите их руками одной строкой.

---

## Удаление тестовых строк

За время отладки в таблицу попали заявки, которых не было: собственные адреса,
`test@example.com`, моки и служебные источники (`smtp-test`, `cli-check`,
`prod-smoke-test`). Чтобы не выбирать их глазами, добавьте эту функцию в тот же
файл Apps Script и запустите её **один раз** из редактора (выбрать
`cleanupTestRows` в списке функций → Run). Веб-апп она не трогает и повторного
деплоя не требует.

```javascript
// Разовая чистка: удаляет из таблицы заявки, созданные при отладке.
// Список намеренно узкий — под свои адреса и служебные источники, чужие лиды
// под него не попадают.
function cleanupTestRows() {
  const TEST_SOURCES = ['smtp-test', 'cli-check', 'cli-check-2', 'prod-smoke-test'];
  const TEST_EMAILS = ['test@example.com'];

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  const values = sheet.getDataRange().getValues();
  let removed = 0;

  // Идём снизу вверх: удаление строки сдвигает все, что под ней.
  for (let i = values.length - 1; i >= 1; i--) {
    const email = String(values[i][1] || '').toLowerCase();
    const source = String(values[i][4] || '').toLowerCase();

    const isTest =
      email.indexOf('aleksfialko15') !== -1 ||
      email.indexOf('.mock.') !== -1 ||
      TEST_EMAILS.indexOf(email) !== -1 ||
      TEST_SOURCES.indexOf(source) !== -1;

    if (isTest) {
      sheet.deleteRow(i + 1);
      removed++;
    }
  }

  Logger.log('Удалено тестовых строк: ' + removed);
}
```

Ожидаемо удалится 9 строк: два `prod-smoke-test` от 01.09.2026, `smtp-test` и
два `cli-check` от 27.08, собственный адрес от 27.07, `test@example.com` от
07.08 и две записи `sophia.lopez.mock.us@gmail.com` от 10.08. После запуска
функцию можно удалить из файла.
