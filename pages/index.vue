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
      <two-side-design v-if="currentItem != ''" :currentItem="currentItem" />
    </div>
    <div v-else>
      <h1>NO TEMPLATE</h1>
    </div>
    <div class="hidden"></div>
    <div id="player"></div>
    <marquee class="bg-OnPrimaryContainer h-[5vh] flex">
      <div class="flex items-center">
        <div class="text-lg text-PrimaryContainer">Digital Signage ISTTS</div>
        <img src="/LogoISTTS.png" alt="" class="h-[5vh]">
      </div>
    </marquee>
  </div>
</template>

<script setup>
import { io } from 'socket.io-client';
const { getTemplate, setTemplate } = useTemplate()
const template = ref(await getTemplate())
const { getFileList, getAllPlaylist } = useFileData();
const router = useRouter()
const routePath = ref('')
// Youtube API
let youtubePlayer;
// SLIDE SHOW DESIGN VARIABLES
const fileList = ref(await getFileList())
const currentIndex = ref(0);
const leaving = ref(false);
const currentItem = ref('')
// TWO SIDE DESIGN VARIABLES
// THREE SIDE DESIGN VARIABLES


// const host = "http://192.168.0.197:3000/"
// const host = "http://10.10.4.210:3000/"
const host = "http://localhost:3000/"
const socket = io(host, {
  path: '/api/socket.io',
});
// EVENT FROM SERVER
socket.on('changeTemplate', async (data) => {
  const temp = {
    oldName: template.value,
    newName: data.template
  }
  console.log(temp)
  await setTemplate(temp)
  router.go()
})
socket.on('connect', () => {
  socket.emit('clientType', window.location.origin)
})
socket.on('tes', (response) => {
  console.log(response);
})
socket.on('reqDataPlaylist', async () => {
  socket.emit('resDataPlaylist', await getAllPlaylist())
})
socket.on('playMusic',(data)=>{
  playVideo(data.id)
})

onMounted(async () => {
  // Load the YouTube Player API script dynamically
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  routePath.value = `${window.location.origin}`
  playContent()
});
// Function to create and initialize the YouTube player
const playVideo = (vidId) => {
  if (YT && YT.Player) {
    youtubePlayer = new YT.Player('player', {
      height: '315',
      width: '560',
      videoId: vidId, // Replace with your video ID
      playerVars: {
        loop: 1, // Enable video looping
      },
      events: {
        'onReady': onPlayerReady
      }
    });
  }
};
// Function called when the player is ready
const onPlayerReady = (event) => {
  event.target.playVideo(); // Automatically start playing the video
};
// Function to pause the video
const pauseVideo = () => {
  if (youtubePlayer) {
    youtubePlayer.pauseVideo();
  }
};
// Function to resume the video
const resumeVideo = () => {
  if (youtubePlayer) {
    youtubePlayer.playVideo();
  }
};
const playContent = async () => {
  while (template.value != 'loading') {
    for (const file of fileList.value) {
      for (const content of file.dataContent) {
        currentIndex.value = file.dataContent.indexOf(content);
        currentItem.value = content;
        // console.log(currentItem.value);
        await delayWithLogging(file.duration * 1000); // 10 seconds delay
      }
    }
  }
}
const playReminder = async () => {

}
function delayWithLogging(ms) {
  let seconds = 0;
  return new Promise(resolve => {
    const interval = setInterval(() => {
      seconds++;
      // console.log(`Elapsed time: ${seconds} seconds`);
    }, 1000);
    setTimeout(() => {
      clearInterval(interval);
      resolve();
    }, ms);
  });
}
</script>