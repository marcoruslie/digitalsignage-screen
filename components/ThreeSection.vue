<template>
	<div class="bg-gradient-to-tl from-Primary to-OnPrimaryContainer h-[95vh] overflow-hidden">
		<div class="flex flex-wrap lg:flex-nowrap justify-center items-center w-full h-full">
			<!-- Left Section: Weather + Reminder -->
			<div
				class="flex flex-col h-full w-1/3 overflow-auto shadow-lg bg-gradient-to-t from-Primary to-OnPrimaryContainer">
				<!-- Weather UI -->
				<div class="h-1/2 flex flex-col justify-center items-center p-10">
					<h2 class="text-[2vw] font-semibold text-white">{{ city.toUpperCase() }}</h2>
					<p class="text-[2vw] text-gray-200">{{ currentTime }} WIB</p>
					<img :src="icon" alt="Weather Icon" class="w-[35%] mb-2" />
					<p class="text-[2vw]  text-gray-200">{{ temperature }}°C</p>
					<p class="text-[2vw]  text-gray-200">{{ weatherDescription.toUpperCase() }}</p>
				</div>

				<!-- Reminder Section -->
				<div ref="reminderContainer" class="h-1/2 space-y-2 p-4 overflow-auto">
					<div v-if="!reminder.length"
						class="w-full h-full flex justify-center items-center text-OnPrimary text-[2vw]">
						Tidak Ada Pengingat
					</div>

					<div v-for="remind in reminder" :key="remind.id"
						class="rounded-2xl w-full py-2 px-3 flex justify-between bg-white">
						<div class="flex-col flex w-[70%]">
							<div class="text-[1.3vw] font-bold">{{ remind.Judul }}</div>
							<div class="text-[1.2vw] italic font-bold">{{ remind.Deadline }}</div>
						</div>
						<div class="flex flex-col items-center text-[1.2vw]">
							<span>Sisa Waktu</span>
							<div class="font-bold" :class="{
								'text-red-500': getTimeDifferenceInDays(remind.Deadline) < 1,
								'text-green-500': getTimeDifferenceInDays(remind.Deadline) > 30,
								'text-yellow-500': getTimeDifferenceInDays(remind.Deadline) >= 1 &&
									getTimeDifferenceInDays(remind.Deadline) <= 30,
							}">{{ getFormattedTimeDifference(remind.Deadline) }}</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Right Section: Media Display -->
			<div class="flex flex-col justify-center items-center h-full w-2/3 bg-black bg-opacity-10">
				<div
					class="flex bg-black bg-opacity-20 text-OnPrimary items-center justify-center text-[1.6vw] font-medium w-full text-center py-1">
					{{
						currentItem1.title ?
							currentItem1.title : 'TIDAK ADA JUDUL' }}
				</div>
				<div class="flex-1 w-full overflow-hidden">
					<img v-if="currentItem1.type === 'image'" :src="'/_nuxt/' + currentItem1.url"
						class="w-full h-full object-contain" />
					<video v-else-if="currentItem1.type === 'video'" ref="video" autoplay controls muted playsinline
						class="w-full h-full object-contain" @playing="unmuteVideo" @ended="videoEnded">
						<source :src="'/_nuxt/' + currentItem1.url" type="video/mp4" />
					</video>
				</div>

			</div>
		</div>
	</div>
</template>

<script setup>
import {
	differenceInMonths,
	differenceInDays,
	differenceInHours,
	differenceInMinutes,
	differenceInSeconds,
	parse,
} from "date-fns"

const { currentItem1, reminder } = defineProps(["currentItem1", "reminder"])

const icon = ref("")
const city = "Surabaya" // Default city
const weatherDescription = ref("")
const temperature = ref(0)
const humidity = ref(0)
const windSpeed = ref(0)
const reminderContainer = ref(null);
const currentTime = ref("")
import eventBus from '~/composables/useBus';
const video = ref(null);

const videoEnded = () => {
	eventBus.emit('videoEnded');
};
const unmuteVideo = () => {
	if (video.value) {
		video.value.muted = false; // Unmute the video
		video.value.play().catch((error) => {
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
	setInterval(fetchWeather, 1000 * 60 * 60) // Fetch weather every hour

	autoScroll(); // Start auto-scrolling
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
// Auto-scrolling logic
const autoScroll = () => {
	const container = reminderContainer.value;

	if (container) {
		let scrollAmount = 0;
		setInterval(() => {
			scrollAmount += 0.5; // Adjust the value to control scrolling speed
			container.scrollTop = scrollAmount;

			// Reset scroll to the top when reaching the bottom
			if (container.scrollTop + container.clientHeight + 2 >= container.scrollHeight) {
				scrollAmount = 0;
			}
		}, 50); // Adjust the interval time for smoother or faster scroll
	}
};
function getFormattedTimeDifference(dateString) {
	// Parse the date from the string (format "dd MMMM yyyy")
	const targetDate = parse(dateString, "dd MMMM yyyy", new Date())

	// Get the current date
	const currentDate = new Date()

	// Calculate the difference in days, hours, minutes, and seconds
	const diffDays = differenceInDays(targetDate, currentDate)
	const diffHours = differenceInHours(targetDate, currentDate)
	const diffMinutes = differenceInMinutes(targetDate, currentDate)
	const diffSeconds = differenceInSeconds(targetDate, currentDate)
	const diffMonths = differenceInMonths(targetDate, currentDate)
	// If the difference is under a day, return the hours, minutes, and seconds remaining
	if (diffDays === 0) {
		const remainingHours = diffHours
		const remainingMinutes = diffMinutes % 60
		const remainingSeconds = diffSeconds % 60

		return `${remainingHours} h ${remainingMinutes} m ${remainingSeconds} s`
	}

	// If the difference is under a month, return the days remaining
	if (diffDays > 0 && diffDays < 30) {
		return `${diffDays} Hari`
	}

	return `${diffMonths} Bulan`
}
function getTimeDifferenceInDays(dateString) {
	const targetDate = parse(dateString, "dd MMMM yyyy", new Date())
	const currentDate = new Date()
	const diffDays = differenceInDays(targetDate, currentDate)
	return diffDays
}
</script>
