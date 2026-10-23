import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const BASE_URL = 'http://localhost:5000/api';

async function testDuplicatesAndExtraSpaces() {
  console.log('========================================================');
  console.log('TESTING DUPLICATE MODEL NAME & EXTRA SPACES SANITIZATION');
  console.log('========================================================\n');

  // Pre-cleanup in case of prior run
  await prisma.model.deleteMany({
    where: {
      name: { in: ['Galaxy S25 Ultra', 'galaxy s25 ultra'] }
    }
  });

  // Step 1: Authenticate as Super Admin
  console.log('[Step 1] Authenticating as Admin ...');
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@example.com',
      password: 'admin123',
    }),
  });
  const loginData: any = await loginRes.json();
  const token = loginData.token || loginData.data?.token;
  if (!token) throw new Error('Failed to obtain auth token');
  console.log('✓ Admin authenticated successfully.\n');

  // Step 2: Construct CSV with heavy extra spaces, case differences, duplicate model rows, and blank lines
  console.log('[Step 2] Building CSV test payload with duplicate model names and extra spaces ...');
  const csvHeadersWithSpaces = '  Model   Name  ,   Brand   ,  Category  ,  Compatible Models  \n';
  const csvRows = [
    // Row 1: Model with irregular multi-spaces in every field
    '   Galaxy    S25    Ultra   ,   Samsung    ,   Tempered    Glass   ,"  Galaxy   S24  ,   Galaxy   S23   "',
    // Row 2: Same model with regular spacing and overlapping + new compatibilities
    'Galaxy S25 Ultra,Samsung,Tempered Glass,"Galaxy S23, Galaxy S22"',
    // Row 3: Same model with lower-case and extra spaces, plus new compatibility
    '  galaxy  s25  ultra  ,  samsung  ,  tempered  glass  ,"Galaxy S21, Galaxy S24"',
    // Row 4: Empty line with comma spaces that should be ignored
    '   ,   ,   ,   \n'
  ].join('\n');

  console.log('Test CSV Content:\n---\n' + csvHeadersWithSpaces + csvRows + '\n---');

  // Step 3: Send to bulk import endpoint with SSE streaming
  console.log('[Step 3] Submitting bulk import with streaming SSE (?stream=true) ...');
  const blob = new Blob([csvHeadersWithSpaces + csvRows], { type: 'text/csv' });
  const formData = new FormData();
  formData.append('file', blob, 'test_spaces_and_duplicates.csv');

  const uploadRes = await fetch(`${BASE_URL}/models/bulk-import?stream=true`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'text/event-stream',
    },
    body: formData,
  });

  if (!uploadRes.ok) {
    const errText = await uploadRes.text();
    throw new Error(`Upload failed with HTTP ${uploadRes.status}: ${errText}`);
  }

  // Parse SSE events
  const reader = uploadRes.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  const events: any[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split('\n\n');
    buffer = parts.pop() || '';
    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.startsWith('data:')) {
        const json = JSON.parse(trimmed.replace(/^data:\s*/, ''));
        events.push(json);
      }
    }
  }

  console.log(`Received ${events.length} SSE events during processing.`);
  const completeEvent = events.find((e) => e.type === 'complete' || e.status === 'completed');
  if (!completeEvent) {
    throw new Error('No complete event received from SSE stream!');
  }

  console.log('Complete event summary:', {
    total: completeEvent.total,
    inserted: completeEvent.inserted,
    newModels: completeEvent.newModels,
    duplicates: completeEvent.duplicates,
    failed: completeEvent.failed,
    progress: completeEvent.progress,
    message: completeEvent.message,
  });

  // Assertions on the event payload
  if (completeEvent.total !== 3) {
    throw new Error(`Expected total to be 3 (blank row ignored), got ${completeEvent.total}`);
  }
  if (completeEvent.newModels !== 1) {
    throw new Error(`Expected 1 new model, got ${completeEvent.newModels}`);
  }
  if (completeEvent.duplicates !== 2) {
    throw new Error(`Expected 2 duplicate model rows merged, got ${completeEvent.duplicates}`);
  }
  if (completeEvent.inserted !== 3) {
    throw new Error(`Expected inserted to be 3 (1 new + 2 merged), got ${completeEvent.inserted}`);
  }
  if (completeEvent.failed !== 0) {
    throw new Error(`Expected 0 failed, got ${completeEvent.failed}`);
  }
  if (completeEvent.progress !== 100) {
    throw new Error(`Expected 100% progress, got ${completeEvent.progress}%`);
  }

  console.log('✓ SSE Stream events verified: 1 new model, 2 duplicates merged, 100% complete!\n');

  // Step 4: Verify Database state directly via Prisma
  console.log('[Step 4] Verifying database records in MySQL via Prisma ...');
  const dbModels = await prisma.model.findMany({
    where: {
      name: 'Galaxy S25 Ultra',
    },
    include: {
      brand: true,
      category: true,
      compatibilityLists: true,
    },
  });

  console.log(`Found ${dbModels.length} model(s) matching 'Galaxy S25 Ultra' in database.`);
  if (dbModels.length !== 1) {
    throw new Error(`Duplicate models created! Expected exactly 1 model record in DB, found ${dbModels.length}`);
  }

  const model = dbModels[0];
  console.log('Model Name:', JSON.stringify(model.name));
  console.log('Brand:', JSON.stringify(model.brand.name));
  console.log('Category:', JSON.stringify(model.category.name));
  console.log('Verified Status:', model.isVerified);

  if (model.name !== 'Galaxy S25 Ultra') {
    throw new Error(`Model name has uncollapsed spaces! Got: "${model.name}"`);
  }
  if (model.brand.name.toLowerCase() !== 'samsung') {
    throw new Error(`Brand name mismatch! Got: "${model.brand.name}"`);
  }
  if (model.category.name.toLowerCase() !== 'tempered glass') {
    throw new Error(`Category name mismatch! Got: "${model.category.name}"`);
  }

  const compatNames = model.compatibilityLists.map((c) => c.compatibleWith).sort();
  console.log('Merged Compatibilities in DB:', compatNames);

  const expectedCompats = ['Galaxy S21', 'Galaxy S22', 'Galaxy S23', 'Galaxy S24'].sort();
  if (JSON.stringify(compatNames) !== JSON.stringify(expectedCompats)) {
    throw new Error(`Compatibilities mismatch! Expected: ${JSON.stringify(expectedCompats)}, got: ${JSON.stringify(compatNames)}`);
  }

  console.log('✓ All 4 compatibilities successfully merged without duplicates!');
  console.log('✓ Model Name and fields properly trimmed and multi-space collapsed!\n');

  // Step 5: Clean up test data
  console.log('[Step 5] Cleaning up test data ...');
  await prisma.model.deleteMany({
    where: {
      name: 'Galaxy S25 Ultra',
    },
  });
  await prisma.$disconnect();
  console.log('✓ Test data cleaned up.\n');

  console.log('========================================================');
  console.log('ALL DUPLICATE & EXTRA SPACES TESTS PASSED 100%!');
  console.log('========================================================');
}

testDuplicatesAndExtraSpaces().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
