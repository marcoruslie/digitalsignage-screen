<template>
    <div class="bg-gradient-to-tl from-Primary to-OnPrimaryContainer h-[95vh] overflow-hidden">
        <div class="flex justify-center items-center w-full">
            <div class="flex justify-center items-center h-[95vh] w-1/2">
                <img v-if="currentItem1.type === 'image'" :src="'/_nuxt/' + currentItem1.url" class="h-full" />
                <video v-else autoplay muted class="h-full">
                    <source :src="'/_nuxt/' + currentItem1.url" type="video/mp4" />
                </video>
            </div>

            <div class="flex justify-center items-center h-[95vh] w-1/2 bg-black bg-opacity-10">
                <img v-if="currentItem2.type === 'image'" :src="'/_nuxt/' + currentItem2.url" class="h-full" />
                <video v-else autoplay muted class="h-full">
                    <source :src="'/_nuxt/' + currentItem2.url" type="video/mp4" />
                </video>
            </div>
        </div>
    </div>
</template>

<script setup>

const { currentItem1, currentItem2, reminder } = defineProps(["currentItem1", "currentItem2", "reminder"])
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
