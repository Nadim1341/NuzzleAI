<template>
  <div class="pawai-view">
    <TopBar title="✨ PawAI Pet Intelligence" />

    <div class="ai-scroll-body">
      <!-- Hero Banner -->
      <div class="ai-hero-card">
        <div class="ai-glow-bg"></div>
        <div class="hero-left">
          <div class="ai-chip">
            <Sparkles :size="12" class="sparkle-icon" />
            <span>Next-Gen Pet AI</span>
          </div>
          <h2 class="ai-hero-title">PawAI Intelligence Suite</h2>
          <p class="ai-hero-sub">AI Vision scanner, Suggest Vet Pro Matcher & 24/7 triage.</p>
        </div>
        <div class="hero-robot-badge">🐾⚡</div>
      </div>

      <!-- Feature Tabs -->
      <div class="ai-tabs-row">
        <button 
          v-for="tab in aiTabs" 
          :key="tab.id"
          class="ai-tab-pill"
          :class="{ active: activeAiTab === tab.id }"
          @click="activeAiTab = tab.id as any"
        >
          <span class="t-emoji">{{ tab.emoji }}</span>
          <span>{{ tab.label }}</span>
        </button>
      </div>

      <!-- TAB 1: SUGGEST VET (AI PRIORITY MATCH ENGINE) -->
      <div v-if="activeAiTab === 'suggest_vet'" class="tab-pane">
        <!-- Pro Priority Explanation Banner -->
        <div class="vet-matcher-hero card-item">
          <div class="matcher-header-row">
            <div class="ai-pulse-badge">
              <span class="pulse-spark">✨</span>
              <span>AI Priority Matcher</span>
            </div>
            <span class="pro-priority-tag">⭐ Pro Subscribers Ranked #1</span>
          </div>
          <h3 class="matcher-main-title">Suggest Best-Fit Vet for Your Pet</h3>
          <p class="matcher-sub">
            PawAI analyzes your pet's species, symptoms, and urgency to find qualified clinics. Clinics with <strong>Nuzzle Pro Partner Subscriptions</strong> are prioritized at the top.
          </p>

          <!-- Criteria Selection Form -->
          <div class="matcher-filters-grid">
            <!-- 1. Select Pet -->
            <div class="filter-field">
              <label class="field-label">🐾 Target Pet</label>
              <select v-model="selectedPetId" class="field-select">
                <option v-for="p in pets" :key="p.id" :value="p.id">
                  {{ p.name }} ({{ p.species }} - {{ p.breed || 'Companion' }})
                </option>
              </select>
            </div>

            <!-- 2. Medical Concern / Specialty -->
            <div class="filter-field">
              <label class="field-label">🩺 Medical Need / Specialty</label>
              <select v-model="selectedMedicalNeed" class="field-select">
                <option value="All">All Routine & Wellness Needs</option>
                <option value="Emergency Surgery">🚨 Emergency Trauma & Surgery (24/7)</option>
                <option value="Dermatology & Allergies">🌿 Skin Itching, Allergies & Dermatology</option>
                <option value="Dental Scaling">🦷 Dental Scaling & Oral Surgery</option>
                <option value="Orthopedics & Joint Care">🦴 Joint Therapy, Limping & Orthopedics</option>
                <option value="Vaccinations">💉 Core Vaccines & Microchipping</option>
                <option value="Avian Medicine">🦜 Avian & Exotic Pet Specialization</option>
                <option value="Geriatric Care">👴 Senior & Geriatric Pet Wellness</option>
              </select>
            </div>

            <!-- 3. Distance Radius -->
            <div class="filter-field">
              <label class="field-label">📍 Distance Radius</label>
              <select v-model="selectedMaxDistance" class="field-select">
                <option :value="5">Within 5 Miles</option>
                <option :value="10">Within 10 Miles</option>
                <option :value="25">Within 25 Miles</option>
                <option :value="999">Any Distance</option>
              </select>
            </div>

            <!-- 4. Emergency Urgency Toggle -->
            <div class="filter-field emergency-toggle-field" :class="{ urgent: isEmergencyUrgent }">
              <label class="field-label">⚡ Urgent Triage</label>
              <button 
                type="button" 
                class="urgent-toggle-btn"
                :class="{ active: isEmergencyUrgent }"
                @click="isEmergencyUrgent = !isEmergencyUrgent"
              >
                <span>{{ isEmergencyUrgent ? '🚨 24/7 Emergency Mode' : 'Standard Booking' }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Matched Vets Results List -->
        <div class="suggested-vets-section">
          <div class="section-title-row">
            <h4 class="section-heading">
              🏥 Matched Vets ({{ suggestedVetsList.length }})
            </h4>
            <span class="sort-indicator">
              ⚡ Sorted by Pro Partner Priority & Criteria Match
            </span>
          </div>

          <div v-if="suggestedVetsList.length > 0" class="vets-cards-list">
            <div 
              v-for="(vet, idx) in suggestedVetsList" 
              :key="vet.id"
              class="suggested-vet-card"
              :class="{ 'pro-priority-card': vet.isProSubscriber }"
            >
              <!-- Pro Priority Header Badge -->
              <div v-if="vet.isProSubscriber" class="pro-partner-ribbon">
                <span class="ribbon-star">🌟</span>
                <span class="ribbon-text">NUZZLE PRO PRIORITY PARTNER • TOP MATCH #{{ idx + 1 }}</span>
              </div>

              <div class="vet-card-body">
                <div class="vet-top-info-row">
                  <img :src="vet.avatarUrl" :alt="vet.name" class="vet-avatar-img" />

                  <div class="vet-text-col">
                    <div class="vet-name-row">
                      <h4 class="vet-doctor-name">{{ vet.name }}</h4>
                      <span v-if="vet.isProSubscriber" class="pro-shield-badge" title="Verified Pro Subscriber">
                        ✓ PRO
                      </span>
                    </div>

                    <span class="vet-clinic-name">{{ vet.clinicName }}</span>

                    <div class="vet-meta-chips">
                      <span class="meta-chip rating">★ {{ vet.rating }} ({{ vet.reviewsCount }})</span>
                      <span class="meta-chip distance">📍 {{ vet.distanceMiles || 1.5 }} mi away</span>
                      <span v-if="vet.emergencyCare" class="meta-chip emergency">🚨 24/7 ICU</span>
                    </div>
                  </div>
                </div>

                <!-- AI Match Rationale Badge -->
                <div class="ai-match-rationale">
                  <span class="ai-brain-icon">🧠</span>
                  <span class="ai-rationale-text">
                    <strong>PawAI Match:</strong>
                    {{ getAiMatchReason(vet) }}
                  </span>
                </div>

                <!-- Specialties Chips -->
                <div class="vet-specialties-track">
                  <span 
                    v-for="spec in vet.specialties" 
                    :key="spec"
                    class="spec-chip"
                    :class="{ highlighted: isSpecialtyHighlighted(spec) }"
                  >
                    {{ spec }}
                  </span>
                </div>

                <!-- Available Slot & Action Buttons -->
                <div class="vet-card-footer">
                  <div class="next-slot-pill">
                    <span class="slot-dot"></span>
                    <span>Next Open: <strong>Tomorrow at 11:00 AM</strong></span>
                  </div>

                  <div class="vet-actions-btns">
                    <button class="btn-solid instant-book-btn" @click="handleBookSlot(vet)">
                      <Calendar :size="14" />
                      <span>Book Slot</span>
                    </button>
                    
                    <button class="btn-outline clinic-chat-btn" @click="contactClinic(vet)">
                      <Send :size="13" />
                      <span>Chat Clinic</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty Fallback -->
          <div v-else class="empty-vet-state">
            <span class="empty-emoji">🩺</span>
            <h4>No clinics match all selected filters</h4>
            <p>Try widening your distance radius or changing the medical specialty.</p>
            <button class="btn-solid reset-btn" @click="resetVetFilters">
              Reset Filters
            </button>
          </div>

          <!-- Pro Vet Clinic Subscription Promotion -->
          <div class="pro-clinic-enroll-card" @click="enrollClinicModal">
            <div class="enroll-left">
              <span class="enroll-icon">🏥⭐</span>
              <div>
                <h4 class="enroll-title">Are you a Veterinary Practice or Hospital?</h4>
                <p class="enroll-sub">
                  Join the <strong>Nuzzle Pro Partner Network ($49/mo)</strong> for #1 Priority Placement on PawAI Suggest Vet & Direct In-App Bookings.
                </p>
              </div>
            </div>
            <button class="enroll-btn">Join Pro Network →</button>
          </div>
        </div>
      </div>

      <!-- TAB 2: PET VISION & HEALTH SCANNER -->
      <div v-else-if="activeAiTab === 'scanner'" class="tab-pane">
        <div class="scanner-card card-item">
          <div class="scanner-viewport">
            <img 
              :src="scanImage" 
              alt="Scan pet" 
              class="scan-preview-img"
              :class="{ scanning: isAiScanning }"
            />

            <!-- Scan Laser Animation Overlay -->
            <div v-if="isAiScanning" class="scan-laser-line"></div>
            
            <div v-if="isAiScanning" class="scanning-badge">
              <div class="spinner-dot"></div>
              <span>AI Analyzing Biometrics & Coat...</span>
            </div>

            <div v-else-if="!currentScanResult" class="scan-prompt-overlay">
              <Camera :size="28" class="cam-icon" />
              <span>Tap 'Analyze Pet' to run AI Vision</span>
            </div>
          </div>

          <div class="scanner-actions-bar">
            <button 
              class="btn-solid scan-btn"
              :disabled="isAiScanning"
              @click="() => runAiPetScan()"
            >
              <Sparkles :size="16" />
              <span>{{ isAiScanning ? 'Processing Neural Scan...' : 'Analyze Pet with AI Vision' }}</span>
            </button>
          </div>

          <!-- Scan Results -->
          <div v-if="currentScanResult" class="scan-results-box">
            <div class="res-header">
              <div class="res-badge">
                <CheckCircle2 :size="15" />
                <span>{{ currentScanResult.breedMatch }}</span>
              </div>
              <span class="conf-score">{{ currentScanResult.confidence }}% Confidence</span>
            </div>

            <div class="mood-box">
              <span class="mood-lbl">🧠 Detected Mood:</span>
              <span class="mood-val">{{ currentScanResult.detectedMood }}</span>
            </div>

            <div class="observations-list">
              <h5 class="obs-title">🔍 Clinical Biometric Observations:</h5>
              <ul>
                <li v-for="(obs, i) in currentScanResult.healthObservations" :key="i">
                  ✓ {{ obs }}
                </li>
              </ul>
            </div>

            <div class="nutrition-box">
              <span class="nut-lbl">🥑 AI Dietary Recommendation:</span>
              <p class="nut-text">{{ currentScanResult.nutritionAdvice }}</p>
            </div>

            <!-- Quick Shortcut to Suggest Vet -->
            <button class="btn-solid suggest-vet-quick-btn" @click="activeAiTab = 'suggest_vet'">
              <span>🏥 Suggest Nearest Pro Vet for this Condition →</span>
            </button>
          </div>
        </div>
      </div>

      <!-- TAB 3: 24/7 SYMPTOM TRIAGE CHAT -->
      <div v-else-if="activeAiTab === 'triage'" class="tab-pane">
        <div class="triage-card card-item">
          <div class="triage-messages-container">
            <div 
              v-for="msg in aiTriageMessages" 
              :key="msg.id"
              class="triage-msg-row"
              :class="{ user: msg.sender === 'user', ai: msg.sender === 'ai' }"
            >
              <div v-if="msg.sender === 'ai'" class="ai-avatar-tiny">🩺</div>
              <div class="msg-bubble" :class="msg.severity || 'low'">
                <p class="msg-text">{{ msg.text }}</p>
                <span class="msg-time">{{ msg.timestamp }}</span>
              </div>
            </div>
          </div>

          <!-- Suggested Quick Prompts -->
          <div class="quick-prompts-track">
            <button 
              v-for="prompt in triagePrompts" 
              :key="prompt"
              class="prompt-pill"
              @click="handleTriagePrompt(prompt)"
            >
              {{ prompt }}
            </button>
          </div>

          <!-- Input Bar -->
          <div class="triage-input-bar">
            <input 
              v-model="triageInput" 
              placeholder="Ask symptoms e.g., 'Dog ate chocolate'..." 
              class="t-input"
              @keyup.enter="handleSendTriage"
            />
            <button class="btn-solid send-triage-btn" @click="handleSendTriage">
              <Send :size="16" />
            </button>
          </div>
        </div>
      </div>

      <!-- TAB 4: PET EMOTION & VOICE TRANSLATOR -->
      <div v-else-if="activeAiTab === 'translator'" class="tab-pane">
        <div class="translator-card card-item">
          <div class="translator-pulse-circle" :class="{ listening: isListening }">
            <button class="mic-trigger-btn" @click="toggleAudioListen">
              <Mic :size="32" class="mic-icon" />
            </button>
          </div>

          <span class="translator-status">
            {{ isListening ? '🐾 Listening to Pet Vocalizations & Barks...' : 'Tap Mic to Translate Pet Audio' }}
          </span>

          <div v-if="translatedThought" class="translation-output-bubble">
            <span class="bubble-tag">PET THOUGHT TRANSLATION:</span>
            <p class="translation-text">"{{ translatedThought }}"</p>
          </div>
        </div>
      </div>

      <!-- TAB 5: PLAYDATE COMPATIBILITY -->
      <div v-else-if="activeAiTab === 'matcher'" class="tab-pane">
        <div class="matcher-card card-item">
          <h4 class="matcher-title">⚡ AI Playdate Compatibility Engine</h4>
          <p class="matcher-sub">Calculates behavioral harmony, energy sync, and size safety.</p>

          <div class="match-vs-row">
            <div class="pet-pick-box">
              <img :src="pets[0].avatarUrl" alt="Waffles" class="m-avatar" />
              <span class="m-name">{{ pets[0].name }}</span>
              <span class="m-stat">⚡ High Zoomies</span>
            </div>

            <div class="vs-badge">VS</div>

            <div class="pet-pick-box">
              <img src="https://images.unsplash.com/photo-1612536057832-2ff7ead58194?w=200&auto=format&fit=crop&q=80" alt="Oliver" class="m-avatar" />
              <span class="m-name">Oliver (Corgi)</span>
              <span class="m-stat">⚡ Playful Scout</span>
            </div>
          </div>

          <div class="match-gauge-box">
            <div class="gauge-ring">
              <span class="gauge-percent">96%</span>
              <span class="gauge-label">Match Score</span>
            </div>
            <div class="gauge-details">
              <div class="g-line">
                <span>⚡ Energy Level Sync:</span>
                <strong class="green">98% (High Synergy)</strong>
              </div>
              <div class="g-line">
                <span>🎾 Play Style:</span>
                <strong class="green">Chase & Fetch Buddies</strong>
              </div>
              <div class="g-line">
                <span>🛡️ Temperament Safety:</span>
                <strong class="green">Verified Gentle</strong>
              </div>
            </div>
          </div>

          <button class="btn-solid invite-playdate-btn" @click="invitePlaydate">
            <Calendar :size="16" />
            <span>Schedule Park Playdate 🌳</span>
          </button>
        </div>
      </div>

      <!-- TAB 6: AI MAGIC PORTRAIT STUDIO -->
      <div v-else-if="activeAiTab === 'portraits'" class="tab-pane">
        <div class="portrait-card card-item">
          <h4 class="port-title">🎨 Magic Pet AI Portrait Studio</h4>
          <p class="port-sub">Transform your pet into iconic digital art styles.</p>

          <div class="styles-grid">
            <div 
              v-for="st in aiStyles" 
              :key="st.name"
              class="style-tile"
              :class="{ active: selectedStyle === st.name }"
              @click="selectedStyle = st.name"
            >
              <img :src="st.preview" :alt="st.name" class="style-img" />
              <span class="style-label">{{ st.name }}</span>
            </div>
          </div>

          <button class="btn-solid generate-art-btn" @click="generateMagicArt">
            <Wand2 :size="16" />
            <span>Generate {{ selectedStyle }} Portrait ✨</span>
          </button>
        </div>
      </div>
    </div>

    <!-- BOOKING SUCCESS MODAL -->
    <div v-if="bookedVetAppointment" class="modal-backdrop" @click.self="bookedVetAppointment = null">
      <div class="booking-modal-box">
        <span class="b-paw">🩺🎉</span>
        <h3 class="b-title">Appointment Confirmed!</h3>
        <p class="b-sub">
          Booked with <strong>{{ bookedVetAppointment.name }}</strong> at <strong>{{ bookedVetAppointment.clinicName }}</strong>.
        </p>
        <div class="b-details-card">
          <div class="b-line">
            <span>Date & Time:</span>
            <strong>Tomorrow at 11:00 AM</strong>
          </div>
          <div class="b-line">
            <span>Pet:</span>
            <strong>{{ targetPet?.name || 'Waffles' }}</strong>
          </div>
          <div class="b-line">
            <span>Location:</span>
            <strong>{{ bookedVetAppointment.location }}</strong>
          </div>
        </div>
        <button class="btn-solid full-btn" @click="bookedVetAppointment = null">
          Done 🐾
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Sparkles, Camera, CheckCircle2, Send, Mic, Calendar, Wand2 } from 'lucide-vue-next';
import TopBar from '../components/layout/TopBar.vue';
import { 
  pets, 
  vets,
  aiTriageMessages, 
  sendAiTriageQuery, 
  isAiScanning, 
  currentScanResult, 
  runAiPetScan,
  openChatWith,
  bookVetSlot
} from '../stores/appStore';
import type { Vet } from '../types';

