<template>
  <header class="app-header clean-topbar">
    <div class="header-left">
      <button v-if="showBackButton" class="back-btn" @click="goBack" title="Back">
        <ArrowLeft :size="20" />
      </button>
      
      <div v-else class="brand-badge" @click="setTab('feed')">
        <NuzzleLogo :size="28" />
        <span class="brand-text">Nuzzle</span>
      </div>
    </div>

    <!-- Center Title (If subview) -->
    <div v-if="showBackButton && title" class="header-center-title">
      <h3>{{ title }}</h3>
    </div>

    <!-- Right Actions -->
    <div class="header-right-actions">
      <!-- 🚨 Emergency Lost & Found -->
      <button 
        class="header-action-btn emergency-btn" 
        :class="{ active: currentTab === 'lostfound' }"
        @click="setTab('lostfound')" 
        title="Lost & Found Emergency Center"
      >
        <AlertTriangle :size="18" />
        <span class="pulse-dot"></span>
      </button>

      <!-- 💬 Direct Messages -->
      <button 
        class="header-action-btn" 
        :class="{ active: currentTab === 'messages' }"
        @click="setTab('messages')" 
        title="Messages"
      >
        <MessageCircle :size="19" />
        <span v-if="unreadMessagesCount > 0" class="unread-pill">{{ unreadMessagesCount }}</span>
      </button>

      <!-- 🔔 Notifications -->
      <button 
        class="header-action-btn" 
        :class="{ active: currentTab === 'activity' }"
        @click="setTab('activity')" 
        title="Notifications"
      >
        <Bell :size="19" />
        <span v-if="unreadNotificationsCount > 0" class="unread-dot"></span>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { MessageCircle, Bell, AlertTriangle, ArrowLeft } from 'lucide-vue-next';
import NuzzleLogo from '../common/NuzzleLogo.vue';
import { 
  currentTab, 
  setTab, 
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

function goBack() {
  setTab('feed');
}
</script>

<style scoped>
.clean-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 16px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-light);
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(16px);
}

.header-left {
  display: flex;
  align-items: center;
}

.brand-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.brand-text {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 800;
  background: var(--brand-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.02em;
}

.header-center-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  max-width: 55%;
  text-align: center;
}

.header-center-title h3 {
  font-size: 15px;
  font-weight: 700;
  color: var(--ink-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.back-btn {
  color: var(--ink-primary);
  padding: 6px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  transition: background 0.15s ease;
}

.back-btn:hover {
  background: var(--bg-card-subtle);
}

.header-right-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.header-action-btn {
  position: relative;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: var(--ink-secondary);
  transition: all 0.15s ease;
}

.header-action-btn:hover {
  background: var(--bg-card-subtle);
  color: var(--brand-primary);
}

.header-action-btn.active {
  color: var(--brand-primary);
  background: var(--brand-soft);
}

.emergency-btn {
  color: #E11D48;
}

.emergency-btn:hover {
  background: #FFE4E6;
}

.pulse-dot {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 7px;
  height: 7px;
  background: #E11D48;
  border-radius: 50%;
  border: 1.5px solid var(--bg-card);
}

.unread-pill {
  position: absolute;
  top: 4px;
  right: 3px;
  background: var(--brand-primary);
  color: #fff;
  font-size: 9px;
  font-weight: 800;
  min-width: 15px;
  height: 15px;
  padding: 0 3px;
  border-radius: var(--radius-full);
  display: grid;
  place-items: center;
  border: 1.5px solid var(--bg-card);
}

.unread-dot {
  position: absolute;
  top: 7px;
  right: 8px;
  width: 7px;
  height: 7px;
  background: var(--brand-primary);
  border-radius: 50%;
  border: 1.5px solid var(--bg-card);
}
</style>
