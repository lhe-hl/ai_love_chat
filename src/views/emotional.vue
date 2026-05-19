<template>
  <div>
    <PageHead title="情感日志"></PageHead>
    <button @click="detailDialogVisible2 = true">thinking效果测试</button>
    <TableSearch :formItem="formItem" @search="handleSearch" />
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="id" label="用户ID" width="80" />
      <el-table-column label="会话ID" width="100">
        <template #default="scope">
          <el-avatar>
            {{scope.row.nickname}}
          </el-avatar>
        </template>
      </el-table-column>
      <el-table-column prop="diaryDate" label="记录日期" width="150" />
      <el-table-column label="情绪评分">
        <template #default="scope">
          <el-rate :model-value="scope.row.moodScore" :max="10" disabled />
        </template>
      </el-table-column>
      <el-table-column label="生活指标" width="160">
        <template #default="scope">
          <div>
            <p>
              睡眠：{{scope.row.sleepQuality}} / 5
            </p>
            <p>
              压力：{{scope.row.stressLevel}} / 5
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="emotionTriggers" label="情绪触发因素" width="120" />
      <el-table-column prop="diaryContent" label="日记内容" width="250" />
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button type="primary" size="small" text @click="viewSessionDetail(scope.row)">详情</el-button>
          <el-button type="danger" size="small" text @click="handleDelete(scope.row)">删除</el-button>
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

    <el-dialog
      v-model="detailDialogVisible"
      title="情绪日志详情"
      width="800px"
      :close-on-click-modal="false"
    >
    <!-- :close-on-click-modal="false" -->
     <div v-if="currentDetail" class="detail-content">
      <div class="detail-section">
        <h4>用户信息</h4>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="用户名">{{currentDetail.username}}</el-descriptions-item>
          <el-descriptions-item label="昵称">{{currentDetail.nickname}}</el-descriptions-item>
          <el-descriptions-item label="用户ID">{{currentDetail.userId}}</el-descriptions-item>
          <el-descriptions-item label="记录日期">{{currentDetail.diaryDate}}</el-descriptions-item>
        </el-descriptions>
      </div>

      <div class="detail-section">
        <h4>情绪状态</h4>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="情绪评分">
            <el-rate :model-value="currentDetail.moodScore" :max="10" disabled />
          </el-descriptions-item>
          <el-descriptions-item label="主要情绪">
            <el-tag :type="getEmotionTagType(currentDetail.dominantEmotion)">{{currentDetail.dominantEmotion || '--'}}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="睡眠质量">{{ currentDetail.sleepQuality || '--' }} / 5</el-descriptions-item>
          <el-descriptions-item label="压力水平">{{ currentDetail.stressLevel || '--' }} / 5</el-descriptions-item>
        </el-descriptions>
      </div>

      <div class="detail-section">
        <h4>日记内容</h4>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="情绪触发因素">{{ currentDetail.emotionTriggers || '无' }}</el-descriptions-item>
          <el-descriptions-item label="日记内容">{{ currentDetail.diaryContent || '无' }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <div class="detail-section">
        <h4>AI情绪分析结果</h4>
        <div class="ai-analysis-result">
          <el-descriptions :column="2" border>
          <el-descriptions-item label="主要情绪">
            <el-tag :type="getAiEmotionTagType(aiData.primaryEmotion)">{{aiData.primaryEmotion}}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="情绪强度">
            <el-progress :percentage="aiData.emotionScore" :color="getEmotionScoreColor(aiData.emotionScore)" :stroke-width = "8" />
          </el-descriptions-item>
          <el-descriptions-item label="风险等级">
            <el-tag :type="getRiskLevelTagType(aiData.riskLevel)">{{getRiskLevelText(aiData.riskLevel)}}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="情绪性质">
            <el-tag :type="aiData.isNegative ? 'danger' : 'success'">{{aiData.isNegative ? '负面情绪' : '正面情绪'}}</el-tag>
          </el-descriptions-item>
        </el-descriptions>
          <div class="ai-suggestion-section">
            <h5>专业建议</h5>
            <div class="suggestion-content">{{ aiData.suggestion || '无' }}</div>
          </div>
          <div class="ai-risk-section">
            <h5>风险描述</h5>
            <div class="risk-content">{{ aiData.riskDescription || '无' }}</div>
          </div>
          <div class="ai-improvements-section">
            <h5>改善建议</h5>
            <ul class="improvement-list">
              <li v-for="item in aiData.improvementSuggestions" :key="item">{{ item }}</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="detail-section">
        <h4>时间信息</h4>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="创建时间">{{currentDetail.createdAt}}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{currentDetail.updatedAt}}</el-descriptions-item>
        </el-descriptions>
      </div>
     </div>

     <template #footer>
       <el-button type="primary" @click="detailDialogVisible = false">关闭</el-button>
     </template>
    </el-dialog>
    <el-dialog
      v-model="detailDialogVisible2"
      title="thinking测试详情"
      width="1200px"
      height="1200px"
    >
      <template #footer>
        <button @click="detailDialogVisible2 = false">关闭</button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import PageHead from '@/components/PageHead.vue'
