<template>
  <div>
    <PageHead title="知识文章">
      <template #buttons>
        <el-button type="primary" @click="handleEdit({})">新增</el-button>
      </template>
    </PageHead>
    <TableSearch :formItem="formItem" @search="handleSearch" />
    <el-table :data="tableData" style="width: 100%; margin-top:25px;">
      <el-table-column width="300" label="文章标题" fixed="left">
        <template #default="scope">
          <div style="display: flex; align-items: center;">
            <el-icon><timer /></el-icon>
            <span>{{ scope.row.title }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="分类" width="200">
        <template #default="scope">
          <div style="display: flex; align-items: center;">
            <el-icon><timer /></el-icon>
            <span>{{ scope.row.categoryName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="authorName" label="作者" width="150" />
      <el-table-column prop="readCount" label="阅读量" width="100" />
      <el-table-column prop="updatedAt" label="发布时间" width="200" />
      <el-table-column label="操作" width="240" fixed="right">
        <template #default="scope">
          <el-button text type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button @click="handlePublish(scope.row)" v-if="scope.row.status === 0 || scope.row.status === 2" text type="success">发布</el-button>
          <el-button @click="handleUnpublish(scope.row)" v-if="scope.row.status === 1" text type="warning">下线</el-button>
          <el-button @click="handleDelete(scope.row)" v-if="scope.row.status === 0 || scope.row.status === 2"  text type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
<el-pagination 
    style="margin-top: 25px;"
    v-model:current-page="pagination.currentPage"
    :page-size="pagination.size"
    layout="prev, pager, next" 
    :total="pagination.total"
    @change="handleChange" />
    <ArticleDialog :article="currentArticle" v-model:modelValue="dialogVisibe" :categories="categories" @success="handleSuccess" />
  </div>
</template>

<script setup>
import {onMounted,reactive,ref} from 'vue'
import PageHead from '@/components/PageHead.vue'
import TableSearch from '@/components/TableSearch.vue';
import { categoryTree, articlePage,getArticleDetail,updateArticleStatus,deleteArticle } from '@/api/admin';
import ArticleDialog from '@/components/ArticleDialog.vue';
import { ElMessageBox,ElMessage } from 'element-plus';


const formItem = [
  {
    comp:'input',
    prop:'title',
    label:'文章标题',
    placeholder:'请输入文章标题'
  },
  {
    comp:'select',
    prop:'categoryId',
    label:'选择分类',
    // options:[
    //   {value:1,label:'人际关系'},
    //   {value:2,label:'工作'},
    //   {value:3,label:'学习'},
    //   {value:4,label:'其他'}],
    placeholder:'请选择分类'
  },
  {
    comp:'select',
    prop:'status',
    label:'状态',
    placeholder:'请选择状态',
    options:[
      {value:1,label:'已发布'},
      {value:2,label:'已下线'},
      {value:0,label:'草稿'}
    ]
  }
]
//分页参数
const pagination = reactive({
  currentPage: 1,
  size: 10,
  total: 0,
})
//列表数据
const tableData = ref([])
//查询事件
const handleSearch = async (formData) => {
  console.log(formData, '查询');
  const params = {
    ...pagination,
    ...formData
  }
  console.log(params,'两盒');
  
  //获取文章分页列表解构data
  const {records,total} = await articlePage(params)
    console.log(records,'文章分页列表');
    tableData.value = records
    pagination.total = total
}

//分页事件
const handleChange = (page) => {
  pagination.currentPage = page
  handleSearch({})
}

//分类映射表
const categoryMap = reactive({})
//分类列表
const categories = ref([])
//新增和编辑
const dialogVisibe = ref(false)
const handleSuccess = () => {
  //关闭弹窗
  dialogVisibe.value = false
  //刷新列表
  handleSearch({})
}
const currentArticle = ref(null)
const handleEdit = (row)=>{
  if(!row.id){
    currentArticle.value = {}
    dialogVisibe.value = true
  }
  else{
    getArticleDetail(row.id).then(res => {
    console.log(res,'文章详情');
    currentArticle.value = res
    dialogVisibe.value = true
  })
  }
 
}
//发布
const handlePublish = (row)=>{
  ElMessageBox.confirm(
    `确认发布文章《${row.title}》吗`,
    '确认',
    {
      confirmButtonText: '确认发布',
      cancelButtonText: '取消',
      type: 'info'
    }
  ).then(()=>{
    updateArticleStatus(row.id,{status:1}).then(res => {
      ElMessage.success('文章发布成功')
      handleSearch({})
    })
  })
}
//下线
const handleUnpublish = (row)=>{
  ElMessageBox.confirm(
    `确认下线文章《${row.title}》吗`,
    '确认',
    {
      confirmButtonText: '确认下线',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(()=>{
    updateArticleStatus(row.id,{status:2}).then(res => {
      ElMessage.success('文章下线成功')
      handleSearch({})
    })
  })
}
//删除
const handleDelete = (row)=>{
  ElMessageBox.confirm(
    `确认删除文章《${row.title}》吗`,
    '确认',
    {
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
      type: 'danger'
    }
  ).then(()=>{
    deleteArticle(row.id).then(() => {
      ElMessage.success('文章删除成功')
      handleSearch({})
    })
  })
}
//后端获取分类树
onMounted(async () => {
  const data = await categoryTree()
  console.log(data,'分类树');

  categories.value = data.map(item => {
    categoryMap[item.id] = item.categoryName
    return {
      label:item.categoryName,
      value:item.id
    }
  })
  console.log(categories.value);
  
  formItem[1].options = categories.value
})

</script>
