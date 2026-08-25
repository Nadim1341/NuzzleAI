<template>
  <article class="pet-scrapbook-card">
    <!-- 1. Pet Scrapbook Header -->
    <header class="scrapbook-header">
      <div class="pet-author-group" @click="handleProfileClick">
        <div class="scrapbook-avatar-frame">
          <img :src="post.petAvatar || post.ownerAvatar" :alt="post.petName || post.ownerName" class="pet-avatar-img" />
          <span class="species-badge">{{ getSpeciesEmoji(post.petBreed) }}</span>
        </div>

        <div class="pet-diary-meta">
          <div class="diary-title-row">
            <h3 class="pet-name-title">{{ post.petName || post.ownerName }}</h3>
            <span v-if="post.petBreed" class="breed-badge">{{ post.petBreed }}</span>
            <span v-if="post.isAnonymous" class="ghost-tag">👻 Incognito</span>
          </div>

          <div class="guardian-date-sub">
            <span class="guardian-name">Guardian: {{ post.ownerName }}</span>
            <span class="dot-divider">•</span>
            <span class="entry-time">{{ post.createdAt }}</span>
          </div>
        </div>
      </div>

      <div class="header-right-tools">
        <span v-if="post.petMood" class="mood-stamp-pill">{{ post.petMood }}</span>
        <button class="options-menu-btn" title="Options">
          <MoreHorizontal :size="17" />
        </button>
      </div>
    </header>

    <!-- 2. Editorial Photo Frame -->
    <div class="editorial-media-wrapper" @dblclick="handleDoubleTap">
      <img :src="post.mediaUrls[0]" :alt="post.caption" class="editorial-photo" />

      <!-- Location & Climate Pin -->
      <div v-if="post.location" class="photo-corner-tag">
        <MapPin :size="11" />
        <span>{{ post.location }}</span>
      </div>

      <!-- Multi-photo Count -->
      <div v-if="post.mediaUrls.length > 1" class="multi-page-pill">
        <span>1 / {{ post.mediaUrls.length }} Pages</span>
      </div>

      <!-- Minimal Double-Tap Reaction Pop -->
      <transition name="minimal-pop">
        <div v-if="burstReaction" class="reaction-burst-box">
          <span class="burst-emoji-icon">{{ getReactionEmoji(burstReaction) }}</span>
          <span class="burst-text-label">{{ getReactionLabel(burstReaction) }}</span>
        </div>
      </transition>
    </div>

    <!-- 3. Pet's Inner Monologue Dialogue (Distinct Nuzzle Feature) -->
    <div v-if="post.petDialogue || getPetThought(post)" class="inner-monologue-banner">
      <span class="thought-bubble-icon">💭</span>
      <div class="thought-body">
        <span class="thought-speaker">{{ post.petName || 'Pet' }}'s diary thought:</span>
        <p class="thought-text">"{{ post.petDialogue || getPetThought(post) }}"</p>
      </div>
    </div>

    <!-- 4. Caption & Collar Tag Chips -->
    <div class="scrapbook-caption-section">
      <p class="main-caption-text">
        <strong class="caption-guardian-prefix" @click="handleProfileClick">{{ post.ownerName }}</strong>
        {{ post.caption }}
      </p>

      <div v-if="post.hashtags && post.hashtags.length" class="collar-chips-row">
        <span 
          v-for="tag in post.hashtags" 
          :key="tag" 
          class="collar-tag"
          @click="exploreTag(tag)"
        >
          🏷️ #{{ tag }}
        </span>
      </div>
    </div>

    <!-- 5. FACEBOOK-STYLE REACTIONS SUMMARY BAR -->
    <div class="fb-summary-bar">
      <div class="top-emojis-preview" v-if="totalReactionsCount > 0">
        <span class="emoji-stack-icons">
          <span v-if="(post.reactions?.paw || 0) > 0" class="mini-react-bubble paw">🐾</span>
          <span v-if="(post.reactions?.nuzzle || 0) > 0" class="mini-react-bubble nuzzle">💜</span>
          <span v-if="(post.reactions?.treat || 0) > 0" class="mini-react-bubble treat">🦴</span>
          <span v-if="(post.reactions?.ball || 0) > 0" class="mini-react-bubble ball">🎾</span>
          <span v-if="(post.reactions?.purr || 0) > 0" class="mini-react-bubble purr">😻</span>
        </span>
        <span class="total-reacts-label">{{ totalReactionsCount }}</span>
      </div>
      <div v-else class="top-emojis-preview no-reacts">
        <span>🐾 Be the first to react</span>
      </div>

      <div class="comments-counter-link" @click="openComments(post)">
        <span>{{ post.commentsCount }} barks</span>
      </div>
    </div>

    <!-- 6. FACEBOOK-STYLE ACTION BUTTONS ROW WITH FLOATING REACTION DOCK -->
    <div class="fb-action-row">
      <!-- React Anchor Container -->
      <div 
        class="react-button-anchor" 
        @mouseleave="onMouseLeaveAnchor"
      >
        <!-- Floating Facebook Reaction Dock -->
        <transition name="dock-pop">
          <div 
            v-if="isDockOpen" 
            class="fb-floating-dock"
            @mouseenter="onMouseEnterDock"
            @mouseleave="onMouseLeaveDock"
          >
            <!-- Dock Tooltip -->
            <div v-if="hoveredReaction" class="dock-tooltip-pill">
              {{ getReactionLabel(hoveredReaction) }}
            </div>

            <!-- Reaction 1: 🐾 Paw Five -->
            <button 
              class="dock-emoji-btn" 
              @click="chooseReaction('paw')"
              @mouseenter="hoveredReaction = 'paw'"
              @mouseleave="hoveredReaction = null"
              title="Paw Five"
            >
              <span class="dock-emoji">🐾</span>
            </button>

            <!-- Reaction 2: 💜 Nuzzle -->
            <button 
              class="dock-emoji-btn" 
              @click="chooseReaction('nuzzle')"
              @mouseenter="hoveredReaction = 'nuzzle'"
              @mouseleave="hoveredReaction = null"
              title="Nuzzle"
            >
              <span class="dock-emoji">💜</span>
            </button>

            <!-- Reaction 3: 🦴 Treat -->
            <button 
              class="dock-emoji-btn" 
              @click="chooseReaction('treat')"
              @mouseenter="hoveredReaction = 'treat'"
              @mouseleave="hoveredReaction = null"
              title="Give Treat"
            >
              <span class="dock-emoji">🦴</span>
            </button>

            <!-- Reaction 4: 🎾 Fetch -->
            <button 
              class="dock-emoji-btn" 
              @click="chooseReaction('ball')"
              @mouseenter="hoveredReaction = 'ball'"
              @mouseleave="hoveredReaction = null"
              title="Play Fetch"
            >
              <span class="dock-emoji">🎾</span>
            </button>

            <!-- Reaction 5: 😻 Purr -->
            <button 
              class="dock-emoji-btn" 
              @click="chooseReaction('purr')"
              @mouseenter="hoveredReaction = 'purr'"
              @mouseleave="hoveredReaction = null"
              title="Purr-fect"
            >
              <span class="dock-emoji">😻</span>
            </button>
          </div>
        </transition>

        <!-- Main React Button -->
        <button 
          class="fb-action-btn react-trigger" 
          :class="[
            post.selectedReaction ? `reacted-${post.selectedReaction}` : '',
            { active: post.isLiked }
          ]"
          @click="handleMainReactClick"
          @mouseenter="onMouseEnterButton"
        >
          <span class="btn-react-emoji">{{ currentActiveEmoji }}</span>
          <span class="btn-react-text">{{ currentActiveLabel }}</span>
        </button>
      </div>

      <!-- Comment / Bark Button -->
      <button class="fb-action-btn" @click="openComments(post)">
        <MessageCircle :size="17" />
        <span>Bark</span>
      </button>

      <!-- Share Button -->
      <button class="fb-action-btn" @click="sharePost(post)">
        <Send :size="16" />
        <span>Share</span>
      </button>

      <!-- Vault / Save Button -->
      <button 
        class="fb-action-btn bookmark-btn" 
        :class="{ active: post.isSaved }" 
        @click="handleSave"
      >
        <Bookmark :size="17" :fill="post.isSaved ? 'currentColor' : 'none'" />
        <span>Save</span>
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { MoreHorizontal, MessageCircle, Send, Bookmark, MapPin } from 'lucide-vue-next';
import type { Post, PetReactionType } from '../../types';
import { 
  reactToPost, 
  togglePostSave, 
  openComments, 
  activeProfileId, 
  setTab 
} from '../../stores/appStore';

