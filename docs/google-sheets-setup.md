# Подключение Google-таблицы для лидов

Лиды с форм сайта пишутся в таблицу через **Apps Script Web App** — скрипт живёт
внутри самой таблицы, поэтому не нужен ни Google Cloud, ни сервис-аккаунт.

Займёт ~5 минут.

---

## Шаг 1. Создать скрипт в таблице

Открой [таблицу](https://docs.google.com/spreadsheets/d/1v2_l2YfRr4sie83cK2j-icd5CL-Epp9MM7AW79MoZlY/edit)
→ меню **Расширения** → **Apps Script**.

Удали всё, что там есть, и вставь этот код:

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
      sheet.appendRow(['Дата', 'Email', 'Имя', 'Компания', 'Источник']);
      sheet.getRange(1, 1, 1, 5).setFontWeight('bold');
    }

    sheet.appendRow([
      data.ts ? new Date(data.ts) : new Date(),
      data.email || '',
      data.name || '',
      data.company || '',
      data.source || '',
    ]);

    return ContentService.createTextOutput('ok');
  } catch (err) {
    return ContentService.createTextOutput('error: ' + err.message);
  }
}
```

Замени `ЗАМЕНИ_НА_СВОЙ_СЕКРЕТ` на любую длинную случайную строку и сохрани
(иконка дискеты или Ctrl+S).

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

## Шаг 3. Прописать переменные в Vercel

Проект на Vercel → **Settings** → **Environment Variables**, добавь две:

| Переменная | Значение |
|---|---|
| `GOOGLE_SHEETS_WEBHOOK_URL` | URL из шага 2 |
| `GOOGLE_SHEETS_WEBHOOK_SECRET` | тот же секрет, что в скрипте |

Выбери все окружения (Production / Preview / Development) и сохрани.

## Шаг 4. Передеплоить

Vercel → **Deployments** → у последнего деплоя меню «…» → **Redeploy**.
Переменные окружения подхватываются только при новом деплое.

---

## Проверка

Отправь тестовый email через форму на сайте — строка должна появиться в таблице
в течение пары секунд.

Если строки нет: Vercel → Deployments → последний деплой → **Runtime Logs**,
ищи строки с префиксом `[sheets]` — там будет причина (неверный URL, не совпал
секрет, недостаточный доступ у деплоя).

## Если что-то менял в скрипте

После правки кода Apps Script нужно **заново развернуть**: Deploy → Manage
deployments → карандаш → Version: *New version* → Deploy. Без этого правки не
попадут в опубликованный веб-апп.
