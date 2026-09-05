"""
Выносит один демо-инструмент лендинга в самостоятельное приложение.

Скрипт, а не шесть ручных копирований: инструменты устроены одинаково, и
разъехавшиеся между репозиториями каркасы пришлось бы чинить шесть раз.
Всё, что тут захардкожено, — список файлов инструмента; остальное общее.
"""
import json, os, re, shutil, sys
from pathlib import Path

SRC = Path(os.environ.get("LANDING_ROOT", Path(__file__).resolve().parent.parent))
OUT_ROOT = Path(os.environ.get("OUT_ROOT", "/tmp/standalone-tools"))

# id → (имя продукта, папка компонента, файл компонента, свой lib, описание)
TOOLS = {
    "bizdoctor": dict(
        name="BizDoctor", comp="bizdoctor/BizDoctorTool.tsx", libs=[],
        ru="Диагностика бизнеса: где теряются деньги и что чинить первым",
        en="Business diagnosis: where the money leaks and what to fix first"),
    "coldmessage": dict(
        name="ColdMessage Pro", comp="coldmessage/ColdMessageTool.tsx", libs=["coldmessage"],
        ru="Холодное сообщение под конкретного человека, а не шаблон",
        en="A cold message written for one specific person, not a template"),
    "objectionkiller": dict(
        name="ObjectionKiller", comp="objectionkiller/ObjectionKillerTool.tsx", libs=["objectionkiller"],
        ru="Ответы на возражения клиента в диалоге",
        en="Answers to sales objections, in a live dialogue"),
    "followupbot": dict(
        name="FollowUpBot", comp="followupbot/FollowUpBotTool.tsx", libs=["coldmessage"],
        ru="Серия дожимов по сделке, которая зависла",
        en="A follow-up sequence for a deal that went quiet"),
    "inboxzero": dict(
        name="InboxZero", comp="inboxzero/InboxZeroTool.tsx", libs=[],
        ru="Разбор письма: срочность, суть и готовый ответ",
        en="Inbox triage: urgency, the gist, and a ready reply"),
    "trendsniper": dict(
        name="Trend Sniper", comp="trendsniper/TrendSniperTool.tsx", libs=["trendsniper"],
        ru="Модель поискового интереса к теме по регионам",
        en="A model of search interest in a topic, by region"),
}

# Ключи словаря инструментов, которые нужны всем: общие строки и метки.
SHARED_KEYS = ["common", "tones", "tiers", "urgency", "severity", "direction"]


def top_level_blocks(body: str):
    """Разбирает тело объекта на пары ключ → текст блока по отступу в 2 пробела.

    Скобочный разбор, а не регулярка: в блоках есть вложенные объекты,
    массивы и строки с фигурными скобками внутри."""
    blocks, i, n = {}, 0, len(body)
    while i < n:
        m = re.compile(r"^  ([A-Za-z_][\w]*):", re.M).search(body, i)
        if not m:
            break
        key, start = m.group(1), m.start()
        j, depth, instr, esc = m.end(), 0, None, False
        while j < n:
            ch = body[j]
            if instr:
                if esc: esc = False
                elif ch == "\\": esc = True
                elif ch == instr: instr = None
            elif ch in "\"'`": instr = ch
            elif ch in "{[(": depth += 1
            elif ch in "}])":
                depth -= 1
                if depth < 0: break
            elif ch in ",;" and depth == 0:
                # В типе члены разделяет `;`, в объекте — `,`; разбираем оба.
                j += 1
                break
            j += 1
        blocks[key] = body[start:j].rstrip()
        i = j
    return blocks


def slice_object(text: str, header: str, keep: list[str]) -> str:
    """Оставляет в объекте `header` только перечисленные ключи."""
    start = text.index(header)
    open_brace = text.index("{", start)
    depth, j, instr, esc = 0, open_brace, None, False
    while j < len(text):
        ch = text[j]
        if instr:
            if esc: esc = False
            elif ch == "\\": esc = True
            elif ch == instr: instr = None
        elif ch in "\"'`": instr = ch
        elif ch == "{": depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0: break
        j += 1
    body = text[open_brace + 1:j]
    blocks = top_level_blocks(body)
    missing = [k for k in keep if k not in blocks]
    if missing:
        raise SystemExit(f"в {header} не найдены ключи: {missing}")
    sep = ";" if "type" in header else ","
    kept = "\n\n".join(blocks[k].rstrip(",;") + sep for k in keep)
    return text[:open_brace + 1] + "\n" + kept + "\n" + text[j:]


