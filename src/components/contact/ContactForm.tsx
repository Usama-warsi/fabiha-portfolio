"use client";

import { useState } from "react";
import { artist } from "@/data/artist";

const INTERESTS = ["Commission", "Portrait", "Mural", "Workshop", "Other"] as const;

export function ContactForm({ artworkTitle }: { artworkTitle?: string }) {
  const [interest, setInterest] = useState<string>(artworkTitle ? "Other" : "Commission");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "");
    const email = String(data.get("email") || "");
    const phone = String(data.get("phone") || "");
    const message = String(data.get("message") || "");

    setSending(true);
    setSent(false);
    setError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message, interest, artwork: artworkTitle, website: data.get("website") }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Could not send your inquiry.");
      setSent(true);
      form.reset();
      setInterest(artworkTitle ? "Other" : "Commission");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Connection failed. Please try again.");
    } finally {
      setSending(false);
    }
  }

  const fieldCls =
    "w-full border-b border-charcoal/25 bg-transparent py-3 font-sans text-[15px] text-charcoal outline-none transition-colors placeholder:text-charcoal/65 focus:border-charcoal";

  return (
    <form onSubmit={handleSubmit} aria-busy={sending} className="space-y-10">
      {artworkTitle && <div className="border-l-2 border-terracotta bg-ivory p-5"><p className="eyebrow text-charcoal/65">Artwork inquiry</p><p className="mt-2 font-serif text-3xl" dir="auto">{artworkTitle}</p></div>}
      <div hidden aria-hidden="true"><label htmlFor="website">Website</label><input id="website" name="website" tabIndex={-1} autoComplete="off" /></div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="eyebrow text-charcoal/65">
            Name
          </label>
          <input id="name" name="name" required maxLength={120} disabled={sending} autoComplete="name" placeholder="Your name" className={`${fieldCls} mt-3`} />
        </div>
        <div>
          <label htmlFor="email" className="eyebrow text-charcoal/65">
            Email
          </label>
          <input id="email" name="email" type="email" required maxLength={254} disabled={sending} autoComplete="email" placeholder="you@email.com" className={`${fieldCls} mt-3`} />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="eyebrow text-charcoal/65">Phone <span className="normal-case tracking-normal">(optional)</span></label>
        <input id="phone" name="phone" type="tel" autoComplete="tel" maxLength={40} disabled={sending} placeholder="+92 300 1234567" className={`${fieldCls} mt-3`} />
      </div>

      <fieldset disabled={sending}>
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
          defaultValue={artworkTitle ? `Hi Fabiha, I'm interested in “${artworkTitle}”. Could you share more details about this artwork?` : ""}
          required
          maxLength={5000}
          disabled={sending}
          rows={5}
          placeholder="Tell me about your story, memory or idea…"
          className={`${fieldCls} mt-3 resize-none`}
        />
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <button
          type="submit"
          disabled={sending}
          className="group inline-flex items-center gap-3 bg-charcoal px-8 py-4 font-sans text-[13px] uppercase tracking-wide2 text-warmwhite transition-colors hover:bg-ink"
        >
          {sending ? "Sending…" : "Send Inquiry"}
          <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">
            →
          </span>
        </button>
        {sent && (
          <p role="status" className="font-sans text-[13px] text-charcoal/60">
            Thank you! Your inquiry has been sent.
          </p>
        )}
        {error && (
          <p role="alert" className="font-sans text-[13px] text-terracotta">
            {error} You can also write to{" "}
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
