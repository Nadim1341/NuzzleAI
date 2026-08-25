<template>
  <header class="app-header">
    <div class="header-left">
      <button v-if="showBackButton" class="btn-icon" @click="goBack" title="Back">
        <ArrowLeft :size="20" />
      </button>
      
      <div v-else class="brand-badge" @click="setTab('feed')">
        <NuzzleLogo :size="32" />
        <span class="brand-text">Nuzzle</span>
      </div>

      <!-- Quick Active Pet Switcher Pill -->
      <button 
        v-if="!showBackButton && pets.length > 0" 
        class="pet-switcher-pill"
        @click="cyclePetPerspective"
        :title="'Currently browsing as ' + currentBrowsingName"
      >
        <span class="switcher-avatar">{{ currentBrowsingEmoji }}</span>
        <span class="switcher-name">{{ currentBrowsingName }}</span>
      </button>
    </div>

    <!-- Center PawAI Quick Assistant Pill -->
    <div v-if="!showBackButton" class="header-center-ai" @click="setTab('ai')">
      <div class="pawai-quick-pill">
        <Sparkles :size="13" class="ai-sparkle-spin" />
        <span>PawAI</span>
      </div>
    </div>

    <div class="header-title" v-else-if="title">
      {{ title }}
    </div>

    <div class="header-actions">
      <button class="action-btn alert-radar-btn" @click="setTab('lostfound')" title="5-Mile Lost & Found Radar">
        <AlertTriangle :size="18" class="alert-icon" />
        <span class="badge-dot pulse"></span>
      </button>

      <button class="action-btn" @click="setTab('messages')" title="Pet Direct Messages">
        <MessageCircle :size="19" />
        <span v-if="unreadMessagesCount > 0" class="badge-count">{{ unreadMessagesCount }}</span>
      </button>

      <button class="action-btn" @click="setTab('activity')" title="Community Notifications">
        <Bell :size="19" />
        <span v-if="unreadNotificationsCount > 0" class="badge-count">{{ unreadNotificationsCount }}</span>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { MessageCircle, Bell, AlertTriangle, ArrowLeft, Sparkles } from 'lucide-vue-next';
import NuzzleLogo from '../common/NuzzleLogo.vue';
import { 
  currentTab, 
  setTab, 
  owner, 
  pets, 
  activeProfileId, 
  unreadMessagesCount, 
  unreadNotificationsCount 
} from '../../stores/appStore';

const props = defineProps<{
  title?: string;
  canGoBack?: boolean;
}>();

const showBackButton = computed(() => {
  return props.canGoBack || !['feed', 'explore', 'ai', 'reels', 'profile'].includes(currentTab.value);
});

const currentBrowsingName = computed(() => {
  if (activeProfileId.value === 'owner_me') return owner.displayName.split(' ')[0];
  const pet = pets.find(p => p.id === activeProfileId.value);
  return pet ? pet.name : 'Waffles';
});

const currentBrowsingEmoji = computed(() => {
  if (activeProfileId.value === 'owner_me') return '👤';
  const pet = pets.find(p => p.id === activeProfileId.value);
  return pet?.species === 'Cat' ? '🐱' : '🐾';
});

function cyclePetPerspective() {
  if (activeProfileId.value === 'owner_me' && pets[0]) {
    activeProfileId.value = pets[0].id;
  } else if (pets[1] && activeProfileId.value === pets[0]?.id) {
    activeProfileId.value = pets[1].id;
  } else {
    activeProfileId.value = 'owner_me';
  }
}

function goBack() {
  setTab('feed');
}
</script>

<style scoped>
.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.brand-badge {
  display: flex;
  align-items: center;
  gap: 7px;
  cursor: pointer;
  user-select: none;
}

.brand-text {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 20px;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, #947DEE 0%, #7C3AED 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.pet-switcher-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-strong);
  color: var(--ink-secondary);
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: var(--radius-full);
  transition: all 0.15s ease;
  box-shadow: 0 1px 3px rgba(148, 125, 238, 0.08);
}

.pet-switcher-pill:hover {
  background: #F3EEFF;
  border-color: var(--brand-primary);
  transform: scale(1.03);
}

.switcher-avatar {
  font-size: 11px;
}

.switcher-name {
  max-width: 58px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.header-center-ai {
  cursor: pointer;
}

.pawai-quick-pill {
  display: flex;
  align-items: center;
  gap: 5px;
  background: linear-gradient(135deg, #7C3AED 0%, #947DEE 100%);
  color: #fff;
  padding: 4px 11px;
  border-radius: var(--radius-full);
  font-size: 11.5px;
  font-weight: 800;
  box-shadow: 0 2px 10px rgba(124, 58, 237, 0.35);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.pawai-quick-pill:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 14px rgba(124, 58, 237, 0.45);
}

.ai-sparkle-spin {
  color: #FDE047;
}

.header-title {
  font-weight: 800;
  font-size: 15px;
  color: var(--ink-primary);
  text-align: center;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.action-btn {
  width: 35px;
  height: 35px;
  border-radius: 11px;
  display: grid;
  place-items: center;
  color: var(--ink-primary);
  position: relative;
  transition: background 0.15s ease;
}

.action-btn:hover {
  background: var(--bg-card-subtle);
  color: var(--brand-primary);
}

.alert-icon {
  color: var(--accent-rose);
}

.badge-count {
  position: absolute;
  top: 2px;
  right: 2px;
  background: var(--accent-rose);
  color: #fff;
  font-size: 9px;
  font-weight: 800;
  min-width: 15px;
  height: 15px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 3px;
  border: 2px solid var(--bg-app);
}

.badge-dot {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--accent-rose);
}

.pulse {
  animation: pulseAnim 1.6s infinite;
}

@keyframes pulseAnim {
  0% { transform: scale(0.95); opacity: 1; }
  50% { transform: scale(1.35); opacity: 0.7; }
  100% { transform: scale(0.95); opacity: 1; }
}
</style>
