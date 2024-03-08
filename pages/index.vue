<template>
  <div>
    <div v-if="fileList.length != 0">
      <!-- Input element for file selection -->
      <input type="file" @change="handleFileChange">
      <!-- Button to trigger file selection -->
      <button @click="upload">Upload File</button>
      <br>
      <div style="display: flex; flex-wrap: wrap;">{{ previewImage }}</div>
      <img v-if="isImage && file != null" :src="previewImage" alt="preview" style="width: auto; height: 90vh;">
      <video v-if="!isImage && file != null" controls style="width: auto; height: 90vh;">
        <source :src="previewImage" type="video/mp4">
      </video>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import { io } from 'socket.io-client';

const { uploadFile, getFileList } = useFileData();
const file = ref<File | null>(null);
const previewImage = ref('');
const isImage = ref(false);
const uploadedUrl = ref(null);
const fileList = ref([])
const currentContent = ref('');



onMounted(async () => {
  fileList.value = await getFileList();
  console.log(io)
  const socket = io('http://10.10.2.240:3000/api/socket.io');

  socket.on('/chat', (response: Record<string,string>) => {
    console.log(response);
  })
  console.log(fileList.value[0]);
});
const handleFileChange = async (event: Event) => {
  const _file = (event.target as HTMLInputElement).files?.[0];
  if (!_file) return;
  file.value = _file;
  isImage.value = file.value.type.includes('image');
  handlePreviewContent(file.value);
};

const handlePreviewContent = (file: File) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    previewImage.value = e.target?.result as string;
    console.log(previewImage.value);
  };
  reader.readAsDataURL(file);
};

const upload = async () => {
  if (!file.value) return;
  try {
    const response = await uploadFile(file.value, fileList.value.length + 1 + "-" + "2");
    alert(response);
  } catch (error) {
    console.error('Error uploading file:', error);
  }
}

const handleContentChange = (event: Event) => {

}
</script>