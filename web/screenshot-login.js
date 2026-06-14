const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Go to login page
  await page.goto('https://amthelper.vercel.app/de/auth/signin');
  await page.waitForLoadState('networkidle');

  // Fill login form
  await page.fill('input[type="email"]', 'demo@amthelper.de');
  await page.fill('input[type="password"]', 'AmtHelper#2026!');
  await page.click('button[type="submit"]');

  // Wait for redirect to dashboard
  await page.waitForURL('**/de/dashboard**');
  await page.waitForLoadState('networkidle');

  // Wait a bit for content to render
  await page.waitForTimeout(3000);

  // Take screenshot
  await page.screenshot({ path: 'dashboard-screenshot.png', fullPage: true });

  console.log('Screenshot saved to dashboard-screenshot.png');

  // Check for white screen - check if body has content
  const bodyText = await page.textContent('body');
  const hasContent = bodyText && bodyText.trim().length > 100;
  console.log('Page has content:', hasContent);

  await browser.close();

  if (!hasContent) {
    process.exit(1);
  }
})();