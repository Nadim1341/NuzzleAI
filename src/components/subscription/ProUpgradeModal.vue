<template>
  <div v-if="isProModalOpen" class="modal-backdrop" @click.self="isProModalOpen = false">
    <div class="pro-modal-container">
      <!-- Top Glow Crown Header -->
      <div class="pro-modal-header">
        <div class="header-crown-bubble">
          <span class="crown-emoji">👑</span>
        </div>

        <button class="close-pro-btn" @click="isProModalOpen = false">
          <X :size="18" />
        </button>

        <h2 class="pro-title">Nuzzle Pro Member</h2>
        <p class="pro-subtitle">Unlock VIP Privileges, AI Intelligence & Priority Pet Care</p>
      </div>

      <!-- Price Banner (90 BDT / Month) -->
      <div class="pro-pricing-card">
        <div class="tier-select-row">
          <!-- Monthly Plan -->
          <div 
            class="tier-box" 
            :class="{ active: selectedPlan === 'monthly' }"
            @click="selectedPlan = 'monthly'"
          >
            <span class="tier-popular-tag">MOST POPULAR</span>
            <span class="tier-name">Monthly VIP</span>
            <div class="tier-cost-line">
              <span class="cost-amount">90 BDT</span>
              <span class="cost-period">/ month</span>
            </div>
            <span class="tier-note">Auto-renews, cancel anytime</span>
          </div>

          <!-- Annual Plan -->
          <div 
            class="tier-box annual" 
            :class="{ active: selectedPlan === 'annual' }"
            @click="selectedPlan = 'annual'"
          >
            <span class="tier-save-tag">SAVE 18%</span>
            <span class="tier-name">Annual Pass</span>
            <div class="tier-cost-line">
              <span class="cost-amount">890 BDT</span>
              <span class="cost-period">/ year</span>
            </div>
            <span class="tier-note">Equivalent to 74 BDT/mo</span>
          </div>
        </div>
      </div>

      <!-- VIP Privileges List -->
      <div class="pro-privileges-section">
        <h4 class="privileges-heading">⭐ Exclusive Member Privileges:</h4>

        <div class="privileges-list">
          <!-- Privilege 1 -->
          <div class="privilege-item">
            <div class="priv-icon-circle gold">👑</div>
            <div class="priv-text">
              <span class="priv-title">Gold VIP Crown & Verified Status</span>
              <p class="priv-desc">Distinguished gold badge on your profile and beside pet names on all posts & comments.</p>
            </div>
          </div>

          <!-- Privilege 2 -->
          <div class="privilege-item">
            <div class="priv-icon-circle purple">🩺</div>
            <div class="priv-text">
              <span class="priv-title">Unlimited PawDoctor 24/7 AI Triage</span>
              <p class="priv-desc">Full access to symptom analyses, nutrition planning, and high-res coat scans with zero limits.</p>
            </div>
          </div>

          <!-- Privilege 3 -->
          <div class="privilege-item">
            <div class="priv-icon-circle blue">🏥</div>
            <div class="priv-text">
              <span class="priv-title">VIP Priority Vet Slots & Concierge</span>
              <p class="priv-desc">Ranked #1 for nearest appointments with Pro Partner clinics and same-day emergency triage.</p>
            </div>
          </div>

          <!-- Privilege 4 -->
          <div class="privilege-item">
            <div class="priv-icon-circle green">🛍️</div>
            <div class="priv-text">
              <span class="priv-title">5% Market Discount & Free Delivery</span>
              <p class="priv-desc">Exclusive savings on verified organic pet food brands, smart GPS collars, and accessories.</p>
            </div>
          </div>

          <!-- Privilege 5 -->
          <div class="privilege-item">
            <div class="priv-icon-circle amber">🛂</div>
            <div class="priv-text">
              <span class="priv-title">Elite Digital Pet Passport Hologram</span>
              <p class="priv-desc">Official IATA travel clearance stamp, digital microchip barcode, and unlimited vaccination cards.</p>
            </div>
          </div>

          <!-- Privilege 6 -->
          <div class="privilege-item">
            <div class="priv-icon-circle pink">🎨</div>
            <div class="priv-text">
              <span class="priv-title">Unlimited AI Magic Pet Portraits</span>
              <p class="priv-desc">Generate unlimited 3D Pixar, Cyberpunk, and Renaissance fine-art portraits for your pets.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Method Selection -->
      <div class="payment-method-block">
        <label class="pay-label">Select Payment Method</label>
        <div class="payment-pills-row">
          <button 
            type="button"
            class="pay-pill"
            :class="{ selected: selectedPayment === 'bKash' }"
            @click="selectedPayment = 'bKash'"
          >
            <span class="pay-emoji">📱</span>
            <span>bKash</span>
          </button>

          <button 
            type="button"
            class="pay-pill"
            :class="{ selected: selectedPayment === 'Nagad' }"
            @click="selectedPayment = 'Nagad'"
          >
            <span class="pay-emoji">⚡</span>
            <span>Nagad</span>
          </button>

          <button 
            type="button"
            class="pay-pill"
            :class="{ selected: selectedPayment === 'Card' }"
            @click="selectedPayment = 'Card'"
          >
            <span class="pay-emoji">💳</span>
            <span>Card / Visa</span>
          </button>
        </div>
      </div>

      <!-- Subscribe CTA Button -->
      <div class="pro-modal-actions">
        <button 
          v-if="!owner.isProMember"
          class="btn-solid activate-pro-cta-btn" 
          @click="handleSubscribe"
        >
          <Sparkles :size="16" />
          <span>Subscribe Now • {{ selectedPlan === 'monthly' ? '90 BDT / month' : '890 BDT / year' }}</span>
        </button>

        <div v-else class="already-subscribed-box">
          <div class="active-badge-row">
            <CheckCircle2 :size="16" class="check-green" />
            <span>You have an Active Pro Membership ({{ owner.proPlan }})</span>
          </div>
          <button class="btn-outline cancel-sub-btn" @click="handleCancel">
            Cancel Subscription
          </button>
        </div>

        <span class="secure-checkout-tag">🔒 256-bit SSL Encrypted • Instant Activation</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { X, Sparkles, CheckCircle2 } from 'lucide-vue-next';
