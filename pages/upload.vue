<template>
    <input type="file" name="" id="" multiple>
    <button @click="upload">Upload File</button>
    <br>
    <div style="display: flex; flex-wrap: wrap;">{{ previewImage }}</div>
    <img v-if="isImage && file != null" :src="previewImage" alt="preview" style="width: auto; height: 90vh;">
    <video v-if="!isImage && file != null" controls style="width: auto; height: 90vh;">
        <source :src="previewImage" type="video/mp4">
    </video>
</template>
<script setup lang="ts">
const { uploadFile, getFileList } = useFileData();
const file = ref<File | null>(null);
const previewImage = ref('');
const isImage = ref(false);
const fileList = ref(await getFileList())
const postDate = ref<Date>(new Date());


onMounted(async () => {
});
const handleFileChange = async (event: Event) => {
    const _file = (event.target as HTMLInputElement).files?.[0] as File;
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
        const response = await uploadFile(file.value, (fileList.value.length + 1) + "-" + "2",postDate.value);
        alert(response);
    } catch (error) {
        console.error('Error uploading file:', error);
    }
}
</script>