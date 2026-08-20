<template>
  <div class="settings-view">
    <TopBar title="⚙️ Settings & Privacy" />

    <div class="settings-scroll-body">
      <!-- Section 1: Account Information -->
      <div class="settings-section">
        <h4 class="sec-heading">Account Details</h4>
        <div class="settings-card card-item">
          <div class="setting-row">
            <span class="set-label">Display Name</span>
            <input v-model="owner.displayName" class="set-input" />
          </div>

          <div class="setting-row">
            <span class="set-label">Username</span>
            <span class="set-val-readonly">@{{ owner.username }} (Fixed)</span>
          </div>

          <div class="setting-row">
            <span class="set-label">Email Address</span>
            <span class="set-val-readonly">alex.rivers@example.com</span>
          </div>
        </div>
      </div>

      <!-- Section 2: Privacy & Anonymity -->
      <div class="settings-section">
        <h4 class="sec-heading">Privacy & Anonymity Controls</h4>
        <div class="settings-card card-item">
          <div class="setting-toggle-row">
            <div class="toggle-text">
              <span class="t-main">Global Anonymity (Ghost Mode)</span>
              <span class="t-sub">Conceals owner identity across all public posts and listings.</span>
            </div>
            <div 
              class="toggle-switch" 
              :class="{ active: owner.isAnonymous }"
              @click="owner.isAnonymous = !owner.isAnonymous"
            >
              <div class="toggle-thumb"></div>
            </div>
          </div>

          <div class="setting-toggle-row">
            <div class="toggle-text">
              <span class="t-main">Private Account</span>
              <span class="t-sub">Only approved followers can view your full pet journals.</span>
            </div>
            <div 
              class="toggle-switch" 
              :class="{ active: owner.isPrivate }"
              @click="owner.isPrivate = !owner.isPrivate"
            >
              <div class="toggle-thumb"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 3: Notification Preferences -->
      <div class="settings-section">
        <h4 class="sec-heading">Notification Channels</h4>
        <div class="settings-card card-item">
          <div class="setting-toggle-row">
            <div class="toggle-text">
              <span class="t-main">Likes on Pet Photos</span>
              <span class="t-sub">Notify when someone likes your pets' posts.</span>
            </div>
            <div 
              class="toggle-switch" 
              :class="{ active: owner.notifyLikes }"
              @click="owner.notifyLikes = !owner.notifyLikes"
            >
              <div class="toggle-thumb"></div>
            </div>
          </div>

          <div class="setting-toggle-row">
            <div class="toggle-text">
              <span class="t-main">Comments & Replies</span>
              <span class="t-sub">Notify on questions and feedback.</span>
            </div>
            <div 
              class="toggle-switch" 
              :class="{ active: owner.notifyComments }"
              @click="owner.notifyComments = !owner.notifyComments"
            >
              <div class="toggle-thumb"></div>
            </div>
          </div>

          <div class="setting-toggle-row">
            <div class="toggle-text">
              <span class="t-main">New Followers</span>
              <span class="t-sub">Notify when other pet owners follow your pack.</span>
            </div>
            <div 
              class="toggle-switch" 
              :class="{ active: owner.notifyFollows }"
              @click="owner.notifyFollows = !owner.notifyFollows"
            >
              <div class="toggle-thumb"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 4: Display & Appearance -->
      <div class="settings-section">
        <h4 class="sec-heading">Appearance</h4>
        <div class="settings-card card-item">
          <div class="setting-toggle-row">
            <div class="toggle-text">
              <span class="t-main">Dark Theme</span>
              <span class="t-sub">Switch between warm paper palette and obsidian dark mode.</span>
            </div>
            <div 
              class="toggle-switch" 
              :class="{ active: isDarkMode }"
              @click="toggleTheme"
            >
              <div class="toggle-thumb"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 5: Logout & Version -->
      <div class="settings-section">
        <button class="btn-outline logout-btn" @click="handleLogout">
          Log Out of PetSocial
        </button>

        <p class="app-version-text">
          PetSocial Client v1.0.0 • Built with Vue 3 & Vite
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TopBar from '../components/layout/TopBar.vue';
import { owner, isDarkMode, toggleTheme, setTab } from '../stores/appStore';

function handleLogout() {
  if (confirm('Log out of PetSocial?')) {
    setTab('feed');
  }
}
</script>

<style scoped>
.settings-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.settings-scroll-body {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px 28px;
}

.settings-section {
  margin-bottom: 18px;
}

.sec-heading {
  font-size: 12.5px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--ink-muted);
  margin-bottom: 8px;
  padding-left: 4px;
}

.settings-card {
  padding: 4px 16px;
}

.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-light);
}

.setting-row:last-child {
  border-bottom: none;
}

.set-label {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--ink-primary);
}

.set-input {
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  padding: 6px 12px;
  font-size: 13px;
  color: var(--ink-primary);
  text-align: right;
  outline: none;
}

.set-val-readonly {
  font-size: 12.5px;
  color: var(--ink-muted);
}

.setting-toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-light);
  gap: 12px;
}

.setting-toggle-row:last-child {
  border-bottom: none;
}

.toggle-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.t-main {
  font-size: 13.5px;
  font-weight: 700;
  color: var(--ink-primary);
}

.t-sub {
  font-size: 11px;
  color: var(--ink-muted);
  line-height: 1.35;
}

.logout-btn {
  width: 100%;
  color: var(--accent-rose);
  border-color: #FECDD3;
  padding: 12px;
  margin-top: 8px;
}

.app-version-text {
  text-align: center;
  font-size: 11px;
  color: var(--ink-muted);
  margin-top: 14px;
}
</style>