const activeAiTab = ref<'suggest_vet' | 'scanner' | 'triage' | 'translator' | 'matcher' | 'portraits'>('suggest_vet');

const aiTabs = [
  { id: 'suggest_vet', label: 'Suggest Vet', emoji: '🏥' },
  { id: 'scanner', label: 'PetScan AI', emoji: '🔬' },
  { id: 'triage', label: 'PawDoctor 24/7', emoji: '🩺' },
  { id: 'translator', label: 'Voice Translator', emoji: '🎙️' },
  { id: 'matcher', label: 'Playdate Matcher', emoji: '⚡' },
  { id: 'portraits', label: 'Magic Studio', emoji: '🎨' }
];

// SUGGEST VET CRITERIA STATE
const selectedPetId = ref(pets[0]?.id || 'pet_1');
const selectedMedicalNeed = ref('All');
const selectedMaxDistance = ref(15);
const isEmergencyUrgent = ref(false);
const bookedVetAppointment = ref<Vet | null>(null);

const targetPet = computed(() => {
  return pets.find(p => p.id === selectedPetId.value) || pets[0];
});

// SUGGEST VET AI PRIORITY ALGORITHM
const suggestedVetsList = computed(() => {
  const currentPet = targetPet.value;
  const petSpecies = currentPet?.species || 'Dog';

  return vets
    .filter(vet => {
      // 1. Criteria Match: Pet Species Compatibility
      if (vet.acceptedSpecies && !vet.acceptedSpecies.includes(petSpecies)) {
        return false;
      }

      // 2. Criteria Match: Emergency Mode
      if (isEmergencyUrgent.value && !vet.emergencyCare) {
        return false;
      }

      // 3. Criteria Match: Distance
      if (vet.distanceMiles && vet.distanceMiles > selectedMaxDistance.value) {
        return false;
      }

      // 4. Criteria Match: Medical Need / Specialty
      if (selectedMedicalNeed.value !== 'All') {
        const need = selectedMedicalNeed.value.toLowerCase();
        const hasSpecialty = vet.specialties.some(s => 
          s.toLowerCase().includes(need) || 
          need.includes(s.toLowerCase()) ||
          (need.includes('emergency') && vet.emergencyCare)
        );
        if (!hasSpecialty) return false;
      }

      return true;
    })
    .sort((a, b) => {
      // PRIORITY 1: Pro Subscribers are ranked at the VERY TOP
      const aPro = a.isProSubscriber ? 1 : 0;
      const bPro = b.isProSubscriber ? 1 : 0;
      if (aPro !== bPro) {
        return bPro - aPro; // Pro subscribers come first
      }

      // PRIORITY 2: Rating
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }

      // PRIORITY 3: Distance
      return (a.distanceMiles || 0) - (b.distanceMiles || 0);
    });
});

