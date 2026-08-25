<template>
  <div class="bottom-nav-outer-wrapper">
    <nav class="floating-island-nav">
      <!-- 🏡 Den (Pet Feed) -->
      <button 
        class="nav-capsule-btn" 
        :class="{ active: currentTab === 'feed' }" 
        @click="setTab('feed')"
      >
        <div class="icon-bubble">
          <Home :size="20" />
        </div>
        <span class="nav-label">Den</span>
      </button>

      <!-- 🧭 Park (Explore & Clubs) -->
      <button 
        class="nav-capsule-btn" 
        :class="{ active: currentTab === 'explore' }" 
        @click="setTab('explore')"
      >
        <div class="icon-bubble">
          <Compass :size="20" />
        </div>
        <span class="nav-label">Park</span>
      </button>

      <!-- 🐾 Center Bark FAB -->
      <div class="center-fab-anchor">
        <button class="glowing-bark-fab" @click="isCreateSheetOpen = true" title="Bark a Moment">
          <span class="fab-paw-icon">🐾</span>
        </button>
      </div>

      <!-- ✨ PawAI Intelligence -->
      <button 
        class="nav-capsule-btn ai-tab" 
        :class="{ active: currentTab === 'ai' }" 
        @click="setTab('ai')"
      >
        <div class="icon-bubble ai-bubble">
          <Sparkles :size="20" class="ai-sparkle" />
        </div>
        <span class="nav-label ai-label">PawAI</span>
      </button>

      <!-- 🛂 Passport (Pet Bio ID) -->
      <button 
        class="nav-capsule-btn" 
        :class="{ active: currentTab === 'profile' }" 
        @click="setTab('profile')"
      >
        <div class="passport-avatar-bubble" :class="{ active: currentTab === 'profile' }">
          <img :src="owner.avatarUrl" :alt="owner.displayName" />
        </div>
        <span class="nav-label">Passport</span>
      </button>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { Home, Compass, Sparkles } from 'lucide-vue-next';
import { currentTab, setTab, isCreateSheetOpen, owner } from '../../stores/appStore';
</script>

<style scoped>
.bottom-nav-outer-wrapper {
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  padding: 0 14px;
  z-index: 50;
  pointer-events: none;
}

.floating-island-nav {
  pointer-events: auto;
  height: 64px;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(24px) saturate(200%);
  -webkit-backdrop-filter: blur(24px) saturate(200%);
  border: 1.5px solid rgba(148, 125, 238, 0.2);
  border-radius: 32px;
  box-shadow: 
    0 12px 32px -4px rgba(45, 25, 80, 0.18),
    0 4px 12px rgba(148, 125, 238, 0.15);
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 8px;
}

:global([data-theme='dark']) .floating-island-nav {
  background: rgba(26, 19, 43, 0.94);
  border-color: rgba(169, 149, 246, 0.25);
  box-shadow: 0 14px 36px rgba(0, 0, 0, 0.6);
}

.nav-capsule-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  flex: 1;
  color: var(--ink-muted);
  transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
}

.icon-bubble {
  width: 32px;
  height: 28px;
  display: grid;
  place-items: center;
  border-radius: var(--radius-full);
  transition: transform 0.18s ease, background 0.18s ease;
}

.nav-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.nav-capsule-btn.active {
  color: var(--brand-primary);
}

.nav-capsule-btn.active .icon-bubble {
  background: #F3EEFF;
  transform: translateY(-2px);
}

:global([data-theme='dark']) .nav-capsule-btn.active .icon-bubble {
  background: rgba(169, 149, 246, 0.18);
}

.nav-capsule-btn:active .icon-bubble {
  transform: scale(0.88);
}

/* Center Glowing Bark FAB */
.center-fab-anchor {
  position: relative;
  width: 52px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.glowing-bark-fab {
  width: 48px;
  height: 48px;
  border-radius: 20px;
  background: linear-gradient(135deg, #947DEE 0%, #7C3AED 100%);
  color: #ffffff;
  display: grid;
  place-items: center;
  box-shadow: 0 8px 22px rgba(124, 58, 237, 0.45);
  margin-top: -24px;
  border: 3.5px solid var(--bg-card);
  position: relative;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease;
}

.glowing-bark-fab:hover {
  transform: scale(1.08) translateY(-2px);
  box-shadow: 0 12px 28px rgba(124, 58, 237, 0.6);
}

.glowing-bark-fab:active {
  transform: scale(0.92);
}

.fab-paw-icon {
  font-size: 20px;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.glowing-bark-fab:hover .fab-paw-icon {
  transform: scale(1.2) rotate(12deg);
}

/* PawAI Tab */
.ai-tab.active .ai-label {
  background: linear-gradient(135deg, #947DEE 0%, #EC4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
}

.ai-tab.active .ai-sparkle {
  color: #7C3AED;
}

/* Passport Avatar */
.passport-avatar-bubble {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid transparent;
  transition: all 0.18s ease;
}

.passport-avatar-bubble img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.passport-avatar-bubble.active {
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 2px rgba(148, 125, 238, 0.35);
  transform: translateY(-2px);
}
</style>
