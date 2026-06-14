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
  await page.waitForTimeout(3000);

  // Check sidebar HTML
  const sidebarHtml = await page.locator('aside, [class*="w-64"], [class*="w-20"]').first().innerHTML();
  console.log('=== SIDEBAR HTML ===');
  console.log(sidebarHtml.substring(0, 5000));
  
  // Also check for any element containing "Sprache"
  const hasSprache = await page.locator('text=Sprache').count();
  console.log('\n=== "Sprache" elements found:', hasSprache);
  
  // Check for DE/RU/UK/RO buttons
  const deBtn = await page.locator('button:has-text("DE"), button:has-text("de")').count();
  const ruBtn = await page.locator('button:has-text("RU"), button:has-text("ru")').count();
  const ukBtn = await page.locator('button:has-text("UK"), button:has-text("uk")').count();
  const roBtn = await page.locator('button:has-text("RO"), button:has-text("ro")').count();
  console.log('DE buttons:', deBtn, 'RU buttons:', ruBtn, 'UK buttons:', ukBtn, 'RO buttons:', roBtn);

  // Check isOpen state by looking at sidebar width
  const sidebar = page.locator('aside, [class*="w-64"], [class*="w-20"]').first();
  const className = await sidebar.getAttribute('class');
  console.log('\n=== Sidebar class:', className);

  // Take screenshot
  await page.screenshot({ path: 'dashboard-screenshot.png', fullPage: true });
  console.log('\nScreenshot saved');

  await browser.close();
})();