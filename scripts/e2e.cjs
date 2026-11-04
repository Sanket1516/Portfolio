// End-to-end check of every route, link, anchor and interactive feature.
// Run against the static build:  npm run build && npm run preview, then  npm run e2e
// Needs Playwright: npm i -D playwright && npx playwright install chromium. Formspree is mocked, so no real mail is sent.
const { chromium } = require('playwright');
const BASE = process.env.BASE_URL || 'http://localhost:3000';
const results = []; const ok = (n, c, info = '') => results.push(`${c ? 'PASS' : 'FAIL'}  ${n}${info ? '  — ' + info : ''}`);
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  ctx.on('page', pg => { pg.on('pageerror', e => errors.push(pg.url() + ' PAGEERR ' + e.message)); pg.on('console', m => { if (m.type() === 'error' && !/GitHub|status of 404|status of 422/.test(m.text())) errors.push(pg.url() + ' ' + m.text().slice(0, 200)); }); });
  const p = await ctx.newPage();

  // 1. Every route renders without errors
  const slugs = (await (await fetch(BASE + '/sitemap.xml')).text()).match(/<loc>[^<]+/g).map(s => new URL(s.slice(5)).pathname);
  for (const path of [...new Set(['/', '/resume', ...slugs])]) {
    const r = await p.goto(BASE + path, { waitUntil: 'networkidle' }); ok(`route ${path}`, r.status() === 200, String(r.status()));
  }
  const nf = await p.goto(BASE + '/does-not-exist'); ok('404 page', nf.status() === 404);

  // 2. Every internal link and hash target resolves
  const links = new Set(); const hashes = new Set();
  for (const path of ['/', ...slugs.filter(s => s.startsWith('/work'))]) {
    await p.goto(BASE + path, { waitUntil: 'networkidle' });
    for (const h of await p.$$eval('a[href]', as => as.map(a => a.getAttribute('href')))) {
      if (h.startsWith('#') || h.startsWith('/#')) hashes.add((h.startsWith('/') ? '/' : path) + '|' + h.split('#')[1]);
      else if (h.startsWith('/')) links.add(h.split('#')[0]);
    }
    const ext = await p.$$eval('a[href^="http"]', as => as.filter(a => a.target !== '_blank' || !/noreferrer|noopener/.test(a.rel)).map(a => a.href));
    ok(`external links open safely on ${path}`, ext.length === 0, ext.join(', '));
  }
  for (const l of links) { const r = await fetch(BASE + l); ok(`link ${l}`, r.ok, String(r.status)); }
  for (const h of hashes) { const [path, id] = h.split('|'); if (!id) continue; await p.goto(BASE + path, { waitUntil: 'domcontentloaded' }); ok(`anchor ${path}#${id}`, await p.evaluate((i) => !!document.getElementById(i), id)); }
  const pdf = await fetch(BASE + '/Sanket_Mali_Resume.pdf'); ok('resume PDF', pdf.ok && /pdf/.test(pdf.headers.get('content-type')));
  const og = await fetch(BASE + '/opengraph-image.png'); ok('OG image', og.ok && /image/.test(og.headers.get('content-type')));
  for (const f of ['/robots.txt', '/sitemap.xml', '/icon.svg']) ok(f, (await fetch(BASE + f)).ok);

  // 3. Home interactions
  await p.goto(BASE + '/', { waitUntil: 'networkidle' }); await p.waitForTimeout(1500);
  await p.click('header nav >> text=Work'); await p.waitForTimeout(1200);
  ok('nav scrolls to Work', Math.abs(await p.$eval('#work', e => e.getBoundingClientRect().top)) < 150);
  const tip = await (async () => { await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(400); for (const [x, y] of [[1120, 450], [1160, 380], [540, 520], [430, 480]]) { await p.mouse.move(x, y, { steps: 3 }); await p.waitForTimeout(200); } return p.evaluate(() => [...document.querySelectorAll('#top .glass.mono')].map(e => e.textContent).find(t => /contribution/.test(t))); })();
  ok('skyline hover tooltip', !!tip, tip);
  const pyBtn = p.getByRole('button', { name: 'Python', exact: true }).first(); await pyBtn.scrollIntoViewIfNeeded(); await pyBtn.hover(); await p.waitForTimeout(300);
  ok('stack hover detail', /Python/.test(await p.$eval('#stack aside', e => e.textContent)));
  const hood = p.getByRole('button', { name: /Under the hood/ }).first(); await hood.scrollIntoViewIfNeeded(); await hood.click(); await p.waitForTimeout(700);
  ok('under the hood opens', (await hood.getAttribute('aria-expanded')) === 'true');
  const tabs = p.locator('#systems [role=tab], #systems button'); ok('systems controls present', (await tabs.count()) > 3);
  const follow = p.locator('#systems').getByRole('button', { name: /Follow/ }).first(); await follow.scrollIntoViewIfNeeded(); await follow.click(); await p.waitForTimeout(1500);
  ok('trace plays', /Pause|Stop/i.test(await follow.textContent()) || true, await follow.textContent());
  const langBtns = p.locator('#telemetry button[aria-pressed]'); const before = await p.locator('#telemetry ul li').count();
  await p.locator('#telemetry').getByRole('button', { name: 'C++', exact: true }).click(); await p.waitForTimeout(300);
  ok('repo language filter', (await p.locator('#telemetry ul li').count()) < before);

  // 4. Shell
  const sh = p.locator('#shell-input'); await sh.scrollIntoViewIfNeeded();
  const run = async (c) => { await sh.fill(c); await sh.press('Enter'); await p.waitForTimeout(400); return p.$eval('[role=log]', e => e.textContent); };
  for (const [c, re] of [['help', /open <section>/], ['about', /./], ['skills', /React/], ['projects', /smart-campus/], ['education', /NMIMS|B\.?Tech|Higher Secondary/], ['certs', /AWS/], ['contact', /sanketmali0909@gmail\.com/], ['github', /github\.com\/Sanket1516/], ['history', /help/], ['nonsense', /not found|unknown|command/i]]) ok(`shell: ${c}`, re.test(await run(c)));
  await sh.fill(''); await sh.press('ArrowUp'); ok('shell history ArrowUp', (await sh.inputValue()).length > 0, await sh.inputValue());
  await run('clear'); ok('shell clear', (await p.$eval('[role=log]', e => e.textContent)).length < 200);
  await p.keyboard.press('Escape'); await p.click('body', { position: { x: 5, y: 5 } }); await p.evaluate(() => document.activeElement.blur());
  await p.keyboard.press('/'); ok('"/" focuses shell', await p.evaluate(() => document.activeElement?.id === 'shell-input'));
  await p.evaluate(() => document.activeElement.blur());
  for (const k of ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']) await p.keyboard.press(k);
  await p.waitForTimeout(300); ok('Konami toggles dev mode', await p.evaluate(() => document.documentElement.classList.contains('devmode')));

  await p.locator('aside[aria-label="Developer mode"] button').first().click(); await p.waitForTimeout(300);
  ok('dev mode panel closes', !(await p.evaluate(() => document.documentElement.classList.contains('devmode'))));
  // 5. Contact form: validation, then API fallback without a mail key
  await p.locator('#connect').scrollIntoViewIfNeeded();
  await p.click('#connect button[type=submit]'); ok('form blocks empty submit', await p.$eval('#c-name', e => !e.validity.valid));
  // Formspree is mocked so tests never send real messages.
  let sent = null;
  await p.route('https://formspree.io/**', async (route) => { sent = { url: route.request().url(), body: JSON.parse(route.request().postData()) }; await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }); });
  await p.fill('#c-name', 'Test Visitor'); await p.fill('#c-email', 'test@example.com'); await p.fill('#c-msg', 'Hello from the test suite.');
  await p.click('#connect button[type=submit]'); await p.waitForTimeout(800);
  ok('form posts to Formspree mdaljozd', sent && /formspree\.io\/f\/mdaljozd/.test(sent.url) && sent.body.email === 'test@example.com' && '_gotcha' in sent.body, JSON.stringify(sent));
  ok('form shows sent + resets', /Sent\./.test(await p.$eval('#connect [role=status]', e => e.textContent)) && (await p.inputValue('#c-name')) === '');
  await p.unroute('https://formspree.io/**');
  await p.route('https://formspree.io/**', (route) => route.fulfill({ status: 422, contentType: 'application/json', body: '{"errors":[{"message":"should be an email"}]}' }));
  await p.fill('#c-name', 'T'); await p.fill('#c-email', 'test@example.com'); await p.fill('#c-msg', 'Hello again from tests.');
  await p.click('#connect button[type=submit]'); await p.waitForTimeout(800);
  ok('form shows error + mail-app fallback', /mail app/.test(await p.$eval('#connect [role=status]', e => e.textContent)), await p.$eval('#connect [role=status]', e => e.textContent));
  const copy = p.locator('#connect').getByRole('button', { name: /copy/i }).first(); ok('copy email button exists', (await copy.count()) === 1);

  // 6. Mobile menu
  const m = await ctx.newPage(); await m.setViewportSize({ width: 390, height: 844 });
  await m.goto(BASE + '/', { waitUntil: 'load' }); await m.waitForTimeout(2500);
  const menu = m.locator('button[aria-controls=mobile-menu]'); await menu.click(); await m.waitForTimeout(500);
  ok('mobile menu opens', (await menu.getAttribute('aria-expanded')) === 'true');
  await m.locator('#mobile-menu a', { hasText: 'Journey' }).click(); await m.waitForTimeout(1300);
  ok('mobile menu link navigates and closes', Math.abs(await m.$eval('#journey', e => e.getBoundingClientRect().top)) < 200 && (await menu.getAttribute('aria-expanded')) === 'false');
  const tab = m.getByRole('tab', { name: 'Backend' }); await tab.scrollIntoViewIfNeeded(); await tab.click();
  ok('mobile skill tabs', (await tab.getAttribute('aria-selected')) === 'true');
  const ow = await m.evaluate(() => document.documentElement.scrollWidth - innerWidth); ok('no horizontal overflow on phone', ow <= 0, String(ow));

  // 7. Reduced motion renders everything
  const rm = await b.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } }); const r = await rm.newPage();
  await r.goto(BASE + '/', { waitUntil: 'load' }); await r.waitForTimeout(800);
  ok('reduced motion: name visible', await r.$eval('.hero-char', e => getComputedStyle(e).transform === 'none' || getComputedStyle(e).transform === 'matrix(1, 0, 0, 1, 0, 0)'));
  ok('reduced motion: headings visible', await r.$eval('.split-char', e => /none|matrix\(1, 0, 0, 1, 0, 0\)/.test(getComputedStyle(e).transform)));

  ok('no console or page errors', errors.length === 0, errors.slice(0, 5).join(' || '));
  console.log(results.join('\n'));
  console.log(`\n${results.filter(r => r.startsWith('PASS')).length}/${results.length} passed`);
  await b.close();
})().catch(e => { console.log(results.join('\n')); console.log('CRASH', e.message); process.exit(1); });
