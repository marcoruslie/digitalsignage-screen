<template>
	<div class="h-screen flex flex-col justify-center items-center">
		<div :class="template != 'template1' && template != 'template2' ? 'rotate-90 w-[100vh] h-[100vw]' : 'w-[100vw] h-[100vh]'"
			class="bg-gradient-to-r from-OnPrimaryContainer to-PrimaryContainer">
			<marquee class="text-2xl text-OnPrimary bg-Primary h-[5vh] flex items-center"> Digital Signage ISTTS
			</marquee>

			<div v-if="template == 'loading'">Loading...</div>
			<div v-else-if="template == 'template1'" class="relative flex flex-col justify-between">
				<SlideShowDesign :currentItem="currentItem" />
			</div>
			<div v-else-if="template == 'template2'" class="relative flex flex-col justify-between">
				<ThreeSection v-if="currentItem != '' && reminder != ''" :currentItem="currentItem"
					:reminder="reminder" />
			</div>
			<div v-else-if="template == 'template3'" class="relative flex-col">
				<ThreeContentPortrait v-if="currentItem != '' && reminder != ''" :currentItem="currentItem"
					:reminder="reminder" />
			</div>
			<div v-else-if="template == 'template4'" class="relative flex-col">
				<SlideShowPortrait :currentItem="currentItem" />
			</div>
			<div v-else>
				<h1>NO TEMPLATE</h1>
			</div>
			<marquee class="bg-OnPrimaryContainer h-[5vh] flex">
				<div class="flex items-center">
					<div class="text-lg text-PrimaryContainer">Digital Signage ISTTS</div>
					<img src="/LogoISTTS.png" alt="" class="h-[5vh]" />
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
	</div>
</template>

<script setup>
const { getTemplate, setTemplate } = useTemplate()
const template = ref(await getTemplate())
const { getFileList, getReminder } = useFileData()
const reminder = ref(await getReminder())
const routePath = ref("")
// SLIDE SHOW DESIGN VARIABLES
const fileData = ref(await getFileList())
const fileList = ref(fileData.value.data)
const currentIndex = ref(0)
const leaving = ref(false)
const currentItem = ref("")
onMounted(async () => {
	routePath.value = `${window.location.origin}`
	playContent()
})
const playContent = async () => {
	while (true) {
		for (const file of fileList.value) {
			for (const content of file.dataContent) {
				currentIndex.value = file.dataContent.indexOf(content)
				currentItem.value = content
				await delayWithLogging(file.duration * 1000) // 10 seconds delay
			}
		}
	}
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