const props = defineProps<{
  post: Post;
}>();

const isDockOpen = ref(false);
const hoveredReaction = ref<PetReactionType | null>(null);
const burstReaction = ref<PetReactionType | null>(null);
let closeTimer: ReturnType<typeof setTimeout> | null = null;

const totalReactionsCount = computed(() => {
  if (props.post.reactions) {
    const r = props.post.reactions;
    return (r.paw || 0) + (r.nuzzle || 0) + (r.treat || 0) + (r.ball || 0) + (r.purr || 0);
  }
  return props.post.likesCount || 0;
});

const currentActiveEmoji = computed(() => {
  if (!props.post.selectedReaction) return '🐾';
  return getReactionEmoji(props.post.selectedReaction);
});

const currentActiveLabel = computed(() => {
  if (!props.post.selectedReaction) return 'React';
  return getReactionLabel(props.post.selectedReaction);
});

function handleMainReactClick() {
  if (!isDockOpen.value) {
    isDockOpen.value = true;
  } else {
    // If dock is open and user clicks main button, toggle active or default reaction
    const target = props.post.selectedReaction || 'paw';
    chooseReaction(target);
  }
}

function onMouseEnterButton() {
  clearTimer();
  isDockOpen.value = true;
}

function onMouseLeaveAnchor() {
  startCloseTimer();
}

