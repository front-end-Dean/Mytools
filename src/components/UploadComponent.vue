<template>
  <div class="uploadComponentContainer">
    <el-upload class="upload-demo" drag action="#" multiple :on-change="handleFileChange" :auto-upload="false"
      :accept="'.xlsx, .xls'" :disabled="!filterName">
      <div class="el-upload__text">
        拖拽文件至此或<em>点击上传</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">只能上传xlsx/xls文件</div>
      </template>
    </el-upload>
  </div>
</template>

<script lang="ts" setup>
import { ElUpload, ElMessage, ElLoading } from 'element-plus';
import * as XLSX from 'xlsx';

const props = defineProps({
  filterName: {
    type: String,
    default: ''
  }
});

const emits = defineEmits(['update:analysisData']);

const handleFileChange = (file: any) => {
  const fileReader = new FileReader();
  const loading = ElLoading.service({ text: '正在解析文件...' });

  fileReader.onload = async (e) => {
    try {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as Array<Array<any>>;

      if (!jsonData.length) return;

      localStorage.setItem('tableHeader', JSON.stringify(jsonData[0]));

      if (props.filterName) {
        const filteredData = jsonData.filter((row) => row[15] === props.filterName.trim());
        emits('update:analysisData', filteredData, jsonData[0]);
      } else {
        emits('update:analysisData', jsonData.slice(1), jsonData[0]);
      }
    } catch (error) {
      ElMessage.error('文件解析失败，请检查文件格式');
    } finally {
      loading.close();
    }
  };

  fileReader.readAsArrayBuffer(file.raw);
};
</script>

<style scoped>
.el-upload__text em {
  color: #409EFF;
}

.uploadComponentContainer {
  width: 100%;
  height: 300px;
}

.upload-demo {
  height: 100%;
}

:deep(.el-upload) {
  height: 100%;
}

:deep(.el-upload-dragger) {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
