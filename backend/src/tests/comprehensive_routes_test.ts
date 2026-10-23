import http from 'http';

interface TestResult {
  route: string;
  method: string;
  status: number;
  expectedStatus: number | number[];
  success: boolean;
  notes?: string;
  error?: string;
}

const results: TestResult[] = [];
let adminToken = '';
let userToken = '';
let testUserId: number | null = null;
let testBrandId: number | null = null;
let testCategoryId: number | null = null;
let testTypeId: number | null = null;
let testModelId: number | null = null;

async function request(
  method: string,
  path: string,
  body?: any,
  token?: string,
  customHeaders?: Record<string, string>
): Promise<{ status: number; data: any; headers: http.IncomingHttpHeaders }> {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : undefined;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(customHeaders || {})
    };
    if (payload) {
      headers['Content-Length'] = Buffer.byteLength(payload).toString();
    }

    const req = http.request(
      {
        hostname: 'localhost',
        port: 5000,
        path,
        method,
        headers
      },
      (res) => {
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => {
          let parsed = null;
          try {
            parsed = raw ? JSON.parse(raw) : null;
          } catch {
            parsed = raw;
          }
          resolve({ status: res.statusCode || 0, data: parsed, headers: res.headers });
        });
      }
    );

    req.on('error', (err) => reject(err));
    if (payload) req.write(payload);
    req.end();
  });
}

function record(
  method: string,
  route: string,
  status: number,
  expectedStatus: number | number[],
  data: any,
  notes = ''
) {
  const allowed = Array.isArray(expectedStatus) ? expectedStatus : [expectedStatus];
  const passed = allowed.includes(status);
  results.push({
    method,
    route,
    status,
    expectedStatus,
    success: passed,
    notes: notes || (data?.message ? String(data.message) : ''),
    error: passed ? undefined : JSON.stringify(data)
  });
  console.log(
    `[${passed ? 'PASS' : 'FAIL'}] ${method} ${route} -> Status: ${status} (Expected: ${allowed.join('/')})`
  );
  if (!passed) {
    console.log(`   Response details:`, JSON.stringify(data).slice(0, 300));
  }
}

