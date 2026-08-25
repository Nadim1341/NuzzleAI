<template>
  <div class="profile-view">
    <!-- Top Header -->
    <header class="app-header profile-header">
      <div class="header-username">
        <span class="user-handle">{{ currentProfileHandle }}</span>
        <span v-if="isCurrentAnonymous" class="ghost-pill-active">👻 Ghost</span>
      </div>

      <div class="header-actions">
        <button class="btn-icon passport-head-btn" @click="isPassportModalOpen = true" title="Digital Pet Passport">
          <Award :size="20" class="gold-icon" />
        </button>
        <button class="btn-icon" @click="setTab('settings')" title="Settings">
          <Settings :size="20" />
        </button>
      </div>
    </header>

    <div class="profile-scroll-body">
      <!-- Profile Persona Switcher (Owner vs Pets) -->
      <div class="persona-switcher-bar">
        <button 
          class="persona-tab"
          :class="{ active: activeProfileId === 'owner_me' }"
          @click="activeProfileId = 'owner_me'"
        >
          <img :src="owner.avatarUrl" :alt="owner.displayName" class="persona-avatar" />
          <span>{{ owner.displayName.split(' ')[0] }} (Owner)</span>
        </button>

        <button 
          v-for="p in pets" 
          :key="p.id"
          class="persona-tab"
          :class="{ active: activeProfileId === p.id }"
          @click="activeProfileId = p.id"
        >
          <img :src="p.avatarUrl" :alt="p.name" class="persona-avatar" />
          <span>🐾 {{ p.name }}</span>
        </button>
      </div>

      <!-- Anonymity / Ghost Mode Banner (Entire Card is Clickable) -->
      <div 
        class="anonymity-card card-item"
        :class="{ 'ghost-active': isCurrentAnonymous }"
        @click="toggleAnonymity"
        title="Click to toggle Anonymous Ghost Mode"
      >
        <div class="anon-text-col">
          <div class="anon-badge-line">
            <EyeOff :size="15" class="anon-icon" />
            <span class="anon-title">
              {{ isCurrentAnonymous ? '👻 Ghost Mode Active' : 'Anonymous Mode' }}
            </span>
            <span v-if="isCurrentAnonymous" class="live-active-tag">ON</span>
          </div>
          <p class="anon-explain">
            {{ isCurrentAnonymous 
                ? 'Your identity is masked as Anonymous across public feeds & comments.' 
                : 'Click here to hide your real name & photo on public posts.' }}
          </p>
        </div>

        <div class="toggle-switch" :class="{ active: isCurrentAnonymous }">
          <div class="toggle-thumb"></div>
        </div>
      </div>

      <!-- Main Profile Bio & Numbers Card -->
      <div class="profile-hero-card card-item" :class="{ 'ghost-mode-border': isCurrentAnonymous }">
        <div class="hero-top-row">
          <div class="hero-avatar-wrapper" :class="{ 'ghost-halo': isCurrentAnonymous }">
            <img :src="currentAvatar" :alt="currentDisplayName" class="hero-avatar" />
            <div v-if="isCurrentAnonymous" class="ghost-badge-overlay" title="Anonymous Persona">👻</div>
            <div v-else-if="activePet" class="pet-star-badge">⭐</div>
          </div>

          <div class="stats-counts-group">
            <div class="count-box">
              <span class="c-num">{{ currentPostsCount }}</span>
              <span class="c-label">Posts</span>
            </div>
            <div class="count-box">
              <span class="c-num">{{ currentFollowersCount }}</span>
              <span class="c-label">Followers</span>
            </div>
            <div class="count-box">
              <span class="c-num">{{ currentFollowingCount }}</span>
              <span class="c-label">Following</span>
            </div>
          </div>
        </div>

        <!-- Names & Bio -->
        <div class="hero-bio-section">
          <div class="name-badge-row">
            <h3 class="hero-name">{{ currentDisplayName }}</h3>
            <span v-if="isCurrentAnonymous" class="anon-identity-badge">Incognito</span>
          </div>
          <span v-if="activePet" class="hero-subtitle">{{ activePet.species }} • {{ activePet.breed }} • {{ activePet.age }}</span>
          <span v-else class="hero-subtitle">Pet Parent • Portland / Dhaka</span>

          <p class="hero-bio-text">
            {{ currentBio }}
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="profile-buttons-row">
          <button class="btn-solid profile-btn gold-gradient-btn" @click="isPassportModalOpen = true">
            <Award :size="15" />
            <span>{{ activePet ? `${activePet.name}'s Passport` : 'Pet Passports' }} 🛂</span>
          </button>

          <button class="btn-outline profile-btn" @click="setTab('settings')">
            <Edit :size="14" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      <!-- UPGRADED PET PASSPORT SUMMARY CARD (PROMINENT WIDGET) -->
      <div class="passport-widget-card card-item" @click="isPassportModalOpen = true">
        <div class="p-widget-top">
          <div class="p-widget-emblem">
            <span class="p-flag">🛂</span>
            <div>
              <h4 class="p-widget-title">Digital Pet Passport ID</h4>
              <span class="p-widget-chip">CHIP: {{ activePet?.microchipId || pets[0]?.microchipId || '985-0019-4820-GOLD' }}</span>
            </div>
          </div>
          <div class="verified-seal-badge">
            <ShieldCheck :size="13" />
            <span>100% Verified</span>
          </div>
        </div>

        <div class="p-widget-metrics">
          <div class="p-metric">
            <span class="pm-val">✓ Active</span>
            <span class="pm-lbl">Rabies & Core</span>
          </div>
          <div class="p-metric">
            <span class="pm-val">June 2027</span>
            <span class="pm-lbl">Next Booster</span>
          </div>
          <div class="p-metric">
            <span class="pm-val">✈️ Cleared</span>
            <span class="pm-lbl">Travel Ready</span>
          </div>
        </div>

        <div class="p-widget-cta">
          <span class="cta-text">Open Full Passport & Scannable QR ID</span>
          <ChevronRight :size="16" class="cta-arrow" />
        </div>
      </div>

      <!-- Pets Roster (when in Owner View) -->
      <div v-if="!activePet" class="pets-roster-section">
        <div class="roster-head">
          <h4 class="roster-title">🐾 Alex's Pets ({{ pets.length }})</h4>
          <button class="add-pet-link" @click="addDemoPet">+ Add Pet</button>
        </div>

        <div class="pets-cards-scroll">
          <div 
            v-for="p in pets" 
            :key="p.id"
            class="pet-summary-card"
            @click="activeProfileId = p.id"
          >
            <img :src="p.avatarUrl" :alt="p.name" class="p-thumb" />
            <span class="p-name">{{ p.name }}</span>
            <span class="p-breed">{{ p.breed }}</span>
          </div>
        </div>
      </div>

      <!-- Media & Posts Grid Tabs -->
      <div class="profile-media-tabs">
        <button class="p-tab-btn active">
          <Grid :size="18" />
          <span>Posts ({{ currentPostsCount }})</span>
        </button>
        <button class="p-tab-btn">
          <Bookmark :size="18" />
          <span>Saved</span>
        </button>
      </div>

      <!-- Grid Photos -->
      <div class="profile-posts-grid">
        <div 
          v-for="(img, idx) in userGridImages" 
          :key="idx"
          class="grid-photo-cell"
        >
          <img :src="img" alt="Post" class="grid-img" />
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
import { Settings, EyeOff, Edit, Grid, Bookmark, Award, ShieldCheck, ChevronRight } from 'lucide-vue-next';
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
    return activePet.value ? `anon_${activePet.value.name.toLowerCase()}` : 'anon_pet_parent_92';
  }
  if (activePet.value) return `@${activePet.value.name.toLowerCase()}_official`;
  return `@${owner.username}`;
});

