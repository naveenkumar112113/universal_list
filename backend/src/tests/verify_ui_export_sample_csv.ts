import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function verifyUiExportSampleCsv() {
  console.log('========================================================');
  console.log('VERIFYING UI EXPORT SAMPLE CSV IN ADMIN DASHBOARD');
  console.log('========================================================\n');

  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,820'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 820 });

  page.on('dialog', async (dialog) => {
    await dialog.accept();
  });

  try {
    // 1. Login as admin
    console.log('[Step 1] Logging into admin account...');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
    await page.focus('input[type="email"]');
    await page.keyboard.type('admin@example.com');
    await page.focus('input[type="password"]');
    await page.keyboard.type('admin123');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
    await sleep(1500);

    // 2. Navigate to Admin Dashboard
    console.log('[Step 2] Navigating to Admin Dashboard Tab 7 (AdSense & CSV Import)...');
    await page.goto('http://localhost:5173/dashboard/admin', { waitUntil: 'networkidle0' });
    await sleep(1500);

    const adsTabBtn = await page.$('button ::-p-text(AdSense & CSV Import)');
    if (!adsTabBtn) throw new Error('AdSense & CSV Import tab button not found');
    await adsTabBtn.click();
    await sleep(1200);

    // 3. Scroll to Bulk CSV Importer card
    console.log('[Step 3] Scrolling to Bulk CSV Importer card...');
    const card = await page.$('::-p-text(Bulk CSV Importer)');
    if (card) {
      await page.evaluate((el: any) => el.scrollIntoView({ behavior: 'instant', block: 'center' }), card);
      await sleep(1000);
    }

    // 4. Verify Export Sample CSV button
    console.log('[Step 4] Checking "Export Sample CSV" button...');
    const exportBtn = await page.$('button ::-p-text(Export Sample CSV)');
    if (!exportBtn) throw new Error('"Export Sample CSV" button not found in Bulk CSV Importer card');
    console.log('✓ Found "Export Sample CSV" button!');

    // Take screenshot of the Bulk CSV Importer card with Export Sample CSV button
    const screenshotPath = '/home/naveen/.gemini/antigravity-ide/brain/55e52df9-6f2e-4ed8-a4a7-cd081a3b533e/bulk_csv_with_export_sample.png';
    await page.screenshot({ path: screenshotPath });
    console.log(`✓ Saved UI verification screenshot: ${screenshotPath}`);

    console.log('\n========================================================');
    console.log('UI VERIFICATION COMPLETED SUCCESSFULLY!');
    console.log('========================================================');
  } finally {
    await browser.close();
  }
}

verifyUiExportSampleCsv().catch((err) => {
  console.error('UI verification failed:', err);
  process.exit(1);
});