function onMouseEnterDock() {
  clearTimer();
  isDockOpen.value = true;
}

function onMouseLeaveDock() {
  startCloseTimer();
}

function startCloseTimer() {
  clearTimer();
  closeTimer = setTimeout(() => {
    isDockOpen.value = false;
    hoveredReaction.value = null;
  }, 450);
}

function clearTimer() {
  if (closeTimer) {
    clearTimeout(closeTimer);
    closeTimer = null;
  }
}

function chooseReaction(reaction: PetReactionType) {
  reactToPost(props.post.id, reaction);
  isDockOpen.value = false;
  hoveredReaction.value = null;
  triggerBurst(reaction);
}

function triggerBurst(reaction: PetReactionType) {
  burstReaction.value = reaction;
  setTimeout(() => {
    burstReaction.value = null;
  }, 750);
}

function handleDoubleTap() {
  const current = props.post.selectedReaction || 'nuzzle';
  chooseReaction(current);
}

function handleSave() {
  togglePostSave(props.post.id);
}

function handleProfileClick() {
  if (props.post.petId) {
    activeProfileId.value = props.post.petId;
  } else {
    activeProfileId.value = 'owner_me';
  }
  setTab('profile');
}

function exploreTag(_tag: string) {
  setTab('explore');
}

function sharePost(post: Post) {
  if (navigator.share) {
    navigator.share({
      title: `Nuzzle - ${post.petName || post.ownerName}'s post`,
      text: post.caption,
      url: window.location.href
    }).catch(() => {});
  } else {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard! 🐾');
  }
}

function getSpeciesEmoji(breed?: string): string {
  if (!breed) return '🐾';
  const b = breed.toLowerCase();
  if (b.includes('cat') || b.includes('kitten') || b.includes('persian') || b.includes('bengal')) return '🐱';
  if (b.includes('bird') || b.includes('parrot') || b.includes('kiwi')) return '🦜';
  if (b.includes('rabbit') || b.includes('bunny') || b.includes('lop')) return '🐰';
  return '🐕';
}

function getReactionEmoji(reaction: PetReactionType): string {
  switch (reaction) {
    case 'paw': return '🐾';
    case 'nuzzle': return '💜';
    case 'treat': return '🦴';
    case 'ball': return '🎾';
    case 'purr': return '😻';
    default: return '🐾';
  }
}

function getReactionLabel(reaction: PetReactionType): string {
  switch (reaction) {
    case 'paw': return 'Paw Five';
    case 'nuzzle': return 'Nuzzled';
    case 'treat': return 'Treated';
    case 'ball': return 'Fetch';
    case 'purr': return 'Purr-fect';
    default: return 'Loved';
  }
}

function getPetThought(post: Post): string {
  if (post.petDialogue) return post.petDialogue;
  const name = post.petName || 'I';
  if (post.caption.toLowerCase().includes('park') || post.caption.toLowerCase().includes('run')) {
    return `${name}: "I ran at maximum velocity and investigated 14 distinct smells."`;
  }
  if (post.caption.toLowerCase().includes('nap') || post.caption.toLowerCase().includes('sleep')) {
    return `${name}: "I have selected the sunniest spot on the carpet and declared it my kingdom."`;
  }
  if (post.caption.toLowerCase().includes('treat') || post.caption.toLowerCase().includes('food')) {
    return `${name}: "The human opened the snack cupboard. I am deploying the puppy eyes."`;
  }
  return `${name}: "Living my best life today. 10/10 would wag tail again!"`;
}
</script>