function getAiMatchReason(vet: Vet): string {
  const petName = targetPet.value?.name || 'Your Pet';
  if (vet.isProSubscriber && isEmergencyUrgent.value) {
    return `99% Match • Pro Partner Hospital equipped with 24/7 ICU & surgical triage for ${petName}.`;
  }
  if (vet.isProSubscriber) {
    return `98% Match • Verified Pro Partner with top ratings in ${vet.specialties[0]} & immediate slot availability.`;
  }
  return `92% Match • Qualified clinic for ${petName}'s routine wellness and preventive diagnostics.`;
}

function isSpecialtyHighlighted(spec: string): boolean {
  if (selectedMedicalNeed.value === 'All') return false;
  return spec.toLowerCase().includes(selectedMedicalNeed.value.toLowerCase());
}

function handleBookSlot(vet: Vet) {
  const pet = targetPet.value;
  bookVetSlot(vet.id, 'Tomorrow', '11:00 AM', pet?.id || 'pet_1', selectedMedicalNeed.value);
  bookedVetAppointment.value = vet;
}

function contactClinic(vet: Vet) {
  const pet = targetPet.value;
  openChatWith(
    vet.name,
    vet.avatarUrl,
    undefined,
    `Hi ${vet.name}! I was matched via PawAI for ${pet?.name || 'my pet'} regarding ${selectedMedicalNeed.value === 'All' ? 'a general consultation' : selectedMedicalNeed.value}. Do you have openings tomorrow?`
  );
}

