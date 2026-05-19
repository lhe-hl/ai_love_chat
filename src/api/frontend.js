import service from '@/utils/request'
//注册接口
export function register(data) {
  return service.post('/user/add', data)
}