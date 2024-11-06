<template>
    <div class="bg-gradient-to-tl from-Primary to-OnPrimaryContainer h-[97vw] overflow-hidden">
        <div class="flex flex-col justify-center items-center h-full w-full">
            <div class="flex w-full h-1/2 justify-center items-center">
                <!-- Konten 1 -->
                <div
                    class="w-1/2 h-full bg-gradient-to-br from-OnPrimaryContainer to-Primary flex flex-col items-center justify-between">
                    <div
                        class="flex bg-black bg-opacity-20 text-OnPrimary items-center justify-center text-[1.7vw] font-bold w-full text-center py-1">
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
                <div
                    class="w-1/2 h-full bg-gradient-to-br from-OnPrimaryContainer to-Primary flex flex-col items-center justify-center">
                    <div
                        class="flex bg-black bg-opacity-20 text-OnPrimary items-center justify-center text-[1.7vw] font-bold w-full text-center py-1">
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
            <div class="flex justify-center items-center h-1/2 w-full bg-black bg-opacity-10">

                <div class="w-2/3 h-full flex flex-col items-center justify-between">
                    <div
                        class="flex bg-black bg-opacity-20 text-OnPrimary items-center justify-center text-[1.7vw] font-bold w-full text-center py-1">
                        {{
                            currentItem3.title ?
                                currentItem3.title : 'TIDAK ADA JUDUL' }}
                    </div>
                    <div class="flex-1 w-full overflow-hidden">
                        <img v-if="currentItem3.type === 'image'" :src="'/_nuxt/' + currentItem3.url"
                            class="w-full h-full object-contain" />
                        <video v-else-if="currentItem3.type === 'video'" ref="video3" autoplay controls muted
                            playsinline class="w-full h-full object-contain" @playing="unmuteVideo3"
                            @ended="videoEnded">
                            <source :src="'/_nuxt/' + currentItem3.url" type="video/mp4" />
                        </video>
                    </div>
                </div>
                <div class="w-1/3 flex flex-col items-center">
                    <h2 class="text-[2vw] font-semibold text-white">{{ city }}</h2>
                    <img :src="icon" alt="Weather Icon" class="w-[30%] mb-2" />
                    <p class="text-[2vw] text-center text-gray-200">{{ weatherDescription.toUpperCase() }}</p>
                    <p class="text-[2vw]  text-gray-200">{{ temperature }}°C</p>
                    <p class="text-[2vw] font-bold text-gray-200">{{ currentTime }} WIB</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

const { currentItem1, currentItem2, currentItem3 } = defineProps(["currentItem1", "currentItem2", "currentItem3"])
const currentTime = ref("")
const icon = ref("")
const city = "Surabaya" // Default city
const weatherDescription = ref("")
const temperature = ref(0)
const humidity = ref(0)
const windSpeed = ref(0)
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
    fetchWeather() // Initial fetch
    updateTime() // Initial time
    setInterval(updateTime, 1000) // Update time every second
})
// Fetch weather data
async function fetchWeather() {
    try {
        const response = await fetch(
            `http://api.openweathermap.org/data/2.5/weather?q=surabaya&appid=ecd0ce8a78dbf07f5542645696510b9b&units=metric&lang=id`
        )
        const data = await response.json()
        weatherDescription.value = data.weather[0].description
        temperature.value = data.main.temp
        humidity.value = data.main.humidity
        windSpeed.value = data.wind.speed

        icon.value = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
    } catch (error) {
        console.error("Error fetching weather data:", error)
    }
}
</script>
