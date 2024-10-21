<template>
    <div class="bg-gradient-to-tl from-Primary to-OnPrimaryContainer overflow-hidden h-[97vw] w-[100vh] flex justify-center items-center"
        @click="unmuteVideo">
        <img v-if="currentItem1.type === 'image'" :src="'/_nuxt/' + currentItem1.url" class="w-full" />
        <video v-else-if="currentItem1.type === 'video'" ref="video" autoplay muted playsinline controls class="h-full">
            <source :src="'/_nuxt/' + currentItem1.url" type="video/mp4" />
        </video>
    </div>
</template>

<script setup>
const { currentItem1 } = defineProps(["currentItem1"])

const video = ref(null);

const unmuteVideo = () => {
    if (video.value) {
        video.value.muted = false; // Unmute video
        video.value.play(); // Ensure playback continues
    }
};
</script>
