<template>
  <div class="snuggle-tray-container">
    <div class="tray-header-row">
      <span class="tray-title">🐾 Snuggle Circles</span>
      <span class="tray-sub">Live daily stories</span>
    </div>

    <div class="stories-scroll-track">
      <!-- Add Story Tile -->
      <div class="story-snuggle-card add-card" @click="isCreateSheetOpen = true">
        <div class="card-avatar-wrapper">
          <img :src="owner.avatarUrl" :alt="owner.displayName" class="story-pet-img" />
          <div class="add-action-badge">
            <Plus :size="13" />
          </div>
        </div>
        <span class="card-pet-name">Share Story</span>
        <span class="card-mood-tag">✨ Add Moment</span>
      </div>

      <!-- Active Stories -->
      <div 
        v-for="story in stories" 
        :key="story.id" 
        class="story-snuggle-card"
        :class="{ 'has-new': story.hasUnseen }"
        @click="openStory(story)"
      >
        <div class="card-avatar-wrapper" :class="{ 'glow-ring': story.hasUnseen }">
          <img :src="story.creatorAvatar" :alt="story.creatorName" class="story-pet-img" />
          <div class="story-species-badge">{{ getSpeciesEmoji(story.petName) }}</div>
        </div>
        <span class="card-pet-name">{{ story.petName?.split(' ')[0] || story.creatorName.split(' ')[0] }}</span>
        <span class="card-mood-tag">{{ getStoryMood(story.petName) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus } from 'lucide-vue-next';
import { stories, openStory, owner, isCreateSheetOpen } from '../../stores/appStore';

function getSpeciesEmoji(name?: string): string {
  if (!name) return '🐾';
  const lower = name.toLowerCase();
  if (lower.includes('cat') || lower.includes('cleo') || lower.includes('mochi')) return '🐱';
  if (lower.includes('bird') || lower.includes('conure') || lower.includes('kiwi')) return '🦜';
  if (lower.includes('bun') || lower.includes('boba') || lower.includes('lop')) return '🐰';
  return '🐶';
}

function getStoryMood(name?: string): string {
  if (!name) return '🐾 Active';
  const lower = name.toLowerCase();
  if (lower.includes('corgi')) return '☁️ Zoomies';
  if (lower.includes('conure')) return '🎶 Singing';
  if (lower.includes('bun') || lower.includes('boba')) return '🍌 Snacking';
  return '🎾 Playing';
}
</script>

<style scoped>
.snuggle-tray-container {
  padding: 12px 14px 10px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-light);
}

.tray-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 0 4px;
}

.tray-title {
  font-size: 13px;
  font-weight: 800;
  color: var(--ink-primary);
  letter-spacing: -0.01em;
}

.tray-sub {
  font-size: 11px;
  font-weight: 600;
  color: var(--ink-muted);
}

.stories-scroll-track {
  display: flex;
  align-items: center;
  gap: 12px;
  overflow-x: auto;
  scrollbar-width: none;
  padding-bottom: 4px;
}

.stories-scroll-track::-webkit-scrollbar {
  display: none;
}

.story-snuggle-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  flex-shrink: 0;
  padding: 6px 8px 8px;
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-subtle);
  border-radius: 18px;
  min-width: 76px;
  transition: transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.18s ease;
}

.story-snuggle-card:hover {
  transform: translateY(-2px);
  border-color: var(--border-strong);
}

.story-snuggle-card:active {
  transform: scale(0.95);
}

.story-snuggle-card.has-new {
  background: linear-gradient(180deg, #FAF7FF 0%, #F4EEFF 100%);
  border-color: #D5C8F2;
}

.card-avatar-wrapper {
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: 16px;
  padding: 2px;
}

.card-avatar-wrapper.glow-ring {
  background: linear-gradient(135deg, var(--brand-primary), #EC4899, #7C3AED);
  box-shadow: 0 3px 10px rgba(148, 125, 238, 0.35);
}

.story-pet-img {
  width: 100%;
  height: 100%;
  border-radius: 14px;
  object-fit: cover;
  border: 2px solid var(--bg-card);
}

.add-action-badge {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--brand-primary);
  color: #fff;
  display: grid;
  place-items: center;
  border: 2px solid var(--bg-card);
  box-shadow: 0 2px 5px rgba(148, 125, 238, 0.4);
}

.story-species-badge {
  position: absolute;
  bottom: -3px;
  right: -3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #ffffff;
  display: grid;
  place-items: center;
  font-size: 10px;
  border: 1px solid var(--border-light);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

.card-pet-name {
  font-size: 11.5px;
  font-weight: 700;
  color: var(--ink-primary);
  max-width: 68px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-mood-tag {
  font-size: 9.5px;
  font-weight: 700;
  color: var(--brand-primary);
  background: var(--bg-card);
  padding: 1px 6px;
  border-radius: var(--radius-full);
  white-space: nowrap;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}
</style>
