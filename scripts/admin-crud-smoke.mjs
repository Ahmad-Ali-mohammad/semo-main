const API_BASE = (
  process.env.API_BASE ||
  (process.env.BACKEND_URL ? `${String(process.env.BACKEND_URL).replace(/\/+$/, '')}/api` : '') ||
  'http://127.0.0.1:3001/api'
).replace(/\/+$/, '');
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'owner@reptilehouse.sy';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Owner@12345';
const CANONICAL_BASE_URL = process.env.CANONICAL_BASE_URL || 'https://example.com';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function request(path, { method = 'GET', body, token, expected = [200] } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!expected.includes(res.status)) {
    const msg = typeof data === 'object' && data?.error ? data.error : text || `HTTP ${res.status}`;
    throw new Error(`${method} ${path} failed: ${res.status} - ${msg}`);
  }

  return { status: res.status, data };
}

async function run() {
  const runId = Date.now();
  const results = [];
  const created = {
    productId: null,
    articleId: null,
    heroId: null,
    offerId: null,
    policyId: null,
    serviceId: null,
    pageId: null,
  };

  const pass = (name) => results.push({ name, status: 'PASS' });
  const fail = (name, error) => results.push({ name, status: 'FAIL', error: error.message });

  // Login
  let token = '';
  try {
    const login = await request('/auth/login', {
      method: 'POST',
      body: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
      expected: [200],
    });
    token = login.data?.token || '';
    assert(token, 'No token received from login');
    pass('Admin login');
  } catch (error) {
    fail('Admin login', error);
    printSummary(results);
    process.exitCode = 1;
    return;
  }

  // SETTINGS (frontend control surfaces)
  try {
    const marker = `Smoke-${runId}`;
    await request('/settings/contact', {
      method: 'PUT',
      token,
      expected: [200],
      body: {
        phone: `+9639${String(runId).slice(-8)}`,
        email: `smoke-${runId}@example.com`,
        address: `Address ${marker}`,
        city: 'Damascus',
        country: 'Syria',
        workingHours: '10-18',
        socialMedia: { facebook: `https://facebook.com/${marker}` },
      },
    });
    const contact = await request('/settings/contact', { expected: [200] });
    assert(String(contact.data?.email || '').includes(`smoke-${runId}`), 'Contact settings not updated');
    pass('Settings contact update/read');
  } catch (error) {
    fail('Settings contact update/read', error);
  }

  try {
    const title = `SEO Title ${runId}`;
    await request('/settings/seo', {
      method: 'PUT',
      token,
      expected: [200],
      body: {
        defaultTitle: title,
        defaultDescription: `SEO Desc ${runId}`,
        canonicalBaseUrl: CANONICAL_BASE_URL,
      },
    });
    const seo = await request('/settings/seo', { expected: [200] });
    assert(seo.data?.defaultTitle === title, 'SEO settings not updated');
    pass('Settings SEO update/read');
  } catch (error) {
    fail('Settings SEO update/read', error);
  }

  try {
    const companyName = `Reptile House ${runId}`;
    await request('/settings/company', {
      method: 'PUT',
      token,
      expected: [200],
      body: {
        name: companyName,
        nameEnglish: companyName,
        description: `Company ${runId}`,
      },
    });
    const company = await request('/settings/company', { expected: [200] });
    assert(company.data?.name === companyName, 'Company settings not updated');
    pass('Settings company update/read');
  } catch (error) {
    fail('Settings company update/read', error);
  }

  // PRODUCT CRUD
  try {
    const createdProduct = await request('/products', {
      method: 'POST',
      token,
      expected: [201],
      body: {
        name: `Smoke Product ${runId}`,
        species: 'Test Species',
        description: 'CRUD smoke product',
        price: 199,
        imageUrl: '/assets/photo_2026-02-04_07-13-35.jpg',
        rating: 4.9,
        isAvailable: true,
        status: 'available',
        category: 'lizard',
      },
    });
    created.productId = createdProduct.data?.id;
    assert(created.productId, 'Product create did not return id');

    await request(`/products/${created.productId}`, {
      method: 'PUT',
      token,
      expected: [200],
      body: { price: 299, name: `Smoke Product Updated ${runId}` },
    });
    const list = await request('/products', { expected: [200] });
    assert(Array.isArray(list.data) && list.data.some((p) => p.id === created.productId), 'Product not found in list');

    await request(`/products/${created.productId}`, { method: 'DELETE', token, expected: [204] });
    const listAfterDelete = await request('/products', { expected: [200] });
    assert(!listAfterDelete.data.some((p) => p.id === created.productId), 'Product still exists after delete');
    created.productId = null;
    pass('Products CRUD');
  } catch (error) {
    fail('Products CRUD', error);
  }

  // ARTICLE CRUD
  try {
    const createdArticle = await request('/articles', {
      method: 'POST',
      token,
      expected: [201],
      body: {
        title: `Smoke Article ${runId}`,
        excerpt: 'Excerpt',
        content: 'Content',
        category: 'educational',
        date: '2026-03-05',
        author: 'Smoke',
        image: '/assets/photo_2026-02-04_07-13-35.jpg',
      },
    });
    created.articleId = createdArticle.data?.id;
    assert(created.articleId, 'Article create did not return id');

    await request(`/articles/${created.articleId}`, {
      method: 'PUT',
      token,
      expected: [200],
      body: { title: `Smoke Article Updated ${runId}` },
    });
    await request(`/articles/${created.articleId}`, { method: 'DELETE', token, expected: [204] });
    created.articleId = null;
    pass('Articles CRUD');
  } catch (error) {
    fail('Articles CRUD', error);
  }

  // HERO CRUD
  try {
    const heroId = `smoke-hero-${runId}`;
    const createdHero = await request('/hero', {
      method: 'POST',
      token,
      expected: [201],
      body: {
        id: heroId,
        image: '/assets/photo_2026-02-04_07-13-35.jpg',
        title: `Hero ${runId}`,
        subtitle: 'Sub',
        buttonText: 'Go',
        link: 'showcase',
        active: true,
      },
    });
    created.heroId = createdHero.data?.id || heroId;
    await request(`/hero/${created.heroId}`, {
      method: 'PUT',
      token,
      expected: [200],
      body: { title: `Hero Updated ${runId}` },
    });
    await request(`/hero/${created.heroId}`, { method: 'DELETE', token, expected: [204] });
    created.heroId = null;
    pass('Hero slides CRUD');
  } catch (error) {
    fail('Hero slides CRUD', error);
  }

  // OFFERS CRUD
  try {
    const offerId = `smoke-offer-${runId}`;
    const createdOffer = await request('/offers', {
      method: 'POST',
      token,
      expected: [201],
      body: {
        id: offerId,
        title: `Offer ${runId}`,
        description: 'Offer desc',
        imageUrl: '/assets/photo_2026-02-04_07-13-35.jpg',
        discountPercentage: 15,
        startDate: '2026-03-05',
        endDate: '2026-12-31',
        isActive: true,
        targetCategory: 'all',
        buttonText: 'Open',
        buttonLink: 'offers',
      },
    });
    created.offerId = createdOffer.data?.id || offerId;
    await request(`/offers/${created.offerId}`, {
      method: 'PUT',
      token,
      expected: [200],
      body: { title: `Offer Updated ${runId}` },
    });
    await request(`/offers/${created.offerId}`, { method: 'DELETE', token, expected: [204] });
    created.offerId = null;
    pass('Offers CRUD');
  } catch (error) {
    fail('Offers CRUD', error);
  }

  // POLICIES CRUD
  try {
    const policyId = `smoke-policy-${runId}`;
    const createdPolicy = await request('/policies', {
      method: 'POST',
      token,
      expected: [201],
      body: {
        id: policyId,
        type: 'custom',
        title: `Policy ${runId}`,
        content: '<p>Policy content</p>',
        lastUpdated: '2026-03-05',
        isActive: true,
      },
    });
    created.policyId = createdPolicy.data?.id || policyId;
    await request(`/policies/${created.policyId}`, {
      method: 'PUT',
      token,
      expected: [200],
      body: { title: `Policy Updated ${runId}` },
    });
    await request(`/policies/${created.policyId}`, { method: 'DELETE', token, expected: [204] });
    created.policyId = null;
    pass('Policies CRUD');
  } catch (error) {
    fail('Policies CRUD', error);
  }

  // SERVICES CRUD + reorder
  try {
    const serviceId = `smoke-service-${runId}`;
    const createdService = await request('/services', {
      method: 'POST',
      token,
      expected: [201],
      body: {
        id: serviceId,
        title: `Service ${runId}`,
        description: 'Service description',
        imageUrl: '/assets/photo_2026-02-04_07-13-35.jpg',
        icon: 'reptile',
        price: 50,
        sortOrder: 5,
        isPublished: true,
      },
    });
    created.serviceId = createdService.data?.id || serviceId;
    await request(`/services/${created.serviceId}`, {
      method: 'PUT',
      token,
      expected: [200],
      body: {
        id: created.serviceId,
        title: `Service Updated ${runId}`,
        description: 'Service description updated',
        imageUrl: '/assets/photo_2026-02-04_07-13-35.jpg',
        icon: 'reptile',
        price: 70,
        sortOrder: 6,
        isPublished: true,
      },
    });
    await request('/services/reorder', {
      method: 'POST',
      token,
      expected: [200],
      body: { items: [{ id: created.serviceId, sortOrder: 1 }] },
    });
    await request(`/services/${created.serviceId}`, { method: 'DELETE', token, expected: [204] });
    created.serviceId = null;
    pass('Services CRUD + reorder');
  } catch (error) {
    fail('Services CRUD + reorder', error);
  }

  // PAGE CONTENT CRUD + frontend slug fetch
  try {
    const slug = `smoke-page-${runId}`;
    const createdPage = await request('/page-contents', {
      method: 'POST',
      token,
      expected: [201],
      body: {
        id: `page-${runId}`,
        slug,
        title: `Page ${runId}`,
        excerpt: 'Page excerpt',
        content: '<p>Page content</p>',
        seoTitle: `SEO ${runId}`,
        seoDescription: `SEO Desc ${runId}`,
        isActive: true,
      },
    });
    created.pageId = createdPage.data?.id;
    assert(created.pageId, 'Page content create did not return id');

    const getBySlug = await request(`/page-contents/slug/${slug}`, { expected: [200] });
    assert(getBySlug.data?.slug === slug, 'Page content slug fetch failed');

    await request(`/page-contents/${created.pageId}`, {
      method: 'PUT',
      token,
      expected: [200],
      body: { title: `Page Updated ${runId}` },
    });
    await request(`/page-contents/${created.pageId}`, { method: 'DELETE', token, expected: [204] });
    created.pageId = null;
    pass('Page contents CRUD + slug read');
  } catch (error) {
    fail('Page contents CRUD + slug read', error);
  }

  // Cleanup safety
  await safeCleanup(token, created);
  printSummary(results);
  if (results.some((r) => r.status === 'FAIL')) process.exitCode = 1;
}

