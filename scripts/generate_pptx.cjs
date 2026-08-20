const pptxgen = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

const pptx = new pptxgen();

// Presentation Properties
pptx.layout = 'LAYOUT_16x9';
pptx.author = 'Abu Zafor';
pptx.company = 'PetSocial (Nuzzle)';
pptx.title = 'PetSocial — AI-Powered Mobile-First Pet Community App';
pptx.subject = 'Session-01 UI/UX Presentation';

const SCREENSHOTS_DIR = path.resolve(__dirname, '../presentation_screenshots');
const OUTPUT_FILE = path.resolve(__dirname, '../presentation/PetSocial_UIUX_Presentation.pptx');
const ROOT_OUTPUT_FILE = path.resolve(__dirname, '../../PetSocial_UIUX_Presentation.pptx');

// Color Palette Constants
const COLORS = {
  bgDark: '0D0C0B',
  bgSlide: '161413',
  bgCard: '201D1A',
  bgSubtle: '2A2622',
  primary: 'F4915C',
  primaryDark: 'E15B1E',
  aiPurple: '8B5CF6',
  aiIndigo: '6366F1',
  textMain: 'FAF7F2',
  textMuted: 'A3968D',
  textDim: '70655E',
  border: '332D28',
  emerald: '10B981',
  rose: 'F43F5E'
};

function createBaseSlide(slideNumber, eyebrowText, titleText, speakerNotes) {
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.bgSlide };

  // Top Header Bar
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: '100%', h: 0.7,
    fill: { color: COLORS.bgDark },
    line: { color: COLORS.border, width: 1 }
  });

  slide.addText('🐾 PetSocial (Nuzzle)', {
    x: 0.6, y: 0.15, w: 3.5, h: 0.4,
    fontSize: 14, fontFace: 'Outfit', bold: true, color: COLORS.primary
  });

  slide.addText(`Slide ${slideNumber} / 10 • UI/UX Pitch`, {
    x: 9.2, y: 0.15, w: 3.5, h: 0.4,
    fontSize: 11, fontFace: 'Plus Jakarta Sans', color: COLORS.textMuted, align: 'right'
  });

  // Eyebrow
  if (eyebrowText) {
    slide.addText(eyebrowText.toUpperCase(), {
      x: 0.6, y: 0.9, w: 8.0, h: 0.3,
      fontSize: 10, fontFace: 'Plus Jakarta Sans', bold: true, color: COLORS.primary, charSpacing: 1.5
    });
  }

  // Slide Title
  if (titleText) {
    slide.addText(titleText, {
      x: 0.6, y: 1.15, w: 8.5, h: 0.55,
      fontSize: 22, fontFace: 'Outfit', bold: true, color: COLORS.textMain
    });
  }

  // Speaker Notes
  if (speakerNotes) {
    slide.addNotes(speakerNotes);
  }

  return slide;
}

// ----------------------------------------------------
// SLIDE 1: INTRODUCTION
// ----------------------------------------------------
const s1 = pptx.addSlide();
s1.background = { color: COLORS.bgDark };

s1.addShape(pptx.ShapeType.roundRect, {
  x: 4.8, y: 1.0, w: 3.7, h: 0.45, r: 0.2,
  fill: { color: '2A1C14' },
  line: { color: COLORS.primary, width: 1 }
});
s1.addText('SESSION-01: UI/UX PRESENTATION (5 MINS)', {
  x: 4.8, y: 1.0, w: 3.7, h: 0.45,
  fontSize: 10, fontFace: 'Plus Jakarta Sans', bold: true, color: COLORS.primary, align: 'center'
});

s1.addText('PetSocial — The Next-Gen\nAI-Powered Pet Community', {
  x: 1.5, y: 1.7, w: 10.3, h: 1.6,
  fontSize: 38, fontFace: 'Outfit', bold: true, color: COLORS.textMain, align: 'center'
});

s1.addText('"A mobile-first social ecosystem empowering pet parents with dedicated pet profiles, 24/7 AI health triage, and community safety networks."', {
  x: 2.2, y: 3.5, w: 8.9, h: 1.0,
  fontSize: 16, fontFace: 'Plus Jakarta Sans', italic: true, color: COLORS.textMuted, align: 'center'
});