const currentDisplayName = computed(() => {
  if (isCurrentAnonymous.value) {
    return activePet.value ? `👻 Anonymous ${activePet.value.name}` : '👻 Anonymous Pet Parent';
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
    return '🔒 Identity protected in Ghost Mode. Exploring pet community safely.';
  }
  if (activePet.value) return activePet.value.bio || 'Happy pet on Nuzzle!';
  return owner.bio || 'Pet lover on Nuzzle!';
});

const currentPostsCount = computed(() => {
  if (activePet.value) return activePet.value.postsCount;
  return 48;
});

const currentFollowersCount = computed(() => {
  if (activePet.value) return activePet.value.followersCount;
  return owner.followersCount;
});

const currentFollowingCount = computed(() => {
  if (activePet.value) return 42;
  return owner.followingCount;
});

function toggleAnonymity() {
  if (activePet.value) {
    activePet.value.isAnonymous = !activePet.value.isAnonymous;
  } else {
    owner.isAnonymous = !owner.isAnonymous;
  }

  const newState = isCurrentAnonymous.value;
  showProfileToast(
    newState 
      ? '👻 Ghost Mode Activated: Real name & photo masked on feeds!' 
      : '👤 Public Mode: Real name & photo visible'
  );
}

function showProfileToast(msg: string) {
  profileToast.value = msg;
  setTimeout(() => {
    profileToast.value = null;
  }, 2400);
}

