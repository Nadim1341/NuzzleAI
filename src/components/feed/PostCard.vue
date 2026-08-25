<template>
  <article class="pet-moment-card">
    <!-- 1. Magazine-Style Pet Header -->
    <header class="moment-header">
      <div class="pet-profile-group" @click="handleProfileClick">
        <div class="avatar-ring-container">
          <img :src="post.petAvatar || post.ownerAvatar" :alt="post.petName || post.ownerName" class="pet-avatar-img" />
          <div class="species-badge">{{ getSpeciesEmoji(post.petBreed) }}</div>
        </div>

        <div class="pet-identity-text">
          <div class="primary-row">
            <h3 class="pet-main-name">{{ post.petName || post.ownerName }}</h3>
            <span v-if="post.isAnonymous" class="ghost-badge">👻 Anon Pet</span>
          </div>
          <div class="byline-row">
            <span class="owner-byline">by {{ post.ownerName }}</span>
            <span class="dot-separator">•</span>
            <span class="post-time">{{ post.createdAt }}</span>
          </div>
        </div>
      </div>

      <!-- Quick Action Menu -->
      <button class="menu-dots-btn" title="Post Options">
        <MoreHorizontal :size="19" />
      </button>
    </header>

    <!-- 2. Pet Mood & Soundbite Bar -->
    <div v-if="post.petMood || post.petSoundBite" class="pet-vibe-bar">
      <div v-if="post.petMood" class="pet-mood-pill">
        <span>{{ post.petMood }}</span>
      </div>
      <div v-if="post.petSoundBite" class="soundbite-pill">
        <Volume2 :size="12" class="pulse-sound-icon" />
        <span>{{ post.petSoundBite }}</span>
      </div>
    </div>

    <!-- 3. Organic Media Container -->
    <div class="moment-media-frame" @dblclick="handleDoubleTap">
      <img :src="post.mediaUrls[0]" :alt="post.caption" class="moment-img" />
      
      <!-- Floating Location Tag Pill -->
      <div v-if="post.location" class="floating-location-pill">
        <MapPin :size="11" />
        <span>{{ post.location }}</span>
      </div>

      <!-- Tagged Pet / Breed Pill -->
      <div v-if="post.petBreed" class="floating-breed-pill">
        <span>🐾 {{ post.petBreed }}</span>
      </div>

      <!-- Celebratory Double Tap Reaction Burst -->
      <transition name="reaction-burst-trans">
        <div v-if="burstReaction" class="burst-overlay">
          <div class="burst-content">
            <span class="burst-emoji">{{ getReactionEmoji(burstReaction) }}</span>
            <span class="burst-label">{{ getReactionLabel(burstReaction) }}!</span>
          </div>
        </div>
      </transition>

      <div v-if="post.mediaUrls.length > 1" class="carousel-badge">
        1/{{ post.mediaUrls.length }}
      </div>
    </div>

    <!-- 4. FACEBOOK-STYLE PET REACTION DOCK & ACTIONS -->
    <div class="pet-actions-container">
      <!-- Reaction Count Summary Header -->
      <div class="reactions-summary-bar">
        <div class="top-emojis-cluster">
          <span class="cluster-icon">🐾</span>
          <span class="cluster-icon">💜</span>
          <span class="cluster-icon">🦴</span>
          <span class="total-reacts-count">{{ totalReactionsCount }} pet loves</span>
        </div>
        <div class="comments-counter-text" @click="openComments(post)">
          {{ post.commentsCount }} barks • {{ post.hashtags.length }} tags
        </div>
      </div>

      <!-- Primary Action Buttons Row -->
      <div class="main-actions-row">
        <!-- React Anchor (With Floating Facebook-Style Reaction Popover) -->
        <div 
          class="react-anchor"
          @mouseenter="onMouseEnterReact"
          @mouseleave="onMouseLeaveReact"
        >
          <!-- Floating Reaction Dock (Facebook Style) -->
          <transition name="dock-pop">
            <div 
              v-if="isDockOpen" 
              class="fb-reaction-dock"
              @mouseenter="clearDockTimeout"
              @mouseleave="startDockCloseTimeout"
            >
              <!-- 🐾 High Paw -->
              <button 
                class="dock-item-btn" 
                @click.stop="chooseReaction('paw')"
                @mouseenter="hoveredLabel = 'Paw Five!'"
                @mouseleave="hoveredLabel = ''"
              >
                <span class="dock-emoji">🐾</span>
              </button>

              <!-- 💜 Nuzzle -->
              <button 
                class="dock-item-btn" 
                @click.stop="chooseReaction('nuzzle')"
                @mouseenter="hoveredLabel = 'Nuzzle & Love!'"
                @mouseleave="hoveredLabel = ''"
              >
                <span class="dock-emoji">💜</span>
              </button>

              <!-- 🦴 Treat -->
              <button 
                class="dock-item-btn" 
                @click.stop="chooseReaction('treat')"
                @mouseenter="hoveredLabel = 'Give a Treat!'"
                @mouseleave="hoveredLabel = ''"
              >
                <span class="dock-emoji">🦴</span>
              </button>

              <!-- 🎾 Fetch -->
              <button 
                class="dock-item-btn" 
                @click.stop="chooseReaction('ball')"
                @mouseenter="hoveredLabel = 'Play Fetch!'"
                @mouseleave="hoveredLabel = ''"
              >
                <span class="dock-emoji">🎾</span>
              </button>

              <!-- 😻 Purr -->
              <button 
                class="dock-item-btn" 
                @click.stop="chooseReaction('purr')"
                @mouseenter="hoveredLabel = 'Head Scratches!'"
                @mouseleave="hoveredLabel = ''"
              >
                <span class="dock-emoji">😻</span>
              </button>

              <!-- Floating Tooltip Label -->
              <div v-if="hoveredLabel" class="dock-tooltip">
                {{ hoveredLabel }}
              </div>
            </div>
          </transition>

          <!-- Main Clickable Reaction Button -->
          <button 
            class="action-pill-btn react-trigger-btn"
            :class="[post.selectedReaction ? `reacted-${post.selectedReaction}` : '']"
            @click="handleMainReactClick"
          >
            <span class="btn-emoji-icon">{{ currentActiveEmoji }}</span>
            <span class="btn-text-label">{{ currentActiveLabel }}</span>
          </button>
        </div>

        <!-- 💬 Bark / Comment Button -->
        <button class="action-pill-btn" @click="openComments(post)">
          <MessageCircle :size="18" />
          <span>Bark</span>
        </button>

        <!-- 🚀 Share Button -->
        <button class="action-pill-btn" @click="sharePost">
          <Send :size="17" />
          <span>Share</span>
        </button>

        <!-- 🔖 Bookmark Save Button -->
        <button 
          class="action-pill-btn bookmark-pill" 
          :class="{ saved: post.isSaved }"
          @click="togglePostSave(post.id)"
          title="Save Post"
        >
          <Bookmark :size="18" :fill="post.isSaved ? 'currentColor' : 'none'" />
        </button>
      </div>
    </div>

    <!-- 5. Pet Thought Dialogue Bubble (If Available) -->
    <div v-if="post.petDialogue" class="pet-dialogue-card">
      <div class="dialogue-avatar">💭</div>
      <div class="dialogue-body">
        <span class="pet-speaker">{{ post.petName || 'Pet' }} thinks:</span>
        <p class="dialogue-quote">"{{ post.petDialogue }}"</p>
      </div>
    </div>

    <!-- 6. Owner Journal Entry & Hashtags -->
    <div class="moment-caption-body">
      <p class="journal-text">
        <span class="owner-prefix">{{ post.ownerName }}:</span>
        {{ post.caption }}
      </p>

      <div class="pet-tags-row">
        <span 
          v-for="tag in post.hashtags" 
          :key="tag" 
          class="pet-tag-chip"
          @click="filterByTag(tag)"
        >
          #{{ tag }}
        </span>
      </div>

      <!-- Quick Comments Section -->
      <div v-if="post.comments.length > 0" class="mini-comments-tray">
        <button class="view-all-barks-link" @click="openComments(post)">
          View all {{ post.commentsCount }} pet barks & purrs
        </button>
        <div class="sample-comment-line">
          <span class="commenter">{{ post.comments[post.comments.length - 1].authorName }}:</span>
          <span class="comment-text">{{ post.comments[post.comments.length - 1].body }}</span>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { MessageCircle, Send, Bookmark, MoreHorizontal, MapPin, Volume2 } from 'lucide-vue-next';
