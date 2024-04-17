export default () => {
    const uploadFile = async (file: File, index:string, date:Date) => {     
        const formData = new FormData();
        formData.append('file', file, file.name);
        formData.append('index', index);
        formData.append('date', date.toString())
        const response = await $fetch('/api/file/uploadFile', {
            method: 'POST',
            body: formData
        });
        return 'File uploaded successfully';
    }
    const getFileList = async () => {
        const fileList = await $fetch('/api/file/getFile');
        return fileList;
    }
    return { uploadFile, getFileList };
}