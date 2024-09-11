<template>
    <div class="bg-gradient-to-tl from-Primary to-OnPrimaryContainer h-[95vh] overflow-hidden">
        <div class="flex justify-center items-center w-full h-full">
            <div class="flex flex-col h-[95vh] w-2/5 overflow-auto shadow-lg">
                <!-- Konten 1 -->
                <div
                    class="h-1/2 bg-gradient-to-br from-OnPrimaryContainer to-Primary flex items-center justify-center relative">
                    <img v-if="currentItem1.type === 'image'" :src="'/_nuxt/' + currentItem1.url" class="h-full" />
                    <video v-else autoplay muted class="h-full">
                        <source :src="'/_nuxt/' + currentItem1.url" type="video/mp4" />
                    </video>
                    <!-- Zooming Text and Background Animation -->
                    <div class="absolute inset-0 flex items-center justify-center z-50" :class="{
                        'bg-gradient-to-r from-OnPrimaryContainer to-PrimaryContainer': show,
                        'bg-transparent': !show,
                    }">
                        <h1 class="text-white font-bold text-6xl md:text-8xl transition-all duration-2000 ease-in-out transform"
                            :class="{ 'scale-100 opacity-100': show, 'scale-50 opacity-0': !show }">
                            HALLOW
                        </h1>
                        <div class="absolute inset-0 bg-cover opacity-30" :class="{ 'animate-pulse': show }"></div>
                    </div>
                </div>
                <!-- Konten 2 -->
                <div
                    class="h-1/2 bg-gradient-to-br from-OnPrimaryContainer to-Primary flex items-center bg-opacity-60 justify-center overflow-auto">
                    <img v-if="currentItem2.type === 'image'" :src="'/_nuxt/' + currentItem2.url" class="h-full" />
                    <video v-else autoplay muted class="h-full">
                        <source :src="'/_nuxt/' + currentItem2.url" type="video/mp4" />
                    </video>
                </div>
            </div>
            <!-- Konten 3 -->
            <div class="flex justify-center items-center h-[95vh] w-3/5 bg-black bg-opacity-10">
                <img v-if="currentItem3.type === 'image'" :src="'/_nuxt/' + currentItem3.url" class="h-full" />
                <video v-else autoplay muted class="h-full">
                    <source :src="'/_nuxt/' + currentItem3.url" type="video/mp4" />
                </video>
            </div>
        </div>
    </div>
</template>

<script setup>

const { currentItem1, currentItem2, currentItem3 } = defineProps(["currentItem1", "currentItem2", "currentItem3"])
const currentTime = ref("")

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