async function safeCleanup(token, created) {
  const cleanupOps = [];
  if (created.productId) cleanupOps.push(request(`/products/${created.productId}`, { method: 'DELETE', token, expected: [204, 404] }));
  if (created.articleId) cleanupOps.push(request(`/articles/${created.articleId}`, { method: 'DELETE', token, expected: [204, 404] }));
  if (created.heroId) cleanupOps.push(request(`/hero/${created.heroId}`, { method: 'DELETE', token, expected: [204, 404] }));
  if (created.offerId) cleanupOps.push(request(`/offers/${created.offerId}`, { method: 'DELETE', token, expected: [204, 404] }));
  if (created.policyId) cleanupOps.push(request(`/policies/${created.policyId}`, { method: 'DELETE', token, expected: [204, 404] }));
  if (created.serviceId) cleanupOps.push(request(`/services/${created.serviceId}`, { method: 'DELETE', token, expected: [204, 404] }));
  if (created.pageId) cleanupOps.push(request(`/page-contents/${created.pageId}`, { method: 'DELETE', token, expected: [204, 404] }));
  await Promise.allSettled(cleanupOps);
}

function printSummary(results) {
  console.log('\n=== Admin Dashboard CRUD Smoke Test ===');
  for (const row of results) {
    if (row.status === 'PASS') {
      console.log(`PASS - ${row.name}`);
    } else {
      console.log(`FAIL - ${row.name}: ${row.error}`);
    }
  }
  const passCount = results.filter((r) => r.status === 'PASS').length;
  const failCount = results.length - passCount;
  console.log(`\nTotal: ${results.length}, PASS: ${passCount}, FAIL: ${failCount}`);
}

run().catch((err) => {
  console.error('Smoke test crashed:', err.message);
  process.exitCode = 1;
});
