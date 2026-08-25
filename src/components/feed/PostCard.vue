<template>
  <article class="clean-post-card">
    <!-- Clean Author Header -->
    <header class="post-header">
      <div class="author-info" @click="handleProfileClick">
        <div class="avatar-wrap">
          <img :src="post.petAvatar || post.ownerAvatar" :alt="post.petName || post.ownerName" class="author-avatar" />
          <span v-if="post.isAnonymous" class="ghost-badge">👻</span>
        </div>

        <div class="author-meta">
          <div class="name-line">
            <h3 class="author-name">{{ post.petName || post.ownerName }}</h3>
            <span v-if="post.petBreed" class="breed-subtext">• {{ post.petBreed }}</span>
          </div>
          <div class="sub-line">
            <span class="author-byline">{{ post.ownerName }}</span>
            <span class="dot-sep">·</span>
            <span class="post-time">{{ post.createdAt }}</span>
          </div>
        </div>
      </div>

      <button class="more-btn" title="Options">
        <MoreHorizontal :size="18" />
      </button>
    </header>

    <!-- Clean Media Container -->
    <div class="post-media-box" @dblclick="handleDoubleTap">
      <img :src="post.mediaUrls[0]" :alt="post.caption" class="post-image" />
      
      <!-- Subtle Location Tag -->
      <div v-if="post.location" class="location-badge">
        <MapPin :size="11" />
        <span>{{ post.location }}</span>
      </div>

      <!-- Carousel indicator if multi-photo -->
      <div v-if="post.mediaUrls.length > 1" class="carousel-pill">
        1/{{ post.mediaUrls.length }}
      </div>

      <!-- Double Tap Heart Burst Animation -->
      <transition name="heart-pop">
        <div v-if="showHeartBurst" class="heart-burst-overlay">
          <span class="burst-icon">🐾</span>
        </div>
      </transition>
    </div>

    <!-- Clean Action Toolbar -->
    <div class="post-actions-bar">
      <div class="left-actions">
        <!-- Like / Paw React -->
        <button 
          class="action-btn react-btn" 
          :class="{ active: post.isLiked }" 
          @click="handleLike"
        >
          <span class="paw-icon">🐾</span>
          <span class="action-count">{{ post.likesCount }}</span>
        </button>

        <!-- Comments -->
        <button class="action-btn comment-btn" @click="openComments(post)">
          <MessageCircle :size="19" />
          <span class="action-count">{{ post.commentsCount }}</span>
        </button>

        <!-- Share -->
        <button class="action-btn share-btn" @click="sharePost(post)">
          <Send :size="18" />
        </button>
      </div>

      <!-- Bookmark -->
      <button 
        class="action-btn bookmark-btn" 
        :class="{ active: post.isSaved }" 
        @click="handleSave"
      >
        <Bookmark :size="19" :fill="post.isSaved ? 'currentColor' : 'none'" />
      </button>
    </div>

    <!-- Clean Caption & Hashtags -->
    <div class="post-content-body">
      <p class="caption-text">
        <strong class="caption-author" @click="handleProfileClick">{{ post.petName || post.ownerName }}</strong>
        {{ post.caption }}
      </p>

      <!-- Clean Inline Hashtags -->
      <div v-if="post.hashtags && post.hashtags.length" class="hashtags-list">
        <span 
          v-for="tag in post.hashtags" 
          :key="tag" 
          class="hashtag-item"
          @click="exploreTag(tag)"
        >
          #{{ tag }}
        </span>
      </div>

      <!-- Subtle Comments Trigger -->
      <button 
        v-if="post.commentsCount > 0" 
        class="view-comments-link" 
        @click="openComments(post)"
      >
        View all {{ post.commentsCount }} comments
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { MoreHorizontal, MessageCircle, Send, Bookmark, MapPin } from 'lucide-vue-next';
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

const showHeartBurst = ref(false);

function handleLike() {
  reactToPost(props.post.id, 'paw');
}

function handleSave() {
  togglePostSave(props.post.id);
}

