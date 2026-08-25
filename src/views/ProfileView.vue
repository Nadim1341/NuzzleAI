<template>
  <div class="profile-view">
    <!-- Top Header Bar -->
    <header class="profile-top-bar">
      <div class="handle-cluster">
        <h2 class="profile-handle">{{ currentProfileHandle }}</h2>
        <span v-if="isCurrentAnonymous" class="ghost-status-chip">Ghost Mode</span>
      </div>

      <div class="header-action-icons">
        <button class="icon-round-btn" @click="setTab('settings')" title="Settings">
          <Settings :size="18" />
        </button>
      </div>
    </header>

    <div class="profile-scroll-body">
      <!-- 1. Pet / Guardian Persona Switcher Pills -->
      <div class="persona-switch-dock">
        <button 
          class="persona-pill-btn"
          :class="{ active: activeProfileId === 'owner_me' }"
          @click="activeProfileId = 'owner_me'"
        >
          <img :src="owner.avatarUrl" :alt="owner.displayName" class="persona-thumb" />
          <span class="persona-name">{{ owner.displayName.split(' ')[0] }} (Guardian)</span>
        </button>

        <button 
          v-for="p in pets" 
          :key="p.id"
          class="persona-pill-btn"
          :class="{ active: activeProfileId === p.id }"
          @click="activeProfileId = p.id"
        >
          <img :src="p.avatarUrl" :alt="p.name" class="persona-thumb" />
          <span class="persona-name">{{ p.name }} ({{ p.species }})</span>
        </button>
      </div>

      <!-- 2. Hero Profile Card -->
      <div class="profile-hero-card" :class="{ 'ghost-active-border': isCurrentAnonymous }">
        <div class="hero-identity-row">
          <div class="hero-avatar-frame" :class="{ 'ghost-halo': isCurrentAnonymous }">
            <img :src="currentAvatar" :alt="currentDisplayName" class="hero-main-avatar" />
            <div v-if="isCurrentAnonymous" class="ghost-icon-tag" title="Ghost Mode Mask">👻</div>
          </div>

          <div class="hero-bio-col">
            <div class="name-badge-line">
              <h3 class="hero-display-name">{{ currentDisplayName }}</h3>
              <span v-if="activePet" class="species-chip">{{ activePet.breed || activePet.species }}</span>
            </div>
            <span class="sub-location-line">
              {{ activePet ? `Age: ${activePet.age || '2 yrs'} • Portland, OR` : 'Certified Pet Guardian • 2 Pets' }}
            </span>
            <p class="hero-bio-paragraph">
              {{ currentBio }}
            </p>
          </div>
        </div>

        <!-- 3. UNIQUE & INNOVATIVE PET VITALS & PACK CIRCLE (Replaces generic followers) -->
        <div class="pet-vitals-dashboard">
          <!-- Card 1: Pack Circle (Playmates & Buddies) -->
          <div class="vital-tile pack-tile" @click="showPackModal">
            <div class="vital-icon-wrap">
              <span class="vital-emoji">🐾</span>
            </div>
            <div class="vital-info">
              <div class="vital-number-row">
                <span class="vital-val">{{ activePet ? '842' : '1.2k' }}</span>
                <span class="vital-trend">+14 new</span>
              </div>
              <span class="vital-lbl">Pack Buddies</span>
            </div>
          </div>

          <!-- Card 2: Love & Snuggle Karma Score -->
          <div class="vital-tile love-tile">
            <div class="vital-icon-wrap">
              <span class="vital-emoji">💜</span>
            </div>
            <div class="vital-info">
              <div class="vital-number-row">
                <span class="vital-val">{{ activePet ? '3.8k' : '5.4k' }}</span>
                <span class="vital-trend">High Vibe</span>
              </div>
              <span class="vital-lbl">Paws & Love Earned</span>
            </div>
          </div>

          <!-- Card 3: Energy & Vitality Score -->
          <div class="vital-tile energy-tile">
            <div class="vital-icon-wrap">
              <span class="vital-emoji">⚡</span>
            </div>
            <div class="vital-info">
              <div class="vital-number-row">
                <span class="vital-val">98%</span>
                <span class="vital-sparkle">✨ Peak</span>
              </div>
              <span class="vital-lbl">{{ activePet ? activePet.energyLevel || 'High Zoomies' : 'Active Guardian' }}</span>
            </div>
          </div>
        </div>

        <!-- 4. Pet Achievement & Milestone Badges -->
        <div class="pet-milestones-track">
          <div class="milestone-badge" title="Core Vaccines Up-to-Date">
            <span class="m-icon">💉</span>
            <span class="m-text">100% Vaccinated</span>
          </div>
          <div class="milestone-badge" title="Official RFID Microchip Registered">
            <span class="m-icon">🏷️</span>
            <span class="m-text">RFID Chipped</span>
          </div>
          <div class="milestone-badge" title="IATA Global Travel Passport Verified">
            <span class="m-icon">✈️</span>
            <span class="m-text">Travel Ready</span>
          </div>
          <div class="milestone-badge gold" title="Top 1% Community Snuggler">
            <span class="m-icon">🌟</span>
            <span class="m-text">Park Legend</span>
          </div>
        </div>

        <!-- 5. Profile Action Buttons -->
        <div class="profile-action-buttons">
          <button class="btn-solid passport-btn" @click="isPassportModalOpen = true">
            <Award :size="15" />
            <span>Digital Pet Passport 🛂</span>
          </button>

          <button class="btn-outline edit-btn" @click="setTab('settings')">
            <Edit :size="14" />
            <span>Edit Info</span>
          </button>
        </div>
      </div>

      <!-- 6. Ghost Anonymity Toggle Card -->
      <div 
        class="ghost-toggle-card"
        :class="{ active: isCurrentAnonymous }"
        @click="toggleAnonymity"
      >
        <div class="ghost-left">
          <div class="ghost-title-row">
            <EyeOff :size="15" class="ghost-eye" />
            <span class="ghost-title">{{ isCurrentAnonymous ? '👻 Ghost Mode Active' : 'Public Profile Active' }}</span>
          </div>
          <p class="ghost-desc">
            {{ isCurrentAnonymous 
                ? 'Your real identity and photo are masked across public feeds & comments.' 
                : 'Tap to enable incognito mode and hide real guardian information.' }}
          </p>
        </div>

        <div class="custom-switch" :class="{ on: isCurrentAnonymous }">
          <div class="switch-ball"></div>
        </div>
      </div>

      <!-- 7. Media Grid Tabs -->
      <div class="media-tabs-bar">
        <button class="tab-btn active">
          <Grid :size="16" />
          <span>Memories ({{ currentPostsCount }})</span>
        </button>
        <button class="tab-btn" @click="setTab('market')">
          <Bookmark :size="16" />
          <span>Market Listings</span>
        </button>
      </div>

      <!-- 8. Memories Photo Grid -->
      <div class="memories-photo-grid">
        <div 
          v-for="(img, idx) in userGridImages" 
          :key="idx" 
          class="photo-cell"
          @click="setTab('feed')"
        >
          <img :src="img" alt="Memory" class="grid-image" />
        </div>
      </div>
    </div>

    <!-- DIGITAL PET PASSPORT MODAL OVERLAY -->
    <PetPassportModal 
      :is-open="isPassportModalOpen" 
      @close="isPassportModalOpen = false" 
    />

    <!-- Toast Notification for Ghost Mode Toggle -->
    <transition name="toast-slide">
      <div v-if="profileToast" class="profile-toast-bar">
        {{ profileToast }}
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Settings, EyeOff, Edit, Grid, Bookmark, Award } from 'lucide-vue-next';
import PetPassportModal from '../components/profile/PetPassportModal.vue';
import { 
  owner, 
  pets, 
  activeProfileId, 
  activePet, 
  setTab 
} from '../stores/appStore';