import TableSearch from '@/components/TableSearch.vue';
import { onMounted, ref, reactive } from 'vue'
import { getEmotionalPage,deleteEmotional } from '@/api/admin'
import { ElMessage,ElMessageBox } from 'element-plus'

const getEmotionTagType = (emotion) => {
  const emotionTypes = {
    '快乐': 'success',
    '平静': 'info',
    '兴奋': 'warning',
    '愤怒': 'danger',
    '悲伤': 'info',
    '焦虑': 'warning',
    '开心': 'success',
  }
  return emotionTypes[emotion] || 'info'
}

const getAiEmotionTagType = (emotion) => {
  const emotionTagMap = {
    '快乐': 'success',
    '平静': 'success',
    '兴奋': 'warning',
    '满足': 'success',
    '愤怒': 'danger',
    '悲伤': 'info',
    '焦虑': 'warning',
    '恐惧': 'danger',
    '沮丧': 'info',
    '压力': 'warning'
  }
  return emotionTagMap[emotion] || 'info'
}

const getEmotionScoreColor = (score) => {
  if (score >= 80) return '#f56c6c'
  if (score >= 60) return '#e6a23c'
  if (score >= 40) return '#909399'
  return '#67c23a'
}

const getRiskLevelTagType = (riskLevel) => {
  const riskTagMap = {
    0: 'success',
    1: 'info',
    2: 'warning',
    3: 'danger'
  }
  return riskTagMap[riskLevel] || 'info'
}

const getRiskLevelText = (riskLevel) => {
  const riskTextMap = {
    0: '正常',
    1: '关注',
    2: '预警',
    3: '危机'
  }
  return riskTextMap[riskLevel] || '未知风险等级'
}

const formItem = [
  {comp:'input',prop:'id',label:'用户ID',placeholder:'请输入用户ID'},
  {comp:'select',prop:'moodScore',label:'情绪评分',placeholder:'请选择情绪评分范围',options: [{
    value:'1-3',
    label:'低分(1-3分)'
  },{
    value:'4-6',
    label:'中分(4-6分)'
  },{
    value:'7-9',
    label:'高分(7-10分)'
  }]},
]

//列表数据
const tableData = ref([])

//定义分页参数
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

const handleSearch =  async (formData) =>{
  // console.log('两盒查询');
  const params = {
    ...pagination,
    ...formData
  }
  // console.log(params,'两盒');
  const {records,total} = await getEmotionalPage(params)
  tableData.value = records
  // console.log(records,'两盒');
   pagination.total = total
}

//分页
const handleChange = (page) =>{
  pagination.currentPage = page
  handleSearch({})
}

//查看详情
//弹窗
const detailDialogVisible = ref(false)
const detailDialogVisible2 = ref(false)
// 详情弹窗数据
const currentDetail = ref(null)
const aiData = ref(null)
const viewSessionDetail = (row) =>{
  currentDetail.value = row
  if(row.aiEmotionAnalysis){
    aiData.value = JSON.parse(row.aiEmotionAnalysis)
    console.log(aiData.value,'两盒');
  }else {
    aiData.value = {}
  }
  detailDialogVisible.value = true
}

//删除情绪日志
const handleDelete = async (row) =>{
  await ElMessageBox.confirm('确认删除吗？', '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'danger'
  })
  await deleteEmotional(row.id)
  ElMessage.success('删除成功')
  handleSearch({})
}
//查询事件
onMounted(()=>{
  handleSearch({})
})
</script>