def build_tools_content(tool: str) -> str:
    text = (SRC / "src/lib/content/tools.ts").read_text()
    keep = SHARED_KEYS + [tool]
    for header in ["export type ToolsContent =", "const ruTools: ToolsContent =",
                   "const enTools: ToolsContent ="]:
        text = slice_object(text, header, keep)
    text = text.replace('import type { Locale } from "../i18n";',
                        'import type { Locale } from "../i18n";')
    return text


def write(path: Path, content: str):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content)


def extract(tool: str):
    meta = TOOLS[tool]
    out = OUT_ROOT / tool
    if out.exists():
        shutil.rmtree(out)
    comp_file = Path(meta["comp"]).name
    comp_name = comp_file.replace(".tsx", "")

    # ── код инструмента ───────────────────────────────────────────────
    shutil.copytree(SRC / "src/app/api" / tool, out / "src/app/api" / tool)
    write(out / "src/components" / comp_file,
          (SRC / "src/components" / meta["comp"]).read_text())
    for lib in meta["libs"]:
        write(out / "src/lib" / f"{lib}.ts", (SRC / "src/lib" / f"{lib}.ts").read_text())

    # ── общие модули ──────────────────────────────────────────────────
    for f in ["gemini.ts", "i18n.ts"]:
        write(out / "src/lib" / f, (SRC / "src/lib" / f).read_text())

    # Текст лимита на лендинге зовёт «оформить доступ» — там для этого есть
    # форма. Здесь её нет, и звать некуда: сообщение говорит только про лимит.
    msgs = (SRC / "src/lib/apiMessages.ts").read_text()
    msgs = msgs.replace(
        '  toolLimit:\n    "Демо-лимит этого инструмента — 2 запроса в день. '
        'Оформите доступ, чтобы использовать без ограничений.",',
        '  toolLimit: "Лимит инструмента — 2 запуска в день. Попробуйте завтра.",')
    msgs = msgs.replace(
        '  toolLimit:\n    "This tool\'s demo limit is 2 requests per day. '
        'Get access to use it without limits.",',
        '  toolLimit: "This tool is capped at 2 runs a day. Try again tomorrow.",')
    write(out / "src/lib/apiMessages.ts", msgs)

    # Лента активности — часть лендинга, здесь её нет: снимаем крючок.
    rl = (SRC / "src/lib/rate-limit.ts").read_text()
    rl = rl.replace(
        '      const { recordToolRun } = await import("./activity");\n'
        '      await recordToolRun(tool).catch(() => {});\n', "")
    write(out / "src/lib/rate-limit.ts", rl)

    write(out / "src/lib/content/tools.ts", build_tools_content(tool))
    used = icons_used([SRC / "src/components" / meta["comp"]])
    used |= {"IconProps", "IconComponent"}
    write(out / "src/components/icons.tsx", slice_icons(used))
    # .reveal и .collapse обслуживают компоненты лендинга, которых здесь нет.
    css = (SRC / "src/app/globals.css").read_text()
    css = re.sub(r"/\*\*\n \* Появление секций.*?\n\.collapse > \* \{[^}]*\}\n",
                 "", css, flags=re.S)
    write(out / "src/app/globals.css", css)

    # ── конфиги ───────────────────────────────────────────────────────
    for f in ["tsconfig.json", "postcss.config.mjs", "next.config.mjs", "tailwind.config.ts"]:
        write(out / f, (SRC / f).read_text())
    write(out / "LICENSE", (SRC / "LICENSE").read_text())

    pkg = {
        "name": tool, "version": "0.1.0", "private": True,
        "description": meta["en"],
        "scripts": {"dev": "next dev", "build": "next build", "start": "next start",
                    "typecheck": "tsc --noEmit"},
        "dependencies": {"next": "^15.1.0", "react": "^19.0.0", "react-dom": "^19.0.0"},
        "devDependencies": {"@types/node": "^22.0.0", "@types/react": "^19.0.0",
                            "@types/react-dom": "^19.0.0", "autoprefixer": "^10.4.20",
                            "postcss": "^8.4.49", "tailwindcss": "^3.4.17",
                            "typescript": "^5.7.0"},
    }
    write(out / "package.json", json.dumps(pkg, indent=2, ensure_ascii=False) + "\n")

    # ── каркас: шапка, две локали, метаданные ─────────────────────────
    write(out / "src/lib/shell.tsx",
          SHELL_TSX.format(name=meta["name"], ru=meta["ru"], en=meta["en"]))
    write(out / "src/app/(ru)/layout.tsx",
          LAYOUT_TSX.format(locale="ru", lang="ru", shell_import="../..", css_import=".."))
    write(out / "src/app/(ru)/page.tsx", PAGE_TSX.format(comp=comp_name, locale="ru"))
    write(out / "src/app/(en)/layout.tsx",
          LAYOUT_TSX.format(locale="en", lang="en", shell_import="../..", css_import=".."))
    write(out / "src/app/(en)/en/page.tsx", PAGE_TSX.format(comp=comp_name, locale="en"))

    # Гарнитура лендинга приходит из next/font/google; здесь её нет, чтобы
    # сборка репозитория не зависела от сети. Системный стек выглядит близко.
    tw = (out / "tailwind.config.ts").read_text().replace(
        'sans: ["var(--font-inter)", "system-ui", "sans-serif"],',
        'sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],'
    ).replace(
        'heading: ["var(--font-inter)", "system-ui", "sans-serif"],',
        'heading: ["Inter", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],'
    )
    write(out / "tailwind.config.ts", tw)

    write(out / ".gitignore", GITIGNORE)
    write(out / ".env.example", ENV_EXAMPLE)
    write(out / ".github/workflows/ci.yml", CI_YML)
    write(out / "README.md", readme(tool, meta))
    return out, comp_name



