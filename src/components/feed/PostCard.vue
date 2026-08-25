<template>
  <article class="nuzzle-moment-card">
    <!-- 1. Pet Persona Header -->
    <header class="moment-header">
      <div class="pet-persona-badge" @click="handleProfileClick">
        <div class="collar-avatar-frame">
          <img :src="post.petAvatar || post.ownerAvatar" :alt="post.petName || post.ownerName" class="pet-photo" />
          <span class="species-charm">{{ getSpeciesCharm(post.petBreed) }}</span>
        </div>

        <div class="persona-identity">
          <div class="pet-name-line">
            <h3 class="pet-hero-name">{{ post.petName || post.ownerName }}</h3>
            <span v-if="post.petMood" class="mood-pill">{{ post.petMood }}</span>
            <span v-if="post.isAnonymous" class="ghost-incognito-tag">👻 Ghost</span>
          </div>
          
          <div class="guardian-meta-line">
            <span class="guardian-by">Guardian: {{ post.ownerName }}</span>
            <span class="meta-dot">·</span>
            <span class="moment-time">{{ post.createdAt }}</span>
          </div>
        </div>
      </div>

      <button class="card-options-btn" title="Options">
        <MoreHorizontal :size="18" />
      </button>
    </header>

    <!-- 2. The Moment Photo Showcase -->
    <div class="moment-photo-container" @dblclick="handleDoubleTap">
      <img :src="post.mediaUrls[0]" :alt="post.caption" class="moment-img" />

      <!-- Corner Vibe / Location Stamp -->
      <div v-if="post.location" class="corner-geo-stamp">
        <MapPin :size="11" />
        <span>{{ post.location }}</span>
      </div>

      <!-- Multi-photo Badge -->
      <div v-if="post.mediaUrls.length > 1" class="carousel-counter-charm">
        <span>📸 1/{{ post.mediaUrls.length }}</span>
      </div>

      <!-- Double Tap Golden Paw Stamp Burst -->
      <transition name="paw-stamp-pop">
        <div v-if="showPawBurst" class="paw-burst-overlay">
          <div class="paw-stamp-emblem">
            <span class="stamp-emoji">🐾</span>
            <span class="stamp-text">PAW BUMP!</span>
          </div>
        </div>
      </transition>
    </div>

    <!-- 3. Unique "Pet's Inner Monologue" Dialogue Card -->
    <div v-if="post.petDialogue || getPetThought(post)" class="pet-monologue-box">
      <div class="monologue-icon">💭</div>
      <div class="monologue-content">
        <span class="monologue-speaker">{{ post.petName || 'Pet' }}'s thoughts:</span>
        <p class="monologue-quote">"{{ post.petDialogue || getPetThought(post) }}"</p>
      </div>
    </div>

    <!-- 4. Pet-Centric Interaction Dock (High Paw, Toss Bone, Nuzzle, Barks) -->
    <div class="pet-interaction-dock">
      <div class="reactions-cluster">
        <!-- High Paw -->
        <button 
          class="pet-reaction-btn paw-btn" 
          :class="{ active: post.isLiked }"
          @click="handlePawBump"
          title="High Paw!"
        >
          <span class="r-icon">🐾</span>
          <span class="r-count">{{ post.likesCount }}</span>
        </button>

        <!-- Toss a Bone / Treat -->
        <button 
          class="pet-reaction-btn bone-btn" 
          :class="{ active: hasGivenBone }"
          @click="handleTossBone"
          title="Toss a Bone / Treat"
        >
          <span class="r-icon">🦴</span>
          <span class="r-count">{{ boneCount }}</span>
        </button>

        <!-- Nuzzle & Love -->
        <button 
          class="pet-reaction-btn nuzzle-btn" 
          :class="{ active: hasNuzzled }"
          @click="handleNuzzle"
          title="Give a Nuzzle"
        >
          <span class="r-icon">💜</span>
          <span class="r-count">{{ nuzzleCount }}</span>
        </button>

        <!-- Barks / Comments -->
        <button 
          class="pet-reaction-btn bark-btn" 
          @click="openComments(post)"
          title="Join the Bark Thread"
        >
          <MessageSquare :size="16" class="bark-svg-icon" />
          <span class="r-count">{{ post.commentsCount }}</span>
        </button>
      </div>

      <!-- Vault Save Bookmark -->
      <button 
        class="save-vault-btn" 
        :class="{ active: post.isSaved }" 
        @click="handleSave"
        title="Save to Pet Vault"
      >
        <Bookmark :size="18" :fill="post.isSaved ? 'currentColor' : 'none'" />
      </button>
    </div>

    <!-- 5. Guardian Caption & Collar Tag Chips -->
    <div class="moment-journal-body">
      <p class="journal-caption">
        <strong class="guardian-name" @click="handleProfileClick">{{ post.ownerName }}</strong>
        <span class="caption-text-content">{{ post.caption }}</span>
      </p>

      <!-- Bespoke Collar Tag Hashtags -->
      <div v-if="post.hashtags && post.hashtags.length" class="collar-tags-track">
        <span 
          v-for="tag in post.hashtags" 
          :key="tag" 
          class="collar-tag-chip"
          @click="exploreTag(tag)"
        >
          <span class="tag-bone">🏷️</span> #{{ tag }}
        </span>
      </div>

      <!-- Bark Thread Peek -->
      <button 
        v-if="post.commentsCount > 0" 
        class="open-bark-thread-btn" 
        @click="openComments(post)"
      >
        <span>🐾 View all {{ post.commentsCount }} barks in this thread</span>
        <ChevronRight :size="14" />
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { MoreHorizontal, Bookmark, MapPin, MessageSquare, ChevronRight } from 'lucide-vue-next';
import type { Post } from '../../types';
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

