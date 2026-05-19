import service from '@/utils/request'

//登录接口
export function login(data) {
  return service.post('user/login', data)
}

//注册接口
export function register(data) {
  return service.post('/user/add', data)
}

//获取知识分类接口
export function categoryTree() {
  return service.get('/knowledge/category/tree')
}
//获取文章分页列表接口  更标准的接口写法，非简写
export function articlePage(params) {
  return service({
    url: '/knowledge/article/page',
    method: "get",
    params: params,
  });
}
//上传文章封面接口
export function uploadFile(file, businessInfo) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('businessType', 'ARTICLE')
  formData.append('businessId', businessInfo.businessId)
  formData.append('businessField', 'cover')
  return service.post('/file/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function createArticle(data) {
  return service.post('/knowledge/article', data)
}

export function getArticleDetail(id) {
  return service.get(`/knowledge/article/${id}`)
}

//更新文章接口
export function updateArticle(id, data) {
  return service.put(`/knowledge/article/${id}`, data)
}

//更新文章状态接口
export function updateArticleStatus(id, data) {
  return service.put(`/knowledge/article/${id}/status`, data)
}

//删除文章接口
export function deleteArticle(id) {
  return service.delete(`/knowledge/article/${id}`)
}


//获取咨询记录分页列表接口
export function getConsultationPage(params) {
  return service({
    url: '/psychological-chat/sessions',
    method: "get",
    params: params,
  });
}

//获取消息会话列表
export function getSessionDetail(sessionId) {
  return service({
    url: `/psychological-chat/sessions/${sessionId}/messages`,
    method: "get",
  });
}

//获取情感日志分页列表接口
export function getEmotionalPage(params) {
  return service({
    url: '/emotion-diary/admin/page',
    method: "get",
    params: params,
  });
}
//删除情感日志接口
export function deleteEmotional(id) {
  return service.delete(`/emotion-diary/admin/${id}`)
}

//获取综合数据分析
export function getAnalyticOverview() {
  return service.get('/data-analytics/overview')
}

//退出登录接口
export function logout() {
  return service.post('/user/logout')
}