const isPassportModalOpen = ref(false);
const profileToast = ref<string | null>(null);

const isCurrentAnonymous = computed(() => {
  if (activePet.value) return activePet.value.isAnonymous;
  return owner.isAnonymous;
});

const currentProfileHandle = computed(() => {
  if (isCurrentAnonymous.value) {
    return activePet.value ? `@anon_${activePet.value.name.toLowerCase()}` : '@anon_guardian_92';
  }
  if (activePet.value) return `@${activePet.value.name.toLowerCase()}_official`;
  return `@${owner.username}`;
});

const currentDisplayName = computed(() => {
  if (isCurrentAnonymous.value) {
    return activePet.value ? `👻 Anon ${activePet.value.name}` : '👻 Anon Pet Guardian';
  }
  if (activePet.value) return activePet.value.name;
  return owner.displayName;
});

const currentAvatar = computed(() => {
  if (activePet.value) return activePet.value.avatarUrl;
  return owner.avatarUrl;
});

const currentBio = computed(() => {
  if (isCurrentAnonymous.value) {
    return '🔒 Identity protected in Ghost Mode. Exploring pet community safely with encrypted passport.';
  }
  if (activePet.value) return activePet.value.bio || 'Happy, energetic adventure companion on Nuzzle! 🎾';
  return owner.bio || 'Pet lover, weekend hiker, and passionate animal rescue advocate.';
});

