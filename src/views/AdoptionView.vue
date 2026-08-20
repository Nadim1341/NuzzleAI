<template>
  <div class="adoption-view">
    <TopBar title="🐾 Pet Adoption Center" />

    <div class="adoption-scroll-body">
      <!-- Top Adoption Intro Banner -->
      <div class="adopt-banner">
        <div class="adopt-banner-text">
          <h3 class="adopt-banner-title">Find Your New Best Friend 🏡</h3>
          <p class="adopt-banner-sub">Verified shelters and foster parents looking for loving forever homes.</p>
        </div>
      </div>

      <!-- Species Filter Chips -->
      <div class="filter-chips-row">
        <button 
          v-for="s in speciesList" 
          :key="s"
          class="filter-chip"
          :class="{ active: selectedSpecies === s }"
          @click="selectedSpecies = s"
        >
          {{ s }}
        </button>
      </div>

      <!-- Adoption Cards -->
      <div class="adoptions-grid">
        <div 
          v-for="pet in filteredAdoptions" 
          :key="pet.id"
          class="adopt-card card-item"
        >
          <div class="adopt-image-container">
            <img :src="pet.imageUrl" :alt="pet.name" class="adopt-img" />
            <span class="adopt-status-badge" :class="pet.status">
              {{ pet.status.toUpperCase() }}
            </span>
            <span class="adopt-gender-badge">{{ pet.gender === 'Boy' ? '♂ Boy' : '♀ Girl' }}</span>
          </div>

          <div class="adopt-info-body">
            <div class="adopt-header-row">
              <div class="name-age">
                <h4 class="adopt-pet-name">{{ pet.name }}</h4>
                <span class="adopt-breed-age">{{ pet.breed }} • {{ pet.age }}</span>
              </div>
              <span v-if="pet.fee" class="adopt-fee">{{ pet.fee }}</span>
            </div>

            <!-- Health Badges -->
            <div class="health-badges-row">
              <span v-if="pet.isVaccinated" class="h-badge">✓ Vaccinated</span>
              <span v-if="pet.isNeutered" class="h-badge">✓ Spayed / Neutered</span>
            </div>

            <!-- Temperament Tags -->
            <div class="temperament-tags">
              <span v-for="tag in pet.temperament" :key="tag" class="temp-tag">
                #{{ tag }}
              </span>
            </div>

            <p class="adopt-desc">{{ pet.description }}</p>

            <div class="shelter-row">
              <Building :size="13" class="shelter-icon" />
              <span class="shelter-name">{{ pet.shelterName }} • {{ pet.location }}</span>
            </div>

            <button 
              class="btn-solid adopt-inquire-btn"
              :disabled="pet.status === 'adopted'"
              @click="inquireAboutPet(pet)"
            >
              <HeartHandshake :size="16" />
              <span>{{ pet.status === 'adopted' ? 'Happily Adopted ❤️' : 'Inquire & Meet ' + pet.name }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Building, HeartHandshake } from 'lucide-vue-next';
import TopBar from '../components/layout/TopBar.vue';
import { adoptions, openChatWith } from '../stores/appStore';
import type { AdoptionListing } from '../types';

const selectedSpecies = ref('All');
const speciesList = ['All', '🐕 Dogs', '🐱 Cats', '🐰 Rabbits', '🦜 Birds'];

const filteredAdoptions = computed(() => {
  if (selectedSpecies.value === 'All') return adoptions;
  const clean = selectedSpecies.value.replace(/[^a-zA-Z]/g, '').toLowerCase();
  return adoptions.filter(a => a.species.toLowerCase().includes(clean) || clean.includes(a.species.toLowerCase()));
});

function inquireAboutPet(pet: AdoptionListing) {
  openChatWith(
    pet.shelterName,
    pet.imageUrl,
    pet.name,
    `Hello! I'm very interested in adopting ${pet.name} (${pet.breed}). Could we arrange a meet and greet?`
  );
}
</script>

<style scoped>
.adoption-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.adoption-scroll-body {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px 28px;
}

.adopt-banner {
  background: linear-gradient(135deg, #FFF7ED, #FFEDD5);
  border: 1.5px solid #FED7AA;
  border-radius: var(--radius-lg);
  padding: 14px 16px;
  margin-bottom: 12px;
}

.adopt-banner-title {
  font-size: 15px;
  font-weight: 800;
  color: #C2410C;
}

.adopt-banner-sub {
  font-size: 12px;
  color: #EA580C;
  margin-top: 2px;
}

.adoptions-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 6px;
}

.adopt-card {
  overflow: hidden;
}

.adopt-image-container {
  position: relative;
  width: 100%;
  height: 200px;
}

.adopt-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.adopt-status-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: 10.5px;
  font-weight: 800;
  backdrop-filter: blur(8px);
}

.adopt-status-badge.available {
  background: rgba(16, 185, 129, 0.9);
  color: #fff;
}

.adopt-status-badge.pending {
  background: rgba(245, 158, 11, 0.9);
  color: #fff;
}

.adopt-status-badge.adopted {
  background: rgba(100, 116, 139, 0.9);
  color: #fff;
}

.adopt-gender-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: var(--radius-full);
  backdrop-filter: blur(4px);
}

.adopt-info-body {
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.adopt-header-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.adopt-pet-name {
  font-size: 16px;
  font-weight: 800;
  color: var(--ink-primary);
}

.adopt-breed-age {
  font-size: 12px;
  color: var(--ink-secondary);
}

.adopt-fee {
  font-size: 12px;
  font-weight: 700;
  color: var(--brand-primary);
  background: var(--brand-soft);
  padding: 3px 8px;
  border-radius: var(--radius-full);
}

.health-badges-row {
  display: flex;
  gap: 6px;
}

.h-badge {
  font-size: 11px;
  font-weight: 700;
  color: #047857;
  background: #D1FAE5;
  padding: 2px 8px;
  border-radius: var(--radius-full);
}

.temperament-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.temp-tag {
  font-size: 11px;
  font-weight: 600;
  color: var(--ink-muted);
  background: var(--bg-card-subtle);
  padding: 2px 7px;
  border-radius: 6px;
}

.adopt-desc {
  font-size: 12.5px;
  color: var(--ink-secondary);
  line-height: 1.4;
}

.shelter-row {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11.5px;
  color: var(--ink-muted);
}

.shelter-icon {
  color: var(--brand-primary);
}

.adopt-inquire-btn {
  width: 100%;
  margin-top: 4px;
}
</style>