import type { Post, PetReactionType } from '../../types';
import { reactToPost, togglePostSave, openComments, setTab, activeHashtag } from '../../stores/appStore';

const props = defineProps<{
  post: Post;
}>();

const isDockOpen = ref(false);
const hoveredLabel = ref('');
const burstReaction = ref<PetReactionType | null>(null);
let dockTimeout: any = null;

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
    const targetReaction = props.post.selectedReaction || 'nuzzle';
    chooseReaction(targetReaction);
  }
}

function chooseReaction(reaction: PetReactionType) {
  reactToPost(props.post.id, reaction);
  isDockOpen.value = false;
  hoveredLabel.value = '';
  triggerBurst(reaction);
}

function onMouseEnterReact() {
  clearDockTimeout();
  isDockOpen.value = true;
}

function onMouseLeaveReact() {
  startDockCloseTimeout();
}

function startDockCloseTimeout() {
  clearDockTimeout();
  dockTimeout = setTimeout(() => {
    isDockOpen.value = false;
    hoveredLabel.value = '';
  }, 400);
}

function clearDockTimeout() {
  if (dockTimeout) {
    clearTimeout(dockTimeout);
    dockTimeout = null;
  }
}

function handleDoubleTap() {
  const current = props.post.selectedReaction || 'nuzzle';
  chooseReaction(current);
}

