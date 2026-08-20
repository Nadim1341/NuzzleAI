<template>
  <div class="feed-view">
    <TopBar />

    <div class="feed-scroll-body">
      <!-- Stories Tray -->
      <StoryTray />

      <!-- Emergency Alert Banner if any active lost pet -->
      <div v-if="activeLostPet" class="emergency-banner" @click="setTab('lostfound')">
        <div class="alert-pulse-circle">🚨</div>
        <div class="alert-banner-text">
          <span class="alert-title">Emergency: Lost {{ activeLostPet.species }} ({{ activeLostPet.petName }})</span>
          <span class="alert-subtitle">{{ activeLostPet.location }} • Click to help</span>
        </div>
      </div>

      <!-- Posts List -->
      <div class="posts-feed-container">
        <PostCard 
          v-for="post in activePosts" 
          :key="post.id" 
          :post="post" 
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import TopBar from '../components/layout/TopBar.vue';
import StoryTray from '../components/feed/StoryTray.vue';
import PostCard from '../components/feed/PostCard.vue';
import { activePosts, lostFoundList, setTab } from '../stores/appStore';

const activeLostPet = computed(() => {
  return lostFoundList.find(p => p.status === 'lost' && !p.isResolved) || null;
});
</script>

<style scoped>
.feed-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.feed-scroll-body {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 24px;
}

.emergency-banner {
  margin: 10px 14px 4px;
  background: linear-gradient(135deg, #FFF1F2, #FFE4E6);
  border: 1.5px solid #FDA4AF;
  border-radius: var(--radius-md);
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(244, 63, 94, 0.12);
  transition: transform 0.15s ease;
}

.emergency-banner:active {
  transform: scale(0.98);
}

.alert-pulse-circle {
  font-size: 20px;
  animation: bounce 1.8s infinite;
}

.alert-banner-text {
  display: flex;
  flex-direction: column;
}

.alert-title {
  font-size: 13px;
  font-weight: 800;
  color: #9F1239;
}

.alert-subtitle {
  font-size: 11.5px;
  color: #BE123C;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.posts-feed-container {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
</style>
