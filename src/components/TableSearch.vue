<template>
  <div class="table-search">
    <el-form  ref="ruleFormRef" :model="formData" class="search-form">
      <el-row :gutter="24">
        <template v-for="(item, index) in formItemAttrs" :key="item.prop">
          <el-col v-bind="item.col">
            <el-form-item :label="item.label" :prop="item.prop" class="form-item">
              <!-- 动态渲染组件 -->
              <component 
                :is="isComp(item.comp)" 
                :placeholder="item.placeholder" 
                v-model="formData[item.prop]"
                class="form-component"
              >
                <template v-if="item.comp === 'select'">
                  <el-option 
                    v-for="option in item.options" 
                    :key="option.value" 
                    :label="option.label" 
                    :value="option.value"
                  >
                  </el-option>
                </template>
              </component>
            </el-form-item>
          </el-col>
        </template>
      </el-row>
      <el-row class="button-row">
        <el-col :span="24" class="text-right">
          <el-button type="primary" @click="handleSubmit" class="search-button">查询</el-button>
          <el-button @click="handleReset(ruleFormRef)" class="reset-button">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'

const props = defineProps({
  formItem: {
    type: Array,
    default: () => []
  }
})
//定义emit以便把数据甩给父级
const emit = defineEmits(['search'])
//响应式计算属性
const formItemAttrs = computed(()=>{
  const {formItem} = props
  formItem.forEach(item => {
    item.col = {xs:24, sm:12, md:8, lg:6, xl:6}
  });
  return formItem
})
//表单数据
const formData = reactive({})
//表单实例
const ruleFormRef = ref(null)



const isComp = (comp) => {
  return {
    input:'el-input',
    select:'el-select'
  }[comp]
}

//查询事件
const handleSubmit = () => {
  //把数据甩给父级
  emit('search', formData)
}
//重置事件
const handleReset = (formEl) => {
  //先重置表单，然后触发查询
  if(!formEl){
    return
  }
  formEl.resetFields()
  emit('search', formData)
}
</script>

<style lang="scss" scoped>
.table-search {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
}

.search-form {
  .form-item {
    margin-bottom: 15px;
    
    .el-form-item__label {
      font-weight: 500;
      color: #333;
    }
  }
  
  .form-component {
    width: 100%;
  }
  
  .button-row {
    padding-top: 12px;
    border-top: 1px solid #f0f0f0;
    
    .search-button {
      margin-right: 10px;
    }
  }
}
</style>