<style scoped>
.pet-scrapbook-card {
  background: var(--bg-card);
  border: 1.5px solid var(--border-subtle);
  border-radius: 20px;
  margin: 10px 12px 18px;
  overflow: visible; /* Important for floating Facebook reaction dock */
  box-shadow: 
    0 8px 24px -4px rgba(148, 125, 238, 0.09),
    0 1px 3px rgba(0, 0, 0, 0.03);
  position: relative;
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease;
}

.pet-scrapbook-card:hover {
  box-shadow: 
    0 12px 32px -4px rgba(148, 125, 238, 0.16),
    0 2px 8px rgba(0, 0, 0, 0.04);
}

/* 1. Header */
.scrapbook-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px 10px;
}

.pet-author-group {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  flex: 1;
}

.scrapbook-avatar-frame {
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  padding: 2px;
  background: linear-gradient(135deg, #947DEE 0%, #F59E0B 100%);
  flex-shrink: 0;
}

.pet-avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--bg-card);
}

.species-badge {
  position: absolute;
  bottom: -2px;
  right: -3px;
  width: 17px;
  height: 17px;
  border-radius: 50%;
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  display: grid;
  place-items: center;
  font-size: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}

.pet-diary-meta {
  display: flex;
  flex-direction: column;
}

.diary-title-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.pet-name-title {
  font-size: 14.5px;
  font-weight: 800;
  color: var(--ink-primary);
  letter-spacing: -0.01em;
}

.breed-badge {
  font-size: 11px;
  font-weight: 600;
  color: var(--brand-primary);
}

.ghost-tag {
  font-size: 9.5px;
  font-weight: 800;
  color: #fff;
  background: #7C3AED;
  padding: 1px 6px;
  border-radius: var(--radius-full);
}

.guardian-date-sub {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: var(--ink-muted);
}

.guardian-name {
  font-weight: 600;
  color: var(--ink-secondary);
}

.dot-divider {
  opacity: 0.5;
}

.header-right-tools {
  display: flex;
  align-items: center;
  gap: 6px;
}

.mood-stamp-pill {
  font-size: 10.5px;
  font-weight: 700;
  color: #6D28D9;
  background: #F3EEFF;
  border: 1px solid #DDD6FE;
  padding: 3px 8px;
  border-radius: var(--radius-full);
}

.options-menu-btn {
  color: var(--ink-muted);
  padding: 5px;
  border-radius: 50%;
  transition: all 0.15s ease;
}

.options-menu-btn:hover {
  background: var(--bg-card-subtle);
  color: var(--ink-primary);
}

/* 2. Photo Showcase */
.editorial-media-wrapper {
  position: relative;
  width: calc(100% - 16px);
  margin: 0 8px;
  aspect-ratio: 4 / 3;
  border-radius: 16px;
  overflow: hidden;
  background: var(--bg-card-subtle);
  user-select: none;
}

.editorial-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.25s ease;
}

.photo-corner-tag {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(26, 18, 42, 0.72);
  color: #ffffff;
  font-size: 10.5px;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: var(--radius-full);
  backdrop-filter: blur(8px);
}

.multi-page-pill {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(26, 18, 42, 0.72);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: var(--radius-full);
  backdrop-filter: blur(8px);
}

/* Minimal Pop burst on double tap */
.reaction-burst-box {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(148, 125, 238, 0.16);
  backdrop-filter: blur(2px);
  pointer-events: none;
  animation: miniPop 0.75s ease forwards;
}

.burst-emoji-icon {
  font-size: 44px;
}

.burst-text-label {
  font-size: 12px;
  font-weight: 800;
  color: var(--brand-primary);
  background: #fff;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  margin-top: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

@keyframes miniPop {
  0% { transform: scale(0.4); opacity: 0; }
  50% { transform: scale(1.15); opacity: 1; }
  80% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.05); opacity: 0; }
}

/* 3. Thought Dialogue */
.inner-monologue-banner {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  background: linear-gradient(135deg, #FAF7FF 0%, #F5EEFF 100%);
  border: 1.5px dashed #D8B4FE;
  border-radius: 12px;
  padding: 8px 12px;
  margin: 10px 12px 4px;
}

:global([data-theme='dark']) .inner-monologue-banner {
  background: rgba(42, 23, 72, 0.4);
  border-color: rgba(192, 132, 252, 0.4);
}

.thought-bubble-icon {
  font-size: 15px;
  flex-shrink: 0;
  margin-top: 1px;
}

.thought-body {
  display: flex;
  flex-direction: column;
}

.thought-speaker {
  font-size: 9.5px;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--brand-primary);
  letter-spacing: 0.03em;
}

.thought-text {
  font-size: 12px;
  font-style: italic;
  color: var(--ink-primary);
  line-height: 1.35;
  margin-top: 1px;
}