s1.addShape(pptx.ShapeType.roundRect, {
  x: 3.2, y: 5.0, w: 6.9, h: 0.8, r: 0.4,
  fill: { color: COLORS.bgCard },
  line: { color: COLORS.border, width: 1 }
});
s1.addText('👤 Presenter: Abu Zafor   •   📱 Prototype: Vue.js 3 + Vite   •   ⏱️ Duration: 5 Mins', {
  x: 3.2, y: 5.0, w: 6.9, h: 0.8,
  fontSize: 13, fontFace: 'Plus Jakarta Sans', bold: true, color: COLORS.textMain, align: 'center'
});

s1.addNotes("Good day everyone. Today I'm excited to present PetSocial—a purpose-built mobile social app designed specifically for pets and pet parents, integrating cutting-edge AI features with clean, human-centered UI/UX design.");


// ----------------------------------------------------
// SLIDE 2: KEY LEARNINGS FROM UI/UX SESSION
// ----------------------------------------------------
const s2 = createBaseSlide(2, 'Section 2 • UI/UX Principles & Insights', 'Key Learnings from the UI/UX Session', 
  "From our UI/UX sessions, my biggest takeaway was that design isn't just decoration—it's empathy. We applied thumb-zone navigation, warm calming color palettes, and privacy-first anonymity."
);

const pointsS2 = [
  { title: '1. Purpose-Driven Information Architecture', desc: 'Eliminated visual clutter common in generic social apps. Every component serves an explicit pet welfare need (Health, Lost Alerts, Playdates).' },
  { title: '2. Warm, Emotionally Resonant Aesthetic', desc: 'Adopted warm paper tokens (#FFFCF9) and soft coral (#F4915C) to evoke warmth, care, and trustworthiness rather than cold tech interfaces.' },
  { title: '3. Thumb-Zone Mobile Ergonomics', desc: 'Bottom navigation bar, floating action buttons, and swipeable bottom sheets designed for single-hand mobile interactions.' },
  { title: '4. Privacy & Anonymity by Design', desc: 'Separation of Owner identity vs Pet identity, giving users seamless Ghost Mode controls without losing app functionality.' }
];

let yOffset = 1.9;
pointsS2.forEach((pt) => {
  s2.addShape(pptx.ShapeType.roundRect, {
    x: 0.6, y: yOffset, w: 7.2, h: 1.1, r: 0.15,
    fill: { color: COLORS.bgCard },
    line: { color: COLORS.border, width: 1 }
  });
  s2.addText(pt.title, {
    x: 0.8, y: yOffset + 0.1, w: 6.8, h: 0.35,
    fontSize: 12.5, fontFace: 'Outfit', bold: true, color: COLORS.primary
  });
  s2.addText(pt.desc, {
    x: 0.8, y: yOffset + 0.42, w: 6.8, h: 0.6,
    fontSize: 10.5, fontFace: 'Plus Jakarta Sans', color: COLORS.textMuted
  });
  yOffset += 1.25;
});

// Image on Right
s2.addImage({
  path: path.join(SCREENSHOTS_DIR, '01_home_feed.png'),
  x: 8.4, y: 1.75, w: 2.7, h: 5.3
});


// ----------------------------------------------------
// SLIDE 3: PROBLEM STATEMENT & TARGET USERS
// ----------------------------------------------------
const s3 = createBaseSlide(3, 'Section 3 • Problem Statement & Personas', 'Problem Statement & Target Users',
  "Current platforms treat pets as an afterthought. Pet parents struggle with disorganized medical logs and frantic lost-pet searches. PetSocial provides a dedicated home for both pet identity and care."
);

const pointsS3 = [
  { title: '⚠️ The Problem', desc: 'Generic social media (Instagram, TikTok) mixes pet content with human clutter. Pet parents lack a dedicated space for health records, emergency lost alerts, and neighborhood pet compatibility.' },
  { title: '👩‍🦰 Persona 1: The Devoted Pet Parent (Alex)', desc: 'Wants a dedicated digital journal for her Golden Retriever, needs 24/7 symptom advice, and loves sharing daily milestones with fellow dog lovers.' },
  { title: '👨‍⚕️ Persona 2: The Community Adopter & Vet', desc: 'Needs a trustworthy channel to publish adoptable pets, verify medical passports, and offer slot bookings without scheduling chaos.' }
];

