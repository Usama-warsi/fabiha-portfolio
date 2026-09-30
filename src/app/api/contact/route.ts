const interests = new Set(["Commission", "Portrait", "Mural", "Workshop", "Other"]);

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return Response.json({ error: "Invalid request origin." }, { status: 403 });
  }

  let input: Record<string, unknown>;
  try {
    const body = await request.text();
    if (body.length > 20000) return Response.json({ error: "Message is too large." }, { status: 413 });
    const parsed: unknown = JSON.parse(body);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Invalid body");
    input = parsed as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Please submit a valid inquiry." }, { status: 400 });
  }

  // A hidden field catches simple form-filling bots without bothering visitors.
  if (input.website) return Response.json({ ok: true });
  const field = (key: string) => typeof input[key] === "string" ? (input[key] as string).trim() : "";
  const name = field("name");
  const email = field("email");
  const phone = field("phone");
  const interest = field("interest");
  const message = field("message");
  const artwork = field("artwork");
  if (artwork.length > 200) return Response.json({ error: "Invalid artwork." }, { status: 400 });
  if (phone && (phone.length > 40 || !/^[+\d\s().-]+$/.test(phone) || phone.replace(/\D/g, "").length < 7 || phone.replace(/\D/g, "").length > 15)) {
    return Response.json({ error: "Please enter a valid phone number, including country code, or leave it blank." }, { status: 400 });
  }
  if (!name || name.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 ||
      !interests.has(interest) || !message || message.length > 5000) {
    return Response.json({ error: "Please check your name, email and message (maximum 5,000 characters)." }, { status: 400 });
  }

  const webhook = process.env.SLACK_WEBHOOK_URL;
  if (!webhook) return Response.json({ error: "The contact form is temporarily unavailable. Please email the artist directly." }, { status: 503 });

  try {
    // Plain-text blocks prevent visitor input from becoming Slack mentions or markup.
    const plainText = (text: string) => ({ type: "plain_text", text, emoji: false });
    const sections = message.match(/[\s\S]{1,2500}/g)!;
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `New ${interest.toLowerCase()} inquiry — Fabiha Shaheen Portfolio`,
        unfurl_links: false,
        unfurl_media: false,
        attachments: [{
          color: "#995f49",
          blocks: [
          { type: "header", text: { type: "plain_text", text: "🎨 New Portfolio Inquiry", emoji: true } },
          { type: "context", elements: [plainText("FABIHA SHAHEEN  ·  Contact & Commissions")] },
          { type: "divider" },
          { type: "section", fields: [
            plainText(`NAME\n${name}`),
            plainText(`EMAIL\n${email}`),
            plainText(`PHONE\n${phone || "Not provided"}`),
            plainText(`INTERESTED IN\n${interest}`),
            plainText("SOURCE\nPortfolio contact form"),
            ...(artwork ? [plainText(`ARTWORK\n${artwork}`)] : []),
          ] },
          { type: "divider" },
          { type: "section", text: { type: "mrkdwn", text: "*Message*" } },
          ...sections.map((text) => ({ type: "section", text: plainText(text) })),
          { type: "divider" },
          { type: "context", elements: [plainText("Reply directly to the visitor using the email address above.")] },
          ],
        }],
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok || (await response.text()).trim() !== "ok") throw new Error("Delivery failed");
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Your inquiry could not be sent. Please try again or email the artist directly." }, { status: 502 });
  }
}
