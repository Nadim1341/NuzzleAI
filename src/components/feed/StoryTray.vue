<template>
  <div class="clean-story-tray">
    <div class="stories-scroll-track">
      <!-- Your Story / Add Story -->
      <div class="story-item" @click="isCreateSheetOpen = true">
        <div class="story-avatar-wrap your-story">
          <img :src="owner.avatarUrl" :alt="owner.displayName" class="story-avatar-img" />
          <div class="add-plus-badge">
            <Plus :size="12" />
          </div>
        </div>
        <span class="story-username">Your Story</span>
      </div>

      <!-- Active Stories -->
      <div 
        v-for="story in stories" 
        :key="story.id" 
        class="story-item"
        @click="openStory(story)"
      >
        <div class="story-avatar-wrap" :class="{ 'has-unseen': story.hasUnseen }">
          <img :src="story.creatorAvatar" :alt="story.creatorName" class="story-avatar-img" />
        </div>
        <span class="story-username">{{ story.petName?.split(' ')[0] || story.creatorName.split(' ')[0] }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus } from 'lucide-vue-next';
import { stories, openStory, owner, isCreateSheetOpen } from '../../stores/appStore';
</script>

<style scoped>
.clean-story-tray {
  padding: 10px 14px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-light);
}

.stories-scroll-track {
  display: flex;
  align-items: center;
  gap: 14px;
  overflow-x: auto;
  scrollbar-width: none;
}

.stories-scroll-track::-webkit-scrollbar {
  display: none;
}

.story-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  flex-shrink: 0;
  user-select: none;
}

.story-avatar-wrap {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  padding: 2px;
  background: transparent;
  display: grid;
  place-items: center;
  position: relative;
  transition: transform 0.15s ease;
}

.story-avatar-wrap.has-unseen {
  background: linear-gradient(135deg, #947DEE 0%, #EC4899 50%, #F59E0B 100%);
  box-shadow: 0 2px 10px rgba(148, 125, 238, 0.25);
}

.story-avatar-wrap:hover {
  transform: scale(1.05);
}

.story-avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--bg-card);
}

.your-story {
  position: relative;
}

.add-plus-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--brand-primary);
  color: #fff;
  display: grid;
  place-items: center;
  border: 2px solid var(--bg-card);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
}

.story-username {
  font-size: 11px;
  font-weight: 600;
  color: var(--ink-secondary);
  max-width: 58px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
}
</style>