function triggerBurst(reaction: PetReactionType) {
  burstReaction.value = reaction;
  setTimeout(() => {
    burstReaction.value = null;
  }, 900);
}

function getSpeciesEmoji(breed?: string): string {
  if (!breed) return '🐾';
  const lower = breed.toLowerCase();
  if (lower.includes('cat') || lower.includes('bengal') || lower.includes('coon')) return '🐱';
  if (lower.includes('bird') || lower.includes('parrot') || lower.includes('conure')) return '🦜';
  if (lower.includes('bunny') || lower.includes('rabbit') || lower.includes('lop')) return '🐰';
  return '🐶';
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

function handleProfileClick() {
  setTab('profile');
}

function filterByTag(tag: string) {
  activeHashtag.value = tag;
  setTab('explore');
}

function sharePost() {
  if (navigator.share) {
    navigator.share({
      title: `${props.post.petName || 'Pet'} on Nuzzle`,
      text: props.post.caption,
      url: window.location.href
    }).catch(() => {});
  } else {
    alert('Nuzzle link copied to clipboard! 🐾');
  }
}
</script>

<style scoped>
.pet-moment-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 24px;
  margin: 10px 12px 16px;
  box-shadow: 
    0 10px 30px -4px rgba(148, 125, 238, 0.1),
    0 2px 6px rgba(0, 0, 0, 0.03);
  overflow: visible; /* Allows floating reaction dock to pop outside seamlessly */
  position: relative;
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease;
}

.pet-moment-card:hover {
  box-shadow: 
    0 14px 38px -4px rgba(148, 125, 238, 0.16),
    0 4px 10px rgba(0, 0, 0, 0.04);
}

/* 1. Header */
.moment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px 10px;
}

.pet-profile-group {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  flex: 1;
}

.avatar-ring-container {
  position: relative;
  width: 46px;
  height: 46px;
}

.pet-avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #EDE4FA;
  box-shadow: 0 2px 8px rgba(148, 125, 238, 0.2);
}

.species-badge {
  position: absolute;
  bottom: -3px;
  right: -3px;
  width: 19px;
  height: 19px;
  border-radius: 50%;
  background: #ffffff;
  display: grid;
  place-items: center;
  font-size: 11px;
  border: 1.5px solid #EDE4FA;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

.pet-identity-text {
  display: flex;
  flex-direction: column;
}

.primary-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.pet-main-name {
  font-size: 15px;
  font-weight: 800;
  color: var(--ink-primary);
  letter-spacing: -0.01em;
}

.ghost-badge {
  font-size: 10px;
  font-weight: 700;
  background: var(--bg-card-subtle);
  color: var(--ink-muted);
  padding: 2px 6px;
  border-radius: var(--radius-full);
}

.byline-row {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11.5px;
  color: var(--ink-muted);
  margin-top: 1px;
}

.owner-byline {
  font-weight: 600;
  color: var(--ink-secondary);
}

.dot-separator {
  opacity: 0.5;
}

.menu-dots-btn {
  color: var(--ink-muted);
  padding: 6px;
  border-radius: 50%;
  transition: background 0.15s ease;
}

.menu-dots-btn:hover {
  background: var(--bg-card-subtle);
  color: var(--ink-primary);
}

/* 2. Pet Vibe Bar */
.pet-vibe-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 16px 10px;
  overflow-x: auto;
  scrollbar-width: none;
}

