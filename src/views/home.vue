<template>
  <div class="home-container">
    <div class="content">
      <div class="text">
        <h2 class="title">
          一次温暖的对话<br />
          <span class="highlight-text">化孤独为慰籍</span>
        </h2>
        <p class="description">每个深夜，每个焦虑的时刻，我们都在这里。不必独自承受，让心与心的连接温暖您的每一天</p>
        <div class="hero-actions">
          <el-button size="large">开始倾诉，获得陪伴</el-button>
          <el-button size="large" style="border-color: #fff;" color="transparent">记录心情，释放情感</el-button>
        </div>
      </div>
      <div class="robot">
        <el-image style="width: 150px; height: 150px;" :src="iconURL" alt="机器人" class="robot-image" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const iconURL = new URL('@/assets/images/robot-fill.png', import.meta.url)
</script>

<style scoped lang="scss">
.home-container {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  background:
    radial-gradient(circle at 18% 20%, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0) 28%),
    radial-gradient(circle at 82% 72%, rgba(255, 215, 0, 0.13) 0%, rgba(255, 215, 0, 0) 26%),
    linear-gradient(110deg, rgb(74, 156, 140) 0%, rgb(61, 138, 122) 100%) rgba(74, 156, 140, 0.95);
  color: white;
  padding: 5rem 0;
  min-height: calc(100vh - 285px);
  display: flex;
  align-items: center;
  justify-content: center;

  &::before,
  &::after {
    content: '';
    position: absolute;
    border-radius: 999px;
    pointer-events: none;
    z-index: -1;
  }

  &::before {
    width: 360px;
    height: 360px;
    left: -110px;
    bottom: -140px;
    background: rgba(255, 255, 255, 0.1);
    filter: blur(4px);
  }

  &::after {
    width: 260px;
    height: 260px;
    top: -100px;
    right: 10%;
    border: 1px solid rgba(255, 255, 255, 0.16);
    background: rgba(255, 255, 255, 0.05);
  }

  .content {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 48px;
    width: min(960px, calc(100% - 48px));
    padding: 48px;
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 28px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.13), rgba(255, 255, 255, 0.04));
    box-shadow: 0 28px 70px rgba(22, 78, 68, 0.26), inset 0 1px 0 rgba(255, 255, 255, 0.22);
    backdrop-filter: blur(12px);
    animation: home-fade-up 0.7s ease both;

    .text {
      width: 500px;
      max-width: 100%;

      .title {
        font-size: clamp(2.25rem, 5vw, 3.1rem);
        font-weight: bold;
        line-height: 1.18;
        letter-spacing: 0;
        margin-bottom: 18px;
        text-wrap: balance;

        .highlight-text {
          color: #ffd700;
          display: inline-block;
          position: relative;
          text-shadow: 0 8px 24px rgba(255, 215, 0, 0.2);

          &::after {
            content: '';
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0.08em;
            height: 0.32em;
            border-radius: 999px;
            background: rgba(255, 215, 0, 0.18);
            z-index: -1;
          }
        }
      }

      .description {
        max-width: 520px;
        margin: 0;
        color: rgba(255, 255, 255, 0.88);
        font-size: 1.08rem;
        line-height: 1.85;
        text-shadow: 0 1px 12px rgba(30, 92, 82, 0.2);
      }

      .hero-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 14px;
        margin-top: 30px;

        :deep(.el-button) {
          min-width: 176px;
          height: 46px;
          padding: 0 22px;
          border-radius: 999px;
          border-color: rgba(255, 255, 255, 0.62);
          color: #fff;
          font-weight: 600;
          letter-spacing: 0;
          box-shadow: 0 12px 28px rgba(21, 74, 66, 0.2);
          transition: transform 0.22s ease, box-shadow 0.22s ease, background-color 0.22s ease, border-color 0.22s ease;

          &:first-child {
            border-color: rgba(255, 255, 255, 0.92);
            background: rgba(255, 255, 255, 0.2);
          }

          &:hover,
          &:focus-visible {
            transform: translateY(-2px);
            border-color: rgba(255, 255, 255, 0.95);
            background-color: rgba(255, 255, 255, 0.24);
            box-shadow: 0 18px 34px rgba(20, 72, 64, 0.28);
          }

          &:active {
            transform: translateY(0) scale(0.99);
            box-shadow: 0 10px 22px rgba(20, 72, 64, 0.2);
          }
        }
      }
    }

    .robot {
      position: relative;
      flex: 0 0 auto;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 260px;
      height: 260px;
      border-radius: 50%;
      border: 2px solid rgba(255, 255, 255, 0.2);
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.07) 100%);
      box-shadow: 0 22px 48px rgba(20, 83, 73, 0.26), inset 0 1px 0 rgba(255, 255, 255, 0.34);
      transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
      animation: robot-float 4.8s ease-in-out infinite;

      &::before {
        content: '';
        position: absolute;
        inset: 24px;
        border-radius: inherit;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 68%);
      }

      &:hover {
        transform: translateY(-4px) scale(1.02);
        border-color: rgba(255, 255, 255, 0.38);
        box-shadow: 0 28px 58px rgba(20, 83, 73, 0.32), inset 0 1px 0 rgba(255, 255, 255, 0.42);
      }

      :deep(.robot-image) {
        position: relative;
        z-index: 1;
        filter: drop-shadow(0 16px 22px rgba(33, 83, 77, 0.22));
        transition: transform 0.3s ease, filter 0.3s ease;
      }

      &:hover :deep(.robot-image) {
        transform: scale(1.04);
        filter: drop-shadow(0 18px 26px rgba(33, 83, 77, 0.28));
      }
    }
  }
}

@keyframes home-fade-up {
  from {
    opacity: 0;
    transform: translateY(18px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes robot-float {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-8px);
  }
}

@media (max-width: 820px) {
  .home-container {
    padding: 3rem 0;

    .content {
      flex-direction: column;
      gap: 34px;
      width: min(100% - 32px, 620px);
      padding: 36px 24px;
      text-align: center;

      .text {
        width: 100%;

        .description {
          margin: 0 auto;
          font-size: 1rem;
        }

        .hero-actions {
          justify-content: center;
        }
      }

      .robot {
        width: 220px;
        height: 220px;
      }
    }
  }
}

@media (max-width: 480px) {
  .home-container {
    padding: 2rem 0;

    .content {
      width: calc(100% - 24px);
      padding: 30px 18px;
      border-radius: 22px;

      .text {
        .title {
          font-size: 2.08rem;
        }

        .hero-actions {
          :deep(.el-button) {
            width: 100%;
            min-width: 0;
          }
        }
      }

      .robot {
        width: 190px;
        height: 190px;
      }
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-container {
    .content,
    .content .robot {
      animation: none;
    }

    .content .text .hero-actions :deep(.el-button),
    .content .robot,
    .content .robot :deep(.robot-image) {
      transition: none;
    }
  }
}
</style>
