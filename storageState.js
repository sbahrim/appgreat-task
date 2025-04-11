const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({headless: false});
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://github.com/login');

  // Manually log in here
  console.log('Please log in manually and press Enter in the terminal when done.');
  await new Promise(resolve => process.stdin.once('data', resolve));

  // Save storage state
  await context.storageState({ path: 'storageState.json' });
  await browser.close();
})();