import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const ARTIFACT_DIR = '/home/naveen/.gemini/antigravity-ide/brain/55e52df9-6f2e-4ed8-a4a7-cd081a3b533e';
const RECORDINGS_DIR = path.join(ARTIFACT_DIR, 'recordings');

if (!fs.existsSync(RECORDINGS_DIR)) {
  fs.mkdirSync(RECORDINGS_DIR, { recursive: true });
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function recordScreenFlow() {
  console.log('Starting Screen Recording & Full UI Test Workflow...');

  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--window-size=1280,800',
    ],
    defaultViewport: {
      width: 1280,
      height: 800
    }
  });

  const page = await browser.newPage();

  try {
    // 1. Catalog Home
    console.log('[1/18] Recording: Catalog Home Page');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
    await sleep(1500);
    await page.screenshot({ path: path.join(RECORDINGS_DIR, '01_catalog_home.png') });

    // 2. Categories Page
    console.log('[2/18] Recording: Categories Page');
    await page.goto('http://localhost:5173/categories', { waitUntil: 'networkidle0' });
    await sleep(1000);
    await page.screenshot({ path: path.join(RECORDINGS_DIR, '02_categories_page.png') });

    // 3. Category Types Page (Tempered Glass)
    console.log('[3/18] Recording: Tempered Glass Types Page');
    await page.goto('http://localhost:5173/category/1/types', { waitUntil: 'networkidle0' });
    await sleep(1000);
    await page.screenshot({ path: path.join(RECORDINGS_DIR, '03_category_types.png') });

    // 4. Models List for Normal Tempered
    console.log('[4/18] Recording: Models for Normal Tempered');
    await page.goto('http://localhost:5173/category/1/type/1/models', { waitUntil: 'networkidle0' });
    await sleep(1000);
    await page.screenshot({ path: path.join(RECORDINGS_DIR, '04_catalog_models.png') });

    // 5. Brands Page
    console.log('[5/18] Recording: All Brands Page');
    await page.goto('http://localhost:5173/brands', { waitUntil: 'networkidle0' });
    await sleep(1000);
    await page.screenshot({ path: path.join(RECORDINGS_DIR, '05_catalog_brands.png') });

    // 6. Universal Models Search
    console.log('[6/18] Recording: Universal Search Page');
    await page.goto('http://localhost:5173/models', { waitUntil: 'networkidle0' });
    await sleep(800);
    await page.type('input[placeholder*="Type brand name"]', 'Vivo');
    await sleep(1200);
    await page.screenshot({ path: path.join(RECORDINGS_DIR, '06_search_models_results.png') });

    // 7. Login Page
    console.log('[7/18] Recording: Login Page');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
    await sleep(800);
    await page.screenshot({ path: path.join(RECORDINGS_DIR, '07_login_page.png') });

    // 8. Fill Login Form
    console.log('[8/18] Recording: Filling Login Credentials');
    await page.type('input[type="email"]', 'admin@example.com');
    await page.type('input[type="password"]', 'admin123');
    await sleep(500);
    await page.screenshot({ path: path.join(RECORDINGS_DIR, '08_login_filled.png') });

    // 9. Submit Login & Enter Dashboard
    console.log('[9/18] Recording: Submitting Login to Dashboard');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
    await sleep(2000);
    await page.screenshot({ path: path.join(RECORDINGS_DIR, '09_dashboard_overview.png') });

    // 10. Dashboard Models Table
    console.log('[10/18] Recording: Dashboard Models CRUD Table');
    await page.goto('http://localhost:5173/dashboard/models', { waitUntil: 'networkidle0' });
    await sleep(1500);
    await page.screenshot({ path: path.join(RECORDINGS_DIR, '10_models_crud_table.png') });

    // 11. Open Add Model Modal (Insert)
    console.log('[11/18] Recording: Add Model Modal (Insert)');
    // Click button with text "Add Model"
    const addBtn = await page.$('button ::-p-text(Add Model)');
    if (addBtn) {
      await addBtn.click();
    } else {
      // Find button by Plus icon or last button
      const buttons = await page.$$('button');
      for (const btn of buttons) {
        const text = await page.evaluate(el => el.textContent, btn);
        if (text && text.includes('Add Model')) {
          await btn.click();
          break;
        }
      }
    }
    await sleep(800);
    await page.screenshot({ path: path.join(RECORDINGS_DIR, '11_add_model_modal.png') });

    // 12. Fill Add Model Form
    console.log('[12/18] Recording: Filling New Model Form');
    const modelInput = await page.$('input[placeholder*="Vivo Y200"]');
    if (modelInput) {
      await modelInput.type('OnePlus Nord CE 4 (Screen Recorded)');
    }
    const aliasInput = await page.$('input[placeholder*="comma-separated"]');
    if (aliasInput) {
      await aliasInput.type('Nord CE 4, CPH2613');
    }
    const compatInput = await page.$('textarea[placeholder*="comma-separated"]');
    if (compatInput) {
      await compatInput.type('OnePlus Nord 4, Realme 12 Pro');
    }
    await sleep(600);
    await page.screenshot({ path: path.join(RECORDINGS_DIR, '12_add_model_filled.png') });

    // 13. Submit Model (Insert)
    console.log('[13/18] Recording: Submitting New Model');
    const saveBtn = await page.$('button[type="submit"]');
    if (saveBtn) {
      await saveBtn.click();
    }
    await sleep(2500);
    await page.screenshot({ path: path.join(RECORDINGS_DIR, '13_model_created_in_table.png') });

    // 14. Edit Model Modal (Update)
    console.log('[14/18] Recording: Edit Model Modal (Update)');
    const editBtn = await page.$('button svg.lucide-edit-2');
    if (editBtn) {
      const parentBtn = await editBtn.evaluateHandle(el => el.closest('button'));
      if (parentBtn) await (parentBtn as any).click();
    } else {
      // Click first edit button in table
      const buttons = await page.$$('table tbody tr td:last-child button:first-child');
      if (buttons.length > 0) await buttons[0].click();
    }
    await sleep(800);
    await page.screenshot({ path: path.join(RECORDINGS_DIR, '14_edit_model_modal.png') });

    // Cancel edit modal to keep clean
    const cancelBtn = await page.$('button ::-p-text(Cancel)');
    if (cancelBtn) {
      await cancelBtn.click();
      await sleep(500);
    }

    // 15. Delete Model Flow
    console.log('[15/18] Recording: Delete Confirmation Modal');
    const deleteBtn = await page.$('table tbody tr td:last-child button:last-child');
    if (deleteBtn) {
      await deleteBtn.click();
      await sleep(800);
      await page.screenshot({ path: path.join(RECORDINGS_DIR, '15_delete_confirmation_modal.png') });

      // Click Cancel on delete modal
      const cancelDeleteBtn = await page.$('button ::-p-text(Cancel)');
      if (cancelDeleteBtn) {
        await cancelDeleteBtn.click();
        await sleep(500);
      }
    }

    // 16. Brands Management Page
    console.log('[16/18] Recording: Brands CRUD Page');
    await page.goto('http://localhost:5173/dashboard/brands', { waitUntil: 'networkidle0' });
    await sleep(1200);
    await page.screenshot({ path: path.join(RECORDINGS_DIR, '16_brands_management.png') });

    // 17. Admin Dashboard Overview
    console.log('[17/18] Recording: Admin Dashboard Overview');
    await page.goto('http://localhost:5173/dashboard/admin', { waitUntil: 'networkidle0' });
    await sleep(1500);
    await page.screenshot({ path: path.join(RECORDINGS_DIR, '17_admin_dashboard.png') });

    // 18. Admin AI Settings & Discovery Engine
    console.log('[18/18] Recording: Admin AI Engine & Ad Slots');
    const aiTabBtn = await page.$('button ::-p-text(Gemini AI)');
    if (aiTabBtn) {
      await aiTabBtn.click();
      await sleep(1000);
    }
    await page.screenshot({ path: path.join(RECORDINGS_DIR, '18_admin_ai_settings.png') });

    console.log('Screen Recording & Manual UI testing successfully completed!');
  } catch (err) {
    console.error('Error during screen recording flow:', err);
  } finally {
    await browser.close();
  }
}

recordScreenFlow().catch(console.error);
