<template>
    <div
        class="bg-gradient-to-tl from-Primary to-OnPrimaryContainer overflow-hidden h-[97vw] w-[100vh] flex justify-center items-center">
        <img v-if="currentItem1.type === 'image'" :src="'/_nuxt/' + currentItem1.url" class="w-full" />
        <video v-else-if="currentItem1.type === 'video'" autoplay controls playsinline class="h-full"
            @canplay="playVideo">
            <source :src="'/_nuxt/' + currentItem1.url" type="video/mp4" />
        </video>
    </div>
</template>

<script setup>
const { currentItem1 } = defineProps(["currentItem1"])
const playVideo = (event) => {
    const video = event.target;
    video.play().catch((error) => {
        console.warn("Autoplay blocked:", error);
    });
};
</script>
