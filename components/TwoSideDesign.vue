<template>

    <div class="bg-gradient-to-tl from-Primary to-OnPrimaryContainer max-h-[90vh] h-[90vh] overflow-hidden">
        <div class="flex justify-center items-center w-full">
            <div class="flex flex-col h-[90vh] w-1/3 overflow-hidden shadow-lg">
                <!-- Weather UI -->
                <div
                    class="h-1/2 bg-gradient-to-br from-OnPrimaryContainer to-Primary flex flex-col items-center justify-between px-6 py-4">
                    <h2 class="sm:text-2xl lg:text-5xl font-semibold text-white mb-2">{{ city }}</h2>
                    <img :src='icon' alt="">
                    <p class="sm:text-xl lg:text-3xl text-gray-200 mb-1">{{ weatherDescription.toUpperCase() }}</p>
                    <p class="sm:text-3xl lg:text-6xl text-gray-200 mb-1">{{ temperature }}°C</p>
                    <p class="sm:text-xl lg:text-4xl font-bold text-gray-200">{{ currentTime }} WIB</p>
                    <!-- <p class="text-2xl text-gray-200 mb-1">Kelembapan: {{ humidity }}%</p>
                        <p class="text-2xl text-gray-200 mb-1">Kecepatan Angin: {{ windSpeed }} m/detik</p> -->
                </div>
                <!-- Reminder -->
                <div class="h-1/2 bg-black flex flex-col justify-center items-center bg-opacity-60">
                    <div class="sm:text-3xl lg:text-5xl text-white p-1">Reminder</div>
                    <!-- <img v-if="currentItem.type === 'image'" :src="'/_nuxt/' + currentItem.url" class="h-full" />
                        <video v-else autoplay muted class="h-full">
                            <source :src="'/_nuxt/' + currentItem.url" type="video/mp4" />
                        </video> -->

                </div>
            </div>

            <div class="flex justify-center items-center h-[90vh] w-2/3 bg-black bg-opacity-10">
                <img v-if="currentItem.type === 'image'" :src="'/_nuxt/' + currentItem.url" class="h-full" />
                <video v-else autoplay muted class="h-full">
                    <source :src="'/_nuxt/' + currentItem.url" type="video/mp4" />
                </video>
            </div>
        </div>
    </div>

</template>

<script setup>
const { currentItem } = defineProps(['currentItem']);

const icon = ref('');
const city = 'Surabaya'; // Default city
const weatherDescription = ref('');
const temperature = ref(0);
const humidity = ref(0);
const windSpeed = ref(0);

const currentTime = ref('');

onMounted(() => {
    // Update current time every second
    function updateTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        currentTime.value = `${hours}:${minutes}:${seconds}`;
    }

    fetchWeather(); // Initial fetch
    updateTime(); // Initial time

    setInterval(updateTime, 1000); // Update time every second
});
// Fetch weather data
async function fetchWeather() {
    try {
        const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=surabaya&appid=ecd0ce8a78dbf07f5542645696510b9b&units=metric&lang=id`)
        const data = await response.json();
        weatherDescription.value = data.weather[0].description;
        temperature.value = data.main.temp;
        humidity.value = data.main.humidity;
        windSpeed.value = data.wind.speed;

        icon.value = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}
</script>