<template>
  <div class="consultation-container">
    <div class="sidebar">
      <!-- AI助手信息 -->
      <div class="ai-assistant-info">
        <div class="breathing-circle">
          <el-image :src="iconURL" style="width: 25px; height: 25px;" />
        </div>
        <h3 class="assistant-name">两盒AI助手</h3>
        <div class="online-status">
          <div class="status-dot"></div>
          在线服务中
        </div>
      </div>
      <!-- 情绪花园 -->
      <div class="emotion-garden">
        <div class="garden-header">
          <div class="gander-title">情绪花园</div>
        </div>
        <div v-if="!hasEmotionData" class="emotion-empty">
          <div class="empty-orbit">
            <span class="empty-seed seed-one"></span>
            <span class="empty-seed seed-two"></span>
            <span class="empty-seed seed-three"></span>
            <span class="empty-core">心</span>
          </div>
          <div class="empty-title">等待一场新的心情记录</div>
          <div class="empty-text">开始聊天后，情绪花园会根据这次对话慢慢生长。</div>
        </div>
        <template v-else>
        <div class="emotion-info">
          <div class="emotion-name">{{ currentEmotion.primaryEmotion }}</div>
          <div class="emotion-score">{{ currentEmotion.emotionScore }}</div>
        </div>
        <div class="warm-tips">
          <div class="emotion-status-text">
            <span class="status-label">今天感觉:</span>
            <span class="status-emotion">{{ currentEmotion.isNegative ? '需要关注' : '很不错' }}</span>
          </div>
          <div class="emotion-intensity">
            <span class="intensity-dots">
              <span v-for="dot in 3" :key="dot" class="dot" :class="{'active' : getIntensityClass(currentEmotion.emotionScore) >= dot}"></span>
            </span>
            <span class="intensity-text">
              {{ getRiskText(currentEmotion.riskLevel) }}
            </span>
          </div>
          <!-- 温暖建议卡片 -->
          <div v-if="currentEmotion.suggestion" class="warm-suggestion">
            <div class="suggestion-icon">💝</div>
            <div class="suggestion-content">
              <div class="suggestion-title">给你的小建议：</div>
              <div v-if="currentEmotion.suggestion" class="suggestion-text">
                {{ currentEmotion.suggestion }}
              </div>
            </div>
          </div>
          <!-- 治愈行动 -->
          <div v-if="currentEmotion.improvementSuggestions.length > 0" class="healing-actions">
            <div class="actions-title">治愈自己的小行动</div>
            <div class="actions-list">
              <div v-for="action in currentEmotion.improvementSuggestions" :key="action" class="action-item">
                <div class="action-icon">✨</div>
                <div class="action-text">{{ action }}</div>
              </div>
            </div>
          </div>
          <!-- 风险提示 -->
          <div v-if="currentEmotion.isNegative && currentEmotion.riskLevel > 2" class="risk-notice">
            <div class="notice-icon">🤗</div>
            <div class="notice-content">
              <div class="notice-title">风险提示</div>
              <div class="notice-text">{{ currentEmotion.riskDescription }}</div>
            </div>
          </div>
        </div>
        </template>
      </div>
      <!-- 会话列表 -->
      <div class="session-history">
        <h4 class="session-title">会话列表</h4>
        <div class="session-list">
          <div v-for="session in sessionList" :key="session.id" @click="handleSessionClick(session)"
            class="session-item">
            <div class="session-info">
              <div class="session-title">
                <span>{{ session.sessionTitle }}</span>
                <div class="session-meta">
                  <span class="session-time">{{ session.startedAt }}</span>
                </div>
                <div class="session-preview">
                  {{ session.lastMessageContent }}
                </div>
                <div class="session-stats">
                  <span>
                    <el-icon>
                      <ChatRound />
                    </el-icon>
                    {{ session.messageCount || 0 }}
                  </span>
                  <span>
                    <el-icon>
                      <Clock />
                    </el-icon>
                    {{ session.durationMinutes || 0 }}
                  </span>
                </div>
              </div>
              <div class="session-actions">
                <el-button text type="danger" size="mini" @click="handleDeleteClick(session.id)"><el-icon>
                    <DeleteFilled />
                  </el-icon></el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- AI对话区域 -->
    <div class="chat-main">
      <div class="chat-header">
        <div class="header-left">
          <div class="chat-avatar">
            <el-image :src="iconURL1" style="width: 30px; height: 30px;" />
          </div>
          <div class="chat-info">
            <h2>两盒AI助手</h2>
            <p>贴心的心理健康AI助手</p>
          </div>
        </div>
        <el-button circle @click="createNewFrontendSession" title="创建新会话"  :disabled="isAiTying">
          <el-icon>
            <Plus />
          </el-icon>
        </el-button>
      </div>
      <!-- 消息区域 -->
      <div class="chat-messages" ref="chatMessagesRef">
        <!-- 默认用语 -->
        <div class="message-item ai-message" v-if="message.length === 0">
          <div class="message-avatar">
            <el-image :src="iconURL" style="width: 18px; height: 18px" />
          </div>
          <div class="message-content">
            <div class="message-bubble">
              <p>你好，我是两盒AI助手，我可以帮助你解决心理问题。</p>
            </div>
            <div class="message-time">刚刚</div>
          </div>
        </div>
        <div v-else v-for="msg in message" :key="msg.id" class="message-item"
          :class="msg.senderType === 1 ? 'user-message' : 'ai-message'">
          <div class="message-avatar">
            <el-image v-if="msg.senderType === 1" :src="iconURL2" style="width: 18px; height: 18px" />
            <el-image v-if="msg.senderType === 2" :src="iconURL" style="width: 18px; height: 18px" />
          </div>
          <div class="message-content">
            <div class="message-bubble">
              <!-- ai正在思考 -->
              <div v-if="msg.senderType === 2 && isAiTying && !msg.content" class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
              </div>
              <!-- 错误提示 -->
              <div v-else-if="msg.isError" class="error-message">
                <p>{{ msg.content }}</p>
              </div>
              <!-- 正常消息 -->
              <MarkdownRenderer v-else-if="msg.senderType === 2 && !msg.isError" :content="msg.content"
                :isAiMessage="true" />
              <p v-else-if="msg.content" v-html="formatMessageContent(msg.content)"></p>
            </div>
            <div class="message-time">{{ msg.senderType === 2 && isAiTying && msg === message[message.length - 1] ? '正在回复......' : msg.createdAt }}</div>
          </div>
        </div>
      </div>
      <!-- 输入区域 -->
      <div class="chat-input">
        <div class="input-container">
          <el-input v-model="userMessage" placeholder="请输入" type="textarea" rows="3" :disabled="isAiTying"
            @keydown="handleKeyDown" class="message-input" clearable />
          <div class="input-footer">
            <span>按Enter发送消息</span>
            <span>{{ userMessage.length }}/500</span>
          </div>
        </div>
        <el-button :disabled="!userMessage.trim() || userMessage.length > 500" @click="sendMessage" class="send-btn"
          type="primary"><el-icon>
            <Promotion />
          </el-icon></el-button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ChatRound, Clock, DeleteFilled, Promotion } from '@element-plus/icons-vue'