function addDemoPet() {
  const newPet = {
    id: `pet_${Date.now()}`,
    ownerId: owner.id,
    name: 'Pepper',
    species: 'Dog' as const,
    breed: 'Australian Shepherd',
    bio: 'Speedy frisbee catcher! 🥏',
    age: '6 mos',
    avatarUrl: 'https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?w=200&auto=format&fit=crop&q=80',
    isAnonymous: false,
    weight: '14.2 kg',
    microchipId: '985-0028-1194-PEPPER',
    postsCount: 1,
    followersCount: 12
  };
  pets.push(newPet);
  activeProfileId.value = newPet.id;
  showProfileToast(`🐾 ${newPet.name} registered with Digital Passport!`);
}

const userGridImages = [
  'https://images.unsplash.com/photo-1552053831-71594a27632d?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&auto=format&fit=crop&q=80'
];
</script>

<style scoped>
.profile-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.profile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-username {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-handle {
  font-size: 16px;
  font-weight: 800;
  color: var(--ink-primary);
}

.ghost-pill-active {
  background: #7C3AED;
  color: #fff;
  font-size: 10px;
  font-weight: 800;
  padding: 2px 7px;
  border-radius: var(--radius-full);
  letter-spacing: 0.03em;
  animation: pulse 2s infinite;
}

.passport-head-btn {
  color: #D97706;
}

.gold-icon {
  color: #F59E0B;
}

.profile-scroll-body {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px 84px;
}

.persona-switcher-bar {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
  margin-bottom: 12px;
}

.persona-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px 6px 8px;
  border-radius: var(--radius-full);
  background: var(--bg-card);
  border: 1.5px solid var(--border-light);
  font-size: 12.5px;
  font-weight: 700;
  color: var(--ink-secondary);
  flex-shrink: 0;
  transition: all 0.15s ease;
}

.persona-tab.active {
  background: var(--brand-gradient);
  border-color: transparent;
  color: #fff;
  box-shadow: 0 4px 12px rgba(148, 125, 238, 0.35);
}

.persona-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

/* ANONYMITY / GHOST MODE CARD */
.anonymity-card {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  background: var(--bg-card-subtle);
  border: 1.5px solid var(--border-strong);
  cursor: pointer;
  user-select: none;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.anonymity-card:hover {
  border-color: var(--brand-primary);
  transform: translateY(-1px);
}

.anonymity-card.ghost-active {
  background: linear-gradient(135deg, #F3EEFF 0%, #FAF5FF 100%);
  border-color: #A855F7;
  box-shadow: 0 4px 16px rgba(168, 85, 247, 0.22);
}

:global([data-theme='dark']) .anonymity-card.ghost-active {
  background: linear-gradient(135deg, #2A1748 0%, #1D1333 100%);
  border-color: #C084FC;
}

.anon-badge-line {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 2px;
}

.anon-icon {
  color: var(--ink-muted);
}

.ghost-active .anon-icon {
  color: #7C3AED;
}

.anon-title {
  font-size: 13px;
  font-weight: 800;
  color: var(--ink-primary);
}

.ghost-active .anon-title {
  color: #6D28D9;
}

.live-active-tag {
  background: #10B981;
  color: #fff;
  font-size: 9px;
  font-weight: 800;
  padding: 1px 5px;
  border-radius: var(--radius-full);
}

.anon-explain {
  font-size: 11px;
  color: var(--ink-muted);
}

/* HERO PROFILE CARD */
.profile-hero-card {
  padding: 16px;
  margin-bottom: 12px;
  transition: all 0.2s ease;
}

.profile-hero-card.ghost-mode-border {
  border-color: #C4B5FD;
  box-shadow: 0 4px 18px rgba(148, 125, 238, 0.2);
}

.hero-top-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.hero-avatar-wrapper {
  position: relative;
}

.hero-avatar-wrapper.ghost-halo .hero-avatar {
  border: 2.5px solid #A855F7;
  box-shadow: 0 0 12px rgba(168, 85, 247, 0.4);
}

.hero-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--border-light);
}

.ghost-badge-overlay {
  position: absolute;
  bottom: 0;
  right: 0;
  background: #7C3AED;
  color: #fff;
  font-size: 11px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  border: 2px solid var(--bg-card);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.pet-star-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  background: #F59E0B;
  color: #fff;
  font-size: 11px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  border: 2px solid var(--bg-card);
}

.stats-counts-group {
  flex: 1;
  display: flex;
  justify-content: space-around;
  text-align: center;
}

.count-box {
  display: flex;
  flex-direction: column;
}

.c-num {
  font-size: 16px;
  font-weight: 800;
  color: var(--ink-primary);
}

.c-label {
  font-size: 11px;
  color: var(--ink-muted);
}

.hero-bio-section {
  margin: 12px 0 14px;
}

.name-badge-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.hero-name {
  font-size: 16px;
  font-weight: 800;
  color: var(--ink-primary);
}

.anon-identity-badge {
  font-size: 10px;
  font-weight: 700;
  background: #F3EEFF;
  border: 1px solid #D8B4FE;
  color: #7C3AED;
  padding: 1px 7px;
  border-radius: var(--radius-full);
}

.hero-subtitle {
  font-size: 12px;
  font-weight: 600;
  color: var(--brand-primary);
  display: block;
  margin-bottom: 4px;
}

.hero-bio-text {
  font-size: 13px;
  color: var(--ink-secondary);
  line-height: 1.4;
}

.profile-buttons-row {
  display: flex;
  gap: 8px;
}

.profile-btn {
  flex: 1;
  padding: 9px 0;
  font-size: 13px;
}

.gold-gradient-btn {
  background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%) !important;
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(217, 119, 6, 0.35);
}

