import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

//创建axios实例
const service = axios.create({
  baseURL: '/api',
  timeout: 5000//请求超时时间
})

const publicAuthUrls = ['/user/login', '/user/add']

const isPublicAuthUrl = (url = '') => {
  const normalizedUrl = url.startsWith('/') ? url : `/${url}`
  return publicAuthUrls.some(item => normalizedUrl.includes(item))
}

//请求拦截器
service.interceptors.request.use(
  //在发送请求之前做些什么
  config => {
    const token = localStorage.getItem('token')
    if (token && !isPublicAuthUrl(config.url)) {
      config.headers['token'] = token
    }
    return config
  },
  error => {
    //对请求错误做些什么
    return Promise.reject(error)
  }
)

//响应拦截器
service.interceptors.response.use(
  //对响应数据做点什么
  response => {
    const { data, config } = response
    //处理业务状态
    if (String(data.code) === '200') {
      return data.data
    } else {
      if (String(data.code) === '-1') {
        if (!isPublicAuthUrl(config.url)) {
          ElMessage.error(data.msg || '登录过期，请重新登录')
          //清除登录信息
          localStorage.removeItem('token')
          //清除用户信息
          localStorage.removeItem('userInfo')
          //跳转到登录页
          router.push('/auth/login')
        } else {
          ElMessage.error(data.msg || '请求失败')
          return Promise.reject(data.msg || '网络请求失败.....')
        }
      }
    }
    return response
  },
  error => {
    //对响应错误做点什么
    return Promise.reject(error)
  }
)

export default service
