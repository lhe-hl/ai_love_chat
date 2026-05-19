<template>
  <el-dialog
    :title="isEdit ? '编辑文章' : '文章详情'"
    v-model="dialogVisible"
    width="50%"
    @close="handleClose"
  >
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formData.title" placeholder="请输入文章标题" maxlength="200" show-word-limit clearable></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="categoryId">
        <el-select v-model="formData.categoryId" placeholder="请选择文章分类" clearable>
          <el-option v-for="item in props.categories" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="文章摘要" prop="summary">
        <el-input type="textarea" v-model="formData.summary" placeholder="请输入文章摘要（可选）" maxlength="1000" show-word-limit clearable :rows="4"></el-input>
      </el-form-item>
      <el-form-item label="文章标签" prop="tags">
        <el-select v-model="formData.tagArray" placeholder="请选择文章标签" clearable multiple filterable allow-create style="width: 100%">
          <el-option v-for="item in commonTags" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="封面图片" style="margin-top: 30px;">
        <div class="cover-upload">
          <el-upload
            class="avatar-uploader"
            :before-upload="beforeUpload"
            :http-request="handleUploadRequest"
            :show-file-list="false"
            accept="image/*"
          >
            <div v-if="!imgUrl" class="cover-placeholder">
              <p>点击上传封面</p>
            </div>
            <img v-else :src="imgUrl" alt="封面">
          </el-upload>
          <div v-if="imgUrl">
            <el-button type="danger" size="mini" @click="handleRemove">删除封面</el-button>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <RichTextEditor 
        v-model="formData.content" 
        placeholder="请输入文章内容"
        :maxCharCount="5000"
        @change="handleContentChange"
        @created="handleEditorCreated"
        min-height="400px"
        />
      </el-form-item>
    </el-form>
    <div v-if="btnPreview">
      <h3>内容预览</h3>
      <div v-html="formData.content"></div>
    </div>
    <template #footer>
      <el-button @click="btnPreview = !btnPreview">{{ btnPreview ? '关闭预览' : '预览效果' }}</el-button>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="loading">{{ isEdit ? '更新文章' : '新增文章' }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref,reactive,computed,nextTick, watch } from 'vue'
import { uploadFile,createArticle,updateArticle } from '@/api/admin'
import { ElMessage } from 'element-plus'
import { fileBaseUrl } from '@/config/index'
import RichTextEditor from '@/components/RichTextEditor.vue'
// 定义props，用于接收父组件传递的modelValue值
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  categories: {
    type: Array,
    default: () => []
  },
  article: {
    type: Object,
    default: null
  }
})
// 定义emit，用于触发父组件的update:modelValue事件
const emit = defineEmits(['update:modelValue','success'])
const dialogVisible = computed({
  get(){
    return props.modelValue
  },
  set(val){
    emit('update:modelValue',val)
  }
})
//判断打开的是新增还是编辑文章
const isEdit = computed(()=> !!props.article?.id)

//监听编辑数据
watch(()=>props.article, (newVal) => {
  if(newVal){
    nextTick(()=>{
      Object.assign(formData, newVal)
      //使用现有的id
      businessId.value = newVal.id
      //封面Url
      imgUrl.value = fileBaseUrl + newVal.coverImage
    })
  }
})
const handleClose = () => {
  //重置表单
  formRef.value.resetFields()
  //重置id
  businessId.value = null
  //重置标签
  formData.tagArray = []
  //重置封面图片和数据
  handleRemove()
  emit('update:modelValue',false)

}

// 定义表单数据
const formData = reactive(
  {
    "title": "",
    "content": "",
    "coverImage": "",
    "categoryId": "",
    "summary": "",
    "tags": "",
    "id": ""
}
)
const commonTags = [
  '情绪管理', '焦虑', '抑郁', '压力', '睡眠', 
  '冥想', '正念', '放松', '心理健康', '自我成长',
  '人际关系', '工作压力', '学习方法', '生活技巧'
]
// 定义表单验证规则
const rules = reactive({
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' }
  ],
  categoryId: [
    { required: true, message: '请选择文章分类', trigger: 'change' }
  ],
  summary: [
    { required: false, message: '请输入文章摘要（可选）', trigger: 'blur' }
  ],
  tags: [
    { required: false, message: '请选择文章标签', trigger: 'change' }
  ],
  content: [
    { required: true, message: '请输入文章内容', trigger: 'blur' },
    { max: 5000, message: '文章内容长度必须在10000以内', trigger: 'blur' }
  ]
})
//上传
const imgUrl = ref('')
const beforeUpload = (file)=>{
  //针对上传的文件进行校验
  console.log(file);
  const isImage = file.type.startsWith('image/')
  const isLt5 = file.size / 1024 / 1024 < 5
  if(!isImage){
    ElMessage.error('请上传图片文件')
    return false
  }
  if(!isLt5){
    ElMessage.error('图片大小不能超过5MB')
    return false
  }
  return isImage
}
const businessId = ref(null)
// 自定义上传文件方法（覆盖el-upload默认上传行为）
const handleUploadRequest = async ({ file }) => {
  // 生成唯一随机ID，用于标识当前上传的文件归属
  businessId.value = crypto.randomUUID()

  // 调用封装好的上传接口，传入文件和业务ID
  const fileRes = await uploadFile(file, {
      businessId: businessId.value
  })

  // 打印接口返回结果（调试用）
  console.log(fileRes)

  // 拼接完整的图片访问地址 → 用于页面预览显示
  imgUrl.value = `${fileBaseUrl}${fileRes.filePath}`

  // 把后端返回的图片存储路径 → 存入表单，用于提交保存
  formData.coverImage = fileRes.filePath
}

//删除封面
const handleRemove = () => {
  imgUrl.value = ''
  formData.coverImage = ''
}
//富文本
const handleContentChange = (data) => {
  console.log(data,'富文本');
  formData.content = data.html
  
}
//富文本创建
const editorInstance = ref(null)
const handleEditorCreated = (editor) => {
  editorInstance.value = editor
  //编辑
  if(formData.content && editor){
    nextTick(() => {
      editor.setHtml(formData.content)
    })
  }
}
//预览状态
const btnPreview = ref(false)
//提交
const formRef = ref(null)
const loading = ref(false)
//提交文章
const handleSubmit = async () => {
  formRef.value.validate((valid,fields)=>{
    if(valid){
      loading.value = true
    }
    console.log(formData,'formData');
    const submitData = {
      ...formData,
      tags: formData.tagArray.join(',')
    }
    delete submitData.tagArray

    if(!isEdit.value) {
      submitData.id = businessId.value
      createArticle(submitData).then(res => {
        ElMessage.success('文章创建成功')
        loading.value = false
        emit('success')
    })
    }
    else {
      updateArticle(props.article.id,submitData).then(res => {
        ElMessage.success('文章更新成功')
        loading.value = false
        emit('success')
    })
    }
    
  })
}
</script>

<style scoped lang="scss">
.cover-upload{
  .cover-placeholder {
  width: 200px;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #8b949e;
  background: #f6f8fa;
  }
  img {
      width: 200px;
      height: 120px;
      display: block;
      object-fit: cover;
    }
}

</style>
