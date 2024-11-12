<template>
  <div class="HomeViewContainer">
    <div class="back" @click="goBack" v-if="!isShowUpload">
      <el-icon :size="20">
        <RefreshLeft />
      </el-icon>
    </div>
    <div class="generateExcel" @click="generateExcel" v-if="!isShowUpload">
      <el-icon :size="20">
        <MagicStick />
      </el-icon>
    </div>
    <div class="filterContainer">
      <el-input v-if="isShowUpload" v-model="filterName" type="text" placeholder="请输入您在表格中的名字"></el-input>
    </div>
    <UploadComponent @update:analysis-data="getAnalysisData" v-if="isShowUpload" :filterName="filterName">
    </UploadComponent>
    <QuestionCard v-for="(item, index) in analysisData" :key="index" :question-info="item" :index="index"
      @update:questionInfo="changeQuestionInfo"></QuestionCard>
  </div>
</template>

<script setup lang="ts">
import UploadComponent from '@/components/UploadComponent.vue';
import QuestionCard from '@/components/QuestionCard.vue';
import { ElInput, ElIcon, ElLoading, ElMessageBox } from 'element-plus';
import { MagicStick, RefreshLeft } from '@element-plus/icons-vue';
import { ref, onMounted } from 'vue';
import * as XLSX from 'xlsx';

const isShowUpload = ref(true);
const filterName = ref('');
const analysisData = ref<Array<Array<any>>>([]);
const headerData = ref([]);

onMounted(() => {
  const questionInfo = localStorage.getItem('questionInfo');
  if (questionInfo) {
    analysisData.value = JSON.parse(questionInfo);
    isShowUpload.value = false;
  }
});

const getAnalysisData = (data: any, header: any) => {
  analysisData.value = data;
  headerData.value = header;
  localStorage.setItem('questionInfo', JSON.stringify(analysisData.value));
  isShowUpload.value = false;
};

const changeQuestionInfo = (rowIndex: number, columnIndex: number, value: 0 | 1 | string) => {
  analysisData.value[rowIndex][columnIndex] = value;
  localStorage.setItem('questionInfo', JSON.stringify(analysisData.value));
};

const goBack = () => {
  ElMessageBox.confirm(
    '此操作会清除所有已审核数据，确认继续?',
    '取消确认',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    filterName.value = '';
    analysisData.value = [];
    localStorage.removeItem('questionInfo');
    isShowUpload.value = true;
  });
};

const generateExcel = () => {
  const loading = ElLoading.service({ text: '正在生成 Excel 文件...' });
  try {
    const tableHeader = JSON.parse(localStorage.getItem('tableHeader')!);
    const tableData = JSON.parse(localStorage.getItem('questionInfo')!);

    const worksheet = XLSX.utils.json_to_sheet([tableHeader].concat(tableData), { skipHeader: true });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const fileName = `题目解析内部体验审核结果-${filterName.value}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  } finally {
    loading.close();
  }
};
</script>

<style scoped>
.HomeViewContainer {
  width: 100%;
}

.filterContainer {
  margin-bottom: 30px;
}

.generateExcel,
.back {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 999;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  background-color: #409EFF;
  cursor: pointer;
}

.back {
  bottom: 90px;
  background-color: #fff;
  color: #409EFF;
}
</style>
