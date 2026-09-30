"use client";

import { useState } from "react";
import { artist } from "@/data/artist";

const INTERESTS = ["Commission", "Portrait", "Mural", "Workshop", "Other"] as const;

/**
 * No server backend is configured. On submit this composes a pre-filled email
 * via the visitor's mail client (mailto:). To capture inquiries server-side,
 * replace `handleSubmit` with a POST to an API route / form service
 * (e.g. Resend, Formspree, or a Next.js route handler that sends mail).
 */
export function ContactForm() {
  const [interest, setInterest] = useState<string>("Commission");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "");
    const email = String(data.get("email") || "");
    const message = String(data.get("message") || "");

    const subject = encodeURIComponent(`${interest} inquiry — ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nInterested in: ${interest}\n\n${message}`
    );
    window.location.href = `mailto:${artist.email}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  const fieldCls =
    "w-full border-b border-charcoal/25 bg-transparent py-3 font-sans text-[15px] text-charcoal outline-none transition-colors placeholder:text-charcoal/65 focus:border-charcoal";

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="eyebrow text-charcoal/65">
            Name
          </label>
          <input id="name" name="name" required autoComplete="name" placeholder="Your name" className={`${fieldCls} mt-3`} />
        </div>
        <div>
          <label htmlFor="email" className="eyebrow text-charcoal/65">
            Email
          </label>
          <input id="email" name="email" type="email" required autoComplete="email" placeholder="you@email.com" className={`${fieldCls} mt-3`} />
        </div>
      </div>

      <fieldset>
        <legend className="eyebrow text-charcoal/65">I&apos;m interested in</legend>
        <div className="mt-4 flex flex-wrap gap-3">
          {INTERESTS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setInterest(opt)}
              aria-pressed={interest === opt}
              className={`border px-4 py-2 font-sans text-[13px] tracking-wide2 transition-colors ${
                interest === opt
                  ? "border-charcoal bg-charcoal text-warmwhite"
                  : "border-charcoal/25 text-charcoal/70 hover:border-charcoal/60"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="message" className="eyebrow text-charcoal/65">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Tell me about your story, memory or idea…"
          className={`${fieldCls} mt-3 resize-none`}
        />
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <button
          type="submit"
          className="group inline-flex items-center gap-3 bg-charcoal px-8 py-4 font-sans text-[13px] uppercase tracking-wide2 text-warmwhite transition-colors hover:bg-ink"
        >
          Send Inquiry
          <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">
            →
          </span>
        </button>
        {sent && (
          <p role="status" className="font-sans text-[13px] text-charcoal/60">
            Opening your email client… if nothing happens, write to{" "}
            <a href={`mailto:${artist.email}`} className="link-underline text-charcoal">
              {artist.email}
            </a>
            .
          </p>
        )}
      </div>
    </form>
  );
}