yOffset = 2.0;
pointsS3.forEach((pt) => {
  s3.addShape(pptx.ShapeType.roundRect, {
    x: 0.6, y: yOffset, w: 7.2, h: 1.4, r: 0.15,
    fill: { color: COLORS.bgCard },
    line: { color: COLORS.border, width: 1 }
  });
  s3.addText(pt.title, {
    x: 0.8, y: yOffset + 0.12, w: 6.8, h: 0.35,
    fontSize: 13, fontFace: 'Outfit', bold: true, color: COLORS.primary
  });
  s3.addText(pt.desc, {
    x: 0.8, y: yOffset + 0.48, w: 6.8, h: 0.8,
    fontSize: 11, fontFace: 'Plus Jakarta Sans', color: COLORS.textMuted
  });
  yOffset += 1.6;
});

s3.addImage({
  path: path.join(SCREENSHOTS_DIR, '13_dual_profile.png'),
  x: 8.4, y: 1.75, w: 2.7, h: 5.3
});


// ----------------------------------------------------
// SLIDE 4: DESIGN PROCESS & USER FLOW
// ----------------------------------------------------
const s4 = createBaseSlide(4, 'Section 4 • Design Process & Approach', 'Design Process & User Flows',
  "Our user flows prioritize speed and emotion. Pet parents can switch seamlessly between their human profile and pet passport with one tap, keeping medical records always at hand."
);

const pointsS4 = [
  { title: '1. User Research & Empathy Mapping', desc: 'Identified top friction points: emergency panic when a pet is lost, vet booking delays, and uncertainty over toxic foods.' },
  { title: '2. Dual-Persona Architecture', desc: 'Designed a switchable profile system where the Pet has its own followers and posts, decoupled from the owner\'s private account.' },
  { title: '3. AI-First Interaction Layer', desc: 'Positioned PawAI directly in the bottom navigation for 1-tap access to health vision scanning and symptom triage.' }
];

yOffset = 2.0;
pointsS4.forEach((pt) => {
  s4.addShape(pptx.ShapeType.roundRect, {
    x: 0.6, y: yOffset, w: 5.8, h: 1.4, r: 0.15,
    fill: { color: COLORS.bgCard },
    line: { color: COLORS.border, width: 1 }
  });
  s4.addText(pt.title, {
    x: 0.8, y: yOffset + 0.12, w: 5.4, h: 0.35,
    fontSize: 13, fontFace: 'Outfit', bold: true, color: COLORS.primary
  });
  s4.addText(pt.desc, {
    x: 0.8, y: yOffset + 0.48, w: 5.4, h: 0.8,
    fontSize: 11, fontFace: 'Plus Jakarta Sans', color: COLORS.textMuted
  });
  yOffset += 1.6;
});

s4.addImage({
  path: path.join(SCREENSHOTS_DIR, '14_pet_persona_profile.png'),
  x: 6.8, y: 1.75, w: 2.6, h: 5.2
});

s4.addImage({
  path: path.join(SCREENSHOTS_DIR, '15_health_passport.png'),
  x: 9.7, y: 1.75, w: 2.6, h: 5.2
});


// ----------------------------------------------------
// SLIDE 5: PAWAI PET INTELLIGENCE SUITE
// ----------------------------------------------------
const s5 = createBaseSlide(5, 'Section 5 • Prototype Walkthrough — AI Suite', '✨ PawAI Pet Intelligence Suite',
  "Here is our standout innovation: the PawAI suite. Unlike Instagram, we provide active computer vision diagnostics and instant emergency triage when a pet ingests something harmful."
);

const pointsS5 = [
  { title: '🔬 PetScan AI (Vision & Biometrics)', desc: 'Neural vision analyzes breed purity (98.4%), Body Condition Score (BCS 5/9), coat health, and mood detection in real-time.' },
  { title: '🩺 PawDoctor 24/7 Triage Chat', desc: 'Immediate veterinary-trained symptom triage with automated severity flags (Low, Moderate, Critical Emergency).' },
  { title: '🎙️ Voice & Emotion AI Translator', desc: 'Captures bark/meow audio waveforms and translates pet feelings into entertaining, heartwarming thoughts.' }
];