const currentPostsCount = computed(() => {
  if (activePet.value) return activePet.value.postsCount || 18;
  return 48;
});

const userGridImages = [
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1513360309081-38f0762b781e?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&auto=format&fit=crop&q=80'
];

function toggleAnonymity() {
  if (activePet.value) {
    activePet.value.isAnonymous = !activePet.value.isAnonymous;
  } else {
    owner.isAnonymous = !owner.isAnonymous;
  }

  const newState = isCurrentAnonymous.value;
  showProfileToast(
    newState 
      ? '👻 Ghost Mode Enabled: Real name & photo masked on all feeds!' 
      : '👤 Public Mode: Real name & photo visible to community.'
  );
}

function showPackModal() {
  showProfileToast('🐾 Pack Circle: 842 playmates connected in Portland!');
}

function showProfileToast(msg: string) {
  profileToast.value = msg;
  setTimeout(() => {
    profileToast.value = null;
  }, 3200);
}
</script>

<style scoped>
.profile-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Header */
.profile-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-light);
}

.handle-cluster {
  display: flex;
  align-items: center;
  gap: 6px;
}

.profile-handle {
  font-size: 15px;
  font-weight: 800;
  color: var(--ink-primary);
}

.ghost-status-chip {
  font-size: 9.5px;
  font-weight: 800;
  color: #fff;
  background: #7C3AED;
  padding: 1px 6px;
  border-radius: var(--radius-full);
}

.icon-round-btn {
  color: var(--ink-muted);
  padding: 5px;
  border-radius: 50%;
  transition: all 0.15s ease;
}

.icon-round-btn:hover {
  background: var(--bg-card-subtle);
  color: var(--ink-primary);
}

.profile-scroll-body {
  flex: 1;
  overflow-y: auto;
  padding: 10px 12px 30px;
}

/* 1. Persona Switcher */
.persona-switch-dock {
  display: flex;
  align-items: center;
  gap: 6px;
  overflow-x: auto;
  scrollbar-width: none;
  margin-bottom: 10px;
}

.persona-switch-dock::-webkit-scrollbar {
  display: none;
}

.persona-pill-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px 4px 5px;
  border-radius: var(--radius-full);
  background: var(--bg-card);
  border: 1.5px solid var(--border-light);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
}

.persona-thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.persona-name {
  font-size: 11.5px;
  font-weight: 700;
  color: var(--ink-secondary);
}

.persona-pill-btn.active {
  background: linear-gradient(135deg, #7C3AED 0%, #947DEE 100%);
  border-color: transparent;
}

.persona-pill-btn.active .persona-name {
  color: #fff;
}

/* 2. Hero Card */
.profile-hero-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 18px;
  padding: 14px;
  margin-bottom: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
}

.profile-hero-card.ghost-active-border {
  border-color: #A78BFA;
  box-shadow: 0 4px 16px rgba(124, 58, 237, 0.15);
}

.hero-identity-row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.hero-avatar-frame {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  padding: 2px;
  background: linear-gradient(135deg, #947DEE 0%, #F59E0B 100%);
  flex-shrink: 0;
}

.hero-avatar-frame.ghost-halo {
  background: linear-gradient(135deg, #7C3AED 0%, #C084FC 100%);
}

.hero-main-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--bg-card);
}

.ghost-icon-tag {
  position: absolute;
  bottom: -2px;
  right: -2px;
  font-size: 13px;
  background: #7C3AED;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  border: 1.5px solid #fff;
}