const showPawBurst = ref(false);
const hasGivenBone = ref(false);
const hasNuzzled = ref(false);
const boneCount = ref(14);
const nuzzleCount = ref(28);

function handlePawBump() {
  reactToPost(props.post.id, 'paw');
}

function handleTossBone() {
  hasGivenBone.value = !hasGivenBone.value;
  boneCount.value += hasGivenBone.value ? 1 : -1;
  triggerBurst();
}

function handleNuzzle() {
  hasNuzzled.value = !hasNuzzled.value;
  nuzzleCount.value += hasNuzzled.value ? 1 : -1;
  triggerBurst();
}

function handleDoubleTap() {
  reactToPost(props.post.id, 'paw');
  triggerBurst();
}

function triggerBurst() {
  showPawBurst.value = true;
  setTimeout(() => {
    showPawBurst.value = false;
  }, 850);
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

function getSpeciesCharm(breed?: string): string {
  if (!breed) return '🐾';
  const b = breed.toLowerCase();
  if (b.includes('cat') || b.includes('kitten') || b.includes('persian') || b.includes('bengal')) return '🐱';
  if (b.includes('bird') || b.includes('parrot') || b.includes('kiwi')) return '🦜';
  if (b.includes('rabbit') || b.includes('bunny') || b.includes('lop')) return '🐰';
  return '🐕';
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
.nuzzle-moment-card {
  background: var(--bg-card);
  border: 1.5px solid var(--border-subtle);
  border-radius: 22px;
  margin-bottom: 18px;
  overflow: hidden;
  box-shadow: 
    0 4px 20px -2px rgba(148, 125, 238, 0.08),
    0 1px 3px rgba(0, 0, 0, 0.03);
  position: relative;
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease;
}

.nuzzle-moment-card:hover {
  box-shadow: 
    0 8px 28px -4px rgba(148, 125, 238, 0.16),
    0 2px 8px rgba(0, 0, 0, 0.04);
}

/* 1. Pet Persona Header */
.moment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px 10px;
}

.pet-persona-badge {
  display: flex;
  align-items: center;
  gap: 11px;
  cursor: pointer;
  flex: 1;
}

.collar-avatar-frame {
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  padding: 2px;
  background: linear-gradient(135deg, #947DEE 0%, #F59E0B 100%);
  flex-shrink: 0;
}

.pet-photo {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--bg-card);
}

.species-charm {
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
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
}

.persona-identity {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.pet-name-line {
  display: flex;
  align-items: center;
  gap: 6px;
}

.pet-hero-name {
  font-size: 14.5px;
  font-weight: 800;
  color: var(--ink-primary);
  letter-spacing: -0.01em;
}

.mood-pill {
  font-size: 10.5px;
  font-weight: 700;
  color: #6D28D9;
  background: #F3EEFF;
  border: 1px solid #DDD6FE;
  padding: 2px 7px;
  border-radius: var(--radius-full);
}

.ghost-incognito-tag {
  font-size: 10px;
  font-weight: 800;
  color: #fff;
  background: #7C3AED;
  padding: 1px 6px;
  border-radius: var(--radius-full);
}

.guardian-meta-line {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: var(--ink-muted);
}

.guardian-by {
  font-weight: 600;
  color: var(--ink-secondary);
}

.meta-dot {
  opacity: 0.5;
}

.card-options-btn {
  color: var(--ink-muted);
  padding: 6px;
  border-radius: 50%;
  transition: all 0.15s ease;
}

.card-options-btn:hover {
  background: var(--bg-card-subtle);
  color: var(--ink-primary);
}

/* 2. Photo Showcase */
.moment-photo-container {
  position: relative;
  width: calc(100% - 16px);
  margin: 0 8px;
  aspect-ratio: 4 / 3;
  border-radius: 16px;
  overflow: hidden;
  background: var(--bg-card-subtle);
  user-select: none;
}

.moment-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.corner-geo-stamp {
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

.carousel-counter-charm {
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

/* Double-tap Golden Paw Stamp */
.paw-burst-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(148, 125, 238, 0.22);
  backdrop-filter: blur(2px);
  pointer-events: none;
  z-index: 10;
}

.paw-stamp-emblem {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid #F59E0B;
  padding: 12px 20px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(245, 158, 11, 0.35);
  animation: stampZoom 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

.stamp-emoji {
  font-size: 42px;
}

.stamp-text {
  font-size: 12px;
  font-weight: 900;
  color: #D97706;
  letter-spacing: 0.05em;
}

@keyframes stampZoom {
  0% { transform: scale(0.3) rotate(-15deg); opacity: 0; }
  45% { transform: scale(1.18) rotate(0deg); opacity: 1; }
  80% { transform: scale(1) rotate(0deg); opacity: 1; }
  100% { transform: scale(1.1) rotate(5deg); opacity: 0; }
}

/* 3. Pet's Inner Monologue */
.pet-monologue-box {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  background: linear-gradient(135deg, #FAF7FF 0%, #F5EEFF 100%);
  border: 1.5px dashed #D8B4FE;
  border-radius: 14px;
  padding: 9px 12px;
  margin: 10px 14px 4px;
}

:global([data-theme='dark']) .pet-monologue-box {
  background: rgba(42, 23, 72, 0.4);
  border-color: rgba(192, 132, 252, 0.4);
}

.monologue-icon {
  font-size: 16px;
  flex-shrink: 0;
  margin-top: 1px;
}

.monologue-content {
  display: flex;
  flex-direction: column;
}

.monologue-speaker {
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--brand-primary);
  letter-spacing: 0.03em;
}

.monologue-quote {
  font-size: 12px;
  font-style: italic;
  color: var(--ink-primary);
  line-height: 1.35;
  margin-top: 1px;
}

/* 4. Pet Interaction Dock */
.pet-interaction-dock {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px 4px;
}

.reactions-cluster {
  display: flex;
  align-items: center;
  gap: 6px;
}

.pet-reaction-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  border-radius: var(--radius-full);
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-light);
  color: var(--ink-secondary);
  font-size: 12px;
  font-weight: 700;
  transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
  user-select: none;
}

.pet-reaction-btn:hover {
  transform: translateY(-1px);
  border-color: var(--brand-primary);
}

.pet-reaction-btn:active {
  transform: scale(0.95);
}

.pet-reaction-btn.active {
  background: #F3EEFF;
  border-color: #C4B5FD;
  color: #7C3AED;
}

.r-icon {
  font-size: 14px;
}

.r-count {
  font-size: 11.5px;
}

.bark-svg-icon {
  color: var(--ink-muted);
}

.save-vault-btn {
  padding: 6px 8px;
  border-radius: var(--radius-full);
  color: var(--ink-muted);
  transition: all 0.15s ease;
}

.save-vault-btn:hover {
  color: var(--brand-primary);
  background: var(--bg-card-subtle);
}

.save-vault-btn.active {
  color: var(--brand-primary);
}

/* 5. Journal Body */
.moment-journal-body {
  padding: 4px 14px 14px;
}

.journal-caption {
  font-size: 13px;
  line-height: 1.45;
  color: var(--ink-primary);
}

.guardian-name {
  font-weight: 800;
  margin-right: 4px;
  cursor: pointer;
}

.collar-tags-track {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 8px;
}

.collar-tag-chip {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  font-weight: 700;
  color: #7C3AED;
  background: #FAF5FF;
  border: 1px solid #E9D5FF;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all 0.15s ease;
}

.collar-tag-chip:hover {
  background: #F3EEFF;
  border-color: #C084FC;
  transform: translateY(-1px);
}

.tag-bone {
  font-size: 10px;
}

.open-bark-thread-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-size: 11.5px;
  font-weight: 700;
  color: var(--ink-muted);
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px solid var(--border-light);
  transition: color 0.15s ease;
}

.open-bark-thread-btn:hover {
  color: var(--brand-primary);
}
</style>