async function runTests() {
  console.log('====================================================');
  console.log('STARTING UNIVERSAL LIST FULL ROUTE INTEGRATION TESTS');
  console.log('====================================================\n');

  // 1. Health
  try {
    const res = await request('GET', '/health');
    record('GET', '/health', res.status, 200, res.data, 'Health check');
  } catch (err: any) {
    record('GET', '/health', 0, 200, null, err.message);
  }

  // 2. Auth - Admin Login
  try {
    const res = await request('POST', '/api/auth/login', {
      email: 'admin@example.com',
      password: 'admin123'
    });
    record('POST', '/api/auth/login', res.status, 200, res.data, 'Super Admin login');
    if (res.data?.token) {
      adminToken = res.data.token;
    }
  } catch (err: any) {
    record('POST', '/api/auth/login', 0, 200, null, err.message);
  }

  // 3. Auth - Invalid Login
  try {
    const res = await request('POST', '/api/auth/login', {
      email: 'admin@example.com',
      password: 'wrongpassword'
    });
    record('POST', '/api/auth/login (invalid password)', res.status, 401, res.data, 'Reject bad password');
  } catch (err: any) {
    record('POST', '/api/auth/login (invalid password)', 0, 401, null, err.message);
  }

  // 4. Auth - Register New User
  const uniqueEmail = `testuser_${Date.now()}@example.com`;
  try {
    const res = await request('POST', '/api/auth/register', {
      name: 'Test Technician',
      email: uniqueEmail,
      password: 'Password123!'
    });
    record('POST', '/api/auth/register', res.status, 201, res.data, 'Register test user');
    if (res.data?.data?.id) {
      testUserId = res.data.data.id;
    }
  } catch (err: any) {
    record('POST', '/api/auth/register', 0, 201, null, err.message);
  }

  // 5. Auth - Login as Newly Registered User
  try {
    const res = await request('POST', '/api/auth/login', {
      email: uniqueEmail,
      password: 'Password123!'
    });
    record('POST', '/api/auth/login (new user)', res.status, 200, res.data, 'Login new user');
    if (res.data?.token) {
      userToken = res.data.token;
    }
  } catch (err: any) {
    record('POST', '/api/auth/login (new user)', 0, 200, null, err.message);
  }

  // 6. Auth - GET /me with Bearer token
  try {
    const res = await request('GET', '/api/auth/me', undefined, userToken);
    record('GET', '/api/auth/me', res.status, 200, res.data, 'Authenticated me endpoint');
  } catch (err: any) {
    record('GET', '/api/auth/me', 0, 200, null, err.message);
  }

  // 7. Auth - GET /me without token (should fail 401)
  try {
    const res = await request('GET', '/api/auth/me');
    record('GET', '/api/auth/me (unauthenticated)', res.status, 401, res.data, 'Should reject no auth');
  } catch (err: any) {
    record('GET', '/api/auth/me (unauthenticated)', 0, 401, null, err.message);
  }

  // 8. Auth - Logout
  try {
    const res = await request('POST', '/api/auth/logout', undefined, userToken);
    record('POST', '/api/auth/logout', res.status, 200, res.data, 'Logout user');
  } catch (err: any) {
    record('POST', '/api/auth/logout', 0, 200, null, err.message);
  }

  // 9. Brands - GET /api/brands
  try {
    const res = await request('GET', '/api/brands');
    record('GET', '/api/brands', res.status, 200, res.data, `Found ${res.data?.data?.length || 0} brands`);
  } catch (err: any) {
    record('GET', '/api/brands', 0, 200, null, err.message);
  }

  // 10. Brands - POST /api/brands (Admin Insert)
  const testBrandName = `TestBrand_${Date.now()}`;
  try {
    const res = await request(
      'POST',
      '/api/brands',
      {
        name: testBrandName,
        slug: testBrandName.toLowerCase(),
        logoUrl: 'https://example.com/logo.png',
        isActive: true
      },
      adminToken
    );
    record('POST', '/api/brands (admin insert)', res.status, 201, res.data, 'Brand created');
    if (res.data?.data?.id) {
      testBrandId = res.data.data.id;
    }
  } catch (err: any) {
    record('POST', '/api/brands (admin insert)', 0, 201, null, err.message);
  }

  // 11. Brands - POST /api/brands (Technician/User forbidden)
  try {
    const res = await request(
      'POST',
      '/api/brands',
      { name: `ForbiddenBrand_${Date.now()}` },
      userToken
    );
    record('POST', '/api/brands (non-admin forbidden)', res.status, 403, res.data, 'Should forbid regular user');
  } catch (err: any) {
    record('POST', '/api/brands (non-admin forbidden)', 0, 403, null, err.message);
  }

  // 12. Brands - GET /api/brands/:id
  if (testBrandId) {
    try {
      const res = await request('GET', `/api/brands/${testBrandId}`);
      record('GET', `/api/brands/:id`, res.status, 200, res.data, 'Get single brand by ID');
    } catch (err: any) {
      record('GET', `/api/brands/:id`, 0, 200, null, err.message);
    }

    // 13. Brands - PUT /api/brands/:id (Admin Update)
    try {
      const res = await request(
        'PUT',
        `/api/brands/${testBrandId}`,
        {
          name: `${testBrandName} Updated`
        },
        adminToken
      );
      record('PUT', `/api/brands/:id (admin update)`, res.status, 200, res.data, 'Brand updated');
    } catch (err: any) {
      record('PUT', `/api/brands/:id (admin update)`, 0, 200, null, err.message);
    }
  }

  // 14. Categories - GET /api/categories
  try {
    const res = await request('GET', '/api/categories');
    record('GET', '/api/categories', res.status, 200, res.data, `Found ${res.data?.data?.length || 0} categories`);
  } catch (err: any) {
    record('GET', '/api/categories', 0, 200, null, err.message);
  }

  // 15. Categories - POST /api/categories (Admin Insert)
  const testCatName = `TestCat_${Date.now()}`;
  try {
    const res = await request(
      'POST',
      '/api/categories',
      {
        name: testCatName,
        slug: testCatName.toLowerCase(),
        description: 'Automated test category',
        navigationType: 'brand_first',
        sortOrder: 99
      },
      adminToken
    );
    record('POST', '/api/categories (admin insert)', res.status, 201, res.data, 'Category created');
    if (res.data?.data?.id) {
      testCategoryId = res.data.data.id;
    }
  } catch (err: any) {
    record('POST', '/api/categories (admin insert)', 0, 201, null, err.message);
  }

  // 16. Categories - GET /api/categories/:id
  if (testCategoryId) {
    try {
      const res = await request('GET', `/api/categories/${testCategoryId}`);
      record('GET', `/api/categories/:id`, res.status, 200, res.data, 'Get single category');
    } catch (err: any) {
      record('GET', `/api/categories/:id`, 0, 200, null, err.message);
    }

    // 17. Categories - PUT /api/categories/:id (Admin Update)
    try {
      const res = await request(
        'PUT',
        `/api/categories/${testCategoryId}`,
        { description: 'Updated test category description' },
        adminToken
      );
      record('PUT', `/api/categories/:id (admin update)`, res.status, 200, res.data, 'Category updated');
    } catch (err: any) {
      record('PUT', `/api/categories/:id (admin update)`, 0, 200, null, err.message);
    }

    // 18. Categories - POST /api/categories/:id/types (Admin Insert Type)
    try {
      const res = await request(
        'POST',
        `/api/categories/${testCategoryId}/types`,
        {
          name: 'Standard Variant',
          slug: 'standard-variant',
          description: 'Type test'
        },
        adminToken
      );
      record('POST', `/api/categories/:id/types`, res.status, 201, res.data, 'Category type created');
      if (res.data?.data?.id) {
        testTypeId = res.data.data.id;
      }
    } catch (err: any) {
      record('POST', `/api/categories/:id/types`, 0, 201, null, err.message);
    }

    // 19. Categories - PUT /api/categories/types/:typeId (Admin Update Type)
    if (testTypeId) {
      try {
        const res = await request(
          'PUT',
          `/api/categories/types/${testTypeId}`,
          { name: 'Standard Variant Pro' },
          adminToken
        );
        record('PUT', `/api/categories/types/:typeId`, res.status, 200, res.data, 'Category type updated');
      } catch (err: any) {
        record('PUT', `/api/categories/types/:typeId`, 0, 200, null, err.message);
      }
    }

    // 20. Categories - GET /api/categories/:id/types
    try {
      const res = await request('GET', `/api/categories/${testCategoryId}/types`);
      record('GET', `/api/categories/:id/types`, res.status, 200, res.data, 'Get category types list');
    } catch (err: any) {
      record('GET', `/api/categories/:id/types`, 0, 200, null, err.message);
    }

    // 21. Categories - GET /api/categories/:id/brands
    try {
      const res = await request('GET', `/api/categories/${testCategoryId}/brands`);
      record('GET', `/api/categories/:id/brands`, res.status, 200, res.data, 'Get brands for category');
    } catch (err: any) {
      record('GET', `/api/categories/:id/brands`, 0, 200, null, err.message);
    }
  }

  // 22. Models - GET /api/models (View all models)
  try {
    const res = await request('GET', '/api/models?page=1&limit=10');
    record('GET', '/api/models', res.status, 200, res.data, `Total models: ${res.data?.pagination?.total || 0}`);
  } catch (err: any) {
    record('GET', '/api/models', 0, 200, null, err.message);
  }

  // 23. Models - POST /api/models (Admin Insert Model)
  if (testBrandId && testCategoryId) {
    const testModelName = `Galaxy Test ${Date.now()}`;
    try {
      const res = await request(
        'POST',
        '/api/models',
        {
          name: testModelName,
          brandId: testBrandId,
          categoryId: testCategoryId,
          typeId: testTypeId || undefined,
          isVerified: true,
          notes: 'Test model for automation',
          aliases: ['GT-100', 'Galaxy-T'],
          compatibilityLists: [
            {
              compatibleWith: 'Galaxy S24 Ultra',
              connectorType: 'Type-C',
              type: 'Charging'
            }
          ]
        },
        adminToken
      );
      record('POST', '/api/models (admin insert)', res.status, 201, res.data, 'Model created with aliases & compat');
      if (res.data?.data?.id) {
        testModelId = res.data.data.id;
      }
    } catch (err: any) {
      record('POST', '/api/models (admin insert)', 0, 201, null, err.message);
    }
  }

  // 24. Models - GET /api/models/:id (View single model)
  if (testModelId) {
    try {
      const res = await request('GET', `/api/models/${testModelId}`);
      record('GET', `/api/models/:id`, res.status, 200, res.data, 'Get single model by ID');
    } catch (err: any) {
      record('GET', `/api/models/:id`, 0, 200, null, err.message);
    }

    // 25. Models - GET /api/models/:id/compatibility (View compatibility)
    try {
      const res = await request('GET', `/api/models/${testModelId}/compatibility`);
      record('GET', `/api/models/:id/compatibility`, res.status, 200, res.data, 'Get model compatibilities');
    } catch (err: any) {
      record('GET', `/api/models/:id/compatibility`, 0, 200, null, err.message);
    }

    // 26. Models - PUT /api/models/:id (Admin Update Model)
    try {
      const res = await request(
        'PUT',
        `/api/models/${testModelId}`,
        {
          name: 'Galaxy Test Pro',
          notes: 'Updated notes after verification',
          aliases: ['GT-100', 'GT-100-PRO']
        },
        adminToken
      );
      record('PUT', `/api/models/:id (admin update)`, res.status, 200, res.data, 'Model updated');
    } catch (err: any) {
      record('PUT', `/api/models/:id (admin update)`, 0, 200, null, err.message);
    }

    // 27. Models - POST /api/models/:id/compatibility (Add compatibility)
    try {
      const res = await request(
        'POST',
        `/api/models/${testModelId}/compatibility`,
        {
          compatibleWith: 'Galaxy Note 20',
          connectorType: 'Type-C',
          type: 'Display'
        },
        adminToken
      );
      record('POST', `/api/models/:id/compatibility`, res.status, 201, res.data, 'Added compatibility relationship');
    } catch (err: any) {
      record('POST', `/api/models/:id/compatibility`, 0, 201, null, err.message);
    }
  }

  // 28. Models - POST /api/models/request (Public model request)
  if (testBrandId && testCategoryId) {
    try {
      const res = await request('POST', '/api/models/request', {
        name: 'Requested Model Phone X',
        brandId: testBrandId,
        categoryId: testCategoryId,
        notes: 'Technician requested this model'
      });
      record('POST', '/api/models/request', res.status, 201, res.data, 'Public request submitted');
    } catch (err: any) {
      record('POST', '/api/models/request', 0, 201, null, err.message);
    }
  }

  // 29. Search - GET /api/search
  try {
    const res = await request('GET', '/api/search?q=Galaxy');
    record('GET', '/api/search?q=Galaxy', res.status, 200, res.data, `Found ${res.data?.data?.length || 0} results`);
  } catch (err: any) {
    record('GET', '/api/search?q=Galaxy', 0, 200, null, err.message);
  }

  // 30. Search - GET /api/search/models
  try {
    const res = await request('GET', '/api/search/models?q=Galaxy');
    record('GET', '/api/search/models', res.status, 200, res.data, 'Search models endpoint');
  } catch (err: any) {
    record('GET', '/api/search/models', 0, 200, null, err.message);
  }

  // 31. Search - GET /api/search/suggest
  try {
    const res = await request('GET', '/api/search/suggest?q=Gal');
    record('GET', '/api/search/suggest', res.status, 200, res.data, 'Autocomplete suggestions');
  } catch (err: any) {
    record('GET', '/api/search/suggest', 0, 200, null, err.message);
  }

  // 32. Search - GET /api/search/trending
  try {
    const res = await request('GET', '/api/search/trending');
    record('GET', '/api/search/trending', res.status, 200, res.data, 'Trending searches list');
  } catch (err: any) {
    record('GET', '/api/search/trending', 0, 200, null, err.message);
  }

  // 33. Dashboard - GET /api/dashboard/stats
  try {
    const res = await request('GET', '/api/dashboard/stats');
    record('GET', '/api/dashboard/stats', res.status, 200, res.data, `Models count: ${res.data?.data?.totalModels}`);
  } catch (err: any) {
    record('GET', '/api/dashboard/stats', 0, 200, null, err.message);
  }

  // 34. Dashboard - GET /api/dashboard/recent-updates
  try {
    const res = await request('GET', '/api/dashboard/recent-updates');
    record('GET', '/api/dashboard/recent-updates', res.status, 200, res.data, `Updates count: ${res.data?.data?.length}`);
  } catch (err: any) {
    record('GET', '/api/dashboard/recent-updates', 0, 200, null, err.message);
  }

  // 35. Ad Settings - GET /api/ad-settings
  try {
    const res = await request('GET', '/api/ad-settings');
    record('GET', '/api/ad-settings', res.status, 200, res.data, 'Fetch ad settings');
  } catch (err: any) {
    record('GET', '/api/ad-settings', 0, 200, null, err.message);
  }

  // 36. Ad Settings - PUT /api/ad-settings (Admin update)
  try {
    const res = await request(
      'PUT',
      '/api/ad-settings',
      {
        home_top: { slotKey: 'home_top', isActive: true, adClient: 'ca-pub-123', adSlot: '123' },
        home_mid: { slotKey: 'home_mid', isActive: false, adClient: 'ca-pub-123', adSlot: '123' },
        sidebar: { slotKey: 'sidebar', isActive: false, adClient: 'ca-pub-123', adSlot: '123' },
        in_list: { slotKey: 'in_list', isActive: false, adClient: 'ca-pub-123', adSlot: '123' }
      },
      adminToken
    );
    record('PUT', '/api/ad-settings', res.status, 200, res.data, 'Update ad settings');
  } catch (err: any) {
    record('PUT', '/api/ad-settings', 0, 200, null, err.message);
  }

  // 37. Admin - GET /api/admin/dashboard
  try {
    const res = await request('GET', '/api/admin/dashboard', undefined, adminToken);
    record('GET', '/api/admin/dashboard', res.status, 200, res.data, 'Admin dashboard metrics');
  } catch (err: any) {
    record('GET', '/api/admin/dashboard', 0, 200, null, err.message);
  }

  // 38. Admin - GET /api/admin/dashboard without admin token (forbidden)
  try {
    const res = await request('GET', '/api/admin/dashboard', undefined, userToken);
    record('GET', '/api/admin/dashboard (non-admin)', res.status, 403, res.data, 'Should forbid technician');
  } catch (err: any) {
    record('GET', '/api/admin/dashboard (non-admin)', 0, 403, null, err.message);
  }

  // 39. Admin - GET /api/admin/users
  try {
    const res = await request('GET', '/api/admin/users', undefined, adminToken);
    record('GET', '/api/admin/users', res.status, 200, res.data, `Users found: ${res.data?.data?.length}`);
  } catch (err: any) {
    record('GET', '/api/admin/users', 0, 200, null, err.message);
  }

  // 40. Admin - PATCH /api/admin/users/:id/status
  if (testUserId) {
    try {
      const res = await request(
        'PATCH',
        `/api/admin/users/${testUserId}/status`,
        { status: 'suspended' },
        adminToken
      );
      record('PATCH', `/api/admin/users/:id/status`, res.status, 200, res.data, 'User status changed to suspended');

      // Re-activate user
      await request(
        'PATCH',
        `/api/admin/users/${testUserId}/status`,
        { status: 'active' },
        adminToken
      );
    } catch (err: any) {
      record('PATCH', `/api/admin/users/:id/status`, 0, 200, null, err.message);
    }

    // 41. Admin - PATCH /api/admin/users/:id/role
    try {
      const res = await request(
        'PATCH',
        `/api/admin/users/${testUserId}/role`,
        { roleId: 3 }, // Technician
        adminToken
      );
      record('PATCH', `/api/admin/users/:id/role`, res.status, 200, res.data, 'User role updated');
    } catch (err: any) {
      record('PATCH', `/api/admin/users/:id/role`, 0, 200, null, err.message);
    }
  }

  // 42. Admin - GET /api/admin/ai/jobs
  try {
    const res = await request('GET', '/api/admin/ai/jobs', undefined, adminToken);
    record('GET', '/api/admin/ai/jobs', res.status, 200, res.data, 'Get AI jobs history');
  } catch (err: any) {
    record('GET', '/api/admin/ai/jobs', 0, 200, null, err.message);
  }

  // 43. Admin - GET /api/admin/ai/candidates
  try {
    const res = await request('GET', '/api/admin/ai/candidates', undefined, adminToken);
    record('GET', '/api/admin/ai/candidates', res.status, 200, res.data, 'Get AI candidates');
  } catch (err: any) {
    record('GET', '/api/admin/ai/candidates', 0, 200, null, err.message);
  }

  // 44. Admin - GET /api/admin/ai/settings
  try {
    const res = await request('GET', '/api/admin/ai/settings', undefined, adminToken);
    record('GET', '/api/admin/ai/settings', res.status, 200, res.data, 'Get AI settings');
  } catch (err: any) {
    record('GET', '/api/admin/ai/settings', 0, 200, null, err.message);
  }

  // 45. Admin - PUT /api/admin/ai/settings
  try {
    const res = await request(
      'PUT',
      '/api/admin/ai/settings',
      { auto_approve_threshold: '0.85' },
      adminToken
    );
    record('PUT', '/api/admin/ai/settings', res.status, 200, res.data, 'Update AI settings');
  } catch (err: any) {
    record('PUT', '/api/admin/ai/settings', 0, 200, null, err.message);
  }

  // 46. Admin - GET /api/admin/ai/models
  try {
    const res = await request('GET', '/api/admin/ai/models', undefined, adminToken);
    record('GET', '/api/admin/ai/models', res.status, 200, res.data, `Gemini models: ${res.data?.data?.length || 0}`);
  } catch (err: any) {
    record('GET', '/api/admin/ai/models', 0, 200, null, err.message);
  }

  // 47. Admin - GET /api/admin/audit-logs
  try {
    const res = await request('GET', '/api/admin/audit-logs', undefined, adminToken);
    record('GET', '/api/admin/audit-logs', res.status, 200, res.data, `Audit logs count: ${res.data?.data?.length || 0}`);
  } catch (err: any) {
    record('GET', '/api/admin/audit-logs', 0, 200, null, err.message);
  }

  // 48. Clean Up - Delete/Deactivate test records
  // Delete Model
  if (testModelId) {
    try {
      const res = await request('DELETE', `/api/models/${testModelId}`, undefined, adminToken);
      record('DELETE', `/api/models/:id`, res.status, 200, res.data, 'Model deactivated/deleted');
    } catch (err: any) {
      record('DELETE', `/api/models/:id`, 0, 200, null, err.message);
    }
  }

  // Delete Category
  if (testCategoryId) {
    try {
      const res = await request('DELETE', `/api/categories/${testCategoryId}`, undefined, adminToken);
      record('DELETE', `/api/categories/:id`, res.status, 200, res.data, 'Category deactivated/deleted');
    } catch (err: any) {
      record('DELETE', `/api/categories/:id`, 0, 200, null, err.message);
    }
  }

  // Delete Brand
  if (testBrandId) {
    try {
      const res = await request('DELETE', `/api/brands/${testBrandId}`, undefined, adminToken);
      record('DELETE', `/api/brands/:id`, res.status, 200, res.data, 'Brand deactivated/deleted');
    } catch (err: any) {
      record('DELETE', `/api/brands/:id`, 0, 200, null, err.message);
    }
  }

  console.log('\n====================================================');
  console.log('TEST SUMMARY');
  console.log('====================================================');
  const total = results.length;
  const passed = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;
  console.log(`Total Routes Tested: ${total}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  if (failed > 0) {
    console.log('\nFailed Tests:');
    results
      .filter((r) => !r.success)
      .forEach((r) => {
        console.log(`- ${r.method} ${r.route} -> Status ${r.status} (Expected: ${r.expectedStatus}) Error: ${r.error}`);
      });
  }
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Test execution failed with error:', e);
  process.exit(1);
});
