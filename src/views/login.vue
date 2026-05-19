<template>
  <div class="container">
    <div class="title">
      <div class="back-home" @click="goHome">
        <el-icon>
          <Back />
        </el-icon>
        <span>返回首页</span>
      </div>
      <div class="title-text">
        <h2>登录您的账户</h2>
        <p>请输入您的登录信息</p>
      </div>
    </div>
    <div class="form-container">
      <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-position="top">
        <el-form-item label="用户名或邮箱" prop="username">
          <el-input v-model="formData.username" size="large" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password" size="large" placeholder="请输入密码" type="password" show-password />
        </el-form-item>
        <el-button class="btn" type="primary" size="large" @click="submitForm(ruleFormRef)">登录</el-button>
      </el-form>
      <div class="footer">
        <p>还没有账户？<el-link to="/auth/register" @click="goRegister">去注册</el-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { login } from '@/api/admin'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
const route = useRoute()
const ruleFormRef = ref()
const formData = reactive({
  username: '',
  password: ''
})
//表单校验规则
const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
})

//登录
const router = useRouter()
const submitForm = async (formRef) => {
  if (!formRef) {
    return
  }
  await formRef.validate((valid, fields) => {
    if (valid) {
      login(formData).then(data => {
        //判断token是否存在
        if (!data.token) {
          return console.error('登录失败')
        }
        //登录成功 保存token和用户信息
        localStorage.setItem('token', data.token)
        localStorage.setItem('userInfo', JSON.stringify(data.userInfo))
        //根据用户角色决定跳转路径
        if (data.userInfo.userType === 2) {
          router.push('/back/dashboard')
        }
        else {
          router.push('/')
        }
      })
    }
  })
}
//去注册
const goRegister = () => {
  router.push('/auth/register')
}
//返回首页
const goHome = () => {
  router.push('/')
}
</script>
<style lang="scss" scoped>
.container {
  width: 420px;
  padding: 48px 40px;
  background: #ffffff;
  border-radius: 24px;
  box-shadow:
    0 25px 50px -12px rgba(102, 126, 234, 0.15),
    0 12px 24px -8px rgba(118, 75, 162, 0.1);
  animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);

  .title {
    margin-bottom: 40px;

    .back-home {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 32px;
      padding: 8px 16px;
      font-size: 14px;
      color: #6b7280;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        color: #667eea;
        background: rgba(102, 126, 234, 0.08);
        transform: translateX(-4px);
      }

      .el-icon {
        font-size: 16px;
        transition: transform 0.3s ease;
      }

      &:hover .el-icon {
        transform: translateX(-2px);
      }
    }

    .title-text {
      text-align: center;

      h2 {
        margin-bottom: 12px;
        font-size: 32px;
        font-weight: 700;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        letter-spacing: 1px;
      }

      p {
        font-size: 16px;
        color: #9ca3af;
        line-height: 1.6;
      }
    }
  }

  .form-container {
    margin-top: 8px;

    :deep(.el-form-item) {
      margin-bottom: 24px;

      .el-form-item__label {
        padding: 0 0 8px 0;
        font-size: 14px;
        font-weight: 600;
        color: #374151;
        line-height: 1.5;
      }

      .el-form-item__error {
        padding-top: 6px;
        font-size: 12px;
      }
    }

    :deep(.el-input) {
      .el-input__wrapper {
        padding: 4px 16px;
        border-radius: 12px;
        box-shadow: 0 0 0 1px #e5e7eb inset;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

        &:hover {
          box-shadow: 0 0 0 1px #d1d5db inset;
        }

        &.is-focus {
          box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.3), 0 0 0 1px #667eea inset !important;
          background: #fafbff;
        }

        .el-input__inner {
          height: 44px;
          font-size: 15px;
          color: #1f2937;

          &::placeholder {
            color: #9ca3af;
          }
        }
      }
    }

    .btn {
      width: 100%;
      height: 52px;
      margin-top: 32px;
      font-size: 16px;
      font-weight: 600;
      letter-spacing: 1px;
      border: none;
      border-radius: 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      box-shadow:
        0 4px 15px rgba(102, 126, 234, 0.35),
        0 2px 6px rgba(118, 75, 162, 0.2);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;

      &:hover {
        transform: translateY(-2px);
        box-shadow:
          0 8px 25px rgba(102, 126, 234, 0.45),
          0 4px 10px rgba(118, 75, 162, 0.3);
      }

      &:active {
        transform: translateY(0);
        box-shadow:
          0 2px 8px rgba(102, 126, 234, 0.3),
          0 1px 3px rgba(118, 75, 162, 0.2);
      }
    }

    .footer {
      text-align: center;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #f3f4f6;

      p {
        font-size: 14px;
        color: #6b7280;
      }

      :deep(.el-link) {
        margin-left: 4px;
        font-size: 14px;
        font-weight: 600;
        color: #667eea;
        transition: all 0.3s ease;

        &::after {
          display: none;
        }

        &:hover {
          color: #764ba2;
          transform: translateX(2px);
        }

        .el-link__inner {
          border-bottom: 1px solid transparent;
          transition: border-color 0.3s ease;
        }

        &:hover .el-link__inner {
          border-bottom-color: #764ba2;
        }
      }
    }
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 480px) {
  .container {
    width: calc(100% - 32px);
    padding: 32px 24px;
    margin: 0 16px;
    border-radius: 20px;

    .title {
      margin-bottom: 28px;

      .back-home {
        margin-bottom: 24px;
        padding: 6px 12px;
        font-size: 13px;
      }

      .title-text {
        h2 {
          font-size: 26px;
        }

        p {
          font-size: 14px;
        }
      }
    }

    .form-container {
      :deep(.el-form-item) {
        margin-bottom: 20px;

        .el-input__wrapper {
          .el-input__inner {
            height: 40px;
            font-size: 14px;
          }
        }
      }

      .btn {
        height: 48px;
        margin-top: 24px;
        font-size: 15px;
      }

      .footer {
        margin-top: 24px;
        padding-top: 20px;
      }
    }
  }
}
</style>