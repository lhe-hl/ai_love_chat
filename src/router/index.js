import { createRouter, createWebHashHistory } from 'vue-router'
import BackendLayout from '@/components/BackendLayout.vue'
import AuthLayout from '@/components/AuthLayout.vue'
import FrontendLayout from '@/components/FrontendLayout.vue'
//路由配置
const backendRoutes = [
  {
    path: '/back',
    redirect: '/back/dashboard',
    component: BackendLayout,
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard.vue'),
        meta: {
          title: '数据分析',
          icon: 'PieChart'
        }
      },
      {
        path: 'knowledge',
        component: () => import('@/views/knowledge.vue'),
        meta: {
          title: '知识文章',
          icon: 'ChatLineSquare'
        }
      },
      {
        path: 'consultations',
        component: () => import('@/views/consultations.vue'),
        meta: {
          title: '咨询记录',
          icon: 'Message'
        }
      },
      {
        path: 'emotional',
        component: () => import('@/views/emotional.vue'),
        meta: {
          title: '情感日志',
          icon: 'User'
        }
      }
    ]
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        component: () => import('@/views/login.vue'),
        meta: {
          title: '登录',
        }
      },
      {
        path: 'register',
        component: () => import('@/views/register.vue'),
        meta: {
          title: '注册',
        }
      },
    ]
  }
]

//前台用户端路由配置
const frontendRouts = [
  {
    path: '/',
    component: FrontendLayout,
    children: [
      {
        path: '/',
        component: () => import('@/views/home.vue'),
      },
      {
        path: '/consultation',
        component: () => import('@/views/consultation.vue'),
      },
      {
        path: '/emotion-diary',
        component: () => import('@/views/emotionDiary.vue'),
      },
      {
        path: '/knowledge',
        component: () => import('@/views/frontendKnowledge.vue'),
      },
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: [...backendRoutes, ...frontendRouts]
})

// 路由前置守卫
// 路由前置守卫（临时注释，开发期间跳过登录验证）
// router.beforeEach((to, form, next) => {
//   const token = localStorage.getItem('token')
//   //当前token存在
//   if (token) {
//     const userInfo = JSON.parse(localStorage.getItem('userInfo'))
//     //如果是后台用户
//     if (userInfo.userType === 2) {
//       if (to.path.startsWith('/back')) {
//         next()
//       } else {
//         next('/back/dashboard')
//       }
//     }
//     //如果是前台用户
//     else if (userInfo.userType === 1) {
//       if (to.path.startsWith('/back') || to.path.startsWith('/auth')) {
//         next('/')
//       } else {
//         next()
//       }
//     }
//   } else {
//     if (to.path.startsWith('/back') || to.path.startsWith('/consultation') || to.path.startsWith('/emotion-diary')) {
//       //如果访问后台页面，跳转到登录页
//       next('/auth/login')
//     } else {
//       //如果访问其他页面，继续导航
//       next()
//     }
//   }
// })
router.beforeEach((to, from, next) => {
  next() // 开发模式：直接放行所有路由
})
export default router