def slice_icons(used: set[str]) -> str:
    """Оставляет в наборе иконок только те, что реально импортированы.

    Полный набор — полсотни глифов на весь лендинг; в отдельном инструменте
    сорок пять из них были бы мёртвым кодом, который читающий репозиторий
    принимает за общий дизайн-набор и боится трогать."""
    text = (SRC / "src/components/icons.tsx").read_text()
    head_end = text.index("export const ")
    head, tail = text[:head_end], text[head_end:]

    kept, dropped = [], 0
    for block in re.split(r"\n(?=export const )", tail):
        m = re.match(r"export const (\w+)", block)
        if not m:
            continue
        if m.group(1) in used:
            kept.append(block.rstrip())
        else:
            dropped += 1
    note = (
        f"\n/* Из общего набора лендинга здесь оставлены только используемые "
        f"иконки ({len(kept)} из {len(kept) + dropped}). */\n\n"
    )
    return head.rstrip() + "\n" + note + "\n\n".join(kept) + "\n"


def icons_used(paths: list[Path]) -> set[str]:
    names: set[str] = set()
    for path in paths:
        for m in re.finditer(
            r"import\s*(?:type\s*)?\{([^}]*)\}\s*from\s*\"[^\"]*icons\"", path.read_text()
        ):
            for part in m.group(1).split(","):
                part = part.strip().removeprefix("type ").strip()
                if part:
                    names.add(part)
    return names


# ── каркас приложения ─────────────────────────────────────────────────

SHELL_TSX = """import type {{ Metadata }} from "next";
import {{ localePath, type Locale }} from "./i18n";

/**
 * Каркас страницы инструмента: шапка с названием, переключатель языка и
 * подвал. Отдельный модуль, потому что оба корневых layout'а (русский и
 * английский) рендерят одно и то же — различается только атрибут lang.
 */

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const COPY: Record<Locale, {{
  title: string;
  subtitle: string;
  switchLabel: string;
  poweredBy: string;
  limitNote: string;
}}> = {{
  ru: {{
    title: "{name}",
    subtitle: "{ru}",
    switchLabel: "Switch to English",
    poweredBy: "Работает на Gemini",
    limitNote: "Бесплатно, без регистрации — 2 запуска в день с одного адреса.",
  }},
  en: {{
    title: "{name}",
    subtitle: "{en}",
    switchLabel: "Переключить на русский",
    poweredBy: "Runs on Gemini",
    limitNote: "Free, no signup — 2 runs a day per address.",
  }},
}};

export function buildMetadata(locale: Locale): Metadata {{
  const t = COPY[locale];
  return {{
    metadataBase: new URL(SITE_URL),
    title: `${{t.title}} — ${{t.subtitle}}`,
    description: t.subtitle,
    alternates: {{
      canonical: localePath(locale),
      languages: {{ ru: "/", en: "/en" }},
    }},
    openGraph: {{
      title: t.title,
      description: t.subtitle,
      url: localePath(locale),
      type: "website",
    }},
  }};
}}

export function ToolShell({{
  locale,
  children,
}}: {{
  locale: Locale;
  children: React.ReactNode;
}}) {{
  const t = COPY[locale];
  const other: Locale = locale === "ru" ? "en" : "ru";

  return (
    <div className="min-h-screen bg-dark">
      <header className="border-b border-white/[0.06]">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
          <span className="font-heading text-base font-semibold tracking-tight text-primary">
            {{t.title}}
          </span>
          <a
            href={{localePath(other)}}
            className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-secondary transition-colors hover:border-white/25 hover:text-primary"
          >
            {{t.switchLabel}}
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="font-heading text-3xl font-semibold tracking-tighter text-primary sm:text-4xl">
          {{t.title}}
        </h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-secondary">
          {{t.subtitle}}
        </p>
        <p className="mt-2 text-sm text-secondary">{{t.limitNote}}</p>
        <div className="mt-8">{{children}}</div>
      </main>

      <footer className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-4xl px-4 py-6 text-xs text-secondary sm:px-6">
          {{t.poweredBy}}
        </div>
      </footer>
    </div>
  );
}}
"""

