<template>
  <div class="auth-layout">
    <div class="left-section">
      <div class="decoration decoration-1"></div>
      <div class="decoration decoration-2"></div>
      <div class="decoration decoration-3"></div>
      <div class="content">
        <h2 class="title">两盒心理AI助手</h2>
        <p class="text">每个深夜，每个焦虑的时刻，我们都在这里。不必独自承受，让心与心的连接温暖您的每一天</p>
        <div class="robot">
          <div class="robot-inner">
            <el-image style="width: 90px; height: 90px;" :src="robotImg" alt="两盒心理AI助手" fit="contain" />
          </div>
        </div>
      </div>
    </div>
    <div class="right-section">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
const robotImg = new URL('@/assets/images/robot-fill.png', import.meta.url).href
</script>

<style lang="scss" scoped>
.auth-layout {
    display: flex;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    
    .left-section {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;
        height: 100%;
        background: linear-gradient(135deg, #60cba9 0%, #58a8d8 50%, #9d88e8 100%);
        background-size: 400% 400%;
        animation: gradientShift 15s ease infinite;
        
        .decoration {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            
            &.decoration-1 {
                width: 300px;
                height: 300px;
                top: -50px;
                left: -50px;
                animation: float 8s ease-in-out infinite;
            }
            
            &.decoration-2 {
                width: 200px;
                height: 200px;
                bottom: 100px;
                right: 50px;
                animation: float 10s ease-in-out infinite reverse;
            }
            
            &.decoration-3 {
                width: 150px;
                height: 150px;
                top: 40%;
                right: 20%;
                animation: float 6s ease-in-out infinite;
            }
        }
        
        .content {
            position: relative;
            z-index: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 40px;
            animation: fadeInUp 1s ease-out;
            
            .title {
                margin-bottom: 24px;
                font-size: 48px;
                font-weight: 700;
                color: #fff;
                text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
                letter-spacing: 1px;
                animation: glow 3s ease-in-out infinite alternate;
            }
            
            .text {
                margin-bottom: 40px;
                width: 480px;
                font-size: 18px;
                line-height: 1.8;
                color: rgba(255, 255, 255, 0.95);
                text-align: center;
                text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            
            .robot {
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 200px;
                height: 200px;
                
                &::before {
                    content: '';
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.05) 100%);
                    animation: pulse 2s ease-in-out infinite;
                }
                
                .robot-inner {
                    position: relative;
                    z-index: 1;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 180px;
                    height: 180px;
                    border-radius: 50%;
                    border: 3px solid rgba(255, 255, 255, 0.3);
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 100%);
                    box-shadow: 
                        0 20px 60px rgba(0, 0, 0, 0.2),
                        inset 0 2px 0 rgba(255, 255, 255, 0.4),
                        0 0 60px rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(20px);
                    animation: bounce 3s ease-in-out infinite;
                }
            }
        }
    }
    
    .right-section {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;
        height: 100%;
        background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
        position: relative;
        
        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
        }
    }
}

@keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

@keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes glow {
    from {
        text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }
    to {
        text-shadow: 0 4px 40px rgba(255, 255, 255, 0.4), 0 0 80px rgba(255, 255, 255, 0.2);
    }
}

@keyframes pulse {
    0%, 100% {
        transform: scale(1);
        opacity: 1;
    }
    50% {
        transform: scale(1.1);
        opacity: 0.8;
    }
}

@keyframes bounce {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
}

@media (max-width: 1024px) {
    .auth-layout {
        flex-direction: column;
        
        .left-section {
            flex: none;
            height: 40vh;
            min-height: 300px;
            
            .content {
                padding: 30px;
                
                .title {
                    font-size: 32px;
                    margin-bottom: 16px;
                }
                
                .text {
                    width: 90%;
                    max-width: 400px;
                    font-size: 15px;
                    margin-bottom: 24px;
                }
                
                .robot {
                    width: 140px;
                    height: 140px;
                    
                    .robot-inner {
                        width: 120px;
                        height: 120px;
                        
                        :deep(.el-image) {
                            width: 60px !important;
                            height: 60px !important;
                        }
                    }
                }
            }
            
            .decoration {
                display: none;
            }
        }
        
        .right-section {
            flex: 1;
        }
    }
}

@media (max-width: 480px) {
    .auth-layout {
        .left-section {
            .content {
                .title {
                    font-size: 24px;
                }
                
                .text {
                    font-size: 14px;
                }
            }
        }
    }
}
</style>
