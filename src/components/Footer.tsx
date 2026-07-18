import { FaLinkedin, FaTwitter, FaFacebook } from "react-icons/fa";
import { CONTACTS } from "@/lib/content";

const PRODUCT_LINKS = [
  { href: "#features", label: "Приложения" },
  { href: "#pricing", label: "Цены" },
  { href: "#how-it-works", label: "Как это работает" },
  { href: "#results", label: "Результаты" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-dark py-14">
      <div className="container-section grid gap-10 md:grid-cols-3">
        <div>
          <p className="flex items-center gap-2 font-heading text-lg font-bold text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-primary to-secondary text-sm">
              AI
            </span>
            AI Integrator
          </p>
          <p className="mt-3 text-sm text-slate-500">
            Making AI work for everyone
          </p>
          <p className="mt-6 text-sm text-slate-600">
            © {new Date().getFullYear()} AI Integrator
          </p>
        </div>

        <nav aria-label="Продукт">
          <p className="font-semibold text-white">Продукт</p>
          <ul className="mt-4 space-y-2">
            {PRODUCT_LINKS.map((link) => (
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
          <p className="font-semibold text-white">Контакты</p>
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
          <div className="mt-5 flex gap-4 text-slate-500">
            <a href="#" aria-label="LinkedIn" className="transition hover:text-white">
              <FaLinkedin size={20} />
            </a>
            <a href="#" aria-label="Twitter" className="transition hover:text-white">
              <FaTwitter size={20} />
            </a>
            <a href="#" aria-label="Facebook" className="transition hover:text-white">
              <FaFacebook size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
