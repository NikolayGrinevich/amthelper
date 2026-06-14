const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Set viewport to a reasonable size
  await page.setViewportSize({ width: 1280, height: 800 });

  await page.goto('https://amthelper.vercel.app/de/auth/signin');
  await page.waitForLoadState('networkidle');

  await page.fill('input[type="email"]', 'demo@amthelper.de');
  await page.fill('input[type="password"]', 'AmtHelper#2026!');
  await page.click('button[type="submit"]');

  await page.waitForURL('**/de/dashboard**');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // Take viewport screenshot
  await page.screenshot({ path: 'dashboard-viewport.png', fullPage: false });
  console.log('Viewport screenshot saved');

  // Also zoom in on sidebar area
  const sidebar = await page.locator('[class*="w-64"]').first();
  await sidebar.screenshot({ path: 'sidebar-closeup.png' });
  console.log('Sidebar closeup saved');

  await browser.close();
})();