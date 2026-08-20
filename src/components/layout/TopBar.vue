<template>
  <header class="app-header">
    <div class="header-left">
      <button v-if="showBackButton" class="btn-icon" @click="goBack" title="Back">
        <ArrowLeft :size="20" />
      </button>
      
      <div v-else class="brand-badge" @click="setTab('feed')">
        <div class="brand-icon-wrapper">
          <PawPrint :size="18" class="brand-paw" />
        </div>
        <span class="brand-text">PetSocial</span>
      </div>

      <div v-if="owner.isAnonymous" class="anon-pill" title="Owner anonymity is active">
        <EyeOff :size="12" />
        <span>Ghost</span>
      </div>
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
      <button class="action-btn" @click="setTab('lostfound')" title="Lost & Found Alerts">
        <AlertTriangle :size="19" class="alert-icon" />
        <span class="badge-dot pulse"></span>
      </button>

      <button class="action-btn" @click="setTab('messages')" title="Direct Messages">
        <MessageCircle :size="20" />
        <span v-if="unreadMessagesCount > 0" class="badge-count">{{ unreadMessagesCount }}</span>
      </button>

      <button class="action-btn" @click="setTab('activity')" title="Notifications">
        <Bell :size="20" />
        <span v-if="unreadNotificationsCount > 0" class="badge-count">{{ unreadNotificationsCount }}</span>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { PawPrint, MessageCircle, Bell, AlertTriangle, ArrowLeft, EyeOff, Sparkles } from 'lucide-vue-next';
import { currentTab, setTab, owner, unreadMessagesCount, unreadNotificationsCount } from '../../stores/appStore';

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

.brand-icon-wrapper {
  width: 30px;
  height: 30px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--brand-primary), #EA580C);
  display: grid;
  place-items: center;
  color: #fff;
  box-shadow: 0 3px 8px rgba(244, 145, 92, 0.35);
}

.brand-paw {
  transform: rotate(-12deg);
}

.brand-text {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 19px;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, var(--brand-primary), #E15B1E);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.anon-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-strong);
  color: var(--ink-secondary);
  font-size: 10.5px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: var(--radius-full);
}

.header-center-ai {
  cursor: pointer;
}

.pawai-quick-pill {
  display: flex;
  align-items: center;
  gap: 5px;
  background: linear-gradient(135deg, #4F46E5, #9333EA);
  color: #fff;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: 11.5px;
  font-weight: 800;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.4);
  transition: transform 0.15s ease;
}

.pawai-quick-pill:hover {
  transform: scale(1.05);
}

.ai-sparkle-spin {
  color: #FDE047;
}

.header-title {
  font-weight: 700;
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
  width: 36px;
  height: 36px;
  border-radius: 11px;
  display: grid;
  place-items: center;
  color: var(--ink-primary);
  position: relative;
  transition: background 0.15s ease;
}

.action-btn:hover {
  background: var(--bg-card-subtle);
}

.alert-icon {
  color: var(--accent-rose);
}

.badge-count {
  position: absolute;
  top: 3px;
  right: 3px;
  background: var(--accent-rose);
  color: #fff;
  font-size: 9.5px;
  font-weight: 800;
  min-width: 16px;
  height: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 3px;
  border: 2px solid var(--bg-app);
}

.badge-dot {
  position: absolute;
  top: 6px;
  right: 6px;
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
