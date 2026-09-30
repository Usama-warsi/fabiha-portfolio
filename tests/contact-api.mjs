import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import ts from "typescript";

const source = readFileSync(new URL("../src/app/api/contact/route.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
const { POST } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);

test("contact validation and Slack delivery outcomes", async () => {
  const originalFetch = globalThis.fetch;
  const originalSecret = process.env.SLACK_WEBHOOK_URL;
  let calls = 0;
  let payload;
  const valid = { name: "Test Visitor", email: "visitor@example.com", interest: "Commission", message: "A portrait inquiry" };
  const request = (body, origin = "https://portfolio.test") => new Request("https://portfolio.test/api/contact", {
    method: "POST", headers: { origin }, body: typeof body === "string" ? body : JSON.stringify(body),
  });
  try {
    process.env.SLACK_WEBHOOK_URL = "https://example.invalid/test-webhook";
    globalThis.fetch = async (_url, options) => {
      calls++;
      payload = JSON.parse(options.body);
      assert.equal(payload.attachments[0].color, "#995f49");
      payload.blocks = payload.attachments[0].blocks;
      return new Response("ok");
    };
    assert.equal((await POST(request("{invalid"))).status, 400);
    assert.equal((await POST(request({ ...valid, email: "bad" }))).status, 400);
    assert.equal((await POST(request({ ...valid, interest: "Invalid" }))).status, 400);
    assert.equal((await POST(request({ ...valid, message: "x".repeat(5001) }))).status, 400);
    assert.equal((await POST(request(valid, "https://other.test"))).status, 403);
    assert.equal((await POST(request({ ...valid, website: "spam" }))).status, 200);
    assert.equal(calls, 0);
    assert.equal((await POST(request({ ...valid, message: "<!channel> " + "x".repeat(4500) }))).status, 200);
    assert.equal(calls, 1);
    assert.equal(payload.blocks[0].type, "header");
    const fields = payload.blocks.find((block) => block.fields)?.fields;
    assert.equal(fields.length, 5);
    assert.ok(fields.some((field) => field.text === "PHONE\nNot provided"));
    assert.ok(fields.every((field) => field.type === "plain_text" && field.text.length <= 2000));
    assert.ok(fields.some((field) => field.text.includes(valid.email)));
    const messageBlocks = payload.blocks.filter((block) => block.type === "section" && block.text?.type === "plain_text");
    assert.equal(messageBlocks.map((block) => block.text.text).join(""), "<!channel> " + "x".repeat(4500));
    assert.ok(messageBlocks.every((block) => block.text.text.length <= 3000));
    assert.equal((await POST(request({ ...valid, phone: "+92 300 1234567" }))).status, 200);
    assert.ok(payload.blocks.find((block) => block.fields).fields.some((field) => field.text === "PHONE\n+92 300 1234567"));
    assert.equal((await POST(request({ ...valid, phone: "invalid" }))).status, 400);
    assert.equal((await POST(request({ ...valid, phone: "123" }))).status, 400);
    globalThis.fetch = async () => new Response("invalid_payload", { status: 400 });
    assert.equal((await POST(request(valid))).status, 502);
    globalThis.fetch = async () => { throw new Error("network failure"); };
    assert.equal((await POST(request(valid))).status, 502);
    delete process.env.SLACK_WEBHOOK_URL;
    assert.equal((await POST(request(valid))).status, 503);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalSecret === undefined) delete process.env.SLACK_WEBHOOK_URL;
    else process.env.SLACK_WEBHOOK_URL = originalSecret;
  }
});