.pet-vibe-bar::-webkit-scrollbar {
  display: none;
}

.pet-mood-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: linear-gradient(135deg, #F3EEFF 0%, #FAF5FF 100%);
  border: 1px solid #D5C8F2;
  color: #6B46C1;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  white-space: nowrap;
}

.soundbite-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-subtle);
  color: var(--ink-secondary);
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  white-space: nowrap;
}

.pulse-sound-icon {
  color: var(--brand-primary);
  animation: soundPulse 1.8s infinite;
}

@keyframes soundPulse {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.2); opacity: 1; color: #7C3AED; }
}

/* 3. Media Frame */
.moment-media-frame {
  position: relative;
  width: calc(100% - 16px);
  margin: 0 8px;
  aspect-ratio: 4 / 3;
  border-radius: 18px;
  overflow: hidden;
  background: var(--bg-card-subtle);
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.04);
  user-select: none;
}

.moment-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.floating-location-pill {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(26, 18, 42, 0.68);
  backdrop-filter: blur(8px);
  color: #ffffff;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 9px;
  border-radius: var(--radius-full);
}

.floating-breed-pill {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  color: var(--ink-primary);
  font-size: 11px;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: var(--radius-full);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
}

.carousel-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(26, 18, 42, 0.65);
  color: #fff;
  font-size: 10.5px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: var(--radius-full);
  backdrop-filter: blur(6px);
}

/* Burst Celebration */
.burst-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(148, 125, 238, 0.25);
  backdrop-filter: blur(2px);
  z-index: 20;
  pointer-events: none;
}

.burst-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.95);
  padding: 14px 22px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(148, 125, 238, 0.4);
  animation: burstZoom 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

.burst-emoji {
  font-size: 48px;
}

.burst-label {
  font-size: 13px;
  font-weight: 800;
  color: var(--brand-primary);
}

@keyframes burstZoom {
  0% { transform: scale(0.4); opacity: 0; }
  40% { transform: scale(1.15); opacity: 1; }
  80% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.1); opacity: 0; }
}

/* 4. FACEBOOK-STYLE ACTIONS & REACTION DOCK */
.pet-actions-container {
  padding: 10px 14px 4px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.reactions-summary-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px 6px;
  border-bottom: 1px solid var(--border-light);
  font-size: 12px;
}

.top-emojis-cluster {
  display: flex;
  align-items: center;
  gap: 2px;
}

.cluster-icon {
  font-size: 13px;
  margin-right: -2px;
}

.total-reacts-count {
  font-weight: 700;
  color: var(--ink-secondary);
  margin-left: 6px;
}

.comments-counter-text {
  font-weight: 600;
  color: var(--ink-muted);
  cursor: pointer;
  transition: color 0.15s ease;
}

.comments-counter-text:hover {
  color: var(--brand-primary);
}

.main-actions-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

/* React Anchor with Facebook Dock */
.react-anchor {
  position: relative;
  display: inline-flex;
}

.action-pill-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 700;
  color: var(--ink-secondary);
  padding: 8px 14px;
  border-radius: var(--radius-full);
  background: var(--bg-card-subtle);
  border: 1.5px solid var(--border-subtle);
  transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
  user-select: none;
}

.action-pill-btn:hover {
  background: #F4EEFF;
  border-color: #D5C8F2;
  color: var(--brand-primary);
  transform: translateY(-1px);
}

.action-pill-btn:active {
  transform: scale(0.95);
}

/* React Button Active Styles */
.react-trigger-btn {
  min-width: 105px;
  justify-content: center;
}

.react-trigger-btn.reacted-paw {
  background: #F3EEFF;
  border-color: #C4B5FD;
  color: #7C3AED;
}

.react-trigger-btn.reacted-nuzzle {
  background: #FDF2F8;
  border-color: #FBCFE8;
  color: #DB2777;
}

.react-trigger-btn.reacted-treat {
  background: #FFFBEB;
  border-color: #FDE68A;
  color: #D97706;
}

.react-trigger-btn.reacted-ball {
  background: #ECFDF5;
  border-color: #A7F3D0;
  color: #059669;
}

.react-trigger-btn.reacted-purr {
  background: #EEF2FF;
  border-color: #C7D2FE;
  color: #4F46E5;
}