function resetVetFilters() {
  selectedMedicalNeed.value = 'All';
  selectedMaxDistance.value = 25;
  isEmergencyUrgent.value = false;
}

function enrollClinicModal() {
  alert('🏥 Welcome to Nuzzle Pro Vet Network! Clinics receive #1 Priority Placement on PawAI Suggest Vet, zero booking fees, and direct client triage records.');
}

// Scanner
const scanImage = ref('https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&auto=format&fit=crop&q=80');

// Triage
const triageInput = ref('');
const triagePrompts = [
  '🐶 Dog ate dark chocolate',
  '🐱 Cat drinking excessive water',
  '🐾 Limping on right front paw',
  '🥑 Daily calorie plan for Golden'
];

function handleSendTriage() {
  if (!triageInput.value.trim()) return;
  sendAiTriageQuery(triageInput.value);
  triageInput.value = '';
}

function handleTriagePrompt(p: string) {
  sendAiTriageQuery(p);
}

// Translator
const isListening = ref(false);
const translatedThought = ref<string | null>("Hey human! That squirrel in the tree looked at me funny. Give me the tennis ball and I'll protect this living room with honor!");

function toggleAudioListen() {
  isListening.value = true;
  translatedThought.value = null;
  setTimeout(() => {
    isListening.value = false;
    const thoughts = [
      "I smelled peanut butter 30 minutes ago. Where is it hiding? I will find it.",
      "That delivery driver seemed nice, but I barked just to let them know I'm the boss here.",
      "The sunbeam moved across the floor so I had to relocate my nap. High effort day.",
      "I love you more than bacon! (Okay, equal to bacon). Let's go for a walk!"
    ];
    translatedThought.value = thoughts[Math.floor(Math.random() * thoughts.length)];
  }, 1800);
}

