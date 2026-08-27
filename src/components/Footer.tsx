import Logo from "./Logo";
import { CONTACTS, getContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

export default function Footer({ locale }: { locale: Locale }) {
  const t = getContent(locale).footer;

  return (
    <footer className="relative bg-dark py-14">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        aria-hidden="true"
      />
      <div className="container-section grid gap-10 md:grid-cols-3">
        <div>
          <Logo className="h-8 w-auto" />
          <p className="mt-3 text-sm text-slate-500">{t.tagline}</p>
          <p className="mt-6 text-sm text-slate-600">
            © {new Date().getFullYear()} AI Integrator
          </p>
        </div>

        <nav aria-label={t.productTitle}>
          <p className="font-semibold text-white">{t.productTitle}</p>
          <ul className="mt-4 space-y-2">
            {t.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-slate-400 transition hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="font-semibold text-white">{t.contactsTitle}</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-400">
            <li>
              <a href={`mailto:${CONTACTS.email}`} className="hover:text-white">
                {CONTACTS.email}
              </a>
            </li>
            <li>
              <a
                href={`https://t.me/${CONTACTS.telegram.replace("@", "")}`}
                className="hover:text-white"
              >
                Telegram: {CONTACTS.telegram}
              </a>
            </li>
            <li>
              <a
                href={`tel:${CONTACTS.phone.replace(/\s/g, "")}`}
                className="hover:text-white"
              >
                {CONTACTS.phone}
              </a>
            </li>
            <li>{CONTACTS.address}</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