function handleDoubleTap() {
  reactToPost(props.post.id, 'nuzzle');
  showHeartBurst.value = true;
  setTimeout(() => {
    showHeartBurst.value = false;
  }, 750);
}

function handleProfileClick() {
  if (props.post.petId) {
    activeProfileId.value = props.post.petId;
  } else {
    activeProfileId.value = 'owner_me';
  }
  setTab('profile');
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
    alert('Link copied to clipboard!');
  }
}

function exploreTag(_tag: string) {
  setTab('explore');
}
</script>

<style scoped>
.clean-post-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  margin-bottom: 16px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

/* 1. Clean Header */
.post-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.avatar-wrap {
  position: relative;
  width: 40px;
  height: 40px;
}

.author-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 1.5px solid var(--border-subtle);
}

.ghost-badge {
  position: absolute;
  bottom: -2px;
  right: -2px;
  font-size: 11px;
  background: #7C3AED;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  display: grid;
  place-items: center;
  border: 1.5px solid var(--bg-card);
}

.author-meta {
  display: flex;
  flex-direction: column;
}

.name-line {
  display: flex;
  align-items: center;
  gap: 5px;
}

.author-name {
  font-size: 13.5px;
  font-weight: 800;
  color: var(--ink-primary);
}

.breed-subtext {
  font-size: 11.5px;
  font-weight: 600;
  color: var(--brand-primary);
}

.sub-line {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: var(--ink-muted);
}

.author-byline {
  color: var(--ink-secondary);
}

.dot-sep {
  opacity: 0.6;
}

.more-btn {
  color: var(--ink-muted);
  padding: 4px;
  border-radius: 50%;
  transition: all 0.15s ease;
}

.more-btn:hover {
  color: var(--ink-primary);
  background: var(--bg-card-subtle);
}

/* 2. Media Box */
.post-media-box {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  background: var(--bg-card-subtle);
  overflow: hidden;
  user-select: none;
}

.post-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.location-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(26, 18, 42, 0.65);
  color: #fff;
  font-size: 10.5px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: var(--radius-full);
  backdrop-filter: blur(6px);
}

.carousel-pill {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(26, 18, 42, 0.65);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: var(--radius-full);
  backdrop-filter: blur(6px);
}

/* Heart Pop Burst */
.heart-burst-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(148, 125, 238, 0.18);
  pointer-events: none;
}

.burst-icon {
  font-size: 54px;
  animation: heartZoom 0.75s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

@keyframes heartZoom {
  0% { transform: scale(0.2); opacity: 0; }
  45% { transform: scale(1.2); opacity: 1; }
  80% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.15); opacity: 0; }
}

/* 3. Action Toolbar */
.post-actions-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px 6px;
}

.left-actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--ink-secondary);
  font-size: 12.5px;
  font-weight: 700;
  transition: all 0.15s ease;
  padding: 2px;
}

.action-btn:hover {
  color: var(--brand-primary);
  transform: translateY(-1px);
}

.paw-icon {
  font-size: 17px;
  transition: transform 0.15s ease;
}

.react-btn.active .paw-icon {
  transform: scale(1.15);
}

.react-btn.active {
  color: var(--brand-primary);
}

.bookmark-btn.active {
  color: var(--brand-primary);
}

/* 4. Caption Body */
.post-content-body {
  padding: 0 14px 14px;
}

.caption-text {
  font-size: 13px;
  line-height: 1.45;
  color: var(--ink-primary);
}

.caption-author {
  font-weight: 800;
  margin-right: 4px;
  cursor: pointer;
}

.hashtags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
}

.hashtag-item {
  font-size: 12px;
  font-weight: 600;
  color: var(--brand-primary);
  cursor: pointer;
  transition: opacity 0.15s ease;
}

.hashtag-item:hover {
  opacity: 0.8;
}

.view-comments-link {
  font-size: 12px;
  font-weight: 600;
  color: var(--ink-muted);
  margin-top: 6px;
  display: block;
  transition: color 0.15s ease;
}

.view-comments-link:hover {
  color: var(--brand-primary);
}
</style>

