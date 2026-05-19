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
        <h2>创建您的账户</h2>
        <p>开启一段温柔、安心的陪伴旅程</p>
      </div>
    </div>
    <div class="form-container">
      <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-position="top">
        <div class="form-grid">
          <el-form-item label="用户名" prop="username">
            <el-input v-model.trim="formData.username" size="large" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model.trim="formData.email" size="large" placeholder="请输入邮箱" />
          </el-form-item>
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model.trim="formData.nickname" size="large" placeholder="请输入昵称" />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model.trim="formData.phone" size="large" placeholder="请输入手机号" maxlength="11" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="formData.password" size="large" placeholder="请输入至少 6 位密码" type="password"
              show-password />
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input v-model="formData.confirmPassword" size="large" placeholder="请再次输入密码" type="password"
              show-password />
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="formData.gender" class="option-group">
              <el-radio-button :value="0">未知</el-radio-button>
              <el-radio-button :value="1">男</el-radio-button>
              <el-radio-button :value="2">女</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="用户类型" prop="userType">
            <el-radio-group v-model="formData.userType" class="option-group">
              <el-radio-button :value="0">普通用户</el-radio-button>
              <el-radio-button :value="1">两盒大人</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </div>
        <el-button class="btn" type="primary" size="large" :loading="loading" :disabled="loading"
          @click="submitForm(ruleFormRef)">
          {{ loading ? '注册中...' : '立即注册' }}
        </el-button>
      </el-form>
      <div class="footer">
        <p>已有账户？<el-link @click="goLogin">去登录</el-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { register } from '@/api/frontend'

const router = useRouter()
const ruleFormRef = ref()
const loading = ref(false)

const formData = reactive({
  username: '',
  email: '',
  nickname: '',
  phone: '',
  password: '',
  confirmPassword: '',
  gender: 0,
  userType: 0
})

const validateEmail = (rule, value, callback) => {
  const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!value) {
    callback(new Error('请输入邮箱'))
  } else if (!emailReg.test(value)) {
    callback(new Error('请输入正确的邮箱格式'))
  } else {
    callback()
  }
}

const validatePhone = (rule, value, callback) => {
  const phoneReg = /^1[3-9]\d{9}$/
  if (!value) {
    callback(new Error('请输入手机号'))
  } else if (!phoneReg.test(value)) {
    callback(new Error('请输入正确的手机号'))
  } else {
    callback()
  }
}

const validateConfirmPassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请再次输入密码'))
  } else if (value !== formData.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  email: [
    { required: true, validator: validateEmail, trigger: 'blur' }
  ],
  nickname: [
    { required: false, message: '请输入昵称', trigger: 'blur' }
  ],
  phone: [
    { required: false, validator: validatePhone, trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少需要 6 位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validateConfirmPassword, trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  userType: [
    { required: true, message: '请选择用户类型', trigger: 'change' }
  ]
})

const isSuccessResponse = (res) => {
  if (!res) {
    return true
  }

  if (res.success === true || String(res.code) === '200') {
    return true
  }

  if (res.data?.success === true || String(res.data?.code) === '200') {
    return true
  }

  // request.js 会把 code 为 200 的响应解包成 data.data，
  // 注册成功后这里拿到的就是用户对象，而不是完整响应。
  if (res.id || res.username) {
    return true
  }

  return false
}

const getErrorMessage = (error, fallback = '注册失败，请稍后重试') => {
  if (typeof error === 'string') {
    return error
  }

  return error?.response?.data?.msg ||
    error?.response?.data?.message ||
    error?.msg ||
    error?.message ||
    fallback
}

const submitForm = async (formRef) => {
  if (!formRef || loading.value) {
    return
  }

  await formRef.validate(async (valid) => {
    if (!valid) {
      return
    }

    loading.value = true
    const payload = {
      username: formData.username,
      email: formData.email,
      nickname: formData.nickname,
      phone: formData.phone,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      gender: Number(formData.gender),
      userType: Number(formData.userType)
    }

    try {
      const res = await register(payload)
      if (isSuccessResponse(res)) {
        ElMessage.success('注册成功，请登录')
        router.push('/auth/login')
      } else {
        ElMessage.error(res?.msg || res?.message || res?.data?.msg || '注册失败，请检查填写信息')
      }
    } catch (error) {
      ElMessage.error(getErrorMessage(error))
    } finally {
      loading.value = false
    }
  })
}

const goHome = () => {
  router.push('/')
}

const goLogin = () => {
  router.push('/auth/login')
}
</script>

<style lang="scss" scoped>
.container {
  width: min(680px, calc(100vw - 48px));
  max-height: calc(100vh - 48px);
  padding: 42px 40px 34px;
  overflow-y: auto;
  background: #ffffff;
  border-radius: 24px;
  box-shadow:
    0 25px 50px -12px rgba(102, 126, 234, 0.15),
    0 12px 24px -8px rgba(118, 75, 162, 0.1);
  animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);

  .title {
    margin-bottom: 30px;

    .back-home {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 26px;
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
        margin-bottom: 10px;
        font-size: 30px;
        font-weight: 700;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        letter-spacing: 1px;
      }

      p {
        font-size: 15px;
        color: #9ca3af;
        line-height: 1.6;
      }
    }
  }

  .form-container {
    margin-top: 8px;

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0 18px;
    }

    :deep(.el-form-item) {
      margin-bottom: 20px;

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
          background: #fafbff;
          box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.3), 0 0 0 1px #667eea inset !important;
        }

        .el-input__inner {
          height: 40px;
          font-size: 15px;
          color: #1f2937;

          &::placeholder {
            color: #9ca3af;
          }
        }
      }
    }

    .option-group {
      display: flex;
      width: 100%;

      :deep(.el-radio-button) {
        flex: 1;

        .el-radio-button__inner {
          width: 100%;
          height: 44px;
          padding: 12px 10px;
          color: #6b7280;
          border-color: #e5e7eb;
          transition: all 0.3s ease;
        }

        &:first-child .el-radio-button__inner {
          border-radius: 12px 0 0 12px;
        }

        &:last-child .el-radio-button__inner {
          border-radius: 0 12px 12px 0;
        }

        &.is-active .el-radio-button__inner {
          color: #fff;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: #667eea;
          box-shadow: 0 6px 16px rgba(102, 126, 234, 0.22);
        }
      }
    }

    .btn {
      width: 100%;
      height: 52px;
      margin-top: 16px;
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

      &.is-disabled {
        transform: none;
        box-shadow: none;
        opacity: 0.75;
      }
    }

    .footer {
      margin-top: 26px;
      padding-top: 22px;
      text-align: center;
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

@media (max-width: 680px) {
  .container {
    width: calc(100% - 32px);
    padding: 32px 24px;
    margin: 0 16px;
    border-radius: 20px;

    .title {
      margin-bottom: 26px;

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
      .form-grid {
        grid-template-columns: 1fr;
      }

      :deep(.el-form-item) {
        margin-bottom: 18px;

        .el-input__wrapper {
          .el-input__inner {
            height: 40px;
            font-size: 14px;
          }
        }
      }

      .btn {
        height: 48px;
        margin-top: 18px;
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
