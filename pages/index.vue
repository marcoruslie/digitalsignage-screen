<template>
  <div>
    <!-- <slide-show-design :fileList="fileList" :currentIndex="currentIndex" :leaving="leaving" :currentItem="currentItem" /> -->
    <!-- <two-side-design :kategori="'lowongan'" :dataList="fileList" :currentItem="currentLowongan" /> -->
    <h1>
      {{ dataFromServer }}
    </h1>
  </div>
</template>

<script setup lang="ts">
import { io } from 'socket.io-client';
const dataFromServer = ref('')
const { getLaporanBAK, getLowongan, getPengumuman } = useDataISTTS()
const { getFileList } = useFileData();
const fileList = ref(await getFileList())
const currentIndex = ref(0);
const leaving = ref(false);
const currentItem: any = computed(() => fileList.value[currentIndex.value] || {});
const [pengumumanRes, lowonganRes, laporanBAKRes]: any = await Promise.all([getPengumuman(), getLowongan(), getLaporanBAK()])
const dataPengumuman = pengumumanRes.response
const dataLowongan = lowonganRes.response
const dataLaporanBAK = laporanBAKRes.response
const currentPengumuman: any = computed(() => dataPengumuman[currentIndex.value] || {});
const currentLowongan: any = computed(() => dataLowongan[currentIndex.value] || {});
const currentLaporanBAK: any = computed(() => dataLaporanBAK[currentIndex.value] || {});

onMounted(async () => {

  const socket = io('http://192.168.0.197:3000', {
    path: '/api/socket.io',
  });
  socket.connect();
  // if(!socket.connected){
  //   setInterval(() => {
  //     useRouter().go(0);
  //   }, 5000);
  // }
  socket.on('tes', (response: Record<string, string>) => {
    console.log(response);
  })
  socket.on('tes2', (response: Record<string, string>) => {
    dataFromServer.value = response.message
  })
  socket.on('sendData', (response: Record<string, string>) => {
    console.log(response);
    dataFromServer.value = response.message
  })
  
  socket.on('refresh', () => {
    useRouter().go(0);
  })
  setInterval(() => {
    leaving.value = true;
    setTimeout(() => {
      currentIndex.value = (currentIndex.value + 1) % fileList.value.length;
      leaving.value = false;
    }, 500);
  }, 5000);
});

</script>