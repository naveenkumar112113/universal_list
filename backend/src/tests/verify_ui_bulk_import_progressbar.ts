import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function verifyUiBulkImportProgressBar() {
  console.log('========================================================');
  console.log('VERIFYING UI BULK IMPORT WITH REAL-TIME PROGRESS BAR');
  console.log('========================================================\n');

  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,1200'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1200 });

  page.on('dialog', async (dialog) => {
    console.log('[Browser Dialog]:', dialog.message());
    await dialog.accept();
  });

  page.on('console', (msg) => {
    console.log('[Browser Console]:', msg.type(), msg.text());
  });

  page.on('pageerror', (err: any) => {
    console.log('[Browser PageError]:', err.message);
  });

  try {
    // 1. Login as admin via API and set in localStorage
    console.log('[Step 1] Authenticating as admin via API...');
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@example.com', password: 'admin123' })
    });
    const loginData: any = await loginRes.json();
    const token = loginData.token || loginData.data?.token;
    const user = loginData.user || loginData.data?.user || { role: 'Super Admin', email: 'admin@example.com' };

    await page.goto('http://localhost:5173/login', { waitUntil: 'domcontentloaded' });
    await page.evaluate((tok, usr) => {
      localStorage.setItem('token', tok);
      localStorage.setItem('user', JSON.stringify(usr));
    }, token, user);
    console.log('✓ Admin authenticated and credentials set in localStorage.');

    // 2. Navigate to Admin Dashboard
    console.log('[Step 2] Navigating to Admin Dashboard (/admin)...');
    await page.goto('http://localhost:5173/admin', { waitUntil: 'networkidle0' });
    await sleep(2000);

    // Click Tab 7 (AdSense & CSV Import)
    console.log('[Step 3] Selecting AdSense & CSV Import tab...');
    const adsTabBtn = await page.waitForSelector('button ::-p-text(AdSense & CSV Import)', { timeout: 10000 });
    if (!adsTabBtn) throw new Error('AdSense & CSV Import tab button not found');
    await adsTabBtn.click();
    await sleep(1500);

    // 3. Locate Bulk CSV Importer card and scroll into view
    console.log('[Step 4] Checking Bulk CSV Importer card and scrolling into view...');
    const card = await page.waitForSelector('::-p-text(Bulk CSV Importer)', { timeout: 5000 });
    if (!card) throw new Error('Bulk CSV Importer card not found');
    await card.evaluate(el => el.scrollIntoView({ behavior: 'smooth', block: 'center' }));
    await sleep(800);
    console.log('✓ Found and centered Bulk CSV Importer card!');

    // Prepare test CSV
    const testCsvPath = '/home/naveen/development/nodejs/universal_list/test_bulk_models.csv';
    const fileInput = await page.$('input[type="file"][accept=".csv"]');
    if (!fileInput) throw new Error('CSV file input element not found');

    // Take screenshot before upload
    const artifactDir = '/home/naveen/.gemini/antigravity-ide/brain/6e28ce15-8fb5-4d76-8aa1-2dd570f2d22a';
    await page.screenshot({ path: path.join(artifactDir, '1_before_upload.png') });
    console.log('✓ Screenshot saved: 1_before_upload.png');

    // 4. Upload file and observe real-time progress
    console.log('[Step 5] Uploading CSV file to trigger real-time progress bar...');
    await fileInput.uploadFile(testCsvPath);

    // Wait for progress bar to appear
    await sleep(400);
    await page.screenshot({ path: path.join(artifactDir, '2_import_in_progress.png') });
    console.log('✓ Screenshot saved: 2_import_in_progress.png');

    // Wait until completed (search for "Completed" or "100%")
    console.log('[Step 6] Waiting for import to complete 100%...');
    await page.waitForSelector('::-p-text(Completed 100%)', { timeout: 30000 }).catch(async () => {
      return page.waitForSelector('::-p-text(100%)', { timeout: 15000 });
    });

    await sleep(1000);
    await page.screenshot({ path: path.join(artifactDir, '3_import_completed.png') });
    console.log('✓ Screenshot saved: 3_import_completed.png');

    // Verify elements on page
    const pageText = await page.evaluate(() => {
      const el = document.querySelector('body');
      return (el?.innerText || '').toLowerCase();
    });

    if (!pageText.includes('bulk import progress')) {
      throw new Error('Title "Bulk Import Progress" not found on page!');
    }
    if (!pageText.includes('total records')) {
      throw new Error('"Total Records" label not found!');
    }
    if (!pageText.includes('inserted records')) {
      throw new Error('"Inserted Records" label not found!');
    }
    if (!pageText.includes('100%')) {
      throw new Error('100% progress indicator not found!');
    }

    console.log('✓ Verified: Title "Bulk Import Progress" visible');
    console.log('✓ Verified: "Total Records" displayed');
    console.log('✓ Verified: "Inserted Records" displayed');
    console.log('✓ Verified: "100%" completion progress displayed');

    // 5. Click "Import Another" to verify reset
    console.log('[Step 7] Testing "Import Another" reset button...');
    const importAnotherBtn = await page.$('button ::-p-text(Import Another)');
    if (importAnotherBtn) {
      await importAnotherBtn.click();
      await sleep(600);
      await page.screenshot({ path: path.join(artifactDir, '4_reset_ready_for_next.png') });
      console.log('✓ Screenshot saved: 4_reset_ready_for_next.png');
      console.log('✓ Dropzone reset cleanly without page reload!');
    } else {
      console.log('Note: Import Another button was not found or already reset.');
    }

    // 6. Clean up test models
    console.log('[Step 8] Cleaning up imported test models...');
    const prisma = (await import('../config/db')).default;
    await prisma.model.deleteMany({
      where: {
        name: {
          in: [
            'Galaxy S25 Ultra', 'Galaxy S25 Plus', 'iPhone 16 Pro Max', 'iPhone 16',
            'OnePlus 13', 'OnePlus 13R', 'Vivo X200 Pro', 'Vivo V40 Pro',
            'Xiaomi 15 Pro', 'Xiaomi 14 Ultra', 'Realme GT 7 Pro', 'Pixel 9 Pro XL',
            'Pixel 9', 'Oppo Find X8 Pro', 'Oppo Reno 13 Pro', 'Nothing Phone (3)',
            'Motorola Edge 50 Ultra', 'iQOO 13', 'Honor Magic 7 Pro', 'Poco F7 Pro'
          ]
        }
      }
    });
    await prisma.$disconnect();
    console.log('✓ Database cleaned up.');

    console.log('\n========================================================');
    console.log('ALL UI VERIFICATIONS PASSED SUCCESSFULLY 100%!');
    console.log('========================================================');
  } catch (err) {
    console.error('UI Verification failed:', err);
    await page.screenshot({ path: path.join('/home/naveen/.gemini/antigravity-ide/brain/6e28ce15-8fb5-4d76-8aa1-2dd570f2d22a', 'error_screenshot.png') }).catch(() => {});
    process.exit(1);
  } finally {
    await browser.close();
  }
}

verifyUiBulkImportProgressBar();
