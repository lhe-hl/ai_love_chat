<template>
  <div class="frontend-layout">
    <div class="navbar-container">
      <div class="brand-section">
        <el-image style="width: 50px; height: 50px;" :src="iconURL" alt="logo" class="brand-logo" />
        <h1 class="brand-name">两盒心理健康AI助手</h1>
      </div>
      <div class="nav-section">
        <router-link to="/" class="nav-link">首页</router-link>
        <router-link to="/consultation" class="nav-link" v-if="isLoggedIn">AI咨询</router-link>
        <router-link to="/emotion-diary" class="nav-link" v-if="isLoggedIn">情绪日记</router-link>
        <router-link to="/knowledge" class="nav-link">知识库</router-link>
        <el-button class="logout-btn" v-if="isLoggedIn" @click="handleLogout">退出登录</el-button>
        <template v-else>
          <router-link to="/auth/login" class="nav-link">登录</router-link>
          <router-link to="/auth/register" class="nav-link">
            <el-button type="primary">注册</el-button>
          </router-link>
        </template>
      </div>
    </div>
    <div class="main-content">
      <router-view></router-view>
    </div>
    <div class="footer-container">
      <div class="footer-bottom">
        <p>&copy; 2026 两盒心理健康AI助手,保留所有权利</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { logout } from '@/api/admin'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
const router = useRouter()
const iconURL = new URL('@/assets/images/机器人.png', import.meta.url).toString()
// 登录状态
const isLoggedIn = ref(false)
// 退出登录
const handleLogout = async () => {
  try {
    await logout()
    ElMessage.success('退出成功')
  } catch (error) {
    ElMessage.warning('退出接口异常，已清除本地登录状态')
  } finally {
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    isLoggedIn.value = false
    router.push('/auth/login')
  }
}
onMounted(() => {
  isLoggedIn.value = localStorage.getItem('token') !== null
})
</script>
<style scoped>
.frontend-layout {
  background-color: #fff;

  .navbar-container {
    max-width: 1600px;
    height: 100%;
    margin: 0 auto;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .brand-section {
      display: flex;
      align-items: center;

      .brand-name {
        margin-left: 10px;
        font-size: 24px;
        font-weight: 600;
        color: #333;
      }
    }

    .nav-section {
      display: flex;
      align-items: center;
      gap: 40px;

      .nav-link {
        color: #4b5563;
        font-size: 16px;
        font-weight: 500;

        &:hover {
          color: #4A90E2;
        }

        &.router-link-exact-active {
          color: #4A90E2;
          font-weight: 700;
        }
      }
    }
  }

  .footer-container {
    background: #1f2937;
    color: white;
    padding: 3px 0;
    margin-top: auto;

    .footer-bottom {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 10px;
      text-align: center;
    }
  }
}
</style>