LAYOUT_TSX = """import type {{ Metadata }} from "next";
import {{ buildMetadata }} from "{shell_import}/lib/shell";
import "{css_import}/globals.css";

export const metadata: Metadata = buildMetadata("{locale}");

export default function RootLayout({{
  children,
}}: Readonly<{{ children: React.ReactNode }}>) {{
  return (
    <html lang="{lang}">
      <body>{{children}}</body>
    </html>
  );
}}
"""

PAGE_TSX = """import {comp} from "@/components/{comp}";
import {{ ToolShell }} from "@/lib/shell";

export default function Page() {{
  return (
    <ToolShell locale="{locale}">
      <{comp} locale="{locale}" />
    </ToolShell>
  );
}}
"""

GITIGNORE = """node_modules/
.next/
out/
.env
.env.local
*.tsbuildinfo
.DS_Store
"""

ENV_EXAMPLE = """# Ключ Google Gemini — без него роут отвечает 500 с понятным текстом.
# https://aistudio.google.com/apikey
GEMINI_API_KEY=

# Необязательно: Upstash Redis для лимитов, переживающих холодный старт.
# Без него лимиты живут в памяти инстанса и сбрасываются вместе с ним.
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Необязательно: канонический адрес деплоя для метаданных.
NEXT_PUBLIC_SITE_URL=
"""

CI_YML = """name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run typecheck
      - run: npm run build
"""


def readme(tool: str, meta: dict) -> str:
    return f"""# {meta['name']}

{meta['ru']}

Инструмент вынесен из [ai-integrator-landing](https://github.com/MERSEI/ai-integrator-landing),
где он живёт одной из страниц каталога. Здесь — то же самое отдельным
приложением: свой деплой, свои лимиты и своя история изменений.

## Как это устроено

Одна страница на язык (`/` — русская, `/en` — английская) и один API-роут
`POST /api/{tool}`. Роут собирает системный промпт, зовёт Gemini со схемой
ответа и отдаёт готовый JSON — разбирать текст модели на клиенте не нужно.

| Файл | Назначение |
|---|---|
| `src/app/api/{tool}/route.ts` | промпт, схема ответа, вызов модели, лимиты |
| `src/components/{Path(meta['comp']).name}` | форма и вывод результата |
| `src/lib/gemini.ts` | общий клиент модели и определение языка ответа |
| `src/lib/rate-limit.ts` | лимиты по IP: burst, дневной и на инструмент |
| `src/lib/content/tools.ts` | весь текст интерфейса на двух языках |

## Лимиты

Три уровня, все по IP: не больше десяти запросов в минуту, тридцати в сутки
и двух в сутки на сам инструмент. При настроенном Upstash счётчики переживают
холодный старт функции; без него они живут в памяти инстанса — лимит
получается мягче, но сервис не падает из-за недоступного Redis.

## Запуск

```bash
npm install
cp .env.example .env.local   # и вписать GEMINI_API_KEY
npm run dev
```

Проверки перед пушем:

```bash
npm run typecheck
npm run build
```

## Деплой

Vercel подхватывает проект без настройки: нужен только `GEMINI_API_KEY`
в переменных окружения (и пара ключей Upstash, если лимиты должны переживать
перезапуск).

## Лицензия

MIT — см. `LICENSE`.
"""


if __name__ == "__main__":
    for t in (sys.argv[1:] or TOOLS):
        out, comp = extract(t)
        print(f"{t:16} → {out}  (компонент {comp})")