.hero-bio-col {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.name-badge-line {
  display: flex;
  align-items: center;
  gap: 6px;
}

.hero-display-name {
  font-size: 16px;
  font-weight: 800;
  color: var(--ink-primary);
}

.species-chip {
  font-size: 10px;
  font-weight: 700;
  color: var(--brand-primary);
  background: #F3EEFF;
  padding: 1px 6px;
  border-radius: var(--radius-full);
}

.sub-location-line {
  font-size: 11px;
  color: var(--ink-muted);
  margin-top: 1px;
}

.hero-bio-paragraph {
  font-size: 12px;
  color: var(--ink-secondary);
  line-height: 1.4;
  margin-top: 5px;
}

/* 3. UNIQUE PET VITALS DASHBOARD */
.pet-vitals-dashboard {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid var(--border-light);
}

.vital-tile {
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 8px 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 3px;
  cursor: pointer;
  transition: transform 0.15s ease, background 0.15s ease;
}

.vital-tile:hover {
  transform: translateY(-1px);
  background: #F3EEFF;
  border-color: #DDD6FE;
}

.vital-icon-wrap {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--bg-card);
  display: grid;
  place-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.vital-emoji {
  font-size: 13px;
}

.vital-number-row {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 3px;
}

.vital-val {
  font-size: 13.5px;
  font-weight: 900;
  color: var(--ink-primary);
}

.vital-trend, .vital-sparkle {
  font-size: 8.5px;
  font-weight: 800;
  color: #059669;
}

.vital-lbl {
  font-size: 9.5px;
  font-weight: 700;
  color: var(--ink-muted);
  line-height: 1.2;
}

/* 4. Milestones Track */
.pet-milestones-track {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 10px;
}

.milestone-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10.5px;
  font-weight: 700;
  color: var(--ink-secondary);
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-light);
  padding: 3px 8px;
  border-radius: var(--radius-full);
}

.milestone-badge.gold {
  color: #92400E;
  background: #FEF3C7;
  border-color: #FCD34D;
}

.m-icon {
  font-size: 11px;
}

/* 5. Action Buttons */
.profile-action-buttons {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 8px;
  margin-top: 12px;
}

.passport-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  font-size: 12.5px;
  font-weight: 800;
  border-radius: var(--radius-full);
}

.edit-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px;
  font-size: 12px;
  border-radius: var(--radius-full);
}

/* 6. Ghost Anonymity Toggle Card */
.ghost-toggle-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 14px;
  padding: 10px 12px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.ghost-toggle-card.active {
  background: linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%);
  border-color: #C084FC;
}

:global([data-theme='dark']) .ghost-toggle-card.active {
  background: rgba(88, 28, 135, 0.35);
  border-color: #9333EA;
}

.ghost-left {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ghost-title-row {
  display: flex;
  align-items: center;
  gap: 5px;
}

.ghost-eye {
  color: var(--brand-primary);
}

.ghost-title {
  font-size: 12px;
  font-weight: 800;
  color: var(--ink-primary);
}

.ghost-desc {
  font-size: 10.5px;
  color: var(--ink-muted);
  line-height: 1.3;
}

/* Custom Switch */
.custom-switch {
  width: 36px;
  height: 20px;
  border-radius: 10px;
  background: var(--border-light);
  position: relative;
  transition: background 0.2s ease;
  flex-shrink: 0;
}

.custom-switch.on {
  background: #7C3AED;
}

.switch-ball {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.custom-switch.on .switch-ball {
  transform: translateX(16px);
}

/* 7. Media Tabs */
.media-tabs-bar {
  display: flex;
  border-bottom: 1px solid var(--border-light);
  margin-bottom: 8px;
}

.tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 8px;
  font-size: 12px;
  font-weight: 700;
  color: var(--ink-muted);
  border-bottom: 2px solid transparent;
  cursor: pointer;
}

.tab-btn.active {
  color: var(--brand-primary);
  border-bottom-color: var(--brand-primary);
}

/* 8. Photo Grid */
.memories-photo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  border-radius: 12px;
  overflow: hidden;
}

.photo-cell {
  aspect-ratio: 1;
  background: var(--bg-card-subtle);
  overflow: hidden;
  cursor: pointer;
}

.grid-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s ease;
}

.photo-cell:hover .grid-image {
  transform: scale(1.05);
}

/* Toast */
.profile-toast-bar {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(26, 18, 42, 0.95);
  color: #fff;
  font-size: 11.5px;
  font-weight: 700;
  padding: 8px 16px;
  border-radius: var(--radius-full);
  backdrop-filter: blur(8px);
  z-index: 999;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
  white-space: nowrap;
}

.toast-slide-enter-active, .toast-slide-leave-active {
  transition: all 0.25s ease;
}

.toast-slide-enter-from, .toast-slide-leave-to {
  opacity: 0;
  transform: translate(-50%, 10px);
}
</style>
