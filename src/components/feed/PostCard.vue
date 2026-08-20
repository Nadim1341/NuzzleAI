<template>
  <article class="post-card">
    <!-- Header -->
    <div class="post-header">
      <div class="post-avatar-wrapper" @click="handleProfileClick">
        <img :src="post.petAvatar || post.ownerAvatar" :alt="post.petName || post.ownerName" class="post-avatar" />
        <div v-if="post.petId" class="pet-paw-badge">🐾</div>
      </div>

      <div class="post-author-meta" @click="handleProfileClick">
        <div class="author-line">
          <span class="author-name">{{ post.petName || post.ownerName }}</span>
          <span v-if="post.isAnonymous" class="ghost-tag" title="Posted Anonymously">👻 Anon</span>
        </div>
        <div class="author-sub">
          <span v-if="post.petBreed" class="breed-name">{{ post.petBreed }} • </span>
          <span v-if="post.location" class="location-name">{{ post.location }} • </span>
          <span class="time-ago">{{ post.createdAt }}</span>
        </div>
      </div>

      <button class="more-btn">
        <MoreHorizontal :size="18" />
      </button>
    </div>

    <!-- Media Area (Double Tap to Like) -->
    <div class="post-media-area" @dblclick="handleDoubleTap">
      <img :src="post.mediaUrls[0]" :alt="post.caption" class="post-img" />
      
      <!-- Heart burst animation on double-tap -->
      <transition name="pop">
        <div v-if="showHeartBurst" class="heart-burst">
          <Heart :size="80" class="burst-icon" />
        </div>
      </transition>

      <div v-if="post.mediaUrls.length > 1" class="carousel-counter">
        1/{{ post.mediaUrls.length }}
      </div>
    </div>

    <!-- Actions Row -->
    <div class="post-actions-bar">
      <div class="action-buttons-group">
        <button 
          class="act-btn like-btn" 
          :class="{ liked: post.isLiked }"
          @click="togglePostLike(post.id)"
        >
          <Heart :size="22" :fill="post.isLiked ? 'currentColor' : 'none'" />
          <span class="count-num">{{ post.likesCount }}</span>
        </button>

        <button class="act-btn comment-btn" @click="openComments(post)">
          <MessageCircle :size="22" />
          <span class="count-num">{{ post.commentsCount }}</span>
        </button>

        <button class="act-btn share-btn" @click="sharePost">
          <Send :size="20" />
        </button>
      </div>

      <button 
        class="act-btn save-btn" 
        :class="{ saved: post.isSaved }"
        @click="togglePostSave(post.id)"
      >
        <Bookmark :size="22" :fill="post.isSaved ? 'currentColor' : 'none'" />
      </button>
    </div>

    <!-- Caption & Hashtags -->
    <div class="post-body-content">
      <p class="post-caption-text">
        <span class="caption-author">{{ post.ownerName }}:</span>
        {{ post.caption }}
      </p>

      <!-- Clickable Hashtags -->
      <div class="hashtags-list">
        <span 
          v-for="tag in post.hashtags" 
          :key="tag" 
          class="hashtag-tag"
          @click="filterByTag(tag)"
        >
          #{{ tag }}
        </span>
      </div>

      <!-- Quick Comments View -->
      <div v-if="post.comments.length > 0" class="comments-preview">
        <button class="view-all-comments" @click="openComments(post)">
          View all {{ post.commentsCount }} comments
        </button>
        <div class="latest-comment">
          <span class="commenter-name">{{ post.comments[post.comments.length - 1].authorName }}:</span>
          <span class="commenter-text">{{ post.comments[post.comments.length - 1].body }}</span>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-vue-next';
import type { Post } from '../../types';
import { togglePostLike, togglePostSave, openComments, setTab, activeHashtag } from '../../stores/appStore';

const props = defineProps<{
  post: Post;
}>();

const showHeartBurst = ref(false);

function handleDoubleTap() {
  if (!props.post.isLiked) {
    togglePostLike(props.post.id);
  }
  showHeartBurst.value = true;
  setTimeout(() => {
    showHeartBurst.value = false;
  }, 800);
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
      title: 'PetSocial Post',
      text: props.post.caption,
      url: window.location.href
    }).catch(() => {});
  } else {
    alert('Link copied to clipboard! 🐾');
  }
}
</script>

<style scoped>
.post-card {
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-light);
  margin-bottom: 8px;
}

.post-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
}

.post-avatar-wrapper {
  position: relative;
  cursor: pointer;
}

.post-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--border-light);
}

.pet-paw-badge {
  position: absolute;
  bottom: -2px;
  right: -2px;
  font-size: 11px;
  background: var(--brand-soft);
  border-radius: 50%;
  width: 17px;
  height: 17px;
  display: grid;
  place-items: center;
  border: 1.5px solid var(--bg-card);
}

.post-author-meta {
  flex: 1;
  cursor: pointer;
}

.author-line {
  display: flex;
  align-items: center;
  gap: 6px;
}

.author-name {
  font-weight: 700;
  font-size: 14px;
  color: var(--ink-primary);
}

.ghost-tag {
  font-size: 10px;
  font-weight: 700;
  background: var(--bg-card-subtle);
  color: var(--ink-muted);
  padding: 1px 6px;
  border-radius: var(--radius-full);
}

.author-sub {
  font-size: 11.5px;
  color: var(--ink-muted);
}

.breed-name {
  font-weight: 600;
  color: var(--brand-primary);
}

.more-btn {
  color: var(--ink-muted);
  padding: 4px;
}

.post-media-area {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  background-color: var(--bg-card-subtle);
  overflow: hidden;
  user-select: none;
}

.post-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.heart-burst {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 10;
}

.burst-icon {
  color: #ffffff;
  fill: #F43F5E;
  filter: drop-shadow(0 4px 12px rgba(244, 63, 94, 0.6));
}

.pop-enter-active, .pop-leave-active {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.pop-enter-from {
  transform: translate(-50%, -50%) scale(0.2);
  opacity: 0;
}

.pop-leave-to {
  transform: translate(-50%, -50%) scale(1.4);
  opacity: 0;
}

.carousel-counter {
  position: absolute;
  top: 10px;
  right: 12px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: var(--radius-full);
  backdrop-filter: blur(4px);
}

.post-actions-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px 4px;
}

.action-buttons-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.act-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--ink-primary);
  font-size: 13.5px;
  font-weight: 600;
  padding: 4px;
  transition: transform 0.12s ease;
}

.act-btn:active {
  transform: scale(0.88);
}

.like-btn.liked {
  color: var(--accent-rose);
}

.save-btn.saved {
  color: var(--brand-primary);
}

.count-num {
  font-size: 13px;
  font-weight: 600;
}

.post-body-content {
  padding: 4px 16px 14px;
}

.post-caption-text {
  font-size: 13.5px;
  line-height: 1.45;
  color: var(--ink-primary);
}

.caption-author {
  font-weight: 700;
  margin-right: 4px;
}

.hashtags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
}

.hashtag-tag {
  color: var(--brand-primary);
  font-weight: 600;
  font-size: 12.5px;
  cursor: pointer;
}

.hashtag-tag:hover {
  text-decoration: underline;
}

.comments-preview {
  margin-top: 8px;
}

.view-all-comments {
  color: var(--ink-muted);
  font-size: 12.5px;
  font-weight: 600;
  margin-bottom: 4px;
  display: block;
}

.latest-comment {
  font-size: 12.5px;
  color: var(--ink-secondary);
}

.commenter-name {
  font-weight: 700;
  margin-right: 4px;
  color: var(--ink-primary);
}
</style>
