<template>
  <div class="marketplace-view">
    <TopBar title="🛍️ Pet Supplies & Gear Market" />

    <div class="market-scroll-body">
      <!-- Search & Quick Sell Row -->
      <div class="market-top-action">
        <div class="search-box">
          <Search :size="16" class="s-icon" />
          <input v-model="marketSearch" placeholder="Search pet beds, treats, toys..." class="s-input" />
        </div>
        <button class="btn-solid sell-fast-btn" @click="isCreateSheetOpen = true">
          + Sell
        </button>
      </div>

      <!-- Categories -->
      <div class="filter-chips-row">
        <button 
          v-for="cat in categories" 
          :key="cat"
          class="filter-chip"
          :class="{ active: selectedCat === cat }"
          @click="selectedCat = cat"
        >
          {{ cat }}
        </button>
      </div>

      <!-- Items Grid -->
      <div class="items-grid">
        <div 
          v-for="item in filteredItems" 
          :key="item.id"
          class="market-card card-item"
        >
          <div class="item-img-container">
            <img :src="item.imageUrl" :alt="item.title" class="item-img" />
            <span class="price-badge">${{ item.price }}</span>
            <span class="condition-badge">{{ item.condition }}</span>
          </div>

          <div class="item-details">
            <h4 class="item-title">{{ item.title }}</h4>
            <span class="item-category">{{ item.category }} • {{ item.location }}</span>
            <p class="item-desc">{{ item.description }}</p>

            <div class="seller-row">
              <img :src="item.sellerAvatar" :alt="item.sellerName" class="seller-avatar" />
              <span class="seller-name">{{ item.sellerName }}</span>
            </div>

            <button class="btn-solid message-seller-btn" @click="contactSeller(item)">
              <MessageSquare :size="15" />
              <span>Contact Seller</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Search, MessageSquare } from 'lucide-vue-next';
import TopBar from '../components/layout/TopBar.vue';
import { marketplace, openChatWith, isCreateSheetOpen } from '../stores/appStore';
import type { MarketplaceListing } from '../types';

const marketSearch = ref('');
const selectedCat = ref('All');
const categories = ['All', 'Beds & Cages', 'Toys', 'Food & Treats', 'Apparel', 'Grooming'];

const filteredItems = computed(() => {
  return marketplace.filter(item => {
    const matchCat = selectedCat.value === 'All' || item.category === selectedCat.value;
    const matchSearch = !marketSearch.value || item.title.toLowerCase().includes(marketSearch.value.toLowerCase());
    return matchCat && matchSearch;
  });
});

function contactSeller(item: MarketplaceListing) {
  openChatWith(
    item.sellerName,
    item.sellerAvatar,
    undefined,
    `Hi ${item.sellerName}! I saw your listing for "${item.title}" ($${item.price}). Is it still available?`
  );
}
</script>

<style scoped>
.marketplace-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.market-scroll-body {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px 28px;
}

.market-top-action {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 6px;
}

.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-card);
  border: 1.5px solid var(--border-light);
  border-radius: var(--radius-full);
  padding: 8px 14px;
}

.s-icon {
  color: var(--ink-muted);
}

.s-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 13px;
  color: var(--ink-primary);
}

.sell-fast-btn {
  font-size: 12.5px;
  padding: 8px 14px;
  border-radius: var(--radius-full);
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 14px;
  margin-top: 6px;
}

.market-card {
  overflow: hidden;
}

.item-img-container {
  position: relative;
  width: 100%;
  height: 180px;
}

.item-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.price-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: var(--brand-primary);
  color: #fff;
  font-weight: 800;
  font-size: 13px;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.condition-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.65);
  color: #fff;
  font-size: 10.5px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: var(--radius-full);
  backdrop-filter: blur(4px);
}

.item-details {
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.item-title {
  font-size: 15px;
  font-weight: 800;
  color: var(--ink-primary);
}

.item-category {
  font-size: 11.5px;
  font-weight: 600;
  color: var(--ink-muted);
}

.item-desc {
  font-size: 12.5px;
  color: var(--ink-secondary);
  line-height: 1.4;
}

.seller-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.seller-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.seller-name {
  font-size: 12px;
  color: var(--ink-secondary);
  font-weight: 600;
}

.message-seller-btn {
  width: 100%;
  margin-top: 6px;
  padding: 9px;
  font-size: 13px;
}
</style>
