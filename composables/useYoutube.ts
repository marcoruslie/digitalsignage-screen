export default () => {
  const getYoutubeMusic = async () => {
    try {
        const youtubeFileName = await $fetch("/api/youtube/getYoutubeId");
        return youtubeFileName;
    } catch (error) {
        console.error("Error getting template file name:", error);
        return null;
    }
}
const setYoutubeMusic = async(data:any) => {
    try {
        const youtubeFileName = await $fetch("/api/youtube/setYoutubeId", {
            method: "POST",
            body: {
                'oldName': data.oldName,
                'newName': data.newName,
            },
        });
        return youtubeFileName;
    } catch (error) {
        console.error("Error setting template file name:", error);
        return null;
    }
}
return { getYoutubeMusic, setYoutubeMusic }
}
