export default () => {
    const getTemplate = async () => {
        try {
            const templateFileName = await $fetch("/api/template/getTemplate");
            return templateFileName;
        } catch (error) {
            console.error("Error getting template file name:", error);
            return null;
        }
    }
    const setTemplate = async(data:any) => {
        try {
            const templateFileName = await $fetch("/api/template/setTemplate", {
                method: "POST",
                body: {
                    'oldName': data.oldName,
                    'newName': data.newName,
                },
            });
            return templateFileName;
        } catch (error) {
            console.error("Error setting template file name:", error);
            return null;
        }
    }
    return { getTemplate, setTemplate }
}