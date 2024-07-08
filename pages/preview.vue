<template>
  <div class="h-screen">
    <!-- {{ routePath }} -->
    <!-- <div v-for="file in fileList">
      <div>{{ file.duration }}</div>
      <div v-for="content in file.dataContent">{{ content }}</div>
    </div> -->
    <marquee class="text-2xl text-OnPrimary bg-Primary h-[5vh] flex items-center">
      Digital Signage ISTTS
    </marquee>
    <div v-if="template == 'loading'">Loading...</div>
    <div v-else-if="template == 'template1'">
      <slide-show-design :fileList="fileList" :currentIndex="currentIndex" :leaving="leaving"
        :currentItem="currentItem" />
    </div>
    <div v-else-if="template == 'template2'" class="relative flex flex-col justify-between">
      <two-side-design v-if="currentItem!=''" :currentItem="currentItem" />
    </div>
    <div v-else>
      <h1>NO TEMPLATE</h1>
    </div>
    <marquee class="bg-OnPrimaryContainer h-[5vh] flex">
      <div class="h-[5vh]  absolute bottom-0 left-0 flex items-center justify-center">
        <div class="text-lg text-PrimaryContainer">Digital Signage ISTTS</div>
        <img src="/LogoISTTS.png" alt="" class="h-[5vh]">
      </div>
    </marquee>
  </div>
</template>

<script setup>
const { getTemplate, setTemplate } = useTemplate()
const template = ref(await getTemplate())
const { getFileList } = useFileData();

const routePath = ref('')
// SLIDE SHOW DESIGN VARIABLES
const fileList = ref(await getFileList())
const currentIndex = ref(0);
const leaving = ref(false);
const currentItem = ref('')
onMounted(async () => {
  routePath.value = `${window.location.origin}`
  playContent()
});
const playContent = async() => {
  while(true){
    for (const file of fileList.value) {
      for (const content of file.dataContent) {
        currentIndex.value = file.dataContent.indexOf(content);
        currentItem.value = content;
        await delayWithLogging(file.duration*1000); // 10 seconds delay
      }
    }
  }
}
function delayWithLogging(ms) {
  let seconds = 0;
  return new Promise(resolve => {
    const interval = setInterval(() => {
      seconds++;
    }, 1000);
    setTimeout(() => {
      clearInterval(interval);
      resolve();
    }, ms);
  });
}
</script>