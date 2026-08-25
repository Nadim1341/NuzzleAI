<template>
  <div class="snuggle-pods-tray">
    <div class="pods-scroll-track">
      <!-- 1. Add Story Pod -->
      <div class="pet-pod-card add-pod" @click="isCreateSheetOpen = true">
        <div class="pod-avatar-frame">
          <img :src="owner.avatarUrl" :alt="owner.displayName" class="pod-img" />
          <div class="add-sparkle-charm">
            <Plus :size="12" />
          </div>
        </div>
        <span class="pod-pet-name">Share Story</span>
      </div>

      <!-- 2. Live Pet Story Pods -->
      <div 
        v-for="story in stories" 
        :key="story.id" 
        class="pet-pod-card"
        :class="{ 'has-unseen': story.hasUnseen }"
        @click="openStory(story)"
      >
        <!-- Floating Mood Icon -->
        <span class="floating-vibe-emoji">{{ getStoryVibe(story.petName) }}</span>

        <div class="pod-avatar-frame" :class="{ 'live-aura': story.hasUnseen }">
          <img :src="story.creatorAvatar" :alt="story.creatorName" class="pod-img" />
          <span class="pod-species-dot">{{ getSpeciesEmoji(story.petName) }}</span>
        </div>
        
        <span class="pod-pet-name">{{ story.petName?.split(' ')[0] || story.creatorName.split(' ')[0] }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus } from 'lucide-vue-next';
import { stories, openStory, owner, isCreateSheetOpen } from '../../stores/appStore';

function getSpeciesEmoji(name?: string): string {
  if (!name) return '🐾';
  const l = name.toLowerCase();
  if (l.includes('cat') || l.includes('cleo') || l.includes('mochi')) return '🐱';
  if (l.includes('bird') || l.includes('conure') || l.includes('kiwi')) return '🦜';
  if (l.includes('bun') || l.includes('boba') || l.includes('lop')) return '🐰';
  return '🐕';
}

function getStoryVibe(name?: string): string {
  if (!name) return '🐾';
  const l = name.toLowerCase();
  if (l.includes('corgi') || l.includes('waffles')) return '⚡';
  if (l.includes('conure') || l.includes('kiwi')) return '🎶';
  if (l.includes('bun') || l.includes('boba')) return '🍌';
  if (l.includes('cleo') || l.includes('mochi')) return '👑';
  return '🎾';
}
</script>

<style scoped>
.snuggle-pods-tray {
  padding: 10px 14px 12px;
  background: var(--bg-card);
  border-bottom: 1.5px solid var(--border-subtle);
}

.pods-scroll-track {
  display: flex;
  align-items: center;
  gap: 13px;
  overflow-x: auto;
  scrollbar-width: none;
  padding-top: 4px;
}

.pods-scroll-track::-webkit-scrollbar {
  display: none;
}

.pet-pod-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  flex-shrink: 0;
  user-select: none;
  transition: transform 0.18s cubic-bezier(0.16, 1, 0.3, 1);
}

.pet-pod-card:hover {
  transform: translateY(-2px);
}

.floating-vibe-emoji {
  position: absolute;
  top: -6px;
  right: 4px;
  font-size: 13px;
  z-index: 5;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15));
  animation: vibeFloat 2.2s infinite ease-in-out;
}

@keyframes vibeFloat {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-2px) scale(1.12); }
}

.pod-avatar-frame {
  position: relative;
  width: 54px;
  height: 54px;
  border-radius: 18px; /* Distinct squircle capsule shape */
  padding: 2px;
  background: var(--bg-card-subtle);
  border: 1.5px solid var(--border-subtle);
  display: grid;
  place-items: center;
  transition: all 0.18s ease;
}

.pod-avatar-frame.live-aura {
  background: linear-gradient(135deg, #947DEE 0%, #EC4899 50%, #F59E0B 100%);
  border-color: transparent;
  box-shadow: 0 4px 14px rgba(148, 125, 238, 0.32);
}

.pod-img {
  width: 100%;
  height: 100%;
  border-radius: 15px;
  object-fit: cover;
  border: 1.5px solid var(--bg-card);
}

.pod-species-dot {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 17px;
  height: 17px;
  border-radius: 50%;
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  display: grid;
  place-items: center;
  font-size: 9px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

.add-sparkle-charm {
  position: absolute;
  bottom: -3px;
  right: -3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7C3AED 0%, #947DEE 100%);
  color: #fff;
  display: grid;
  place-items: center;
  border: 2px solid var(--bg-card);
  box-shadow: 0 2px 6px rgba(124, 58, 237, 0.35);
}

.pod-pet-name {
  font-size: 11px;
  font-weight: 700;
  color: var(--ink-secondary);
  max-width: 58px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
}
</style>

