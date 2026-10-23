import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
const ffmpegPath = require('ffmpeg-static');

const ARTIFACT_DIR = '/home/naveen/.gemini/antigravity-ide/brain/55e52df9-6f2e-4ed8-a4a7-cd081a3b533e';
const FRAMES_DIR = path.join(ARTIFACT_DIR, 'video_frames');
const VIDEO_MP4 = path.join(ARTIFACT_DIR, 'admin_full_workflow_recording.mp4');
const VIDEO_WEBP = path.join(ARTIFACT_DIR, 'admin_full_workflow_recording.webp');

// Also save copy to frontend public directory so user can open/stream it directly
const FRONTEND_PUBLIC_DIR = path.join(__dirname, '../../../frontend/public');

if (fs.existsSync(FRAMES_DIR)) {
  fs.rmSync(FRAMES_DIR, { recursive: true, force: true });
}
fs.mkdirSync(FRAMES_DIR, { recursive: true });

let frameIndex = 0;

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function captureFrame(page: any, label: string, holdSeconds = 1) {
  frameIndex++;
  const frameName = `frame_${String(frameIndex).padStart(4, '0')}.png`;
  const framePath = path.join(FRAMES_DIR, frameName);
  await page.screenshot({ path: framePath });
  console.log(`[Frame ${frameIndex}] Captured: ${label}`);

  // Duplicate frame to hold display time in the video
  const extraCopies = Math.max(0, Math.floor(holdSeconds * 2) - 1);
  for (let i = 0; i < extraCopies; i++) {
    frameIndex++;
    const copyName = `frame_${String(frameIndex).padStart(4, '0')}.png`;
    fs.copyFileSync(framePath, path.join(FRAMES_DIR, copyName));
  }
}

