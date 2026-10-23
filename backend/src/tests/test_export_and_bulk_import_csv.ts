import fs from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const BASE_URL = 'http://localhost:5000/api';

async function testExportAndBulkImportCsv() {
  console.log('========================================================');
  console.log('TESTING EXPORT SAMPLE CSV & BULK CSV UPLOAD PIPELINE');
  console.log('========================================================\n');

  // 1. Test GET /api/models/sample-csv endpoint
  console.log('[Step 1] Requesting sample CSV from GET /api/models/sample-csv ...');
  const sampleRes = await fetch(`${BASE_URL}/models/sample-csv`);
  console.log('HTTP Status:', sampleRes.status);
  console.log('Content-Type:', sampleRes.headers.get('content-type'));
  console.log('Content-Disposition:', sampleRes.headers.get('content-disposition'));

  const csvText = await sampleRes.text();
  console.log('CSV Content Preview:\n---\n' + csvText + '---');

  if (!csvText.includes('Model Name,Brand,Category,Compatible Models')) {
    throw new Error('CSV headers missing or incorrect in exported sample!');
  }
  console.log('✓ Sample CSV structure verified successfully!\n');

  // 2. Test Admin Login to get token for bulk upload test
  console.log('[Step 2] Authenticating as Super Admin ...');
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
  console.log('✓ Admin authenticated! Token received.\n');

  // 3. Test Bulk Upload using the exported sample CSV content
  console.log('[Step 3] Testing Bulk Upload with the Exported Sample CSV ...');
  const blob = new Blob([csvText], { type: 'text/csv' });
  const formData = new FormData();
  formData.append('file', blob, 'sample_models_import.csv');

  const uploadRes = await fetch(`${BASE_URL}/models/bulk-import`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const uploadData: any = await uploadRes.json();
  console.log('Upload HTTP Status:', uploadRes.status);
  console.log('Upload Response:', uploadData);

  if (!uploadData.success) {
    throw new Error(`Bulk import with sample CSV failed: ${uploadData.message}`);
  }
  console.log('✓ Bulk import with sample CSV succeeded!\n');

  // 4. Clean up any imported models
  console.log('[Step 4] Cleaning up test models ...');
  await prisma.model.deleteMany({
    where: {
      name: { in: ['Galaxy S24', 'iPhone 15 Pro', 'Vivo Y200 5G', 'Redmi Note 13 Pro', 'OnePlus 12R', 'Realme 12 Pro', 'Pixel 8 Pro'] }
    }
  });
  await prisma.$disconnect();
  console.log('✓ Cleaned up test database models.\n');

  console.log('========================================================');
  console.log('ALL SAMPLE CSV EXPORT & BULK IMPORT TESTS PASSED 100%!');
  console.log('========================================================');
}

testExportAndBulkImportCsv().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