yOffset = 2.0;
pointsS5.forEach((pt) => {
  s5.addShape(pptx.ShapeType.roundRect, {
    x: 0.6, y: yOffset, w: 5.8, h: 1.4, r: 0.15,
    fill: { color: COLORS.bgCard },
    line: { color: COLORS.border, width: 1 }
  });
  s5.addText(pt.title, {
    x: 0.8, y: yOffset + 0.12, w: 5.4, h: 0.35,
    fontSize: 13, fontFace: 'Outfit', bold: true, color: COLORS.aiPurple
  });
  s5.addText(pt.desc, {
    x: 0.8, y: yOffset + 0.48, w: 5.4, h: 0.8,
    fontSize: 11, fontFace: 'Plus Jakarta Sans', color: COLORS.textMuted
  });
  yOffset += 1.6;
});

s5.addImage({
  path: path.join(SCREENSHOTS_DIR, '03_pawai_scanner.png'),
  x: 6.8, y: 1.75, w: 2.6, h: 5.2
});

s5.addImage({
  path: path.join(SCREENSHOTS_DIR, '04_pawai_triage.png'),
  x: 9.7, y: 1.75, w: 2.6, h: 5.2
});


// ----------------------------------------------------
// SLIDE 6: SOCIAL AI & PLAYDATE HARMONY
// ----------------------------------------------------
const s6 = createBaseSlide(6, 'Section 5 • Prototype Walkthrough — Social & AI Playdates', 'AI Playdate Matcher & Voice Translator',
  "Socializing pets can be risky if energy levels clash. Our AI Harmony Matcher checks behavioral compatibility before dogs meet in the park, ensuring safe and fun playdates."
);

const pointsS6 = [
  { title: '⚡ Playdate Harmony Engine', desc: 'Calculates behavioral synergy (e.g. 96% Match between Waffles & Oliver) by matching energy levels and play styles.' },
  { title: '💬 Direct Chat with Instant Scheduling', desc: '1-tap playdate invitations, encrypted messaging, and simulated real-time neighborhood coordination.' },
  { title: '🎨 Magic Pet Portrait Studio', desc: 'Generative AI transforms pet photos into Pixar 3D, Cyberpunk, and Renaissance fine art avatars.' }
];

yOffset = 2.0;
pointsS6.forEach((pt) => {
  s6.addShape(pptx.ShapeType.roundRect, {
    x: 0.6, y: yOffset, w: 5.8, h: 1.4, r: 0.15,
    fill: { color: COLORS.bgCard },
    line: { color: COLORS.border, width: 1 }
  });
  s6.addText(pt.title, {
    x: 0.8, y: yOffset + 0.12, w: 5.4, h: 0.35,
    fontSize: 13, fontFace: 'Outfit', bold: true, color: COLORS.aiIndigo
  });
  s6.addText(pt.desc, {
    x: 0.8, y: yOffset + 0.48, w: 5.4, h: 0.8,
    fontSize: 11, fontFace: 'Plus Jakarta Sans', color: COLORS.textMuted
  });
  yOffset += 1.6;
});

s6.addImage({
  path: path.join(SCREENSHOTS_DIR, '06_pawai_matcher.png'),
  x: 6.8, y: 1.75, w: 2.6, h: 5.2
});

s6.addImage({
  path: path.join(SCREENSHOTS_DIR, '05_pawai_translator.png'),
  x: 9.7, y: 1.75, w: 2.6, h: 5.2
});


// ----------------------------------------------------
// SLIDE 7: CONTENT CREATION & STORIES
// ----------------------------------------------------
const s7 = createBaseSlide(7, 'Section 5 • Prototype Walkthrough — Media & Feed', 'Stories, Reels & AI First-Person Captions',
  "Content creation is fun and effortless. Our built-in AI Caption Writer generates witty captions in the pet's voice, driving higher engagement across the community."
);

const pointsS7 = [
  { title: '📸 Interactive Story Rings & Viewer', desc: 'Auto-advancing 24h stories with progress bars, tap navigation, hold-to-pause, and direct story replies.' },
  { title: '✍️ AI First-Person Caption Writer', desc: '1-tap generative caption tones (Silly, Sweet, Dramatic, Poetic) written from the pet\'s perspective.' },
  { title: '❤️ Haptic Double-Tap Micro-Interactions', desc: 'Double-tap photo for floating heart burst animation, hashtag discovery, and identity-switched comments.' }
];

