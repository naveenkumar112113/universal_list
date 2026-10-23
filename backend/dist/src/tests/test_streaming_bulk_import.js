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
Object.defineProperty(exports, "__esModule", { value: true });
async function testStreamingBulkImport() {
    console.log('Testing Real-Time Bulk Import SSE Stream...');
    const BASE_URL = 'http://localhost:5000/api';
    // 1. Authenticate
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@example.com', password: 'admin123' })
    });
    const loginData = await loginRes.json();
    const token = loginData.token || loginData.data?.token;
    // 2. Prepare sample CSV
    const csvContent = `Model Name,Brand,Category,Compatible Models
StreamingPhone A,StreamBrand,Display,StreamPhone B
StreamingPhone B,StreamBrand,Display,StreamPhone A
StreamingPhone C,StreamBrand,Battery,
,InvalidBrand,InvalidCat,
StreamingPhone D,StreamBrand,Tempered Glass,"StreamingPhone A, StreamingPhone B"
`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const formData = new FormData();
    formData.append('file', blob, 'test_stream.csv');
    console.log('Sending streaming bulk-import request...');
    const res = await fetch(`${BASE_URL}/models/bulk-import?stream=true`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'text/event-stream',
        },
        body: formData,
    });
    console.log('Stream status:', res.status);
    console.log('Content-Type:', res.headers.get('content-type'));
    const reader = res.body?.getReader();
    if (!reader)
        throw new Error('No readable stream body returned');
    const decoder = new TextDecoder();
    let buffer = '';
    const eventsReceived = [];
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
                eventsReceived.push(payload);
                console.log(`[SSE Event: ${payload.type}] progress: ${payload.progress}%, inserted: ${payload.inserted}, failed: ${payload.failed}, total: ${payload.total}, current: ${payload.currentModel || 'N/A'}`);
            }
        }
    }
    console.log(`\nTotal SSE events received: ${eventsReceived.length}`);
    const lastEvent = eventsReceived[eventsReceived.length - 1];
    console.log('Final SSE event:', lastEvent);
    if (lastEvent.type !== 'complete') {
        throw new Error('Last event was not complete!');
    }
    if (lastEvent.progress !== 100) {
        throw new Error(`Expected progress 100, got ${lastEvent.progress}`);
    }
    if (lastEvent.total !== 5) {
        throw new Error(`Expected total 5, got ${lastEvent.total}`);
    }
    if (lastEvent.inserted !== 4 || lastEvent.failed !== 1) {
        throw new Error(`Expected inserted 4 and failed 1, got inserted=${lastEvent.inserted}, failed=${lastEvent.failed}`);
    }
    // Cleanup test models
    const prisma = (await Promise.resolve().then(() => __importStar(require('../config/db')))).default;
    await prisma.model.deleteMany({
        where: { name: { startsWith: 'StreamingPhone' } }
    });
    await prisma.brand.deleteMany({
        where: { name: 'StreamBrand' }
    });
    await prisma.$disconnect();
    console.log('\n✓ REAL-TIME STREAMING BULK IMPORT TEST PASSED 100%!');
}
testStreamingBulkImport().catch((err) => {
    console.error('Test failed:', err);
    process.exit(1);
});