async function runFullAdminAndVideo() {
  console.log('====================================================');
  console.log('STARTING COMPLETE ADMIN PANEL TESTING & VIDEO CAPTURE');
  console.log('====================================================');

  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--window-size=1280,820',
    ],
    defaultViewport: {
      width: 1280,
      height: 820
    }
  });

  const page = await browser.newPage();

  // Automatically accept all alert/confirm/prompt dialogs
  page.on('dialog', async (dialog: any) => {
    console.log(`[Dialog Handled] ${dialog.type()}: "${dialog.message()}"`);
    if (dialog.type() === 'prompt') {
      await dialog.accept('Admin verified through automated test');
    } else {
      await dialog.accept();
    }
  });

  try {
    // -----------------------------------------------------------
    // STAGE 1: Public Catalog Journey
    // -----------------------------------------------------------
    console.log('\n--- STAGE 1: PUBLIC CATALOG & WORKFLOWS ---');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
    await sleep(1000);
    await captureFrame(page, 'Public Catalog Homepage', 2);

    // Scroll to Recent Updates
    await page.evaluate(() => window.scrollBy({ top: 400, behavior: 'smooth' }));
    await sleep(800);
    await captureFrame(page, 'Recent Updates & Categories Grid', 1.5);

    // Navigate to All Categories
    await page.goto('http://localhost:5173/categories', { waitUntil: 'networkidle0' });
    await sleep(800);
    await captureFrame(page, 'All Categories Page', 1.5);

    // Navigate to Tempered Glass Types
    await page.goto('http://localhost:5173/category/1/types', { waitUntil: 'networkidle0' });
    await sleep(800);
    await captureFrame(page, 'Category Types Selection', 1.5);

    // Navigate to Brands
    await page.goto('http://localhost:5173/brands', { waitUntil: 'networkidle0' });
    await sleep(800);
    await captureFrame(page, 'Supported Brands Directory', 1.5);

    // Navigate to Search Models
    await page.goto('http://localhost:5173/models', { waitUntil: 'networkidle0' });
    await sleep(800);
    await page.type('input[placeholder*="Type brand name"]', 'Samsung');
    await sleep(1000);
    await captureFrame(page, 'Universal Search for Samsung Models', 2);

    // -----------------------------------------------------------
    // STAGE 2: Authentication & Login
    // -----------------------------------------------------------
    console.log('\n--- STAGE 2: SUPER ADMIN AUTHENTICATION ---');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
    await sleep(800);
    await captureFrame(page, 'Login Page', 1);

    await page.type('input[type="email"]', 'admin@example.com');
    await page.type('input[type="password"]', 'admin123');
    await sleep(500);
    await captureFrame(page, 'Login Credentials Entered', 1.5);

    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
    await sleep(1500);
    await captureFrame(page, 'Authenticated Dashboard Overview', 2);

    // -----------------------------------------------------------
    // STAGE 3: Models & Brands Management Pages
    // -----------------------------------------------------------
    console.log('\n--- STAGE 3: MODELS & BRANDS MANAGEMENT ---');
    await page.goto('http://localhost:5173/dashboard/models', { waitUntil: 'networkidle0' });
    await sleep(1200);
    await captureFrame(page, 'Models Management Data Table', 2);

    // Open Add Model modal
    const addModelBtn = await page.$('button ::-p-text(Add Model)');
    if (addModelBtn) {
      await addModelBtn.click();
      await sleep(700);
      await captureFrame(page, 'Add Model Modal (Insert Flow)', 1.5);

      const nameInput = await page.$('input[placeholder*="Vivo Y200"]');
      if (nameInput) await nameInput.type('Pixel 8 Pro (Admin Test)');
      const aliasInput = await page.$('input[placeholder*="comma-separated"]');
      if (aliasInput) await aliasInput.type('GC368, G1MNW');
      const compatInput = await page.$('textarea[placeholder*="comma-separated"]');
      if (compatInput) await compatInput.type('Pixel 7 Pro, Pixel 9 Pro');

      await sleep(600);
      await captureFrame(page, 'Add Model Modal Form Filled', 1.5);

      const submitBtn = await page.$('button[type="submit"]');
      if (submitBtn) {
        await submitBtn.click();
        await sleep(2000);
        await captureFrame(page, 'Model Inserted & Reflected in Table', 2);
      }
    }

    // Brands CRUD page
    await page.goto('http://localhost:5173/dashboard/brands', { waitUntil: 'networkidle0' });
    await sleep(1000);
    await captureFrame(page, 'Brands CRUD Management Page', 2);

    // -----------------------------------------------------------
    // STAGE 4: Full Admin Panel Testing (All 7 Tabs)
    // -----------------------------------------------------------
    console.log('\n--- STAGE 4: FULL ADMIN PANEL DEEP-DIVE TESTING ---');
    await page.goto('http://localhost:5173/dashboard/admin', { waitUntil: 'networkidle0' });
    await sleep(1500);

    // TAB 1: Overview & Metrics
    console.log('[Admin Tab 1/7] Testing Overview & Metrics...');
    await captureFrame(page, 'Admin Tab 1: Overview Metrics & Status', 2.5);

    // Click "Refresh Real-Time Metrics"
    const refreshMetricsBtn = await page.$('button ::-p-text(Refresh Real-Time Metrics)');
    if (refreshMetricsBtn) {
      await refreshMetricsBtn.click();
      await sleep(1000);
      await captureFrame(page, 'Admin Tab 1: Metrics Refreshed Live', 1.5);
    }

    // TAB 2: Categories & Types
    console.log('[Admin Tab 2/7] Testing Categories & Types...');
    const catTabBtn = await page.$('button ::-p-text(Categories & Types)');
    if (catTabBtn) {
      await catTabBtn.click();
      await sleep(1000);
      await captureFrame(page, 'Admin Tab 2: Categories Hierarchy List', 2);

      // Click "Manage Types" on first category
      const manageTypesBtn = await page.$('button ::-p-text(Manage Types)');
      if (manageTypesBtn) {
        await manageTypesBtn.click();
        await sleep(800);
        await captureFrame(page, 'Admin Tab 2: Category Types Detail Pane', 2);
      }

      // Open "Create New Category" modal
      const createCatBtn = await page.$('button ::-p-text(Create New Category)');
      if (createCatBtn) {
        await createCatBtn.click();
        await sleep(700);
        await captureFrame(page, 'Admin Tab 2: Create Category Modal Open', 1.5);

        // Close modal
        const closeBtn = await page.$('button ::-p-text(Cancel)');
        if (closeBtn) await closeBtn.click();
        await sleep(500);
      }
    }

    // TAB 3: Models & Compatibility
    console.log('[Admin Tab 3/7] Testing Models & Compatibility...');
    const modelsTabBtn = await page.$('button ::-p-text(Models & Compatibility)');
    if (modelsTabBtn) {
      await modelsTabBtn.click();
      await sleep(1000);
      await captureFrame(page, 'Admin Tab 3: Models & Compatibility Table', 2);

      // Search filter in admin models tab
      const searchInput = await page.$('input[placeholder*="Search models"]');
      if (searchInput) {
        await searchInput.type('Vivo');
        await sleep(1000);
        await captureFrame(page, 'Admin Tab 3: Model Search Filtered (Vivo)', 2);
        // Clear search
        await page.evaluate((el: any) => { el.value = ''; }, searchInput);
        await sleep(500);
      }

      // Open model details modal (click first model name)
      const firstModelLink = await page.$('table tbody tr td:first-child button');
      if (firstModelLink) {
        await firstModelLink.click();
        await sleep(1000);
        await captureFrame(page, 'Admin Tab 3: Model Compatibility Details Modal', 2.5);

        // Close modal
        const closeBtn = await page.$('button[aria-label="Close"], button ::-p-text(Close)');
        if (closeBtn) {
          await closeBtn.click();
        } else {
          await page.keyboard.press('Escape');
        }
        await sleep(500);
      }
    }

    // TAB 4: AI Review Queue
    console.log('[Admin Tab 4/7] Testing Gemini AI Review Queue...');
    const aiReviewTab = await page.$('button ::-p-text(AI Review Queue)');
    if (aiReviewTab) {
      await aiReviewTab.click();
      await sleep(1200);
      await captureFrame(page, 'Admin Tab 4: AI Candidate Review Queue', 2.5);

      // Click "All Candidates" subtab
      const allCandidatesBtn = await page.$('button ::-p-text(All Candidates)');
      if (allCandidatesBtn) {
        await allCandidatesBtn.click();
        await sleep(800);
        await captureFrame(page, 'Admin Tab 4: All AI Candidates Filtered', 2);
      }

      // Toggle Dry Run mode
      const dryRunCheckbox = await page.$('input[type="checkbox"]');
      if (dryRunCheckbox) {
        await dryRunCheckbox.click();
        await sleep(500);
        await captureFrame(page, 'Admin Tab 4: Dry Run Mode Toggled', 1.5);
      }
    }

    // TAB 5: Gemini Engine Config
    console.log('[Admin Tab 5/7] Testing Gemini Engine Config...');
    const aiSettingsTab = await page.$('button ::-p-text(Gemini Engine Config)');
    if (aiSettingsTab) {
      await aiSettingsTab.click();
      await sleep(1200);
      await captureFrame(page, 'Admin Tab 5: Gemini Engine Model Version & Safety', 2.5);

      // Select Gemini Model Dropdown
      const modelSelect = await page.$('select');
      if (modelSelect) {
        await modelSelect.select('gemini-2.5-flash');
        await sleep(600);
        await captureFrame(page, 'Admin Tab 5: Selected Gemini 2.5 Flash Free Tier', 2);
      }

      // Scroll down to Scheduler & Auto-approve
      await page.evaluate(() => window.scrollBy({ top: 300, behavior: 'smooth' }));
      await sleep(800);
      await captureFrame(page, 'Admin Tab 5: Scheduler & Auto-Approve Thresholds', 2);
    }

    // TAB 6: Technicians & Audits
    console.log('[Admin Tab 6/7] Testing Technicians & Audits...');
    const usersTab = await page.$('button ::-p-text(Technicians & Audits)');
    if (usersTab) {
      await usersTab.click();
      await sleep(1200);
      await captureFrame(page, 'Admin Tab 6: Registered Users & Permissions', 2);

      // Scroll to Audit Log Table
      await page.evaluate(() => window.scrollBy({ top: 400, behavior: 'smooth' }));
      await sleep(800);
      await captureFrame(page, 'Admin Tab 6: Real-Time Audit Log History (Last 50 Entries)', 2.5);
    }

    // TAB 7: AdSense & CSV Import
    console.log('[Admin Tab 7/7] Testing AdSense & Bulk CSV Import...');
    const adsTab = await page.$('button ::-p-text(AdSense & CSV Import)');
    if (adsTab) {
      await adsTab.click();
      await sleep(1200);
      await captureFrame(page, 'Admin Tab 7: Ad Slot Configuration & Bulk CSV Uploader', 2.5);

      // Toggle Ad Slot placement dropdown
      const placementSelect = await page.$('select');
      if (placementSelect) {
        await placementSelect.select('sidebar');
        await sleep(600);
        await captureFrame(page, 'Admin Tab 7: Sidebar Placement Slot Selected', 2);
      }
    }

    console.log(`\nCaptured total of ${frameIndex} frames!`);
    console.log('Compiling frames into MP4 video and animated WebP...');

    // -----------------------------------------------------------
    // STAGE 5: Compile Frames with FFmpeg
    // -----------------------------------------------------------
    // 1. Generate MP4 Video (H.264, standard 2 FPS for crisp readable slide playback)
    const ffmpegMp4Cmd = `"${ffmpegPath}" -y -framerate 2 -i "${FRAMES_DIR}/frame_%04d.png" -c:v libx264 -pix_fmt yuv420p -movflags +faststart "${VIDEO_MP4}"`;
    console.log('Running FFmpeg MP4 encoding...');
    execSync(ffmpegMp4Cmd);
    console.log(`Saved MP4 Video: ${VIDEO_MP4} (${fs.statSync(VIDEO_MP4).size} bytes)`);

    // 2. Generate Animated WebP Video
    const ffmpegWebpCmd = `"${ffmpegPath}" -y -framerate 2 -i "${FRAMES_DIR}/frame_%04d.png" -vcodec libwebp -lossless 0 -q:v 70 -loop 0 "${VIDEO_WEBP}"`;
    console.log('Running FFmpeg WebP encoding...');
    execSync(ffmpegWebpCmd);
    console.log(`Saved WebP Video: ${VIDEO_WEBP} (${fs.statSync(VIDEO_WEBP).size} bytes)`);

    // Copy to frontend public dir for direct web access
    if (fs.existsSync(FRONTEND_PUBLIC_DIR)) {
      fs.copyFileSync(VIDEO_MP4, path.join(FRONTEND_PUBLIC_DIR, 'admin_full_workflow_recording.mp4'));
      fs.copyFileSync(VIDEO_WEBP, path.join(FRONTEND_PUBLIC_DIR, 'admin_full_workflow_recording.webp'));
      console.log('Copied recordings to frontend/public for browser stream access.');
    }

    // Clean up temporary test model
    try {
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      await prisma.model.deleteMany({ where: { name: { contains: 'Admin Test' } } });
      await prisma.$disconnect();
    } catch (e) {}

    console.log('\n====================================================');
    console.log('SCREEN RECORDING VIDEO COMPLETED SUCCESSFULLY!');
    console.log('====================================================');
  } catch (err) {
    console.error('Error during full admin testing and video recording:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runFullAdminAndVideo().catch(console.error);