/* PASSPORT SUMMARY WIDGET */
.passport-widget-card {
  background: linear-gradient(135deg, #1E1735 0%, #150F28 100%);
  border: 1.5px solid #D4AF37;
  border-radius: var(--radius-lg);
  padding: 14px;
  color: #fff;
  margin-bottom: 14px;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(21, 15, 40, 0.35);
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease;
}

.passport-widget-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(212, 175, 55, 0.25);
}

.p-widget-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.p-widget-emblem {
  display: flex;
  align-items: center;
  gap: 8px;
}

.p-flag {
  font-size: 22px;
}

.p-widget-title {
  font-size: 13px;
  font-weight: 800;
  color: #FDE047;
  letter-spacing: 0.02em;
}

.p-widget-chip {
  font-family: monospace;
  font-size: 9.5px;
  color: #CBD5E1;
}

.verified-seal-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(16, 185, 129, 0.25);
  border: 1px solid #10B981;
  color: #6EE7B7;
  font-size: 10px;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: var(--radius-full);
}

.p-widget-metrics {
  display: flex;
  justify-content: space-around;
  background: rgba(0, 0, 0, 0.35);
  border-radius: var(--radius-md);
  padding: 8px 10px;
  margin-bottom: 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.p-metric {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pm-val {
  font-size: 11.5px;
  font-weight: 800;
  color: #F8FAFC;
}

.pm-lbl {
  font-size: 9px;
  color: #94A3B8;
}

.p-widget-cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11.5px;
  font-weight: 700;
  color: #FDE047;
  padding-top: 4px;
}

.cta-arrow {
  transition: transform 0.15s ease;
}

.passport-widget-card:hover .cta-arrow {
  transform: translateX(4px);
}

/* Pets Roster */
.pets-roster-section {
  margin-bottom: 14px;
}

.roster-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.roster-title {
  font-size: 13.5px;
  font-weight: 800;
  color: var(--ink-primary);
}

.add-pet-link {
  font-size: 11.5px;
  font-weight: 700;
  color: var(--brand-primary);
}

.pets-cards-scroll {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  scrollbar-width: none;
}

.pet-summary-card {
  flex-shrink: 0;
  width: 115px;
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: transform 0.15s ease;
}

.pet-summary-card:hover {
  transform: translateY(-2px);
  border-color: var(--brand-primary);
}

.p-thumb {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 4px;
}

.p-name {
  font-size: 12px;
  font-weight: 700;
  color: var(--ink-primary);
}

.p-breed {
  font-size: 10px;
  color: var(--ink-muted);
  text-align: center;
}

.profile-media-tabs {
  display: flex;
  border-bottom: 1px solid var(--border-light);
  margin-bottom: 8px;
}

.p-tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 0;
  font-size: 12.5px;
  font-weight: 700;
  color: var(--ink-muted);
  border-bottom: 2px solid transparent;
}

.p-tab-btn.active {
  color: var(--brand-primary);
  border-bottom-color: var(--brand-primary);
}

.profile-posts-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3px;
  border-radius: var(--radius-md);
  overflow: hidden;
}

.grid-photo-cell {
  aspect-ratio: 1 / 1;
}

.grid-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Toast Bar */
.profile-toast-bar {
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(26, 18, 42, 0.95);
  color: #fff;
  padding: 8px 16px;
  border-radius: var(--radius-full);
  font-size: 11.5px;
  font-weight: 700;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
  z-index: 100;
  white-space: nowrap;
}

.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.toast-slide-enter-from,
.toast-slide-leave-to {
  opacity: 0;
  transform: translate(-50%, -10px);
}
</style>