<!-- 此样式deepseekv4proAI生成 -->
<style lang="scss" scoped>
// ========== 入场动画 ==========
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// ========== 详情内容整体 ==========
.detail-content {
  animation: fadeInUp 0.5s ease;

  .detail-section {
    margin-bottom: 20px;
    padding: 18px 22px;
    border-radius: 14px;
    background: #fff;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
    border: 1px solid #f0f0f0;
    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    animation: fadeInUp 0.45s ease both;

    // 右上角装饰圆
    &::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      opacity: 0.04;
      pointer-events: none;
      transform: translate(20px, -20px);
    }

    &:hover {
      box-shadow: 0 6px 28px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
      border-color: transparent;
    }

    h4 {
      margin: 0 0 16px 0;
      font-size: 16px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 8px;
      padding-bottom: 12px;
      border-bottom: 2px solid #f0f0f0;
      position: relative;
      letter-spacing: 0.5px;

      &::before {
        font-size: 22px;
        flex-shrink: 0;
      }

      &::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 50px;
        height: 3px;
        border-radius: 2px;
        transition: width 0.3s ease;
      }
    }

    &:hover h4::after {
      width: 70px;
    }
  }

  // 每个section依次出现的延迟
  .detail-section:nth-child(1) { animation-delay: 0.05s; }
  .detail-section:nth-child(2) { animation-delay: 0.12s; }
  .detail-section:nth-child(3) { animation-delay: 0.19s; }
  .detail-section:nth-child(4) { animation-delay: 0.26s; }
  .detail-section:nth-child(5) { animation-delay: 0.33s; }

  // ---------- 第1节：用户信息 (蓝色主题) ----------
  .detail-section:nth-child(1) {
    border-left: 4px solid #409eff;

    &::before {
      background: #409eff;
    }

    h4 {
      color: #3375c7;

      &::before {
        content: '👤';
      }

      &::after {
        background: linear-gradient(90deg, #409eff, #79bbff);
      }
    }

    :deep(.el-descriptions__label) {
      background: linear-gradient(135deg, #ecf5ff 0%, #d9ecff 100%);
      color: #3375c7;
      font-weight: 600;
    }
  }

  // ---------- 第2节：情绪状态 (暖色主题) ----------
  .detail-section:nth-child(2) {
    border-left: 4px solid #e6a23c;

    &::before {
      background: #e6a23c;
    }

    h4 {
      color: #d4891a;

      &::before {
        content: '💛';
      }

      &::after {
        background: linear-gradient(90deg, #e6a23c, #f0c78e);
      }
    }

    :deep(.el-descriptions__label) {
      background: linear-gradient(135deg, #fdf6ec 0%, #faecd8 100%);
      color: #b88230;
      font-weight: 600;
    }
  }

  // ---------- 第3节：日记内容 (紫色主题) ----------
  .detail-section:nth-child(3) {
    border-left: 4px solid #a855f7;

    &::before {
      background: #a855f7;
    }

    h4 {
      color: #7c3aed;

      &::before {
        content: '📝';
      }

      &::after {
        background: linear-gradient(90deg, #a855f7, #c4b5fd);
      }
    }

    :deep(.el-descriptions__label) {
      background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
      color: #6d28d9;
      font-weight: 600;
    }
  }

  // ---------- 第4节：AI情绪分析 (特殊渐变 - 最重要) ----------
  .detail-section:nth-child(4) {
    border-left: 4px solid #10b981;
    background: linear-gradient(160deg, #f0fdf4 0%, #ecfdf5 25%, #f0f9ff 50%, #fdf4ff 75%, #fefce8 100%);
    border-color: #d1fae5;

    &::before {
      background: #10b981;
    }

    h4 {
      color: #059669;

      &::before {
        content: '🤖';
      }

      &::after {
        background: linear-gradient(90deg, #10b981, #6ee7b7);
      }
    }

    :deep(.el-descriptions__label) {
      background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
      color: #047857;
      font-weight: 600;
    }
  }

  // ---------- 第5节：时间信息 (灰色主题) ----------
  .detail-section:nth-child(5) {
    border-left: 4px solid #909399;

    &::before {
      background: #909399;
    }

    h4 {
      color: #6b7280;

      &::before {
        content: '⏰';
      }

      &::after {
        background: linear-gradient(90deg, #909399, #b4b6bb);
      }
    }

    :deep(.el-descriptions__label) {
      background: linear-gradient(135deg, #f4f4f5 0%, #e5e7eb 100%);
      color: #606266;
      font-weight: 600;
    }
  }
}

// ========== 对话框整体美化 ==========
:deep(.el-dialog) {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);

  .el-dialog__header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    margin: 0;
    padding: 18px 28px;
    position: relative;
    overflow: hidden;

    &::after {
      content: '';
      position: absolute;
      top: -30px;
      right: -30px;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.06);
    }

    &::before {
      content: '';
      position: absolute;
      bottom: -40px;
      left: 60px;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.04);
    }

    .el-dialog__title {
      color: #fff;
      font-size: 18px;
      font-weight: 700;
      letter-spacing: 1.5px;
      position: relative;
      z-index: 1;
    }

    .el-dialog__headerbtn {
      top: 18px;
      z-index: 1;

      .el-dialog__close {
        color: rgba(255, 255, 255, 0.85);
        font-size: 22px;
        font-weight: 700;
        transition: all 0.3s ease;

        &:hover {
          color: #ffd04b;
          transform: rotate(90deg);
        }
      }
    }
  }

  .el-dialog__body {
    padding: 24px 28px 20px;
    background: #fafbfc;
  }

  .el-dialog__footer {
    padding: 14px 28px 20px;
    background: #fff;
    border-top: 1px solid #f5f5f5;
  }
}

// ========== el-descriptions 表格美化 ==========
.detail-content {
  :deep(.el-descriptions) {
    border-radius: 8px;
    overflow: hidden;

    .el-descriptions__table {
      border-radius: 8px;
    }

    .el-descriptions__label {
      font-weight: 600;
      font-size: 13px;
      border-radius: 0;
      padding: 12px 16px;
      letter-spacing: 0.3px;
    }

    .el-descriptions__content {
      padding: 12px 16px;
      color: #303133;
      font-size: 14px;
      background: #fafdfe;
    }
  }
}

// ========== el-tag 渐变美化 ==========
.detail-content {
  :deep(.el-tag) {
    border-radius: 6px;
    padding: 4px 12px;
    font-weight: 600;
    font-size: 13px;
    letter-spacing: 0.3px;
    border: none;

    &.el-tag--success {
      background: linear-gradient(135deg, #67c23a, #85ce61);
      color: #fff;
    }

    &.el-tag--warning {
      background: linear-gradient(135deg, #e6a23c, #ebb563);
      color: #fff;
    }

    &.el-tag--danger {
      background: linear-gradient(135deg, #f56c6c, #f89898);
      color: #fff;
    }

    &.el-tag--info {
      background: linear-gradient(135deg, #909399, #b4b6bb);
      color: #fff;
    }
  }
}

// ========== el-progress 进度条美化 ==========
.detail-content {
  :deep(.el-progress) {
    .el-progress-bar__outer {
      border-radius: 10px;
      background: #f0f0f0;
      overflow: hidden;
    }

    .el-progress-bar__inner {
      border-radius: 10px;
      transition: width 0.8s ease;
    }

    .el-progress__text {
      font-size: 13px !important;
      font-weight: 700;
      margin-left: 10px;
    }
  }
}

// ========== el-rate 星级美化 ==========
.detail-content {
  :deep(.el-rate) {
    .el-rate__icon {
      margin-right: 4px;
      font-size: 18px;
    }
  }
}

// ========== AI分析结果子模块 ==========
.ai-analysis-result {
  .ai-suggestion-section,
  .ai-risk-section,
  .ai-improvements-section {
    margin-top: 14px;
    padding: 16px 18px;
    border-radius: 12px;
    border: 1px solid;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;

    &:hover {
      transform: translateX(6px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
    }

    h5 {
      margin: 0 0 10px 0;
      font-size: 14px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 6px;
      letter-spacing: 0.5px;
    }
  }

  .ai-suggestion-section {
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #f0f9ff 100%);
    border-color: #bfdbfe;

    h5 {
      color: #2563eb;

      &::before {
        content: '💡';
        font-size: 18px;
      }
    }
  }

  .ai-risk-section {
    background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 50%, #fff5f5 100%);
    border-color: #fecaca;

    h5 {
      color: #dc2626;

      &::before {
        content: '⚠️';
        font-size: 18px;
      }
    }
  }

  .ai-improvements-section {
    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #f7fee7 100%);
    border-color: #bbf7d0;

    h5 {
      color: #16a34a;

      &::before {
        content: '🌟';
        font-size: 18px;
      }
    }
  }

  .suggestion-content,
  .risk-content {
    line-height: 1.75;
    color: #374151;
    background: rgba(255, 255, 255, 0.7);
    padding: 14px 16px;
    border-radius: 8px;
    border: 1px solid rgba(0, 0, 0, 0.06);
    font-size: 14px;
    backdrop-filter: blur(4px);
  }

  .improvement-list {
    margin: 0;
    padding-left: 24px;

    li {
      margin-bottom: 8px;
      color: #374151;
      line-height: 1.7;
      font-size: 14px;
      position: relative;
      padding-left: 4px;

      &::marker {
        color: #10b981;
      }

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .ai-analysis-meta {
    margin-top: 18px;
    padding-top: 14px;
    border-top: 2px dashed #e5e7eb;

    .analysis-time {
      margin: 0;
      font-size: 12px;
      color: #9ca3af;
      font-style: italic;

      i {
        margin-right: 4px;
      }
    }
  }

  :deep(.el-progress) {
    .el-progress__text {
      font-size: 12px !important;
    }
  }
}

// ========== 关闭按钮美化 ==========
:deep(.el-dialog__footer) {
  .el-button--primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    border-radius: 8px;
    padding: 10px 24px;
    font-weight: 600;
    letter-spacing: 0.5px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.45);
      background: linear-gradient(135deg, #5a6fd6 0%, #6a3d96 100%);
    }

    &:active {
      transform: translateY(0);
    }
  }
}
</style>
