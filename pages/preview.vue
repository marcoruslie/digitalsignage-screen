<template>
	<div class="h-screen w-screen flex justify-center items-center">
		<div :class="['template1', 'template2', 'template3', 'template4', 'loading'].includes(template) ? 'w-[100vw] h-[100vh]' : 'rotate-90 w-[100vh] h-[100vw] max-h-[100vw]'"
			class="bg-gradient-to-r from-OnPrimaryContainer to-PrimaryContainer">

			<div v-if="template == 'loading'"
				:class="['template1', 'template2', 'template3', 'template4', 'loading'].includes(template) ? 'h-[95vh]' : 'h-[97vw]'"
				class="text-OnPrimary text-6xl flex justify-center items-center">
				Tidak Ada Layout..</div>
			<SlideShowDesign v-else-if="template == 'template1'" :currentItem1="currentItem1" />
			<ThreeSection v-else-if="template == 'template2'" :currentItem1="currentItem1" :reminder="reminder" />
			<ThreeSlideShow v-else-if="template == 'template3'" :currentItem1="currentItem1"
				:currentItem2="currentItem2" :currentItem3="currentItem3" />
			<TwoSlideShow v-else-if="template == 'template4'" :currentItem1="currentItem1" :currentItem2="currentItem2"
				:reminder="reminder" />
			<SlideShowPortrait v-else-if="template == 'template5'" :currentItem1="currentItem1" />
			<ThreeSectionPortrait v-else-if="template == 'template6'" :currentItem1="currentItem1"
				:reminder="reminder" />
			<ThreeSlideShowPortrait v-else-if="template == 'template7'" :currentItem1="currentItem1"
				:currentItem2="currentItem2" :currentItem3="currentItem3" :reminder="reminder" />
			<TwoSlideShowPortrait v-else-if="template == 'template8'" :currentItem1="currentItem1"
				:currentItem2="currentItem2" :reminder="reminder" />

			<div v-else>
				<h1>NO TEMPLATE</h1>
			</div>
			<marquee
				:class="['template1', 'template2', 'template3', 'template4', 'loading'].includes(template) ? 'h-[5vh]' : 'h-[3vw]'"
				class="bg-OnPrimaryContainer flex">
				<div class="flex items-center">
					<div class="text-2xl text-PrimaryContainer">Digital Signage ISTTS</div>
					<img src="/LogoISTTS.png" alt=""
						:class="['template1', 'template2', 'template3', 'template4', 'loading'].includes(template) ? 'h-[5vh]' : 'h-[3vw]'" />
				</div>
			</marquee>

			<div v-if="visible" class=" fixed inset-0 flex items-center justify-center z-50" :class="{
				'bg-gradient-to-r from-OnPrimaryContainer to-PrimaryContainer': show,
				'bg-transparent': !show,
			}">
				<h1 class="text-white font-bold text-6xl md:text-8xl transition-all duration-2000 ease-in-out transform"
					:class="{ 'scale-100 opacity-100': show, 'scale-50 opacity-0': !show }">
					{{ zoomingText }}
				</h1>
				<div class="absolute inset-0 bg-cover opacity-30" :class="{ 'animate-pulse': show }"></div>
			</div>
		</div>

		<div class="hidden">
			<div id="player"></div>
		</div>
	</div>
</template>

<script setup>
import { parse } from "date-fns"
const { getTemplate, setTemplate } = useTemplate()
const template = ref(await getTemplate())
const { getFileList, getAllPlaylist, getReminder, saveFile, changeJsonFile } = useFileData()
const reminder = ref(await getReminder())
if (reminder.value != null || reminder.value.length > 0) {
	reminder.value = reminder.value.sort((a, b) => {
		return new Date(a.Deadline) - new Date(b.Deadline)
	})
}
const routePath = ref("")
// SLIDE SHOW DESIGN VARIABLES
const fileData = ref(await getFileList())
const fileList = ref(fileData.value.data)

const currentItem1 = ref("")
const currentItem2 = ref("")
const currentItem3 = ref("")
onMounted(async () => {
	playContent()
	await changeReminderData()
	// Load the YouTube Player API script dynamically
	const tag = document.createElement("script")
	tag.src = "https://www.youtube.com/iframe_api"
	const firstScriptTag = document.getElementsByTagName("script")[0]
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
	setInterval(async () => {
		await changeReminderData()
		console.log("reminder updated")
	}, 1000 * 60 * 60)
})
// Play Single Content or Multiple Content
async function loop1() {
	while (fileList.value.filter((item) => item.screen.includes("A")).length > 0) {
		const filteredFiles = fileList.value.filter((item) => item.screen.includes("A"));
		for (const file of filteredFiles) {
			for (const content of file.dataContent) {
				currentItem1.value = content;
				await delayWithLogging(file.duration * 1000);
			}
		}
	}
}
async function loop2() {
	while (fileList.value.filter((item) => item.screen.includes("B")).length > 0) {
		const filteredFiles = fileList.value.filter((item) => item.screen.includes("B"));
		for (const file of filteredFiles) {
			for (const content of file.dataContent) {
				currentItem2.value = content;
				await delayWithLogging(file.duration * 1000);
			}
		}
	}
}
async function loop3() {
	while (fileList.value.filter((item) => item.screen.includes("C")).length > 0) {
		const filteredFiles = fileList.value.filter((item) => item.screen.includes("C"));
		for (const file of filteredFiles) {
			for (const content of file.dataContent) {
				currentItem3.value = content;
				await delayWithLogging(file.duration * 1000);
			}
		}
	}
}
const playContent = async () => {
	await Promise.all([loop1(), loop2(), loop3()])
}
const changeReminderData = async () => {
	reminder.value = reminder.value.sort((a, b) => {
		return new Date(a.Deadline) - new Date(b.Deadline)
	})
	let reminderData = []
	reminder.value.forEach((element) => {
		const deadline = parse(element.Deadline, "dd MMMM yyyy", new Date())
		if (deadline > new Date()) {
			reminderData.push(element)
		}
	})
	await changeJsonFile("reminder", "reminder.json", reminderData)
	reminder.value = await getReminder()
}
function delayWithLogging(ms) {
	let seconds = 0
	return new Promise((resolve) => {
		const interval = setInterval(() => {
			seconds++
		}, 1000)
		setTimeout(() => {
			clearInterval(interval)
			resolve()
		}, ms)
	})
}
</script>