// Matcher
function invitePlaydate() {
  openChatWith(
    'Luna & Oliver',
    'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=200&auto=format&fit=crop&q=80',
    'Oliver (Corgi)',
    'Hi! Our PawAI Playdate score was 96% Match! Would you like to do a weekend dog park meet?'
  );
}

// Portraits
const selectedStyle = ref('Pixar 3D Hero');
const aiStyles = [
  { name: 'Pixar 3D Hero', preview: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&auto=format&fit=crop&q=80' },
  { name: 'Cyberpunk Neon', preview: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&auto=format&fit=crop&q=80' },
  { name: 'Royal Renaissance', preview: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&auto=format&fit=crop&q=80' },
  { name: 'Anime Companion', preview: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&auto=format&fit=crop&q=80' }
];

function generateMagicArt() {
  alert(`✨ Generating ${selectedStyle.value} AI Portrait! Saved to your Pet Gallery.`);
}
</script>

<style scoped>
.pawai-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.ai-scroll-body {
  flex: 1;
  overflow-y: auto;
  padding: 10px 12px 84px;
}

.ai-hero-card {
  position: relative;
  background: linear-gradient(135deg, #1E1B4B, #312E81 50%, #4C1D95);
  border-radius: var(--radius-xl);
  padding: 14px 16px;
  color: #fff;
  overflow: hidden;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 8px 22px rgba(49, 46, 129, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.ai-glow-bg {
  position: absolute;
  top: -20px;
  right: -20px;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.45), transparent 70%);
  filter: blur(20px);
}

.hero-left {
  position: relative;
  z-index: 2;
  max-width: 80%;
}

.ai-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  padding: 2px 8px;
  border-radius: var(--radius-full);
  font-size: 10px;
  font-weight: 700;
  color: #E9D5FF;
  margin-bottom: 4px;
}

.sparkle-icon {
  color: #FDE047;
}

.ai-hero-title {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 800;
  letter-spacing: -0.01em;
}

.ai-hero-sub {
  font-size: 11px;
  color: #DDD6FE;
  line-height: 1.3;
  margin-top: 1px;
}

.hero-robot-badge {
  font-size: 28px;
}

/* Tabs */
.ai-tabs-row {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  scrollbar-width: none;
  margin-bottom: 10px;
}

.ai-tabs-row::-webkit-scrollbar {
  display: none;
}

.ai-tab-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border-radius: var(--radius-full);
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  color: var(--ink-secondary);
  font-size: 11.5px;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.15s ease;
}

.ai-tab-pill.active {
  background: linear-gradient(135deg, #7C3AED 0%, #947DEE 100%);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 2px 8px rgba(124, 58, 237, 0.25);
}

.t-emoji {
  font-size: 12px;
}

/* TAB 1: SUGGEST VET STYLES */
.vet-matcher-hero {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 16px;
  padding: 12px 14px;
  margin-bottom: 12px;
}

.matcher-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.ai-pulse-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10.5px;
  font-weight: 800;
  color: #7C3AED;
  background: #F3EEFF;
  padding: 2px 7px;
  border-radius: var(--radius-full);
}

.pulse-spark {
  animation: spin 3s linear infinite;
}

.pro-priority-tag {
  font-size: 9.5px;
  font-weight: 800;
  color: #92400E;
  background: #FEF3C7;
  border: 1px solid #FCD34D;
  padding: 2px 6px;
  border-radius: var(--radius-full);
}

.matcher-main-title {
  font-size: 15px;
  font-weight: 900;
  color: var(--ink-primary);
}

.matcher-sub {
  font-size: 11.5px;
  color: var(--ink-secondary);
  line-height: 1.35;
  margin-top: 2px;
}

.matcher-filters-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--border-light);
}

.filter-field {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.field-label {
  font-size: 10.5px;
  font-weight: 700;
  color: var(--ink-secondary);
}

.field-select {
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-light);
  border-radius: 8px;
  padding: 6px 8px;
  font-size: 11.5px;
  color: var(--ink-primary);
  outline: none;
}

.urgent-toggle-btn {
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-light);
  border-radius: 8px;
  padding: 6px 8px;
  font-size: 11px;
  font-weight: 800;
  color: var(--ink-secondary);
  cursor: pointer;
  transition: all 0.15s ease;
}

