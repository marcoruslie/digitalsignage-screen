<template>
    <div class="bg-gradient-to-tl from-Primary to-OnPrimaryContainer h-[95vh] overflow-hidden">
        <div class="flex justify-center items-center w-full h-full">
            <div class="flex flex-col h-[95vh] w-1/2 overflow-auto shadow-lg">
                <!-- Konten 1 -->
                <div class="h-1/2 flex flex-col items-center justify-center relative">
                    <div
                        class="flex bg-OnPrimaryContainer text-OnPrimary items-center justify-center text-[1.6vw] font-medium w-full text-center py-1">
                        {{
                            currentItem1.title ?
                                currentItem1.title : 'TIDAK ADA JUDUL' }}
                    </div>
                    <div class="flex-1 w-full overflow-hidden">
                        <img v-if="currentItem1.type === 'image'" :src="'/_nuxt/' + currentItem1.url"
                            class="w-full h-full object-contain" />
                        <video v-else-if="currentItem1.type === 'video'" ref="video" autoplay controls muted playsinline
                            class="w-full h-full object-contain" @playing="unmuteVideo1" @ended="videoEnded">
                            <source :src="'/_nuxt/' + currentItem1.url" type="video/mp4" />
                        </video>
                    </div>
                </div>
                <!-- Konten 2 -->
                <div class="h-1/2 flex flex-col items-center bg-opacity-60 justify-center overflow-auto">
                    <div
                        class="flex bg-OnPrimaryContainer text-OnPrimary items-center justify-center text-[1.6vw] font-medium w-full text-center py-1">
                        {{
                            currentItem2.title ?
                                currentItem2.title : 'TIDAK ADA JUDUL' }}
                    </div>
                    <div class="flex-1 w-full overflow-hidden">
                        <img v-if="currentItem2.type === 'image'" :src="'/_nuxt/' + currentItem2.url"
                            class="w-full h-full object-contain" />
                        <video v-else-if="currentItem2.type === 'video'" ref="video2" autoplay controls muted
                            playsinline class="w-full h-full object-contain" @playing="unmuteVideo2"
                            @ended="videoEnded">
                            <source :src="'/_nuxt/' + currentItem2.url" type="video/mp4" />
                        </video>
                    </div>
                </div>
            </div>
            <!-- Konten 3 -->
            <div class="flex flex-col justify-center items-center h-[95vh] w-1/2">
                <div
                    class="flex bg-OnPrimaryContainer text-OnPrimary items-center justify-center text-[1.6vw] font-medium w-full text-center py-1">
                    {{
                        currentItem3.title ?
                            currentItem3.title : 'TIDAK ADA JUDUL' }}
                </div>
                <div class="flex-1 w-full overflow-hidden">
                    <img v-if="currentItem3.type === 'image'" :src="'/_nuxt/' + currentItem3.url"
                        class="w-full h-full object-contain" />
                    <video v-else-if="currentItem3.type === 'video'" ref="video3" autoplay controls muted playsinline
                        class="w-full h-full object-contain" @playing="unmuteVideo3" @ended="videoEnded">
                        <source :src="'/_nuxt/' + currentItem3.url" type="video/mp4" />
                    </video>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

const { currentItem1, currentItem2, currentItem3 } = defineProps(["currentItem1", "currentItem2", "currentItem3"])
const currentTime = ref("")
import eventBus from '~/composables/useBus';
const video = ref(null);
const video2 = ref(null);
const video3 = ref(null);
const videoEnded = () => {
    eventBus.emit('videoEnded');
};
const unmuteVideo1 = () => {
    if (video.value) {
        video.value.muted = false; // Unmute the video
        video.value.play().catch((error) => {
            console.warn("Playback error:", error);
        }); // Ensure playback continues
    }
};
const unmuteVideo2 = () => {
    if (video2.value) {
        video2.value.muted = false; // Unmute the video
        video2.value.play().catch((error) => {
            console.warn("Playback error:", error);
        }); // Ensure playback continues
    }
};
const unmuteVideo3 = () => {
    if (video3.value) {
        video3.value.muted = false; // Unmute the video
        video3.value.play().catch((error) => {
            console.warn("Playback error:", error);
        }); // Ensure playback continues
    }
};
onMounted(() => {
    // Update current time every second
    function updateTime() {
        const now = new Date()
        const hours = now.getHours().toString().padStart(2, "0")
        const minutes = now.getMinutes().toString().padStart(2, "0")
        const seconds = now.getSeconds().toString().padStart(2, "0")
        currentTime.value = `${hours}:${minutes}:${seconds}`
    }
    updateTime() // Initial time
    setInterval(updateTime, 1000) // Update time every second
})
</script>
