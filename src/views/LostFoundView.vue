<template>
  <div class="lostfound-view">
    <TopBar title="🚨 Lost & Found Emergency Center" />

    <div class="lf-scroll-body">
      <!-- Top Alert Notice -->
      <div class="lf-header-card">
        <div class="lf-shield-icon">🚨</div>
        <div class="lf-header-text">
          <h3 class="lf-title">Community Pet Alert Network</h3>
          <p class="lf-desc">Instant alerts sent to all pet owners within a 5-mile radius.</p>
        </div>
        <button class="btn-solid report-fast-btn" @click="isCreateSheetOpen = true">
          + Report
        </button>
      </div>

      <!-- Filter Tabs -->
      <div class="filter-chips-row">
        <button 
          class="filter-chip" 
          :class="{ active: filterStatus === 'all' }"
          @click="filterStatus = 'all'"
        >
          All Alerts ({{ lostFoundList.length }})
        </button>
        <button 
          class="filter-chip" 
          :class="{ active: filterStatus === 'lost' }"
          @click="filterStatus = 'lost'"
        >
          🚨 Missing / Lost ({{ lostCount }})
        </button>
        <button 
          class="filter-chip" 
          :class="{ active: filterStatus === 'found' }"
          @click="filterStatus = 'found'"
        >
          🐾 Found Pets ({{ foundCount }})
        </button>
      </div>

      <!-- Alerts List -->
      <div class="alerts-list">
        <div 
          v-for="item in filteredList" 
          :key="item.id"
          class="alert-card card-item"
        >
          <!-- Status Banner -->
          <div class="alert-status-header" :class="item.status">
            <span class="status-title-text">
              {{ item.status === 'lost' ? '🚨 LOST PET ALERT' : '🐾 FOUND PET REPORT' }}
            </span>
            <span v-if="item.reward" class="reward-pill">{{ item.reward }}</span>
            <span v-else class="time-reported">{{ item.reportedAt }}</span>
          </div>

          <!-- Pet Media & Main Info -->
          <div class="alert-body-content">
            <div class="alert-img-holder">
              <img :src="item.imageUrl" :alt="item.petName" class="alert-pet-img" />
            </div>

            <div class="alert-details">
              <h4 class="pet-name-heading">{{ item.petName }}</h4>
              <span class="pet-species-breed">{{ item.species }} • {{ item.breed || 'Unknown breed' }}</span>
              
              <div class="location-row">
                <MapPin :size="14" class="loc-icon" />
                <span class="location-text">{{ item.location }}</span>
              </div>

              <p class="description-text">{{ item.description }}</p>
            </div>
          </div>

          <!-- Contact & Action Footer -->
          <div class="alert-actions-footer">
            <div class="contact-name-info">
              <span class="c-label">Reported by:</span>
              <span class="c-val">{{ item.contactName }}</span>
            </div>

            <div class="action-buttons-group">
              <button class="btn-outline contact-call-btn" @click="callOwner(item.contactPhone)">
                <Phone :size="15" />
                <span>Call</span>
              </button>

              <button class="btn-solid contact-chat-btn" @click="chatOwner(item)">
                <MessageCircle :size="15" />
                <span>Message</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { MapPin, Phone, MessageCircle } from 'lucide-vue-next';
import TopBar from '../components/layout/TopBar.vue';
import { lostFoundList, openChatWith, isCreateSheetOpen } from '../stores/appStore';
import type { LostFoundPost } from '../types';

const filterStatus = ref<'all' | 'lost' | 'found'>('all');

const lostCount = computed(() => lostFoundList.filter(i => i.status === 'lost').length);
const foundCount = computed(() => lostFoundList.filter(i => i.status === 'found').length);

const filteredList = computed(() => {
  if (filterStatus.value === 'all') return lostFoundList;
  return lostFoundList.filter(i => i.status === filterStatus.value);
});

function callOwner(phone: string) {
  alert(`Connecting phone call to: ${phone}`);
}

function chatOwner(item: LostFoundPost) {
  openChatWith(
    item.contactName, 
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    item.petName,
    `Hi ${item.contactName}, I have info regarding ${item.petName} (${item.status})!`
  );
}
</script>

<style scoped>
.lostfound-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.lf-scroll-body {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px 28px;
}

.lf-header-card {
  background: linear-gradient(135deg, #FFF1F2, #FFE4E6);
  border: 1.5px solid #FDA4AF;
  border-radius: var(--radius-lg);
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.lf-shield-icon {
  font-size: 26px;
}

.lf-header-text {
  flex: 1;
}

.lf-title {
  font-size: 14px;
  font-weight: 800;
  color: #9F1239;
}

.lf-desc {
  font-size: 11.5px;
  color: #BE123C;
  line-height: 1.35;
}

.report-fast-btn {
  background: #E11D48;
  font-size: 12.5px;
  padding: 8px 14px;
  border-radius: var(--radius-full);
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 8px;
}

.alert-card {
  overflow: hidden;
}

.alert-status-header {
  padding: 8px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11.5px;
  font-weight: 800;
  letter-spacing: 0.03em;
}

.alert-status-header.lost {
  background: #FFE4E6;
  color: #BE123C;
  border-bottom: 1px solid #FECDD3;
}

.alert-status-header.found {
  background: #D1FAE5;
  color: #047857;
  border-bottom: 1px solid #A7F3D0;
}

.reward-pill {
  background: #FEE2E2;
  border: 1px solid #EF4444;
  color: #DC2626;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  font-size: 11px;
}

.alert-body-content {
  display: flex;
  gap: 12px;
  padding: 14px;
}

.alert-img-holder {
  width: 95px;
  height: 95px;
  border-radius: var(--radius-md);
  overflow: hidden;
  flex-shrink: 0;
}

.alert-pet-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.alert-details {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.pet-name-heading {
  font-size: 15px;
  font-weight: 800;
  color: var(--ink-primary);
}

.pet-species-breed {
  font-size: 12px;
  font-weight: 600;
  color: var(--brand-primary);
  margin-bottom: 4px;
}

.location-row {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11.5px;
  color: var(--ink-muted);
  margin-bottom: 6px;
}

.loc-icon {
  color: var(--accent-rose);
}

.description-text {
  font-size: 12px;
  color: var(--ink-secondary);
  line-height: 1.4;
}

.alert-actions-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: var(--bg-card-subtle);
  border-top: 1px solid var(--border-light);
}

.contact-name-info {
  display: flex;
  flex-direction: column;
}

.c-label {
  font-size: 10px;
  color: var(--ink-muted);
}

.c-val {
  font-size: 12px;
  font-weight: 700;
  color: var(--ink-primary);
}

.action-buttons-group {
  display: flex;
  gap: 8px;
}

.contact-call-btn, .contact-chat-btn {
  padding: 6px 12px;
  font-size: 12.5px;
  border-radius: var(--radius-full);
}
</style>
