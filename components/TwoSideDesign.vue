<template>
    <div class="relative flex flex-col justify-between h-screen">
        <div v-if="kategori === 'lowongan'"
            class="bg-gradient-to-tl from-Primary to-OnPrimaryContainer max-h-[95vh] h-[95vh] overflow-hidden">
            <div class="flex justify-center items-center w-full">
                <div class="flex h-[80vh] w-1/3 bg-black bg-opacity-30 rounded-md">
                    <div class="flex flex-col justify-center items-center text-center text-PrimaryContainer">
                        <div class="text-3xl font-bold">{{ currentItem.perusahaan_nama }}</div>
                        <div class="text-lg">{{ currentItem.lowongan_judul }}</div>
                        <div class="text-lg">{{ currentItem.lowongan_posisi }}</div>
                    </div>
                </div>
                <div class="flex justify-center items-center h-[95vh] w-2/3">
                    <img :src="currentItem.link" class="h-screen" />
                </div>
            </div>
        </div>
        <div v-if="dataList.length != 0 && kategori === 'iklan'"
            class="bg-gradient-to-tl from-Primary to-OnPrimaryContainer max-h-[95vh] h-[95vh] overflow-hidden">
            <div class="flex justify-center items-center w-full">
                <div class="flex justify-center items-center h-[95vh] w-1/3 bg-black bg-opacity-30">
                    <img v-if="currentItem.type === 'image'" :src="'/_nuxt/' + currentItem.url" class="h-screen" />
                    <video v-else autoplay class="">
                        <source :src="'/_nuxt/' + currentItem.url" type="video/mp4" />
                    </video>
                </div>
                <div class="flex justify-center items-center h-[95vh] w-2/3">
                    <img v-if="currentItem.type === 'image'" :src="'/_nuxt/' + currentItem.url" class="h-screen" />
                    <video v-else autoplay class="">
                        <source :src="'/_nuxt/' + currentItem.url" type="video/mp4" />
                    </video>
                </div>
            </div>
        </div>
        <footer class="h-[5vh] w-full bg-PrimaryContainer absolute bottom-0 left-0 flex items-center justify-center">
            <div class="text-lg">Digital Signage ISTTS</div>
            <img src="/LogoISTTS.png" alt="" class="h-[5vh]">
        </footer>
    </div>
</template>

<script setup>
const { kategori ,dataList, currentItem } = defineProps(['kategori','dataList', 'currentItem']);
</script>