const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.resolve(__dirname, '../presentation_screenshots');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const CHROME_PATH = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function capture() {
  console.log(`🚀 Launching browser (${CHROME_PATH}) to capture fresh Nuzzle UI screenshots...`);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=430,932']
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: 430,
    height: 932,
    deviceScaleFactor: 2
  });

  console.log('🌐 Navigating to http://localhost:5173/ ...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));

  async function snap(filename) {
    const el = await page.$('.mobile-container') || page;
    const dest = path.join(OUT_DIR, filename);
    await el.screenshot({ path: dest });
    console.log(`📸 Saved: ${filename}`);
  }

  // 1. Home Feed
  console.log('Capturing Home Feed...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('.nav-capsule-item, button'));
    if (btns[0]) btns[0].click();
  });
  await new Promise(r => setTimeout(r, 800));
  await snap('01_home_feed.png');

  // 2. Story Viewer (Click first story avatar)
  console.log('Capturing Story Viewer...');
  await page.evaluate(() => {
    const storyRing = document.querySelector('.circle-item, .story-ring-wrap, .circle-avatar-wrap');
    if (storyRing) storyRing.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await snap('02_story_viewer.png');
  // Close story modal
  await page.evaluate(() => {
    const closeBtn = document.querySelector('.close-modal-btn, .story-close-btn, .modal-close');
    if (closeBtn) closeBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  // 3. PawAI - Scanner
  console.log('Capturing PawAI Scanner...');
  await page.evaluate(() => {
    const aiBtn = Array.from(document.querySelectorAll('.nav-capsule-item')).find(b => b.textContent && b.textContent.includes('PawAI')) || document.querySelectorAll('.nav-capsule-item')[2];
    if (aiBtn) aiBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));
  // Trigger scan analysis
  await page.evaluate(() => {
    const scanBtn = document.querySelector('.scan-primary-btn');
    if (scanBtn) scanBtn.click();
  });
  await new Promise(r => setTimeout(r, 1500));
  await snap('03_pawai_scanner.png');

  // 4. PawAI - Triage
  console.log('Capturing PawAI Triage...');
  await page.evaluate(() => {
    const tabs = document.querySelectorAll('.ai-tab-pill');
    if (tabs[1]) tabs[1].click();
  });
  await new Promise(r => setTimeout(r, 800));
  await snap('04_pawai_triage.png');

  // 5. PawAI - Translator
  console.log('Capturing PawAI Translator...');
  await page.evaluate(() => {
    const tabs = document.querySelectorAll('.ai-tab-pill');
    if (tabs[2]) tabs[2].click();
  });
  await new Promise(r => setTimeout(r, 800));
  await snap('05_pawai_translator.png');

  // 6. PawAI - Matcher
  console.log('Capturing PawAI Matcher...');
  await page.evaluate(() => {
    const tabs = document.querySelectorAll('.ai-tab-pill');
    if (tabs[3]) tabs[3].click();
  });
  await new Promise(r => setTimeout(r, 800));
  await snap('06_pawai_matcher.png');

  // 7. PawAI - Avatar Studio
  console.log('Capturing PawAI Avatar Studio...');
  await page.evaluate(() => {
    const tabs = document.querySelectorAll('.ai-tab-pill');
    if (tabs[4]) tabs[4].click();
  });
  await new Promise(r => setTimeout(r, 800));
  await snap('07_pawai_portraits.png');

  // 8. Explore Communities
  console.log('Capturing Explore Communities...');
  await page.evaluate(() => {
    const expBtn = Array.from(document.querySelectorAll('.nav-capsule-item')).find(b => b.textContent && b.textContent.includes('Explore')) || document.querySelectorAll('.nav-capsule-item')[1];
    if (expBtn) expBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await snap('08_explore_communities.png');

  // 9. Lost & Found Radar
  console.log('Capturing Lost & Found Radar...');
  await page.evaluate(() => {
    const allBtns = Array.from(document.querySelectorAll('button, .category-chip, .quick-action-pill'));
    const lostBtn = allBtns.find(b => b.textContent && (b.textContent.includes('Lost & Found') || b.textContent.includes('Radar')));
    if (lostBtn) lostBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await snap('09_lost_and_found.png');

  // 14. Pet Profile / Passport
  console.log('Capturing Pet Persona & Passport...');
  await page.evaluate(() => {
    const profBtn = Array.from(document.querySelectorAll('.nav-capsule-item')).find(b => b.textContent && (b.textContent.includes('Profile') || b.textContent.includes('Passport'))) || document.querySelectorAll('.nav-capsule-item')[4];
    if (profBtn) profBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await snap('14_pet_persona_profile.png');

  // 17. Dark Theme Mode
  console.log('Capturing Dark Theme Mode...');
  // Go back to feed first
  await page.evaluate(() => {
    const feedBtn = document.querySelectorAll('.nav-capsule-item')[0];
    if (feedBtn) feedBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  // Toggle dark mode
  await page.evaluate(() => {
    const themeBtn = document.querySelector('.theme-toggle-btn, .dark-mode-btn, button[title*="Theme"], button[title*="Dark"]');
    if (themeBtn) {
      themeBtn.click();
    } else {
      document.body.classList.toggle('dark-theme');
      document.documentElement.classList.toggle('dark');
    }
  });
  await new Promise(r => setTimeout(r, 800));
  await snap('17_dark_theme_mode.png');

  await browser.close();
  console.log('🎉 All fresh UI/UX screenshots captured successfully!');
}

capture().catch(err => {
  console.error('Error during screenshot capture:', err);
  process.exit(1);
});
