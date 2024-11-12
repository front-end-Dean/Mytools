<template>
  <div class="questionCardContainer">
    <el-card>
      <h3>第{{ index + 1 }}题</h3>
      <h4>原始题干</h4>
      <p>{{ questionInfoCopy[5] }}</p>
      <h4>原始问题</h4>
      <p>{{ questionInfoCopy[6] }}</p>
      <h4>原始选项</h4>
      <p>{{ questionInfoCopy[7] }}</p>
      <h4>原始答案</h4>
      <p>{{ questionInfoCopy[8] }}</p>
      <h4>题干解析(机器)</h4>
      <p>{{ questionInfoCopy[9] }}</p>

      <h4>输出结果</h4>
      <el-form label-position="top">
        <el-radio-group v-model="questionInfoCopy[13]" @change="updateAnswerDebounced(13)">
          <el-radio :value="1" size="large">答案正确</el-radio>
          <el-radio :value="0" size="large">答案错误</el-radio>
          <el-radio value="-" size="large">未给出答案</el-radio>
        </el-radio-group><br />
        <el-radio-group v-model="questionInfoCopy[14]" @change="updateAnswerDebounced(14)">
          <el-radio :value="1" size="large">推理正确</el-radio>
          <el-radio :value="0" size="large">推理错误</el-radio>
          <el-radio value="-" size="large">未给出推理</el-radio>
        </el-radio-group>
        <el-form-item label="备注" style="margin-top:1em">
          <el-input type="textarea" v-model="questionInfoCopy[16]" @blur="updateAnswerDebounced(16)" />
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { ElCard, ElForm, ElRadio, ElRadioGroup, ElFormItem, ElInput } from 'element-plus';
import debounce from '@/utils/index';

const props = defineProps({
  index: {
    type: Number,
    required: true
  },
  questionInfo: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update:questionInfo']);

// 创建 questionInfo 的本地副本
const questionInfoCopy = ref({ ...props.questionInfo });

// 同步 questionInfo 的变化到本地副本
watch(() => props.questionInfo, newVal => {
  questionInfoCopy.value = { ...newVal };
});

// 使用 debounce 函数优化数据传递
const updateAnswerDebounced = debounce((columnIndex: number) => {
  emit('update:questionInfo', props.index, columnIndex, questionInfoCopy.value[columnIndex]);
}, 0);
</script>

<style scoped>
.questionCardContainer {
  margin: 20px 0;
}

h4 {
  margin: 10px 0;
  font-size: 16px;
  font-weight: bold;
}

p {
  margin: 10px 0;
  text-indent: 2em;
  font-size: 14px;
}
</style>
