const { chromium } = require('e:/nuzzle project/Pet Social media/node_modules/playwright');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = path.resolve(__dirname, '../presentation_screenshots');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function capture() {
  console.log('Launching browser for presentation screenshots...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 440, height: 900 },
    deviceScaleFactor: 2 // High resolution for presentation slides
  });

  const page = await context.newPage();
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Helper to click in Vue store
  async function setTab(tabName) {
    await page.evaluate((tab) => {
      // Find buttons or evaluate store
      const buttons = Array.from(document.querySelectorAll('.nav-tab-btn, .screen-chip, .filter-chip, .persona-tab, button'));
      // Directly trigger via window if available or DOM click
      const tabMap = {
        'feed': () => document.querySelector('.bottom-nav button:nth-child(1)')?.click(),
        'explore': () => document.querySelector('.bottom-nav button:nth-child(2)')?.click(),
        'ai': () => document.querySelector('.bottom-nav button:nth-child(4)')?.click(),
        'profile': () => document.querySelector('.bottom-nav button:nth-child(5)')?.click(),
        'lostfound': () => document.querySelector('.app-header .alert-icon')?.closest('button')?.click(),
        'messages': () => document.querySelector('.app-header button[title="Direct Messages"]')?.click(),
        'activity': () => document.querySelector('.app-header button[title="Notifications"]')?.click()
      };
      if (tabMap[tab]) {
        tabMap[tab]();
      }
    }, tabName);
    await page.waitForTimeout(600);
  }

  // 1. Home Feed
  console.log('Capturing: 01_home_feed.png');
  await setTab('feed');
  await page.screenshot({ path: path.join(OUTPUT_DIR, '01_home_feed.png') });

  // 2. Story Viewer
  console.log('Capturing: 02_story_viewer.png');
  await page.click('.story-tray .story-item:nth-child(2)');
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '02_story_viewer.png') });
  await page.click('.close-btn');
  await page.waitForTimeout(400);

  // 3. PawAI - PetScan AI Vision
  console.log('Capturing: 03_pawai_scanner.png');
  await setTab('ai');
  await page.click('.ai-tab-pill:nth-child(1)');
  await page.waitForTimeout(300);
  await page.click('.scan-btn');
  await page.waitForTimeout(2000); // wait for scan
  await page.screenshot({ path: path.join(OUTPUT_DIR, '03_pawai_scanner.png') });

  // 4. PawAI - Triage Doctor
  console.log('Capturing: 04_pawai_triage.png');
  await page.click('.ai-tab-pill:nth-child(2)');
  await page.waitForTimeout(500);
  await page.click('.triage-prompt-chip:nth-child(1)'); // dog ate chocolate
  await page.waitForTimeout(1400);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '04_pawai_triage.png') });

  // 5. PawAI - Voice Translator
  console.log('Capturing: 05_pawai_translator.png');
  await page.click('.ai-tab-pill:nth-child(3)');
  await page.waitForTimeout(400);
  await page.click('.record-circle-btn');
  await page.waitForTimeout(2200);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '05_pawai_translator.png') });

  // 6. PawAI - Playdate Matcher
  console.log('Capturing: 06_pawai_matcher.png');
  await page.click('.ai-tab-pill:nth-child(4)');
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '06_pawai_matcher.png') });

  // 7. PawAI - Portrait Studio
  console.log('Capturing: 07_pawai_portraits.png');
  await page.click('.ai-tab-pill:nth-child(5)');
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '07_pawai_portraits.png') });

  // 8. Explore & Communities
  console.log('Capturing: 08_explore_communities.png');
  await setTab('explore');
  await page.screenshot({ path: path.join(OUTPUT_DIR, '08_explore_communities.png') });

  // 9. Lost & Found Emergency Center
  console.log('Capturing: 09_lost_and_found.png');
  await setTab('lostfound');
  await page.screenshot({ path: path.join(OUTPUT_DIR, '09_lost_and_found.png') });

  // 10. Direct Messages
  console.log('Capturing: 10_direct_messages.png');
  await setTab('messages');
  await page.screenshot({ path: path.join(OUTPUT_DIR, '10_direct_messages.png') });

  // 11. Live Chat Conversation
  console.log('Capturing: 11_live_chat_thread.png');
  await page.click('.chat-row-item:nth-child(1)');
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '11_live_chat_thread.png') });
  await page.click('.chat-top-header button:nth-child(1)'); // back
  await page.waitForTimeout(400);

  // 12. Notifications / Activity
  console.log('Capturing: 12_notifications.png');
  await setTab('activity');
  await page.screenshot({ path: path.join(OUTPUT_DIR, '12_notifications.png') });

  // 13. Dual Profile
  console.log('Capturing: 13_dual_profile.png');
  await setTab('profile');
  await page.screenshot({ path: path.join(OUTPUT_DIR, '13_dual_profile.png') });

  // 14. Pet Persona Profile (Waffles)
  console.log('Capturing: 14_pet_persona_profile.png');
  await page.click('.persona-tab:nth-child(2)');
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '14_pet_persona_profile.png') });

  // 15. Pet Health Passport & Digital Timeline
  console.log('Capturing: 15_health_passport.png');
  await page.click('.profile-btn:nth-child(1)'); // Health passport button
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '15_health_passport.png') });

  // 16. Post Creation with AI Caption Writer
  console.log('Capturing: 16_post_creation_ai.png');
  await setTab('feed');
  await page.click('.fab-create-btn');
  await page.waitForTimeout(600);
  await page.click('.tone-btn:nth-child(1)'); // Silly AI tone
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '16_post_creation_ai.png') });
  await page.click('.create-sheet .btn-icon'); // Close
  await page.waitForTimeout(400);

  // 17. Dark Theme Mode
  console.log('Capturing: 17_dark_theme_mode.png');
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '17_dark_theme_mode.png') });

  await browser.close();
  console.log(`\n✅ All 17 presentation screenshots captured successfully into:\n${OUTPUT_DIR}`);
}

capture().catch((err) => {
  console.error('Error during capture:', err);
  process.exit(1);
});
