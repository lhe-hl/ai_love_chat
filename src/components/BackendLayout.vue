<template>
  <div class="backend-layout">
    <el-container class="main-container">
      <Sidebar />
      <el-container>
        <el-header>
          <Navbar />
        </el-header>
        <el-main class="main-content">
          <router-view class="content-container"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import Navbar from './Navbar.vue';
import Sidebar from './Sidebar.vue'
</script>
<style scoped lang="scss" >
.backend-layout {
  height: 100vh;
  .el-header {
    height: 74px !important; 
  }
  .main-container {
    height: 100%;
    
    .el-container {
      width: 100%;
      .content-container {
        padding: 20px;
        // margin-top: 10px;
        background-color: #fff;
        min-height: calc(100% - 74px);
      }
      
      .el-header {
        padding: 0;
      }
    }
  }
}

</style>
