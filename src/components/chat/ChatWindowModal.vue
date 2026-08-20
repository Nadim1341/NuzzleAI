<template>
  <div v-if="activeChat" class="chat-modal-view">
    <!-- Header -->
    <div class="chat-top-header">
      <button class="btn-icon" @click="closeChat">
        <ArrowLeft :size="20" />
      </button>

      <div class="participant-info">
        <div class="avatar-holder">
          <img :src="activeChat.participantAvatar" :alt="activeChat.participantName" class="chat-avatar" />
          <div v-if="activeChat.isOnline" class="online-indicator"></div>
        </div>
        <div class="names-col">
          <span class="p-name">{{ activeChat.participantName }}</span>
          <span class="p-status">
            {{ activeChat.isOnline ? 'Online now' : 'Last seen recently' }} 
            <span v-if="activeChat.petName">• {{ activeChat.petName }}</span>
          </span>
        </div>
      </div>

      <div class="header-call-btns">
        <button class="btn-icon" title="Voice Call">
          <Phone :size="18" />
        </button>
        <button class="btn-icon" title="Video Call">
          <Video :size="19" />
        </button>
      </div>
    </div>

    <!-- Messages Body -->
    <div class="chat-messages-container" ref="messagesBox">
      <!-- Conversation Start Pill -->
      <div class="conversation-starter-pill">
        🔒 End-to-end encrypted • Messaging for PetSocial community
      </div>

      <div 
        v-for="msg in activeChat.messages" 
        :key="msg.id"
        class="message-wrapper"
        :class="{ outgoing: msg.isSelf, incoming: !msg.isSelf }"
      >
        <div class="message-bubble">
          <p class="message-text">{{ msg.body }}</p>
          <span class="message-timestamp">{{ msg.timestamp }}</span>
        </div>
      </div>
    </div>

    <!-- Quick Suggested Replies -->
    <div class="quick-chips-row">
      <button 
        v-for="chip in quickChips" 
        :key="chip"
        class="quick-chip"
        @click="sendQuickText(chip)"
      >
        {{ chip }}
      </button>
    </div>

    <!-- Chat Input Bar -->
    <div class="chat-input-bar">
      <button class="attach-btn" @click="sendSticker('🐾')">
        🐾
      </button>

      <input 
        v-model="inputMessage" 
        placeholder="Type a message..." 
        class="chat-text-input"
        @keyup.enter="handleSend"
      />

      <button 
        class="send-message-btn" 
        :disabled="!inputMessage.trim()"
        @click="handleSend"
      >
        <Send :size="18" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { ArrowLeft, Send, Phone, Video } from 'lucide-vue-next';
import { activeChat, closeChat, sendMessageToActiveChat } from '../../stores/appStore';

const inputMessage = ref('');
const messagesBox = ref<HTMLElement | null>(null);

const quickChips = [
  '🐶 Let\'s do a dog park playdate!',
  '🩺 Is this still available?',
  '🐾 What a cutie!',
  '📍 What neighborhood are you in?'
];

function handleSend() {
  if (!inputMessage.value.trim()) return;
  sendMessageToActiveChat(inputMessage.value);
  inputMessage.value = '';
  scrollToBottom();
}

function sendQuickText(text: string) {
  sendMessageToActiveChat(text);
  scrollToBottom();
}

function sendSticker(emoji: string) {
  sendMessageToActiveChat(emoji);
  scrollToBottom();
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesBox.value) {
      messagesBox.value.scrollTop = messagesBox.value.scrollHeight;
    }
  });
}
</script>

<style scoped>
.chat-modal-view {
  position: absolute;
  inset: 0;
  background: var(--bg-app);
  z-index: 130;
  display: flex;
  flex-direction: column;
}

.chat-top-header {
  height: 60px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-glass);
  border-bottom: 1px solid var(--border-light);
  backdrop-filter: blur(16px);
}

.participant-info {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.avatar-holder {
  position: relative;
}

.chat-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
}

.online-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--accent-emerald);
  border: 2px solid var(--bg-card);
}

.names-col {
  display: flex;
  flex-direction: column;
}

.p-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--ink-primary);
}

.p-status {
  font-size: 11px;
  color: var(--ink-muted);
}

.header-call-btns {
  display: flex;
  align-items: center;
  gap: 2px;
}

.chat-messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.conversation-starter-pill {
  align-self: center;
  font-size: 11px;
  color: var(--ink-muted);
  background: var(--bg-card-subtle);
  padding: 5px 12px;
  border-radius: var(--radius-full);
  margin-bottom: 8px;
  text-align: center;
}

.message-wrapper {
  display: flex;
  width: 100%;
}

.message-wrapper.outgoing {
  justify-content: flex-end;
}

.message-wrapper.incoming {
  justify-content: flex-start;
}

.message-bubble {
  max-width: 76%;
  padding: 10px 14px;
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.outgoing .message-bubble {
  background: var(--brand-primary);
  color: #ffffff;
  border-bottom-right-radius: 4px;
}

.incoming .message-bubble {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  color: var(--ink-primary);
  border-bottom-left-radius: 4px;
}

.message-text {
  font-size: 13.5px;
  line-height: 1.45;
}

.message-timestamp {
  font-size: 9.5px;
  align-self: flex-end;
  opacity: 0.7;
}

.quick-chips-row {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding: 8px 14px;
  scrollbar-width: none;
  background: var(--bg-card-subtle);
  border-top: 1px solid var(--border-light);
}

.quick-chips-row::-webkit-scrollbar {
  display: none;
}

.quick-chip {
  flex-shrink: 0;
  font-size: 11.5px;
  font-weight: 600;
  padding: 5px 10px;
  border-radius: var(--radius-full);
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  color: var(--ink-secondary);
}

.chat-input-bar {
  padding: 10px 14px 20px;
  background: var(--bg-card);
  display: flex;
  align-items: center;
  gap: 8px;
}

.attach-btn {
  font-size: 18px;
  padding: 6px;
}

.chat-text-input {
  flex: 1;
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-full);
  padding: 10px 16px;
  font-size: 13.5px;
  color: var(--ink-primary);
  outline: none;
}

.send-message-btn {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: var(--brand-primary);
  color: #fff;
  display: grid;
  place-items: center;
}

.send-message-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
