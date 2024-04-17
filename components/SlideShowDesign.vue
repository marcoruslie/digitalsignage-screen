<template>
    <div class="relative flex flex-col justify-between h-screen">
        
        <div v-if="fileList.length != 0"
            class="bg-gradient-to-tl from-Primary to-OnPrimaryContainer max-h-[95vh] overflow-hidden">
            <transition name="slide" class="transition-transform duration-500 ease-in-out h-full overflow-hidden"
                style="overflow: hidden;">
                <div :key="currentIndex" class="flex justify-center items-center w-full transform overflow-hidden"
                    style="overflow: hidden;" :class="{ 'translate-x-full': leaving }">
                    <img v-if="currentItem.type === 'image'" :src="'/_nuxt/' + currentItem.url"
                        class="object-cover h-full" />
                    <video v-else autoplay class="object-cover h-full">
                        <source :src="'/_nuxt/' + currentItem.url" type="video/mp4" />
                    </video>
                </div>
            </transition>
        </div>
        <footer class="h-[5vh] w-full bg-PrimaryContainer absolute bottom-0 left-0 flex items-center justify-center">
            <div class="text-lg">Digital Signage ISTTS</div>
            <img src="/public/LogoISTTS.png" alt="" class="h-[5vh]">
        </footer>
    </div>
</template>

<script setup>

const {fileList, currentIndex, currentItem, leaving} = defineProps(['fileList', 'currentIndex', 'currentItem', 'leaving']);
</script>