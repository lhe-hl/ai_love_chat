<template>
  <div class="navbar">
    <div class="flex-box">
      <el-button  @click="handleCollapse">
        <el-icon><Expand /></el-icon>
      </el-button>
      <p class="page-title">{{ route.meta.title }}</p>
    </div>
    <div class="flex-box">
      <el-dropdown @command="handleCommand">
        <div class="flex-box">
          <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
          <p class="user-name">admin</p>
          <el-icon><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">个人中心</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import {useAdminStore} from '@/stores/admin'
import {useRouter,useRoute} from 'vue-router'
import {ElMessageBox} from 'element-plus'
import {logout} from '@/api/admin'
const router = useRouter()
const route = useRoute()
//退出登录与个人中心点击事件
const handleCommand = (command) => {
  console.log(command);
  if(command === 'logout'){
    // 退出登录
    ElMessageBox.confirm('确定退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      // 退出登录逻辑
      logout().then(() => {
        //清除缓存
        localStorage.removeItem('token')
        // 清除用户信息
        localStorage.removeItem('userInfo')
        // 跳转登录登录页
        router.push('/auth/login')
      })
    }).catch(() => {
      // 取消退出登录
    })
  }
}
//侧边栏折叠事件
const handleCollapse = () => {
  const adminStore = useAdminStore()
  adminStore.toggleCollapsed()
}


</script>
<style lang="scss" scoped>
.navbar {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  background-color: white;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.1);
  border-bottom: 1px solid #e5e7eb;

  .flex-box {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .page-title {
    margin-left: 20px;
    font-size: 26px;
    font-weight: bold;
    color: #1f2937;
  }
}

</style>