.urgent-toggle-btn.active {
  background: #FFE4E6;
  border-color: #FDA4AF;
  color: #E11D48;
}

/* Suggested Vets List */
.section-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.section-heading {
  font-size: 13.5px;
  font-weight: 800;
  color: var(--ink-primary);
}

.sort-indicator {
  font-size: 10px;
  font-weight: 700;
  color: #D97706;
}

.vets-cards-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.suggested-vet-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  position: relative;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.suggested-vet-card.pro-priority-card {
  border: 1.5px solid #FCD34D;
  box-shadow: 0 4px 14px rgba(245, 158, 11, 0.15);
}

.pro-partner-ribbon {
  display: flex;
  align-items: center;
  gap: 4px;
  background: linear-gradient(135deg, #D97706 0%, #F59E0B 100%);
  color: #fff;
  padding: 4px 10px;
  font-size: 9.5px;
  font-weight: 900;
  letter-spacing: 0.02em;
}

.vet-card-body {
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.vet-top-info-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.vet-avatar-img {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  object-fit: cover;
  flex-shrink: 0;
  border: 1.5px solid var(--border-subtle);
}

.vet-text-col {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.vet-name-row {
  display: flex;
  align-items: center;
  gap: 5px;
}

.vet-doctor-name {
  font-size: 13.5px;
  font-weight: 800;
  color: var(--ink-primary);
}

.pro-shield-badge {
  font-size: 8.5px;
  font-weight: 900;
  color: #fff;
  background: #D97706;
  padding: 1px 4px;
  border-radius: 4px;
}

.vet-clinic-name {
  font-size: 11px;
  color: var(--ink-secondary);
  font-weight: 600;
}

.vet-meta-chips {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 3px;
}

.meta-chip {
  font-size: 9.5px;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: var(--radius-full);
}

.meta-chip.rating {
  background: #FEF3C7;
  color: #92400E;
}

.meta-chip.distance {
  background: var(--bg-card-subtle);
  color: var(--ink-muted);
}

.meta-chip.emergency {
  background: #FFE4E6;
  color: #E11D48;
}

/* AI Match Rationale */
.ai-match-rationale {
  display: flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #FAF5FF 0%, #F3EEFF 100%);
  border: 1px dashed #DDD6FE;
  border-radius: 8px;
  padding: 5px 8px;
}

:global([data-theme='dark']) .ai-match-rationale {
  background: rgba(88, 28, 135, 0.25);
  border-color: rgba(147, 51, 234, 0.4);
}

.ai-brain-icon {
  font-size: 12px;
  flex-shrink: 0;
}

.ai-rationale-text {
  font-size: 10.5px;
  color: #6D28D9;
  line-height: 1.25;
}

:global([data-theme='dark']) .ai-rationale-text {
  color: #DDD6FE;
}

.vet-specialties-track {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.spec-chip {
  font-size: 10px;
  font-weight: 600;
  color: var(--ink-secondary);
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-light);
  padding: 2px 6px;
  border-radius: var(--radius-full);
}

.spec-chip.highlighted {
  background: #F3EEFF;
  border-color: #C084FC;
  color: #7C3AED;
  font-weight: 700;
}

.vet-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
  padding-top: 6px;
  border-top: 1px solid var(--border-light);
}

.next-slot-pill {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 10.5px;
  color: var(--ink-secondary);
}

.slot-dot {
  width: 6px;
  height: 6px;
  background: #059669;
  border-radius: 50%;
}

.vet-actions-btns {
  display: flex;
  gap: 5px;
}

.instant-book-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 800;
  padding: 5px 10px;
  border-radius: var(--radius-full);
}

.clinic-chat-btn {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  padding: 5px 8px;
  border-radius: var(--radius-full);
}

/* Enroll Card */
.pro-clinic-enroll-card {
  margin-top: 14px;
  background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%);
  border: 1.5px solid #FCD34D;
  border-radius: 14px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

:global([data-theme='dark']) .pro-clinic-enroll-card {
  background: rgba(45, 30, 10, 0.6);
  border-color: rgba(245, 158, 11, 0.4);
}

.enroll-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.enroll-icon {
  font-size: 24px;
}

.enroll-title {
  font-size: 12px;
  font-weight: 800;
  color: #92400E;
}

:global([data-theme='dark']) .enroll-title {
  color: #FCD34D;
}

.enroll-sub {
  font-size: 10px;
  color: #B45309;
  line-height: 1.25;
}

:global([data-theme='dark']) .enroll-sub {
  color: #FDE68A;
}

.enroll-btn {
  font-size: 10.5px;
  font-weight: 800;
  color: #92400E;
  background: #fff;
  padding: 5px 9px;
  border-radius: var(--radius-full);
  white-space: nowrap;
}

:global([data-theme='dark']) .enroll-btn {
  background: #78350F;
  color: #FDE68A;
}

/* Empty Vet State */
.empty-vet-state {
  text-align: center;
  padding: 30px 16px;
  background: var(--bg-card);
  border-radius: 14px;
  border: 1px solid var(--border-light);
}

.empty-emoji {
  font-size: 36px;
}

.empty-vet-state h4 {
  font-size: 14px;
  font-weight: 800;
  color: var(--ink-primary);
  margin-top: 6px;
}

.empty-vet-state p {
  font-size: 11.5px;
  color: var(--ink-muted);
  margin: 4px 0 10px;
}

.reset-btn {
  padding: 6px 14px;
  border-radius: var(--radius-full);
  font-size: 11.5px;
}

/* SCANNER STYLES */
.scanner-card {
  padding: 12px;
}

.scanner-viewport {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: 14px;
  overflow: hidden;
  background: var(--bg-card-subtle);
}

.scan-preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: filter 0.3s ease;
}