import { isProModalOpen, owner, subscribeToPro, cancelPro } from '../../stores/appStore';

const selectedPlan = ref<'monthly' | 'annual'>('monthly');
const selectedPayment = ref<'bKash' | 'Nagad' | 'Card'>('bKash');

function handleSubscribe() {
  subscribeToPro(selectedPlan.value, selectedPayment.value);
  isProModalOpen.value = false;
  alert(`👑 Welcome to Nuzzle Pro! You are subscribed for ${selectedPlan.value === 'monthly' ? '90 BDT / month' : '890 BDT / year'} via ${selectedPayment.value}. All VIP privileges are unlocked!`);
}

function handleCancel() {
  if (confirm('Are you sure you want to cancel your Nuzzle Pro subscription?')) {
    cancelPro();
    isProModalOpen.value = false;
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px;
  z-index: 1000;
}

.pro-modal-container {
  background: var(--bg-card);
  border: 1.5px solid #FCD34D;
  border-radius: 24px;
  width: 100%;
  max-width: 400px;
  max-height: 88vh;
  overflow-y: auto;
  padding: 18px 16px 20px;
  box-shadow: 
    0 25px 50px -12px rgba(245, 158, 11, 0.25),
    0 10px 30px rgba(0, 0, 0, 0.3);
  position: relative;
}

/* Header */
.pro-modal-header {
  text-align: center;
  position: relative;
  margin-bottom: 12px;
}

.header-crown-bubble {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
  border: 2px solid #F59E0B;
  display: grid;
  place-items: center;
  margin: 0 auto 8px;
  box-shadow: 0 4px 14px rgba(245, 158, 11, 0.35);
  animation: floatBounce 2.4s ease-in-out infinite;
}

.crown-emoji {
  font-size: 28px;
}

@keyframes floatBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

.close-pro-btn {
  position: absolute;
  top: 0;
  right: 0;
  color: var(--ink-muted);
  padding: 5px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.15s ease;
}

.close-pro-btn:hover {
  background: var(--bg-card-subtle);
  color: var(--ink-primary);
}

.pro-title {
  font-family: var(--font-display);
  font-size: 19px;
  font-weight: 900;
  background: linear-gradient(135deg, #D97706 0%, #F59E0B 50%, #B45309 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.01em;
}

.pro-subtitle {
  font-size: 11.5px;
  color: var(--ink-secondary);
  line-height: 1.35;
  margin-top: 2px;
}

/* Pricing Cards */
.pro-pricing-card {
  margin-bottom: 12px;
}

.tier-select-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.tier-box {
  position: relative;
  background: var(--bg-card-subtle);
  border: 1.5px solid var(--border-light);
  border-radius: 14px;
  padding: 12px 10px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  transition: all 0.15s ease;
}

.tier-box:hover {
  transform: translateY(-1px);
}

.tier-box.active {
  background: #FFFBEB;
  border-color: #D97706;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);
}

:global([data-theme='dark']) .tier-box.active {
  background: rgba(45, 30, 10, 0.65);
  border-color: #F59E0B;
}

.tier-popular-tag {
  position: absolute;
  top: -8px;
  background: linear-gradient(135deg, #7C3AED 0%, #947DEE 100%);
  color: #fff;
  font-size: 8px;
  font-weight: 900;
  padding: 1px 6px;
  border-radius: var(--radius-full);
}

.tier-save-tag {
  position: absolute;
  top: -8px;
  background: #059669;
  color: #fff;
  font-size: 8px;
  font-weight: 900;
  padding: 1px 6px;
  border-radius: var(--radius-full);
}

.tier-name {
  font-size: 11px;
  font-weight: 800;
  color: var(--ink-secondary);
  margin-top: 2px;
}

.tier-cost-line {
  display: flex;
  align-items: baseline;
  gap: 2px;
  margin: 4px 0 2px;
}

.cost-amount {
  font-size: 15px;
  font-weight: 900;
  color: #92400E;
}

:global([data-theme='dark']) .cost-amount {
  color: #FCD34D;
}

.cost-period {
  font-size: 9.5px;
  color: var(--ink-muted);
}

.tier-note {
  font-size: 8.5px;
  color: var(--ink-muted);
}

/* Privileges */
.pro-privileges-section {
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-light);
  border-radius: 16px;
  padding: 10px 12px;
  margin-bottom: 12px;
}

.privileges-heading {
  font-size: 11.5px;
  font-weight: 800;
  color: var(--ink-primary);
  margin-bottom: 8px;
}

.privileges-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.privilege-item {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.priv-icon-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 12px;
  flex-shrink: 0;
  background: var(--bg-card);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.priv-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.priv-title {
  font-size: 11.5px;
  font-weight: 800;
  color: var(--ink-primary);
}

.priv-desc {
  font-size: 10.5px;
  color: var(--ink-secondary);
  line-height: 1.3;
}

/* Payment */
.payment-method-block {
  margin-bottom: 12px;
}

.pay-label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  color: var(--ink-secondary);
  margin-bottom: 5px;
}

.payment-pills-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.pay-pill {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 6px;
  border-radius: var(--radius-full);
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-light);
  font-size: 11px;
  font-weight: 700;
  color: var(--ink-secondary);
  cursor: pointer;
  transition: all 0.15s ease;
}

.pay-pill.selected {
  background: #F3EEFF;
  border-color: #7C3AED;
  color: #7C3AED;
}

.pay-emoji {
  font-size: 12px;
}

/* CTA */
.pro-modal-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.activate-pro-cta-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px;
  font-size: 13px;
  font-weight: 800;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, #D97706 0%, #F59E0B 50%, #B45309 100%);
  box-shadow: 0 4px 14px rgba(217, 119, 6, 0.35);
}

.already-subscribed-box {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.active-badge-row {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11.5px;
  font-weight: 700;
  color: #059669;
}

.check-green {
  color: #059669;
}

.cancel-sub-btn {
  font-size: 11px;
  padding: 4px 10px;
  border-radius: var(--radius-full);
}

.secure-checkout-tag {
  font-size: 9.5px;
  color: var(--ink-muted);
}
</style>
