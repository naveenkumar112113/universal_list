"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
async function testLargeDatasetStreamingImport() {
    console.log('========================================================');
    console.log('TESTING LARGE DATASET REAL-TIME STREAMING BULK IMPORT (1,000 RECORDS)');
    console.log('========================================================\n');
    const BASE_URL = 'http://localhost:5000/api';
    // 1. Authenticate
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@example.com', password: 'admin123' }),
    });
    const loginData = await loginRes.json();
    const token = loginData.token || loginData.data?.token;
    console.log('✓ Admin authenticated! Token received.');
    // 2. Generate 1,000 rows CSV
    console.log('Generating 1,000 records CSV dataset...');
    const header = 'Model Name,Brand,Category,Compatible Models\n';
    const rows = [];
    // Generate 980 valid records and 20 deliberately invalid rows to test error handling
    for (let i = 1; i <= 980; i++) {
        const brand = i % 5 === 0 ? 'Samsung' : i % 5 === 1 ? 'Apple' : i % 5 === 2 ? 'Xiaomi' : i % 5 === 3 ? 'OnePlus' : 'Vivo';
        const category = i % 3 === 0 ? 'Display' : i % 3 === 1 ? 'Battery' : 'Tempered Glass';
        rows.push(`BulkTestModel_${i},${brand},${category},"BulkTestModel_${i - 1}, BulkTestModel_${i + 1}"`);
    }
    for (let i = 981; i <= 1000; i++) {
        // Missing Model Name or Brand to trigger error handling
        if (i % 2 === 0) {
            rows.push(`,Samsung,Display,Compat1`); // missing name
        }
        else {
            rows.push(`InvalidModel_${i},,Battery,Compat2`); // missing brand
        }
    }
    const csvContent = header + rows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const formData = new FormData();
    formData.append('file', blob, 'large_dataset_1000.csv');
    console.log('✓ 1,000 records generated (980 valid, 20 invalid for error handling verification).');
    console.log('\nStarting streaming bulk-import of 1,000 records...\n');
    const startTime = Date.now();
    const res = await fetch(`${BASE_URL}/models/bulk-import?stream=true`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'text/event-stream',
        },
        body: formData,
    });
    if (!res.ok) {
        throw new Error(`Upload failed with status: ${res.status}`);
    }
    const reader = res.body?.getReader();
    if (!reader)
        throw new Error('No body stream reader');
    const decoder = new TextDecoder();
    let buffer = '';
    let eventCount = 0;
    let lastProgressEvent = null;
    while (true) {
        const { done, value } = await reader.read();
        if (done)
            break;
        buffer += decoder.decode(value, { stream: true });
        const chunks = buffer.split('\n\n');
        buffer = chunks.pop() || '';
        for (const chunk of chunks) {
            const line = chunk.trim();
            if (line.startsWith('data:')) {
                const payload = JSON.parse(line.replace(/^data:\s*/, ''));
                eventCount++;
                lastProgressEvent = payload;
                // Print progress periodically to display progress bar updates
                if (eventCount % 5 === 0 || payload.type === 'start' || payload.type === 'complete') {
                    const filled = Math.round((payload.progress / 100) * 20);
                    const empty = 20 - filled;
                    const bar = `[${'█'.repeat(filled)}${'░'.repeat(empty)}]`;
                    console.log(`[${payload.type.toUpperCase()}] Total: ${payload.total} | Inserted: ${payload.inserted} | Failed: ${payload.failed} | Progress: ${bar} ${payload.progress}%`);
                }
            }
        }
    }
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\nImport completed in ${elapsed}s! Total SSE events received: ${eventCount}`);
    console.log('Final Event Payload:', JSON.stringify(lastProgressEvent, null, 2));
    if (lastProgressEvent.type !== 'complete') {
        throw new Error('Expected complete event at end of stream');
    }
    if (lastProgressEvent.total !== 1000) {
        throw new Error(`Expected 1000 total records, got ${lastProgressEvent.total}`);
    }
    if (lastProgressEvent.inserted !== 980) {
        throw new Error(`Expected 980 inserted records, got ${lastProgressEvent.inserted}`);
    }
    if (lastProgressEvent.failed !== 20) {
        throw new Error(`Expected 20 failed records, got ${lastProgressEvent.failed}`);
    }
    if (lastProgressEvent.progress !== 100) {
        throw new Error(`Expected 100% progress on completion, got ${lastProgressEvent.progress}%`);
    }
    // Cleanup test data
    console.log('\nCleaning up 980 test records from database...');
    const prisma = (await Promise.resolve().then(() => __importStar(require('../config/db')))).default;
    await prisma.model.deleteMany({
        where: { name: { startsWith: 'BulkTestModel_' } },
    });
    await prisma.$disconnect();
    console.log('✓ Cleaned up test database models.');
    console.log('\n========================================================');
    console.log('1,000 RECORDS REAL-TIME PROGRESS TEST PASSED 100%!');
    console.log('========================================================');
}
testLargeDatasetStreamingImport().catch((err) => {
    console.error('Test failed:', err);
    process.exit(1);
});
