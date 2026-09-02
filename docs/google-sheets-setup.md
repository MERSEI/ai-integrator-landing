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

const HEADERS = [
  'Дата',
  'Email',
  'Канал связи',
  'Контакт',
  'Написать',
  'Интерес',
  'Контекст',
  'Имя',
  'Компания',
  'Источник',
];

// Ключи приходят с сайта в неизменном виде — здесь только подписи для таблицы.
const CHANNEL_LABELS = {
  email: 'Email',
  telegram: 'Telegram',
  whatsapp: 'WhatsApp',
  phone: 'Телефон',
};

const INTEREST_LABELS = {
  attract: 'Привлечение',
  sales: 'Продажи',
  content: 'Контент',
  analytics: 'Аналитика',
  other: 'Пока не уверен(а)',
};

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (SECRET && data.secret !== SECRET) {
      return ContentService.createTextOutput('forbidden');
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    // Первый запуск: проставляем заголовки колонок.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    const channel = data.channel || 'email';
    // Для канала "email" отдельного контакта нет — это и есть сам email.
    const contact = data.contact || (channel === 'email' ? data.email : '') || '';

    sheet.appendRow([
      data.ts ? new Date(data.ts) : new Date(),
      data.email || '',
      CHANNEL_LABELS[channel] || channel,
      contact,
      contactLink(channel, contact),
      INTEREST_LABELS[data.interest] || data.interest || '',
      data.note || '',
      data.name || '',
      data.company || '',
      data.source || '',
    ]);

    return ContentService.createTextOutput('ok');
  } catch (err) {
    return ContentService.createTextOutput('error: ' + err.message);
  }
}

// Колонка «Написать»: кликабельная ссылка прямо в тот канал, который выбрал лид.
function contactLink(channel, contact) {
  const value = String(contact).replace(/"/g, '').trim();
  if (!value) return '';

  const digits = value.replace(/[^0-9]/g, '');
  let url = '';

  if (channel === 'telegram') {
    url = 'https://t.me/' + value.replace('@', '');
  } else if (channel === 'whatsapp' && digits) {
    url = 'https://wa.me/' + digits;
  } else if (channel === 'phone' && digits) {
    url = 'tel:+' + digits;
  } else if (value.indexOf('@') !== -1) {
    url = 'mailto:' + value;
  }

  if (!url) return '';
  // Разделитель аргументов в формулах, которые ставятся из скрипта, — всегда
  // запятая, независимо от локали таблицы.
  return '=HYPERLINK("' + url + '", "Написать")';
}
```

Замени `ЗАМЕНИ_НА_СВОЙ_СЕКРЕТ` на любую длинную случайную строку и сохрани
(иконка дискеты или Ctrl+S).

> 📋 **Если таблица уже с лидами** (старый скрипт на 5 колонок). Заголовки
> проставляются только на пустом листе, поэтому шапку нужно поправить руками —
> иначе новые строки поедут относительно старых подписей. Проще всего вставить
> три новые колонки после `Email` (`Канал связи`, `Контакт`, `Написать`) и две
> после них (`Интерес`, `Контекст`), чтобы порядок совпал с `HEADERS` в скрипте:
> `Дата · Email · Канал связи · Контакт · Написать · Интерес · Контекст · Имя · Компания · Источник`.
> У старых строк новые ячейки просто останутся пустыми.

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

## Что попадает в таблицу

| Колонка | Откуда |
|---|---|
| `Дата` | момент отправки формы |
| `Email` | обязательное поле формы |
| `Канал связи` | выбор лида: Email / Telegram / WhatsApp / Телефон |
| `Контакт` | `@ник` или номер в выбранном канале (для Email — сам email) |
| `Написать` | ссылка в один клик: `t.me`, `wa.me`, `tel:` или `mailto:` |
| `Интерес` | необязательный селект «что автоматизировать» |
| `Контекст` | расчёт из калькулятора: сумма ROI, тариф, ниша, вводные ползунков |
| `Имя`, `Компания` | заполняются только формами, где эти поля есть |
| `Источник` | блок, из которого пришёл лид: `hero`, `final-cta`, `calculator-modal` |

Канал и контакт нормализуются на стороне сайта (`src/lib/contactChannel.ts`):
в таблицу телеграм приходит как `@username`, номера — как `+380…`. Неизвестный
канал всегда сохраняется как `email` — колонка не может оказаться пустой.

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
  -d '{"email":"test@example.com","channel":"telegram","contact":"@durov","interest":"sales","source":"curl","secret":"ТВОЙ_СЕКРЕТ"}' \
  "ТВОЙ_WEB_APP_URL"
```

Ответ `ok` и новая строка в таблице — скрипт исправен, проблема на стороне
переменных сайта. Ответ `forbidden` — не совпал секрет. HTML — не тот доступ.

## Если что-то менял в скрипте

После правки кода Apps Script нужно **заново развернуть**: Deploy → Manage
deployments → карандаш → Version: *New version* → Deploy. Без этого правки не
попадут в опубликованный веб-апп.
