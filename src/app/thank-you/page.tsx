import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Спасибо! — AI Integrator",
  robots: { index: false },
};

export default function ThankYou() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-dark px-4 text-center">
      <div className="text-6xl">🎉</div>
      <h1 className="mt-6 font-heading text-3xl font-bold text-white sm:text-4xl">
        Заявка принята!
      </h1>
      <p className="mt-4 max-w-md text-lg text-slate-400">
        Мы свяжемся с вами в течение 24 часов и проведём бесплатную диагностику
        вашего бизнеса.
      </p>
      <Link href="/" className="btn-primary mt-8">
        ← Вернуться на главную
      </Link>
    </main>
  );
}