/* 4. Caption & Collar tags */
.scrapbook-caption-section {
  padding: 6px 14px 8px;
}

.main-caption-text {
  font-size: 13px;
  line-height: 1.45;
  color: var(--ink-primary);
}

.caption-guardian-prefix {
  font-weight: 800;
  margin-right: 4px;
  cursor: pointer;
}

.collar-chips-row {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 6px;
}

.collar-tag {
  font-size: 11px;
  font-weight: 700;
  color: #7C3AED;
  background: #FAF5FF;
  border: 1px solid #E9D5FF;
  padding: 2px 7px;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all 0.15s ease;
}

.collar-tag:hover {
  background: #F3EEFF;
  border-color: #C084FC;
}

/* 5. FACEBOOK-STYLE REACTIONS SUMMARY BAR */
.fb-summary-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 14px;
  margin: 0 4px;
  border-top: 1px solid var(--border-light);
  border-bottom: 1px solid var(--border-light);
  font-size: 11.5px;
}

.top-emojis-preview {
  display: flex;
  align-items: center;
  gap: 4px;
}

.emoji-stack-icons {
  display: flex;
  align-items: center;
  gap: 1px;
}

.mini-react-bubble {
  font-size: 13px;
  display: inline-block;
  margin-right: -2px;
}

.total-reacts-label {
  font-weight: 700;
  color: var(--ink-secondary);
  margin-left: 4px;
}

.no-reacts {
  color: var(--ink-muted);
}

.comments-counter-link {
  font-weight: 600;
  color: var(--ink-muted);
  cursor: pointer;
  transition: color 0.15s ease;
}

.comments-counter-link:hover {
  color: var(--brand-primary);
}

/* 6. FACEBOOK-STYLE ACTION BUTTONS & FLOATING REACTION DOCK */
.fb-action-row {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 6px 8px;
  position: relative;
}

.react-button-anchor {
  position: relative;
  display: inline-flex;
}

.fb-action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 12.5px;
  font-weight: 700;
  color: var(--ink-secondary);
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  background: transparent;
  transition: all 0.15s ease;
  user-select: none;
  cursor: pointer;
}

.fb-action-btn:hover {
  background: var(--bg-card-subtle);
  color: var(--brand-primary);
}

.fb-action-btn:active {
  transform: scale(0.96);
}

/* React Button Active Themes */
.react-trigger.reacted-paw {
  color: #7C3AED;
}

.react-trigger.reacted-nuzzle {
  color: #DB2777;
}

.react-trigger.reacted-treat {
  color: #D97706;
}

.react-trigger.reacted-ball {
  color: #059669;
}

.react-trigger.reacted-purr {
  color: #4F46E5;
}

.btn-react-emoji {
  font-size: 15px;
}

.bookmark-btn.active {
  color: var(--brand-primary);
}

/* FLOATING FACEBOOK REACTION DOCK */
.fb-floating-dock {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(148, 125, 238, 0.3);
  border-radius: 32px;
  padding: 4px 8px;
  box-shadow: 
    0 12px 30px -4px rgba(45, 25, 80, 0.22),
    0 2px 8px rgba(148, 125, 238, 0.15);
  z-index: 90;
  transform-origin: bottom left;
}

:global([data-theme='dark']) .fb-floating-dock {
  background: rgba(28, 21, 43, 0.98);
  border-color: rgba(169, 149, 246, 0.3);
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.65);
}

.dock-tooltip-pill {
  position: absolute;
  top: -28px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(26, 18, 42, 0.9);
  color: #ffffff;
  font-size: 10.5px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  white-space: nowrap;
  pointer-events: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.dock-emoji-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: transparent;
  cursor: pointer;
  transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.15s ease;
}

.dock-emoji {
  font-size: 20px;
  transition: transform 0.15s ease;
}

.dock-emoji-btn:hover {
  transform: scale(1.35) translateY(-5px);
  background: rgba(148, 125, 238, 0.12);
}

.dock-emoji-btn:active {
  transform: scale(1.1) translateY(-2px);
}

/* Minimal smooth transition for dock */
.dock-pop-enter-active {
  animation: minimalDockIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.dock-pop-leave-active {
  animation: minimalDockOut 0.15s ease-in forwards;
}

@keyframes minimalDockIn {
  0% { transform: scale(0.8) translateY(6px); opacity: 0; }
  100% { transform: scale(1) translateY(0); opacity: 1; }
}

@keyframes minimalDockOut {
  0% { transform: scale(1) translateY(0); opacity: 1; }
  100% { transform: scale(0.85) translateY(4px); opacity: 0; }
}
</style>
