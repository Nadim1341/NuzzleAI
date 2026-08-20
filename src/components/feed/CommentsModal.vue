<template>
  <div v-if="isCommentsModalOpen && activePostForComments" class="modal-scrim" @click.self="closeComments">
    <div class="bottom-sheet comments-sheet">
      <div class="sheet-handle"></div>

      <!-- Sheet Header -->
      <div class="sheet-header">
        <h3 class="sheet-title">Comments ({{ activePostForComments.commentsCount }})</h3>
        <button class="btn-icon" @click="closeComments">
          <X :size="20" />
        </button>
      </div>

      <!-- Comments List -->
      <div class="comments-scroll-list">
        <div v-if="activePostForComments.comments.length === 0" class="empty-comments">
          <MessageCircle :size="32" class="empty-icon" />
          <p>No comments yet. Be the first to say something nice! 🐾</p>
        </div>

        <div 
          v-for="c in activePostForComments.comments" 
          :key="c.id" 
          class="comment-row"
        >
          <img :src="c.authorAvatar" :alt="c.authorName" class="comment-avatar" />
          <div class="comment-content">
            <div class="comment-meta">
              <span class="comment-author">{{ c.authorName }}</span>
              <span v-if="c.isPet" class="pet-badge">🐾 Pet</span>
              <span class="comment-time">{{ c.createdAt }}</span>
            </div>
            <p class="comment-body">{{ c.body }}</p>
          </div>
          <button class="comment-like-btn">
            <Heart :size="14" />
            <span v-if="c.likesCount > 0">{{ c.likesCount }}</span>
          </button>
        </div>
      </div>

      <!-- Identity Switcher & Comment Input -->
      <div class="comment-input-bar">
        <!-- Post As Switcher -->
        <div class="identity-switch">
          <span class="as-label">Comment as:</span>
          <button 
            class="identity-chip" 
            :class="{ active: !postAsPet }"
            @click="postAsPet = false"
          >
            {{ owner.displayName.split(' ')[0] }} (You)
          </button>
          <button 
            v-if="pets.length > 0"
            class="identity-chip" 
            :class="{ active: postAsPet }"
            @click="postAsPet = true"
          >
            🐾 {{ pets[0].name }}
          </button>
        </div>

        <div class="input-action-row">
          <input 
            v-model="newCommentText" 
            placeholder="Add a comment for the pet..." 
            class="comment-input-field"
            @keyup.enter="handleSend"
          />
          <button 
            class="send-btn" 
            :disabled="!newCommentText.trim()"
            @click="handleSend"
          >
            <Send :size="18" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { X, Send, Heart, MessageCircle } from 'lucide-vue-next';
import { 
  isCommentsModalOpen, 
  activePostForComments, 
  closeComments, 
  addComment, 
  owner, 
  pets 
} from '../../stores/appStore';

const newCommentText = ref('');
const postAsPet = ref(false);

function handleSend() {
  if (!activePostForComments.value || !newCommentText.value.trim()) return;
  addComment(activePostForComments.value.id, newCommentText.value, postAsPet.value);
  newCommentText.value = '';
}
</script>

<style scoped>
.comments-sheet {
  height: 70%;
}

.sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 18px;
  border-bottom: 1px solid var(--border-light);
}

.sheet-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--ink-primary);
}

.comments-scroll-list {
  flex: 1;
  overflow-y: auto;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.empty-comments {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 40px 20px;
  color: var(--ink-muted);
  text-align: center;
  font-size: 13.5px;
}

.empty-icon {
  opacity: 0.5;
}

.comment-row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.comment-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
}

.comment-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 2px;
}

.comment-author {
  font-size: 13px;
  font-weight: 700;
  color: var(--ink-primary);
}

.pet-badge {
  font-size: 10px;
  font-weight: 700;
  background: var(--brand-soft);
  color: var(--brand-primary);
  padding: 1px 5px;
  border-radius: var(--radius-full);
}

.comment-time {
  font-size: 11px;
  color: var(--ink-muted);
}

.comment-body {
  font-size: 13px;
  color: var(--ink-secondary);
  line-height: 1.4;
}

.comment-like-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  color: var(--ink-muted);
  font-size: 10px;
  padding: 4px;
}

.comment-input-bar {
  padding: 10px 16px 20px;
  border-top: 1px solid var(--border-light);
  background: var(--bg-card);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.identity-switch {
  display: flex;
  align-items: center;
  gap: 6px;
}

.as-label {
  font-size: 11px;
  color: var(--ink-muted);
}

.identity-chip {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: var(--radius-full);
  background: var(--bg-card-subtle);
  color: var(--ink-secondary);
  border: 1px solid transparent;
}

.identity-chip.active {
  background: var(--brand-soft);
  color: var(--brand-primary);
  border-color: var(--brand-primary);
  font-weight: 700;
}

.input-action-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.comment-input-field {
  flex: 1;
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-full);
  padding: 9px 16px;
  font-size: 13.5px;
  outline: none;
  color: var(--ink-primary);
}

.send-btn {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: var(--brand-primary);
  color: #fff;
  display: grid;
  place-items: center;
  transition: opacity 0.15s ease;
}

.send-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