.btn-emoji-icon {
  font-size: 15px;
  transition: transform 0.18s ease;
}

.action-pill-btn:hover .btn-emoji-icon {
  transform: scale(1.2);
}

.bookmark-pill.saved {
  color: var(--brand-primary);
  background: #F3EEFF;
  border-color: #D5C8F2;
}

/* FLOATING FACEBOOK DOCK */
.fb-reaction-dock {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(20px) saturate(200%);
  -webkit-backdrop-filter: blur(20px) saturate(200%);
  border: 1.5px solid rgba(148, 125, 238, 0.35);
  border-radius: 36px;
  padding: 6px 10px;
  box-shadow: 
    0 14px 34px -4px rgba(45, 25, 80, 0.25),
    0 4px 12px rgba(148, 125, 238, 0.2);
  z-index: 80;
  transform-origin: bottom left;
}

:global([data-theme='dark']) .fb-reaction-dock {
  background: rgba(28, 21, 43, 0.96);
  border-color: rgba(169, 149, 246, 0.35);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.65);
}

.dock-item-btn {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: transparent;
  cursor: pointer;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.15s ease;
}

.dock-emoji {
  font-size: 22px;
  transition: transform 0.2s ease;
}

.dock-item-btn:hover {
  transform: scale(1.42) translateY(-8px);
  background: rgba(148, 125, 238, 0.15);
}

.dock-item-btn:active {
  transform: scale(1.15) translateY(-4px);
}

.dock-tooltip {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(26, 18, 42, 0.88);
  backdrop-filter: blur(8px);
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: var(--radius-full);
  white-space: nowrap;
  pointer-events: none;
  animation: fadeIn 0.15s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

/* Dock Pop Transition */
.dock-pop-enter-active {
  animation: dockSpring 0.24s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

.dock-pop-leave-active {
  animation: dockFade 0.18s ease-in forwards;
}

@keyframes dockSpring {
  0% { transform: scale(0.6) translateY(12px); opacity: 0; }
  100% { transform: scale(1) translateY(0); opacity: 1; }
}

@keyframes dockFade {
  0% { transform: scale(1) translateY(0); opacity: 1; }
  100% { transform: scale(0.8) translateY(6px); opacity: 0; }
}

/* 5. Pet Thought Dialogue */
.pet-dialogue-card {
  display: flex;
  gap: 10px;
  background: linear-gradient(135deg, #FAF7FF 0%, #F5EFFF 100%);
  border: 1.5px dashed #D5C8F2;
  border-radius: 14px;
  padding: 10px 14px;
  margin: 4px 14px 8px;
}

:global([data-theme='dark']) .pet-dialogue-card {
  background: rgba(37, 29, 56, 0.6);
  border-color: #4A3A6B;
}

.dialogue-avatar {
  font-size: 18px;
  flex-shrink: 0;
  margin-top: 1px;
}

.dialogue-body {
  display: flex;
  flex-direction: column;
}

.pet-speaker {
  font-size: 10.5px;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--brand-primary);
  letter-spacing: 0.04em;
}

.dialogue-quote {
  font-size: 13px;
  font-style: italic;
  color: var(--ink-primary);
  line-height: 1.35;
  margin-top: 2px;
}

/* 6. Caption & Tags */
.moment-caption-body {
  padding: 4px 16px 14px;
}

.journal-text {
  font-size: 13.5px;
  line-height: 1.45;
  color: var(--ink-primary);
}

.owner-prefix {
  font-weight: 800;
  margin-right: 4px;
  color: var(--ink-primary);
}

.pet-tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.pet-tag-chip {
  font-size: 11.5px;
  font-weight: 700;
  color: var(--brand-primary);
  background: var(--bg-card-subtle);
  padding: 2px 8px;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: background 0.15s ease;
}

.pet-tag-chip:hover {
  background: #EDE4FA;
}

.mini-comments-tray {
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px solid var(--border-light);
}

.view-all-barks-link {
  font-size: 12px;
  font-weight: 700;
  color: var(--ink-muted);
  display: block;
  margin-bottom: 4px;
  transition: color 0.15s ease;
}

.view-all-barks-link:hover {
  color: var(--brand-primary);
}

.sample-comment-line {
  font-size: 12px;
  color: var(--ink-secondary);
}

.commenter {
  font-weight: 700;
  color: var(--ink-primary);
  margin-right: 4px;
}
</style>