.scan-preview-img.scanning {
  filter: brightness(0.8) contrast(1.2);
}

.scan-laser-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: #A855F7;
  box-shadow: 0 0 14px #A855F7, 0 0 24px #A855F7;
  animation: laserScan 1.6s ease-in-out infinite alternate;
}

@keyframes laserScan {
  0% { top: 0%; }
  100% { top: 96%; }
}

.scanning-badge {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(26, 18, 42, 0.85);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 5px 12px;
  border-radius: var(--radius-full);
  backdrop-filter: blur(8px);
}

.spinner-dot {
  width: 8px;
  height: 8px;
  border: 2px solid #fff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.scan-prompt-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: rgba(0, 0, 0, 0.35);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  backdrop-filter: blur(2px);
}

.scanner-actions-bar {
  margin-top: 10px;
}

.scan-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 9px;
  border-radius: var(--radius-full);
  font-size: 12.5px;
  font-weight: 800;
}

.scan-results-box {
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid var(--border-light);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.res-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.res-badge {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  font-weight: 800;
  color: #059669;
}

.conf-score {
  font-size: 11px;
  font-weight: 700;
  color: var(--ink-muted);
}

.mood-box, .nutrition-box, .funfact-box {
  font-size: 11.5px;
  line-height: 1.35;
  background: var(--bg-card-subtle);
  padding: 8px 10px;
  border-radius: 8px;
}

.observations-list ul {
  list-style: none;
  padding: 0;
  margin: 4px 0 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 11px;
  color: var(--ink-secondary);
}

.obs-title {
  font-size: 11.5px;
  font-weight: 800;
  color: var(--ink-primary);
}

.suggest-vet-quick-btn {
  width: 100%;
  padding: 8px;
  font-size: 11.5px;
  font-weight: 800;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, #059669 0%, #10B981 100%);
  margin-top: 4px;
}

/* TRIAGE STYLES */
.triage-card {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.triage-messages-container {
  max-height: 320px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-right: 4px;
}

.triage-msg-row {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.triage-msg-row.user {
  justify-content: flex-end;
}

.ai-avatar-tiny {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #F3EEFF;
  display: grid;
  place-items: center;
  font-size: 13px;
  flex-shrink: 0;
}

.msg-bubble {
  max-width: 80%;
  padding: 8px 12px;
  border-radius: 14px;
  font-size: 12px;
  line-height: 1.35;
}

.triage-msg-row.user .msg-bubble {
  background: var(--brand-primary);
  color: #fff;
  border-bottom-right-radius: 2px;
}

.triage-msg-row.ai .msg-bubble {
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-light);
  border-bottom-left-radius: 2px;
}

.msg-bubble.urgent {
  background: #FFF1F2;
  border-color: #FDA4AF;
  color: #9F1239;
}

.msg-time {
  display: block;
  font-size: 9px;
  opacity: 0.65;
  margin-top: 2px;
}

.quick-prompts-track {
  display: flex;
  gap: 5px;
  overflow-x: auto;
  scrollbar-width: none;
}

.prompt-pill {
  font-size: 10.5px;
  font-weight: 600;
  padding: 4px 8px;
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-full);
  white-space: nowrap;
  color: var(--ink-secondary);
  cursor: pointer;
}

.triage-input-bar {
  display: flex;
  gap: 6px;
}

.t-input {
  flex: 1;
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-full);
  padding: 7px 12px;
  font-size: 12px;
  color: var(--ink-primary);
  outline: none;
}