yOffset = 2.0;
pointsS7.forEach((pt) => {
  s7.addShape(pptx.ShapeType.roundRect, {
    x: 0.6, y: yOffset, w: 5.8, h: 1.4, r: 0.15,
    fill: { color: COLORS.bgCard },
    line: { color: COLORS.border, width: 1 }
  });
  s7.addText(pt.title, {
    x: 0.8, y: yOffset + 0.12, w: 5.4, h: 0.35,
    fontSize: 13, fontFace: 'Outfit', bold: true, color: COLORS.primary
  });
  s7.addText(pt.desc, {
    x: 0.8, y: yOffset + 0.48, w: 5.4, h: 0.8,
    fontSize: 11, fontFace: 'Plus Jakarta Sans', color: COLORS.textMuted
  });
  yOffset += 1.6;
});

s7.addImage({
  path: path.join(SCREENSHOTS_DIR, '02_story_viewer.png'),
  x: 6.8, y: 1.75, w: 2.6, h: 5.2
});

s7.addImage({
  path: path.join(SCREENSHOTS_DIR, '16_post_creation_ai.png'),
  x: 9.7, y: 1.75, w: 2.6, h: 5.2
});


// ----------------------------------------------------
// SLIDE 8: SAFETY & ADOPTION
// ----------------------------------------------------
const s8 = createBaseSlide(8, 'Section 5 • Prototype Walkthrough — Safety & Adoption', 'Emergency Alert Network & Adoption Hub',
  "Safety is central to PetSocial. When a pet goes missing, a 5-mile emergency alert is broadcasted immediately, transforming the neighborhood into an active search network."
);

const pointsS8 = [
  { title: '🚨 5-Mile Emergency Broadcast', desc: 'Instant lost pet alerts pushed to nearby users with location markers, reward tags, and 1-tap call buttons.' },
  { title: '🏡 Verified Pet Adoption Center', desc: 'Filter by species, temperament tags, and vaccination status with direct shelter inquiry messaging.' },
  { title: '🏥 Conflict-Free Vet Booking', desc: 'Real-time slot calendar that prevents double bookings and syncs with the Pet Health Passport.' }
];

yOffset = 2.0;
pointsS8.forEach((pt) => {
  s8.addShape(pptx.ShapeType.roundRect, {
    x: 0.6, y: yOffset, w: 5.8, h: 1.4, r: 0.15,
    fill: { color: COLORS.bgCard },
    line: { color: COLORS.border, width: 1 }
  });
  s8.addText(pt.title, {
    x: 0.8, y: yOffset + 0.12, w: 5.4, h: 0.35,
    fontSize: 13, fontFace: 'Outfit', bold: true, color: COLORS.rose
  });
  s8.addText(pt.desc, {
    x: 0.8, y: yOffset + 0.48, w: 5.4, h: 0.8,
    fontSize: 11, fontFace: 'Plus Jakarta Sans', color: COLORS.textMuted
  });
  yOffset += 1.6;
});

s8.addImage({
  path: path.join(SCREENSHOTS_DIR, '09_lost_and_found.png'),
  x: 6.8, y: 1.75, w: 2.6, h: 5.2
});

s8.addImage({
  path: path.join(SCREENSHOTS_DIR, '08_explore_communities.png'),
  x: 9.7, y: 1.75, w: 2.6, h: 5.2
});


// ----------------------------------------------------
// SLIDE 9: DESIGN SYSTEM & DARK MODE
// ----------------------------------------------------
const s9 = createBaseSlide(9, 'Section 5 • Design System & Theming', 'Design System, Typography & Dark Mode',
  "We built a robust design token system supporting both warm daylight mode and high-contrast dark mode with zero layout shift."
);

const pointsS9 = [
  { title: '🎨 Harmonious Color Palette', desc: 'Warm paper background (#FFFCF9), Coral Primary (#F4915C), Emerald for verified health, and Obsidian Dark Mode.' },
  { title: '🔤 Modern Typography Scale', desc: 'Plus Jakarta Sans for crisp readability + Outfit for bold, friendly headings and brand identity.' },
  { title: '🌙 True Dark Mode (#181615)', desc: 'Reduced eye strain during nighttime pet logs and evening walks, preserving battery life on OLED screens.' }
];

