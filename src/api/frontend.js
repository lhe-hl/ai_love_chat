import service from '@/utils/request'
//注册接口
export function register(data) {
  return service.post('/user/add', data)
}

//发送用户信息接口
export function startSession(data) {
  return service({
    url: '/psychological-chat/session/start',
    method: 'post',
    data
  })
}

//分页查询接口  
export function getSessionList(data) {
  return service({
    url: '/psychological-chat/sessions',
    method: 'get',
    params: data
  })
}

//删除会话接口
export function deleteSession(sessionId) {
  return service({
    url: `/psychological-chat/sessions/${sessionId}`,
    method: 'delete'
  })
}

//获取会话消息列表
export function getSessionMessages(sessionId) {
  return service({
    url: `/psychological-chat/sessions/${sessionId}/messages`,
    method: 'get'
  })
}
