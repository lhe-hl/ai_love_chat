<template>
  <div>
    <PageHead title="咨询记录"></PageHead>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="会话ID" width="100">
        <template #default="scope">
          <el-avatar>
            {{ scope.row.userNickname }}
          </el-avatar>
        </template>
      </el-table-column>
      <el-table-column label="情绪日志" >
        <template #default="scope">
          <div class="session-title">{{ scope.row.sessionTitle }}</div>
          <div class="session-preview">{{ scope.row.lastMessageContent }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="messageCount" label="消息数量" width="80" />
      <el-table-column prop="lastMessageTime" label="咨询时间" width="100" />
      <el-table-column label="操作" width="100">
        <template #default="scope">
          <el-button type="primary" size="small" text @click="viewSessionDetail(scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination 
    style="margin-top: 25px;"
    v-model:current-page="pagination.currentPage"
    :page-size="pagination.pageSize"
    layout="prev, pager, next" 
    :total="pagination.total"
    @change="handleChange" />
  </div>
  <el-dialog 
    title="咨询记录详情"
    v-model="showDetailDialog"
    width="70%"
    :close-on-click-modal="false"
  >
  <!-- :close-on-click-modal="false" 作用是点击弹窗外空白不关闭弹窗 -->
    <div class="session-detail">
      <div class="detail-header">
        <div class="detail-row">
          <div class="detail-label">用户:</div>
          <div class="detail-value">{{ sessionDetail.userNickname }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">开始时间:</div>
          <div class="detail-value">{{ sessionDetail.lastMessageTime }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">消息数:</div>
          <div class="detail-value">{{ sessionDetail.messageCount }}</div>
        </div>
      </div>
      <div class="messages-container">
        <div class="messages-header">
          <h4>对话记录</h4>
        </div>
        <div class="messages-list" v-loading="loadingMessage">
          <div v-for="message in sessionMessage" :key="message.id" class="message-item" :class="message.senderType === 1 ? 'user-message' : 'ai-message'">
            <div class="message-header">
              <span class="sender">{{ message.senderType === 1 ? '用户' : 'AI' }}</span>
              <span class="time">{{ message.createdAt }}</span>
            </div>
            <div class="message-content">
              {{ message.content }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <el-button type="primary" @click="showDetailDialog = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import PageHead from '@/components/PageHead.vue'
import { onMounted, ref, reactive } from 'vue'
import { getConsultationPage, getSessionDetail } from '@/api/admin'
//详情弹窗
const showDetailDialog = ref(false)
//加载中
const loadingMessage = ref(false)
const tableData = ref([])

//定义分页参数
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

//查看详情
//当前行数据
const sessionDetail = ref({})
//后端获取的消息列表
const sessionMessage = ref([])
const viewSessionDetail = async (row)=>{
  loadingMessage.value = true  // 开始加载
  try {
    const res = await getSessionDetail(row.id)
    console.log(res, '消息详情')
    sessionMessage.value = res
    sessionDetail.value = row
    showDetailDialog.value = true
    console.log(row, '会话详情')
  } catch (error) {
    console.error('获取会话详情失败:', error)
    // 可选：给用户一个错误提示
    ElMessage?.error?.('加载失败，请重试')
  } finally {
    loadingMessage.value = false  // ✅ 无论成功还是失败，都会执行
  }
}

//分页
const handleChange = (page) =>{
  pagination.currentPage = page
  handleSearch({})
}

//查询
const handleSearch = ()=>{
  getConsultationPage(pagination).then(res => {
    const {records,total} = res
    console.log(records,'咨询记录');
    tableData.value = records
    pagination.total = total
  })
}

onMounted(()=>{
  handleSearch({})
})

</script>

<style lang="scss" scoped>
// ========== 列表样式 ==========
:deep(.el-table) {
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
  overflow: hidden;
  color: #1f2937;

  .el-table__inner-wrapper::before {
    display: none;
  }

  th.el-table__cell {
    background: #f8fafc;
    color: #475569;
    font-size: 13px;
    font-weight: 600;
    border-bottom: 1px solid #e5e7eb;
  }

  td.el-table__cell {
    padding: 14px 0;
    border-bottom: 1px solid #eef2f7;
  }

  .el-table__row {
    transition: background-color 0.2s ease;

    &:hover > td.el-table__cell {
      background: #f7fbff;
    }
  }

  .el-avatar {
    width: 38px;
    height: 38px;
    border: 1px solid #bfdbfe;
    background: #eff6ff;
    color: #2563eb;
    font-size: 13px;
    font-weight: 700;
  }

  .el-button.is-text {
    height: 30px;
    padding: 0 10px;
    border-radius: 6px;
    color: #2563eb;
    font-weight: 600;

    &:hover {
      background: #eff6ff;
      color: #1d4ed8;
    }
  }
}

.session-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 6px;
  line-height: 1.45;
}

.session-preview {
  font-size: 13px;
  color: #64748b;
  line-height: 1.65;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

:deep(.el-pagination) {
  justify-content: flex-end;

  .btn-prev,
  .btn-next,
  .el-pager li {
    border-radius: 6px;
  }

  .el-pager li.is-active {
    background: #2563eb;
    color: #fff;
  }
}

// ========== 入场动画 ==========
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes messageSlideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes messageSlideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

// ========== 详情容器 ==========
.session-detail {
  max-height: 68vh;
  overflow-y: auto;
  animation: fadeInUp 0.28s ease;
  padding: 2px 4px 4px;

  // 自定义滚动条
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
    &:hover {
      background: #9ca3af;
    }
  }

  // ========== 顶部信息卡片 ==========
  .detail-header {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
    margin-bottom: 18px;
    padding: 16px;
    border-radius: 8px;
    background: #fff;
    border: 1px solid #e5e7eb;
    box-shadow: 0 6px 18px rgba(15, 23, 42, 0.05);

    .detail-row {
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-width: 0;
      padding: 12px 14px;
      border-radius: 8px;
      background: #f8fafc;
      border: 1px solid #eef2f7;

      .detail-label {
        font-weight: 600;
        color: #64748b;
        font-size: 13px;
        letter-spacing: 0;
        display: flex;
        align-items: center;
      }

      .detail-value {
        color: #0f172a;
        font-weight: 600;
        font-size: 14px;
        line-height: 1.5;
        overflow-wrap: anywhere;
      }
    }
  }

  // ========== 消息区域 ==========
  .messages-container {
    .messages-header {
      margin-bottom: 12px;

      h4 {
        margin: 0;
        color: #1f2937;
        font-size: 16px;
        font-weight: 700;
        letter-spacing: 0;
        display: flex;
        align-items: center;
      }
    }

    .messages-list {
      min-height: 280px;
      max-height: 430px;
      overflow-y: auto;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 18px;
      background: #f8fafc;

      // 滚动条
      &::-webkit-scrollbar {
        width: 6px;
      }
      &::-webkit-scrollbar-track {
        background: transparent;
        border-radius: 3px;
      }
      &::-webkit-scrollbar-thumb {
        background: #d1d5db;
        border-radius: 3px;
        &:hover {
          background: #9ca3af;
        }
      }

      .message-item {
        margin-bottom: 16px;
        animation: messageSlideIn 0.26s ease both;
        display: flex;
        flex-direction: column;
        gap: 7px;

        &:last-child {
          margin-bottom: 0;
        }

        // 用户消息 - 靠右
        &.user-message {
          align-items: flex-end;

          .message-content {
            background: #2563eb;
            color: #fff;
            border-radius: 8px 8px 2px 8px;
            margin-left: 40px;
            border-color: #2563eb;
          }

          .message-header {
            flex-direction: row-reverse;

            .sender {
              color: #2563eb;
            }

            .time {
              margin-right: 8px;
              margin-left: 0;
            }
          }

          animation-name: messageSlideInRight;
        }

        // AI 消息 - 靠左
        &.ai-message {
          align-items: flex-start;

          .message-content {
            background: #fff;
            color: #1f2937;
            border: 1px solid #dbe4ee;
            border-radius: 8px 8px 8px 2px;
            margin-right: 40px;
          }

          .message-header {
            .sender {
              color: #059669;
            }
          }
        }

        .message-header {
          display: flex;
          align-items: center;
          gap: 8px;

          .sender {
            font-weight: 600;
            font-size: 12px;
            letter-spacing: 0;
          }

          .time {
            font-size: 11px;
            color: #9ca3af;
            margin-left: 8px;
          }
        }

        .message-content {
          max-width: min(78%, 680px);
          padding: 12px 14px;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.05);
          transition: box-shadow 0.2s ease, transform 0.2s ease;
          word-break: break-word;
          line-height: 1.72;
          white-space: pre-wrap;
          font-size: 14px;
          letter-spacing: 0;

          &:hover {
            box-shadow: 0 6px 16px rgba(15, 23, 42, 0.08);
            transform: translateY(-1px);
          }
        }
      }

      // 消息依次出现的延迟
      .message-item:nth-child(1) { animation-delay: 0.05s; }
      .message-item:nth-child(2) { animation-delay: 0.1s; }
      .message-item:nth-child(3) { animation-delay: 0.15s; }
      .message-item:nth-child(4) { animation-delay: 0.2s; }
      .message-item:nth-child(5) { animation-delay: 0.25s; }
      .message-item:nth-child(6) { animation-delay: 0.3s; }
      .message-item:nth-child(7) { animation-delay: 0.35s; }
      .message-item:nth-child(8) { animation-delay: 0.4s; }
      .message-item:nth-child(9) { animation-delay: 0.45s; }
      .message-item:nth-child(10) { animation-delay: 0.5s; }
      .message-item:nth-child(n+11) { animation-delay: 0.55s; }
    }
  }
}

// ========== 弹窗整体美化 ==========
:deep(.el-dialog) {
  width: min(920px, 92vw) !important;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.18);

  .el-dialog__header {
    background: #fff;
    margin: 0;
    padding: 18px 24px;
    border-bottom: 1px solid #e5e7eb;

    .el-dialog__title {
      color: #111827;
      font-size: 18px;
      font-weight: 700;
      letter-spacing: 0;
    }

    .el-dialog__headerbtn {
      top: 17px;
      right: 18px;

      .el-dialog__close {
        color: #94a3b8;
        font-size: 20px;
        transition: color 0.2s ease, transform 0.2s ease;

        &:hover {
          color: #2563eb;
          transform: rotate(90deg);
        }
      }
    }
  }

  .el-dialog__body {
    padding: 22px 24px 20px;
    background: #f8fafc;
  }

  .el-dialog__footer {
    padding: 14px 24px 18px;
    background: #fff;
    border-top: 1px solid #e5e7eb;
  }
}

// ========== 关闭按钮美化 ==========
:deep(.el-dialog__footer) {
  .el-button--primary {
    background: #2563eb;
    border: none;
    border-radius: 6px;
    padding: 10px 24px;
    font-weight: 600;
    letter-spacing: 0;
    transition: background-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
    box-shadow: 0 6px 14px rgba(37, 99, 235, 0.22);

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 10px 20px rgba(37, 99, 235, 0.28);
      background: #1d4ed8;
    }

    &:active {
      transform: translateY(0);
    }
  }
}

@media (max-width: 768px) {
  .session-detail {
    max-height: 72vh;

    .detail-header {
      grid-template-columns: 1fr;
      padding: 12px;
    }

    .messages-container .messages-list {
      padding: 14px 12px;

      .message-item {
        &.user-message .message-content,
        &.ai-message .message-content {
          max-width: 90%;
          margin-left: 20px;
          margin-right: 20px;
        }
      }
    }
  }

  :deep(.el-dialog) {
    .el-dialog__header,
    .el-dialog__body,
    .el-dialog__footer {
      padding-left: 16px;
      padding-right: 16px;
    }
  }
}
</style>
