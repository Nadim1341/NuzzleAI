<template>
  <div class="story-tray">
    <!-- Add Story Item -->
    <div class="story-item" @click="isCreateSheetOpen = true">
      <div class="avatar-ring add-ring">
        <img :src="owner.avatarUrl" :alt="owner.displayName" class="story-avatar" />
        <div class="add-plus-badge">
          <Plus :size="12" />
        </div>
      </div>
      <span class="story-name">Your Story</span>
    </div>

    <!-- Active Stories -->
    <div 
      v-for="story in stories" 
      :key="story.id" 
      class="story-item"
      @click="openStory(story)"
    >
      <div class="avatar-ring" :class="{ unseen: story.hasUnseen, seen: !story.hasUnseen }">
        <img :src="story.creatorAvatar" :alt="story.creatorName" class="story-avatar" />
      </div>
      <span class="story-name">{{ story.creatorName.split(' ')[0] }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus } from 'lucide-vue-next';
import { stories, openStory, owner, isCreateSheetOpen } from '../../stores/appStore';
</script>

<style scoped>
.story-tray {
  display: flex;
  align-items: center;
  gap: 14px;
  overflow-x: auto;
  padding: 12px 16px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-light);
  scrollbar-width: none;
}

.story-tray::-webkit-scrollbar {
  display: none;
}

.story-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  flex-shrink: 0;
}

.avatar-ring {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  padding: 2.5px;
  position: relative;
  display: grid;
  place-items: center;
  transition: transform 0.15s ease;
}

.story-item:active .avatar-ring {
  transform: scale(0.94);
}

.avatar-ring.unseen {
  background: linear-gradient(135deg, #F4915C, #F43F5E, #9333EA);
}

.avatar-ring.seen {
  background: var(--border-strong);
}

.add-ring {
  background: var(--border-light);
}

.story-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--bg-card);
}

.add-plus-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--brand-primary);
  color: #fff;
  display: grid;
  place-items: center;
  border: 2px solid var(--bg-card);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.story-name {
  font-size: 11.5px;
  font-weight: 600;
  color: var(--ink-secondary);
  max-width: 68px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
}
</style>