yOffset = 2.0;
pointsS9.forEach((pt) => {
  s9.addShape(pptx.ShapeType.roundRect, {
    x: 0.6, y: yOffset, w: 7.2, h: 1.4, r: 0.15,
    fill: { color: COLORS.bgCard },
    line: { color: COLORS.border, width: 1 }
  });
  s9.addText(pt.title, {
    x: 0.8, y: yOffset + 0.12, w: 6.8, h: 0.35,
    fontSize: 13, fontFace: 'Outfit', bold: true, color: COLORS.emerald
  });
  s9.addText(pt.desc, {
    x: 0.8, y: yOffset + 0.48, w: 6.8, h: 0.8,
    fontSize: 11, fontFace: 'Plus Jakarta Sans', color: COLORS.textMuted
  });
  yOffset += 1.6;
});

s9.addImage({
  path: path.join(SCREENSHOTS_DIR, '17_dark_theme_mode.png'),
  x: 8.4, y: 1.75, w: 2.7, h: 5.3
});


// ----------------------------------------------------
// SLIDE 10: CONCLUSION & FUTURE ROADMAP
// ----------------------------------------------------
const s10 = createBaseSlide(10, 'Section 6 • Conclusion & Next Steps', 'Conclusion & Future Roadmap',
  "Thank you for your time. PetSocial demonstrates how UI/UX and AI can combine to create meaningful, joyful products. I welcome any questions and would love to show the live prototype!"
);

const pointsS10 = [
  { title: '🎓 What We Learned', desc: 'Domain-specific social UX succeeds when it solves real emotional and practical problems (health, safety, identity) rather than just copying generic feeds.' },
  { title: '🚀 Planned Next Steps', desc: '• IoT Smart Collar GPS integration for live walk tracking\n• Real-time audio model integration for voice translator\n• Telehealth video calls with licensed veterinary clinics' },
  { title: '🐾 Closing Remark', desc: '"Pets are family. PetSocial gives them the dedicated, intelligent platform they deserve."' }
];

yOffset = 2.0;
pointsS10.forEach((pt) => {
  s10.addShape(pptx.ShapeType.roundRect, {
    x: 0.6, y: yOffset, w: 6.8, h: 1.4, r: 0.15,
    fill: { color: COLORS.bgCard },
    line: { color: COLORS.border, width: 1 }
  });
  s10.addText(pt.title, {
    x: 0.8, y: yOffset + 0.12, w: 6.4, h: 0.35,
    fontSize: 13, fontFace: 'Outfit', bold: true, color: COLORS.primary
  });
  s10.addText(pt.desc, {
    x: 0.8, y: yOffset + 0.48, w: 6.4, h: 0.8,
    fontSize: 11, fontFace: 'Plus Jakarta Sans', color: COLORS.textMuted
  });
  yOffset += 1.6;
});

s10.addShape(pptx.ShapeType.roundRect, {
  x: 8.0, y: 2.2, w: 4.6, h: 3.8, r: 0.3,
  fill: { color: COLORS.bgDark },
  line: { color: COLORS.border, width: 2 }
});

s10.addText('Thank You! 🐾', {
  x: 8.0, y: 2.8, w: 4.6, h: 0.8,
  fontSize: 28, fontFace: 'Outfit', bold: true, color: COLORS.primary, align: 'center'
});

s10.addText('Questions & Live Prototype Demo', {
  x: 8.0, y: 3.7, w: 4.6, h: 0.5,
  fontSize: 14, fontFace: 'Plus Jakarta Sans', color: COLORS.textMuted, align: 'center'
});

s10.addShape(pptx.ShapeType.roundRect, {
  x: 8.8, y: 4.5, w: 3.0, h: 0.6, r: 0.3,
  fill: { color: COLORS.bgCard },
  line: { color: COLORS.primary, width: 1 }
});
s10.addText('✨ PetSocial Vue 3 App', {
  x: 8.8, y: 4.5, w: 3.0, h: 0.6,
  fontSize: 12, fontFace: 'Plus Jakarta Sans', bold: true, color: COLORS.textMain, align: 'center'
});


// Save the PowerPoint Presentation
async function savePresentation() {
  console.log('Generating PetSocial PowerPoint Presentation (.pptx)...');
  await pptx.writeFile({ fileName: OUTPUT_FILE });
  // Also copy to root for quick access
  fs.copyFileSync(OUTPUT_FILE, ROOT_OUTPUT_FILE);
  console.log(`✅ PowerPoint Presentation successfully generated:\n1) ${OUTPUT_FILE}\n2) ${ROOT_OUTPUT_FILE}`);
}

savePresentation().catch(err => {
  console.error('Error creating presentation:', err);
  process.exit(1);
});
