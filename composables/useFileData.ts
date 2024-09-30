export default () => {
  const uploadFile = async (file: File, index: string, date: Date) => {
    const formData = new FormData();
    formData.append("file", file, file.name);
    formData.append("index", index);
    formData.append("date", date.toString());
    const response = await $fetch("/api/file/uploadFile", {
      method: "POST",
      body: formData,
    });
    return "File uploaded successfully";
  };
  const getFileList = async () => {
    const fileList = await $fetch("/api/file/getJsonFile");
    return fileList;
  };
  const getReminder = async () => {
    const reminder = await $fetch("/api/file/getReminderFile");
    return reminder;
  };
  const getAllPlaylist = async () => {
    const allPlaylist = await $fetch("/api/file/getAllFile");
    return allPlaylist;
  };
  const saveFile = async (data: any): Promise<void> => {
    try {
      const response = await fetch("/api/file/saveFile", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to save files");
      }

      console.log(response);
      return response.json();
    } catch (error) {
      console.error("Error saving files:", error);
    }
  };
  const changeJsonFile = async (
    resourceDir: string,
    fileName: string,
    json: any
  ) => {
    try {
      const response = await fetch("/api/file/changeJsonFile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resourceDir, fileName, json }),
      });

      if (!response.ok) {
        throw new Error("Failed to change file");
      }
      return "success";
    } catch (error) {
      console.error("Error changing file:", error);
    }
  };
  return {
    uploadFile,
    getFileList,
    getAllPlaylist,
    getReminder,
    saveFile,
    changeJsonFile,
  };
};
