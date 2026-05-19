<template>
  <div class="page-head">
    <p class="page-title">{{ props.title }}</p>
    <div class="action-btn">
      <slot name="buttons"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: '标题'
  }
})
</script>
<style lang="scss" scoped>
.page-head {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  background-color: white;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.1);
  border-bottom: 1px solid #e5e7eb;
  .page-title {
    font-size: 24px;
    color: #1f2937;
  }
}
</style>
