<template>
  <div 
    class="nuzzle-brand-logo-container" 
    :class="[shapeClass, { 'no-bg': transparent }]"
    :style="{ width: typeof size === 'number' ? size + 'px' : size, height: typeof size === 'number' ? size + 'px' : size }"
  >
    <img 
      src="/logo.png" 
      alt="Nuzzle Logo" 
      class="nuzzle-brand-img"
      :class="mode"
    />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: number | string;
    mode?: 'emblem' | 'full';
    shape?: 'rounded' | 'square' | 'circle';
    transparent?: boolean;
  }>(),
  {
    size: 36,
    mode: 'emblem',
    shape: 'rounded',
    transparent: false,
  }
);

const shapeClass = 'shape-rounded';
</script>

<style scoped>
.nuzzle-brand-logo-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 10px;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0 2px 10px rgba(148, 125, 238, 0.2);
  border: 1px solid rgba(148, 125, 238, 0.18);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.nuzzle-brand-logo-container.no-bg {
  background: transparent;
  box-shadow: none;
  border: none;
}

.nuzzle-brand-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s ease;
}

.nuzzle-brand-img.emblem {
  object-position: center 15%;
  transform: scale(1.35);
}

.nuzzle-brand-img.full {
  object-fit: contain;
  transform: scale(1.05);
}
</style>