import { computed, nextTick, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { startSession, getSessionList, deleteSession, getSessionMessages,getEmotionData } from '@/api/frontend'
import { ElMessageBox } from 'element-plus'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'
import { fetchEventSource } from '@microsoft/fetch-event-source'
const iconURL = new URL('@/assets/images/robot-fill.png', import.meta.url).toString()
const iconURL1 = new URL('@/assets/images/like.png', import.meta.url).toString()
const iconURL2 = new URL('@/assets/images/users.png', import.meta.url).toString()

// 定义用户输入的消息
const userMessage = ref('')
// 定义AI是否正在回复
const isAiTying = ref(false)
//定义当前会话对象
const currentSession = ref(null)
// 会话列表
const sessionList = ref([])
//定义对话消息
const message = ref([])
const chatMessagesRef = ref(null)
const scrollChatToBottom = async () => {
  await nextTick()
  const el = chatMessagesRef.value
  if (el) {
    el.scrollTop = el.scrollHeight
  }
}
//情绪花园
const currentEmotion = ref({
  primaryEmotion: '',
  emotionScore: null,
  isNegative: false,
  riskLevel: null,
  suggestion: '',
  improvementSuggestions: [],
  riskDescription: ''

})
const hasEmotionData = computed(() => Boolean(currentEmotion.value.primaryEmotion))
//获取情绪强度的类名
const getIntensityClass = (score) => {
  if(score >= 61) {
    return 3
  }
  else if (score >= 31) {
    return 2
  }
  else {
    return 1
  }
}
const getRiskText = (level) => {
  switch (level) {
    case 0:
      return '正常'
    case 1:
      return '需要关注'
    case 2:
      return '预警'
    case 3:
      return '高风险'
    default:
      return '未知风险'
  }
}
//重置情绪花园
const resetEmotionGarden = () => {
  Object.assign(currentEmotion.value, {
    primaryEmotion: '',
    emotionScore: null,
    isNegative: false,
    riskLevel: null,
    suggestion: '',
    improvementSuggestions: [],
    riskDescription: ''
  })
}
//新建会话
const createNewFrontendSession = () => {
  // console.log('点击了新建对话');
  //创建新的会话对象
  const newSession = {
    sessionId: `temp_${Date.now()}`,
    status: `TEMP`,
    sessionTitle: `新对话`
  }
  currentSession.value = newSession
  //清空对话列表
  message.value = []
  userMessage.value = ''
  scrollChatToBottom()
  //刷新会话历史列表
  getSessionPage()
  //恢复情绪花园默认样式
  resetEmotionGarden()
}

// 处理键盘事件
const handleKeyDown = (e) => {
  if (e.key === 'Enter') {
    e.preventDefault()
    sendMessage()
  }
}
//发送消息
const sendMessage = () => {
  //判断用户输入是否为空
  if (!userMessage.value.trim()) return
  console.log('sendMessage 触发, currentSession:', currentSession.value)
  if (isAiTying.value) {
    ElMessage.error('AI助手正在思考，请稍后再输入')
    return
  }

  const funcMessage = userMessage.value.trim()
  //清空用户输入框
  userMessage.value = ''

  //如果没有会话或者是临时会话 那么创建一个新的会话记录
  if (currentSession.value.status === 'TEMP') {
    startNewSession(funcMessage)
  }
  else if(currentSession.value.status === 'ACTIVE') {
    //添加用户消息
    message.value.push({
      id: Date.now(),
      senderType: 1,
      content: funcMessage,
      createdAt: new Date().toISOString(),
    })
    scrollChatToBottom()
    // 处理已激活的会话
    startAIResponse(currentSession.value.sessionId, funcMessage)
  }
}

const startNewSession = async (funcMessage) => {
  //构建会话参数
  const sessionParams = {
    initialMessage: funcMessage
  }
  if (currentSession.value.sessionTitle === '新对话') {
    sessionParams.sessionTitle = `两盒AI助手-${new Date().toLocaleString()}`
  }
  else {
    sessionParams.sessionTitle = currentSession.value.sessionTitle
  }
  try {
    const res = await startSession(sessionParams)
    console.log('接口返回:', res)
    //后端返回数据转为前端格式
    const sessionData = {
      sessionId: res.sessionId,
      status: res.status,
      sessionTitle: sessionParams.sessionTitle
    }
    //如果当前是临时会话，更新数据
    if (currentSession.value && currentSession.value.status === 'TEMP') {
      Object.assign(currentSession.value, sessionData)
    }
    else {
      currentSession.value = sessionData
    }
  } catch (error) {
    console.error('调用接口失败:', error)
    ElMessage.error('发送失败，请重试')
  } finally {
    //更新会话列表
    getSessionPage()
    //添加初始用户消息
    message.value.push({
      id: Date.now(),
      senderType: 1,
      content: funcMessage,
      createdAt: new Date().toISOString(),
    })
    scrollChatToBottom()
    //流式对话
    startAIResponse(currentSession.value.sessionId, funcMessage)
  }
}
//流式对话开始
const startAIResponse = (sessionId, userMessage) => {
  //防止重复发送
  if (isAiTying.value) {
    ElMessage.error('AI助手正在思考，请稍后再输入')
    return
  }
  isAiTying.value = true
  const aiMessage = {
    id: `ai_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    senderType: 2,
    content: '',
    createdAt: new Date().toISOString(),
  }
  message.value.push(aiMessage)
  scrollChatToBottom()
  //调用流式接口
  const ctrl = new AbortController() //专门用来终止fetch请求的
  fetchEventSource('/api/psychological-chat/stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Token': localStorage.getItem('token') || '',
      'accept': 'text/event-stream'
    },
    body: JSON.stringify({
      sessionId,
      userMessage
    }),
    signal: ctrl.signal,
    onopen: (response) => {
      console.log(response)
      if (response.headers.get('Content-Type') !== 'text/event-stream') {
        ElMessage.error('服务器返回的不是流式数据')
      }
    },
    onmessage: (event) => {
      const raw = event.data.trim()
      // console.log('收到SSE消息:', raw)
      if (!raw) { return }
      const eventName = event.event
      //获取当前会话的ai消息
      const aiMessage = message.value[message.value.length - 1]
      if (eventName === 'done') {
        isAiTying.value = false
        ctrl.abort() //终止请求
        getCurrentEmotion(sessionId)
        getSessionPage()
        return
      }
      const payload = JSON.parse(raw)
      const ok = String(payload.code) === '200'
      if (ok && payload.data && payload.data.content) {
        aiMessage.content += payload.data.content
        scrollChatToBottom()
        // console.log('当前content:', aiMessage.content)
      }
      else if (!ok) {
        //错误回复显示
        handleError(payload.message || 'AI助手回复失败，请重试')
      }
    },
    onerror: (err) => {
      console.error('流式请求错误:', err)
      handleError('AI助手回复失败，请重试')
      throw err //抛出错误 让fetch-event-source内部处理重试逻辑
    },
    onclose: () => {
      //预留情绪分析接口
      getCurrentEmotion(sessionId)
    }
  })
}
//错误处理函数
const handleError = (error) => {
  //获取当前会话的ai消息
  const aiMessage = message.value[message.value.length - 1]
  if (aiMessage) {
    aiMessage.content = 'AI助手回复失败，请重试'
  }
  scrollChatToBottom()
  isAiTying.value = false
  ElMessage.error('AI助手回复失败，请重试')
}


//获取会话列表
const getSessionPage = async () => {
  try {
    const res = await getSessionList({
      pageNum: 1,
      pageSize: 10
    })
    console.log(res);

    //更新会话列表
    sessionList.value = res.records || []
  } catch {
    console.error('调用接口失败:', error)
    ElMessage.error('发送失败，请重试')
  }
}
//处理会话点击事件
const handleSessionClick = async (session) => {
  // console.log(session);
  //获取会话消息列表
  try {
    const res = await getSessionMessages(session.id)
    console.log(res);
    //更新消息列表
    message.value = res || []
    scrollChatToBottom()
    // console.log(message);
    //更新当前会话数据
    const sessionData = {
      sessionId: "session_" + session.id,
      status: 'ACTIVE',
      sessionTitle: session.sessionTitle
    }
    currentSession.value = sessionData
  } catch {
    console.error('调用接口失败:', error)
    ElMessage.error('发送失败，请重试')
  }
  getCurrentEmotion(currentSession.value.sessionId)
}
//处理删除会话点击事件
const handleDeleteClick = async (id) => {
  try {
    await ElMessageBox.confirm('确认删除该会话吗？删除后不可恢复', '删除确认', {
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deleteSession(id)
    ElMessage.success('删除成功')
    getSessionPage()
  } catch (error) {
    if (error === 'cancel') return
    console.error('删除会话失败:', error)
    ElMessage.error('删除失败，请重试')
  }
}
//处理换行逻辑
const formatMessageContent = (content) => {
  return content.replace(/\n/g, '<br>')
}

//获取当前对话情绪花园数据
const getCurrentEmotion = async (id) => {
  try {
    const res = await getEmotionData(id)
    console.log('获取情绪花园数据:', res)
    Object.assign(currentEmotion.value, res)
  } catch {
    ElMessage.error('获取情绪花园数据失败，请重试')
  }
}
onMounted(() => {
  createNewFrontendSession()
  getSessionPage()
})
</script>

<style scoped lang="scss">
.consultation-container {
  margin: 0 auto;
  width: 100%;
  height: calc(100vh - 120px);
  min-height: 560px;
  display: flex;
  gap: 30px;
  padding: 8px 278px 8px 8px;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;

  .sidebar {
    width: 320px;
    min-height: 0;
    display: flex;
    margin-left: 20px;
    flex-direction: column;
    overflow: hidden;

    .ai-assistant-info {
      flex: 0 0 130px;
      min-height: 130px;
      margin-bottom: 10px;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 252, 248, 0.95) 100%);
      border-radius: 16px;
      padding: 16px;
      box-shadow: 0 8px 32px rgba(251, 146, 60, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04);
      border: 1px solid rgba(251, 146, 60, 0.08);
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;

      .breathing-circle {
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #fb923c 0%, #f59e0b 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 12px;
        animation: breathing 4s ease-in-out infinite;
        box-shadow: 0 6px 24px rgba(251, 146, 60, 0.25);
        position: relative;
      }

      .assistant-name {
        font-size: 16px;
        font-weight: 700;
        background: linear-gradient(135deg, #fb923c, #f59e0b);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-align: center;
        background-clip: text;
        margin: 0 0 12px;
      }

      .online-status {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #059669;
        font-size: 12px;
        font-weight: 600;

        .status-dot {
          width: 8px;
          height: 8px;
          background: #059669;
          border-radius: 50%;
          margin-right: 8px;
          animation: onlineBlink 1.4s ease-in-out infinite;
          box-shadow: 0 0 8px rgba(5, 150, 105, 0.4);
        }
      }
    }

    .session-history {
      position: absolute;
      top: 8px;
      right: 20px;
      bottom: 8px;
      width: 260px;
      min-height: 0;
      background: white;
      border-radius: 16px;
      padding: 16px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;

      .section-title {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        margin: 0 0 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;

      }

      .session-list {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: rgba(64, 150, 255, 0.3) transparent;

        .session-item {
          position: relative;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px;
          margin-bottom: 8px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;

          &:hover {
            background: #f8f9ff;
            border-color: #e6f0ff;
          }

          &.active {
            background: #e6f0ff;
            border-color: #4096ff;
          }

          .session-info {
            flex: 1;

            .session-title {
              font-weight: 500;
              font-size: 14px;
              color: #333;
              margin-bottom: 4px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;

              .session-meta {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 6px;

                .session-time {
                  font-size: 12px;
                  color: #999;
                }
              }

              .session-preview {
                width: 200px;
                font-size: 12px;
                color: #666;
                margin-bottom: 6px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }

              .session-stats {
                display: flex;
                align-items: center;
                gap: 12px;

                span {
                  font-size: 12px;
                  color: #999;
                  display: flex;
                  align-items: center;
                  gap: 4px;
                }
              }
            }

            .session-actions {
              position: absolute;
              top: 10px;
              right: 12px;
            }
          }
        }

        .no-sessions-text {
          text-align: center;
          font-size: 14px;
          color: #999;
        }
      }
    }

    .emotion-garden {
      flex: 1 1 0;
      background: linear-gradient(135deg, #fef9e7 0%, #fcf4e6 50%, #f6f0e8 100%);
      border-radius: 20px;
      padding: 16px;
      margin-bottom: 0;
      box-shadow: 0 8px 32px rgba(252, 244, 230, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.2);
      position: relative;
      overflow-y: auto;
      min-height: 0;
      scrollbar-width: thin;
      scrollbar-color: rgba(139, 69, 19, 0.25) transparent;

      .garden-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
        position: relative;
        z-index: 2;

        .garden-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          font-weight: 600;
          color: #8b4513;
        }
      }

      .emotion-empty {
        height: calc(100% - 42px);
        min-height: 220px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        color: #7c5f3f;

        .empty-orbit {
          width: 118px;
          height: 118px;
          border-radius: 50%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
          background:
            radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.96) 0 34%, transparent 35%),
            conic-gradient(from 140deg, rgba(251, 146, 60, 0.18), rgba(34, 197, 94, 0.2), rgba(250, 204, 21, 0.22), rgba(251, 146, 60, 0.18));
          box-shadow: inset 0 0 22px rgba(255, 255, 255, 0.72), 0 14px 34px rgba(139, 92, 36, 0.12);
        }

        .empty-core {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #f97316;
          font-size: 20px;
          font-weight: 700;
          background: linear-gradient(135deg, #fff7ed, #ffedd5);
          box-shadow: 0 8px 20px rgba(251, 146, 60, 0.18);
        }

        .empty-seed {
          position: absolute;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #86efac;
          box-shadow: 0 6px 14px rgba(34, 197, 94, 0.16);
        }

        .seed-one {
          top: 18px;
          right: 28px;
          background: #fcd34d;
        }

        .seed-two {
          left: 18px;
          bottom: 30px;
          background: #fb923c;
        }

        .seed-three {
          right: 22px;
          bottom: 24px;
          background: #86efac;
        }

        .empty-title {
          font-size: 16px;
          font-weight: 700;
          color: #8b4513;
          margin-bottom: 8px;
        }

        .empty-text {
          max-width: 220px;
          font-size: 13px;
          line-height: 1.6;
          color: #9a7650;
        }
      }

      .emotion-info {
        margin: 0 auto;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 10;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        border: 2px solid rgba(255, 255, 255, 0.8);
        background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
        color: #fff;

        .emotion-name {
          font-size: 15px;
          font-weight: 600;
          line-height: 1;
          margin-bottom: 2px;
        }

        .emotion-score {
          font-size: 14px;
          font-weight: 700;
          opacity: 0.9;
        }
      }

      .warm-tips {
        text-align: center;
        margin-bottom: 16px;

        .emotion-status-text {
          margin-bottom: 12px;

          .status-label {
            font-size: 14px;
            color: #8b7355;
            margin-right: 8px;
          }

          .status-emotion {
            font-size: 16px;
            font-weight: 600;
            padding: 4px 12px;
            border-radius: 16px;
            display: inline-block;
          }
        }

        .emotion-intensity {
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;

          .intensity-dots {
            display: flex;
            gap: 4px;

            .dot {
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: #e0e0e0;
              transition: all 0.3s ease;

              &.active {
                background: linear-gradient(135deg, #ff9a9e, #fecfef);
                transform: scale(1.2);
                box-shadow: 0 2px 8px rgba(255, 154, 158, 0.4);
              }
            }
          }

          .intensity-text {
            font-size: 12px;
            color: #8b7355;
            font-weight: 500;
          }
        }

        .warm-suggestion {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.8));
          border-radius: 16px;
          padding: 12px;
          margin-bottom: 16px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);

          .suggestion-icon {
            font-size: 20px;
            flex-shrink: 0;
            margin-top: 2px;
          }

          .suggestion-content {
            text-align: left;
            flex: 1;

            .suggestion-title {
              font-size: 14px;
              font-weight: 600;
              color: #8b7355;
              margin-bottom: 6px;
            }

            .suggestion-text {
              font-size: 13px;
              color: #6b5b47;
              line-height: 1.5;
            }
          }
        }

        .healing-actions {
          margin-bottom: 16px;

          .actions-title {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            font-size: 14px;
            font-weight: 600;
            color: #8b7355;
            margin-bottom: 16px;
          }

          .actions-list {
            display: flex;
            flex-direction: column;
            gap: 10px;

            .action-item {
              background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
              border-radius: 12px;
              padding: 12px;
              display: flex;
              align-items: center;
              gap: 10px;
              border: 1px solid rgba(255, 255, 255, 0.5);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
              text-align: left;

              .action-icon {
                font-size: 14px;
                color: #ffd700;
                flex-shrink: 0;
              }

              .action-text {
                font-size: 12px;
                color: #6b5b47;
                line-height: 1.4;
                flex: 1;
              }
            }
          }
        }

        .risk-notice {
          background: linear-gradient(135deg, #fff9e6, #ffeaa7);
          border-radius: 16px;
          padding: 16px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          border: 1px solid rgba(255, 234, 167, 0.6);
          box-shadow: 0 6px 20px rgba(255, 234, 167, 0.3);

          .notice-icon {
            font-size: 20px;
            flex-shrink: 0;
            margin-top: 2px;
          }

          .notice-content {
            flex: 1;

            .notice-title {
              font-size: 14px;
              font-weight: 600;
              color: #d4840f;
              margin-bottom: 6px;
            }

            .notice-text {
              font-size: 13px;
              color: #b8740c;
              line-height: 1.5;
            }
          }
        }
      }
    }
  }

  .chat-main {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 252, 250, 0.98) 100%);
    border-radius: 20px;
    box-shadow: 0 12px 40px rgba(251, 146, 60, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(251, 146, 60, 0.1);
    backdrop-filter: blur(10px);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    flex: 0.94;
    min-width: 0;
    min-height: 0;

    .chat-header {
      background: linear-gradient(135deg, #fb923c 0%, #f59e0b 100%);
      color: white;
      padding: 20px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      flex-shrink: 0;

      .header-left {
        display: flex;
        align-items: center;

        .chat-avatar {
          width: 48px;
          height: 48px;
          background: rgba(255, 255, 255, 0.25);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          position: relative;
          z-index: 1;
        }

        .chat-info {
          h2 {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 4px;
          }

          p {
            font-size: 14px;
          }
        }
      }
    }

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 252, 248, 0.05) 100%);
      min-height: 0;
      scrollbar-width: thin;
      scrollbar-color: rgba(251, 146, 60, 0.3) transparent;

      .message-item {
        display: flex;
        align-items: flex-start;
        gap: 12px;

        .message-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          color: white;
          flex-shrink: 0;
        }

        &.ai-message {
          .message-avatar {
            background: linear-gradient(135deg, #fb923c, #f59e0b);
            box-shadow: 0 4px 12px rgba(251, 146, 60, 0.3);
          }
        }

        &.user-message {
          .message-avatar {
            background: linear-gradient(135deg, #6b7280, #4b5563);
            box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
          }
        }

        .message-content {
          max-width: 70%;
          min-width: 0;

          .message-bubble {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 252, 248, 0.95) 100%);
            border-radius: 16px;
            padding: 12px 16px;
            position: relative;
            animation: fadeInUp 0.4s ease-out;
            border: 1px solid rgba(251, 146, 60, 0.1);
            box-shadow: 0 4px 16px rgba(251, 146, 60, 0.05);
            overflow-wrap: anywhere;

            .typing-indicator {
              display: flex;
              gap: 4px;
              padding: 8px 0;

              .typing-dot {
                width: 8px;
                height: 8px;
                background: #ccc;
                border-radius: 50%;
                animation: typing 1.5s ease-in-out infinite;

                &:nth-child(2) {
                  animation-delay: 0.2s;
                }

                &:nth-child(3) {
                  animation-delay: 0.4s;
                }
              }
            }

            /* 错误消息样式 */
            .error-message {
              background: linear-gradient(135deg, #FEF2F2 0%, #FECACA 100%);
              border: 1px solid #F87171;
              border-radius: 12px;
              padding: 12px 16px;
              color: #991B1B;
              font-weight: 500;
              display: flex;
              align-items: center;
              gap: 8px;
            }
          }

          .message-time {
            font-size: 12px;
            color: #999;
            margin-top: 4px;
          }
        }
      }
    }

    .chat-input {
      border-top: 1px solid rgba(251, 146, 60, 0.1);
      padding: 16px 20px;
      display: flex;
      gap: 14px;
      align-items: flex-end;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.76) 0%, rgba(255, 250, 245, 0.92) 100%);
      backdrop-filter: blur(10px);
      flex-shrink: 0;

      .input-container {
        flex: 1;
        padding: 10px 12px 8px;
        border: 1px solid rgba(251, 146, 60, 0.16);
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.92);
        box-shadow: 0 8px 24px rgba(251, 146, 60, 0.08);
        transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;

        &:focus-within {
          border-color: rgba(251, 146, 60, 0.45);
          background: #fff;
          box-shadow: 0 10px 28px rgba(251, 146, 60, 0.14), 0 0 0 3px rgba(251, 146, 60, 0.08);
        }
      }

      :deep(.message-input) {
        .el-textarea__inner {
          min-height: 68px !important;
          padding: 4px 2px;
          border: 0;
          border-radius: 12px;
          color: #3f3f46;
          background: transparent;
          box-shadow: none;
          line-height: 1.6;
          resize: none;

          &::placeholder {
            color: #a8a29e;
          }

          &:focus {
            box-shadow: none;
          }
        }
      }

      .input-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 6px;
        font-size: 12px;
        color: #a16207;
        font-weight: 500;
      }

      .send-btn {
        height: 58px;
        width: 58px;
        border-radius: 18px;
        background: linear-gradient(135deg, #fb923c 0%, #f59e0b 100%) !important;
        border: none !important;
        box-shadow: 0 6px 20px rgba(251, 146, 60, 0.25);
        transition: all 0.3s ease;

        &:hover:not(.is-disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 26px rgba(251, 146, 60, 0.32);
        }

        &.is-disabled {
          opacity: 0.48;
          box-shadow: none;
        }
      }

    }

  }
}

@keyframes onlineBlink {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
    box-shadow: 0 0 6px rgba(5, 150, 105, 0.45);
  }

  50% {
    opacity: 0.35;
    transform: scale(1.35);
    box-shadow: 0 0 16px rgba(5, 150, 105, 0.8);
  }
}
</style>
