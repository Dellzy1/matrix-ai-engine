// Smoke test for Decision Loop. Run it against the live site or a local server:
//   node scripts/smoke-test.mjs https://your-site.vercel.app
// It opens the home page on a phone and on a computer, checks that it renders,
// that a "Coming soon" tile opens its box, and that the page throws no errors.
// Needs Playwright:  npm i -D playwright  then  npx playwright install chromium

import { chromium } from "playwright";

const BASE = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const results = [];
const record = (name, ok, detail = "") => {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  (${detail})` : ""}`);
};

const viewports = [
  { label: "phone", width: 390, height: 844 },
  { label: "computer", width: 1440, height: 900 },
];

const browser = await chromium.launch();

for (const vp of viewports) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  const errors = [];
  const badResponses = [];
  page.on("pageerror", (err) => errors.push(err.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("response", (res) => {
    if (res.status() >= 400) badResponses.push(`${res.status()} ${res.url()}`);
  });

  try {
    const res = await page.goto(BASE, { waitUntil: "networkidle", timeout: 60000 });
    record(`${vp.label}: home page loads`, !!res && res.ok(), `HTTP ${res?.status()}`);

    // The brain image is on every version of the home screen.
    // Phones and computers each have their own hero image, so count only the visible one.
    const hasHero = (await page.locator('img[src="/brain.jpg"]:visible').count()) > 0;
    record(`${vp.label}: hero image shows`, hasHero);

    // Open the first "Coming soon" tile and close it again.
    const soonTile = page.getByRole("button", { name: /Assistant|Solver|Opportunity|Marketing|Accountability|Journal/i }).first();
    const hasSoon = await soonTile.isVisible().catch(() => false);
    if (hasSoon) {
      await soonTile.click();
      const box = page.getByText(/coming soon/i).first();
      const opened = await box.isVisible({ timeout: 3000 }).catch(() => false);
      record(`${vp.label}: Coming soon box opens`, opened);
      await page.keyboard.press("Escape");
      await page.mouse.click(5, 5);
    } else {
      record(`${vp.label}: Coming soon tile found`, false, "no matching tile on this layout");
    }

    const problems = [...errors.slice(0, 3), ...badResponses.slice(0, 5)];
    record(`${vp.label}: no page errors`, errors.length === 0 && badResponses.length === 0, problems.join(" | "));
  } catch (err) {
    record(`${vp.label}: run completed`, false, err.message);
  } finally {
    await page.close();
  }
}

await browser.close();

const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed} passed, ${failed} failed.`);
process.exit(failed ? 1 : 0);
