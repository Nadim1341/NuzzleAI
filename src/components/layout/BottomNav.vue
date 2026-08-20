<template>
  <nav class="bottom-nav">
    <button 
      class="nav-tab-btn" 
      :class="{ active: currentTab === 'feed' }" 
      @click="setTab('feed')"
    >
      <Home class="nav-tab-icon" />
      <span>Feed</span>
    </button>

    <button 
      class="nav-tab-btn" 
      :class="{ active: currentTab === 'explore' }" 
      @click="setTab('explore')"
    >
      <Compass class="nav-tab-icon" />
      <span>Explore</span>
    </button>

    <!-- Center Create FAB -->
    <div class="fab-wrapper">
      <button class="fab-create-btn" @click="isCreateSheetOpen = true" title="Create">
        <Plus :size="26" />
      </button>
    </div>

    <!-- PawAI Dedicated Tab -->
    <button 
      class="nav-tab-btn ai-tab" 
      :class="{ active: currentTab === 'ai' }" 
      @click="setTab('ai')"
    >
      <div class="ai-icon-holder" :class="{ active: currentTab === 'ai' }">
        <Sparkles class="nav-tab-icon ai-sparkle" />
      </div>
      <span class="ai-label">PawAI</span>
    </button>

    <button 
      class="nav-tab-btn" 
      :class="{ active: currentTab === 'profile' }" 
      @click="setTab('profile')"
    >
      <div class="profile-nav-avatar" :class="{ active: currentTab === 'profile' }">
        <img :src="owner.avatarUrl" :alt="owner.displayName" />
      </div>
      <span>Profile</span>
    </button>
  </nav>
</template>

<script setup lang="ts">
import { Home, Compass, Plus, Sparkles } from 'lucide-vue-next';
import { currentTab, setTab, isCreateSheetOpen, owner } from '../../stores/appStore';
</script>

<style scoped>
.fab-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
}

.ai-tab.active .ai-label {
  background: linear-gradient(135deg, #6366F1, #9333EA);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
}

.ai-icon-holder {
  display: flex;
  align-items: center;
  justify-content: center;
}

.ai-icon-holder.active {
  color: #6366F1;
}

.ai-sparkle {
  color: inherit;
}

.profile-nav-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  overflow: hidden;
  border: 1.5px solid transparent;
  transition: all 0.15s ease;
}

.profile-nav-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-nav-avatar.active {
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 1px var(--brand-primary);
}
</style>