.send-triage-btn {
  padding: 7px 12px;
  border-radius: var(--radius-full);
}

/* TRANSLATOR */
.translator-card {
  padding: 24px 16px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.translator-pulse-circle {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: rgba(148, 125, 238, 0.15);
  display: grid;
  place-items: center;
  margin-bottom: 12px;
}

.translator-pulse-circle.listening {
  animation: pulseMic 1.4s infinite;
}

@keyframes pulseMic {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(148, 125, 238, 0.5); }
  70% { transform: scale(1.1); box-shadow: 0 0 0 16px rgba(148, 125, 238, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(148, 125, 238, 0); }
}

.mic-trigger-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7C3AED 0%, #947DEE 100%);
  color: #fff;
  display: grid;
  place-items: center;
  box-shadow: 0 6px 16px rgba(124, 58, 237, 0.35);
  cursor: pointer;
}

.translator-status {
  font-size: 12px;
  font-weight: 700;
  color: var(--ink-secondary);
}

.translation-output-bubble {
  margin-top: 14px;
  background: linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%);
  border: 1.5px dashed #C084FC;
  border-radius: 14px;
  padding: 12px;
  text-align: left;
}

.bubble-tag {
  font-size: 9.5px;
  font-weight: 900;
  color: #7C3AED;
}

.translation-text {
  font-size: 13px;
  font-style: italic;
  color: var(--ink-primary);
  line-height: 1.35;
  margin-top: 2px;
}

/* MATCHER */
.matcher-card {
  padding: 14px;
}

.matcher-title {
  font-size: 14px;
  font-weight: 800;
  color: var(--ink-primary);
}

.matcher-sub {
  font-size: 11px;
  color: var(--ink-muted);
}

.match-vs-row {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 12px 0;
}

.pet-pick-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
}

.m-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--brand-primary);
}

.m-name {
  font-size: 11.5px;
  font-weight: 800;
}

.m-stat {
  font-size: 9.5px;
  color: #7C3AED;
  font-weight: 700;
}

.vs-badge {
  font-size: 11px;
  font-weight: 900;
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-light);
  padding: 4px 8px;
  border-radius: var(--radius-full);
}

.match-gauge-box {
  background: var(--bg-card-subtle);
  border-radius: 12px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 12px;
}

.gauge-ring {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 4px solid #059669;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.gauge-percent {
  font-size: 14px;
  font-weight: 900;
  color: #059669;
}

.gauge-label {
  font-size: 8px;
  color: var(--ink-muted);
}

.gauge-details {
  display: flex;
  flex-direction: column;
  gap: 3px;
  font-size: 11px;
}

.invite-playdate-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px;
  border-radius: var(--radius-full);
  font-size: 12px;
}

/* PORTRAITS */
.portrait-card {
  padding: 14px;
}

.port-title {
  font-size: 14px;
  font-weight: 800;
  color: var(--ink-primary);
}

.port-sub {
  font-size: 11px;
  color: var(--ink-muted);
}

.styles-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin: 10px 0;
}

.style-tile {
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid var(--border-light);
  cursor: pointer;
  position: relative;
}

.style-tile.active {
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.35);
}

.style-img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
}

.style-label {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  padding: 3px 6px;
  text-align: center;
}

.generate-art-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px;
  border-radius: var(--radius-full);
  font-size: 12px;
}

/* MODAL */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 1000;
}

.booking-modal-box {
  background: var(--bg-card);
  border-radius: 20px;
  width: 100%;
  max-width: 360px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.b-paw {
  font-size: 40px;
}

.b-title {
  font-size: 16px;
  font-weight: 900;
  color: var(--ink-primary);
  margin-top: 4px;
}

.b-sub {
  font-size: 12px;
  color: var(--ink-secondary);
  margin-top: 4px;
}

.b-details-card {
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 10px 12px;
  margin: 12px 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 11.5px;
}

.b-line {
  display: flex;
  justify-content: space-between;
}

.full-btn {
  width: 100%;
  padding: 8px;
  border-radius: var(--radius-full);
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
