<template>
	<div class="h-screen">
		<!-- {{ routePath }} -->
		<!-- <div v-for="file in fileList">
      <div>{{ file.duration }}</div>
      <div v-for="content in file.dataContent">{{ content }}</div>
    </div> -->
		<marquee class="text-2xl text-OnPrimary bg-Primary h-[5vh] flex items-center"> Digital Signage ISTTS </marquee>

		<div v-if="template == 'loading'">Loading...</div>
		<div
			v-else-if="template == 'template1'"
			class="relative flex flex-col justify-between">
			<SlideShowDesign :currentItem="currentItem" />
		</div>
		<div
			v-else-if="template == 'template2'"
			class="relative flex flex-col justify-between">
			<TwoSideDesign
				v-if="currentItem != '' && reminder != ''"
				:currentItem="currentItem"
				:reminder="reminder" />
		</div>
		<div v-else>
			<h1>NO TEMPLATE</h1>
		</div>
		<marquee class="bg-OnPrimaryContainer h-[5vh] flex">
			<div class="flex items-center">
				<div class="text-lg text-PrimaryContainer">Digital Signage ISTTS</div>
				<img
					src="/LogoISTTS.png"
					alt=""
					class="h-[5vh]" />
			</div>
		</marquee>

		<div class="hidden">
			<div id="player"></div>
		</div>
		<div
			v-if="visible"
			class="fixed inset-0 flex items-center justify-center z-50"
			:class="{
				'bg-gradient-to-r from-OnPrimaryContainer to-PrimaryContainer': show,
				'bg-transparent': !show,
			}">
			<h1
				class="text-white font-bold text-6xl md:text-8xl transition-all duration-2000 ease-in-out transform"
				:class="{ 'scale-100 opacity-100': show, 'scale-50 opacity-0': !show }">
				{{ zoomingText }}
			</h1>
			<div
				class="absolute inset-0 bg-cover opacity-30"
				:class="{ 'animate-pulse': show }"></div>
		</div>
	</div>
</template>

<script setup>
	import { parse } from "date-fns"
	import { io } from "socket.io-client"
	const port = "3000"
	const { getTemplate, setTemplate } = useTemplate()
	const { getYoutubeMusic, setYoutubeMusic } = useYoutube()
	const template = ref(await getTemplate())
	const youtubeId = ref(await getYoutubeMusic())
	const { getFileList, getAllPlaylist, getReminder, saveFile, changeJsonFile } = useFileData()
	const reminder = ref(await getReminder())
	const router = useRouter()
	const routePath = await $fetch("http://localhost:" + port + "/api/os")
	// Youtube API
	let youtubePlayer
	let unmuteInterval
	// SLIDE SHOW DESIGN VARIABLES
	const fileData = ref(await getFileList())
	const fileList = ref(fileData.value.data)
	const currentIndex = ref(0)
	const leaving = ref(false)
	const currentItem = ref("")
	// TWO SIDE DESIGN VARIABLES
	// THREE SIDE DESIGN VARIABLES

	const host = "http://192.168.0.190:3000/"
	// const host = "http://10.10.4.210:3000/"
	// const host = "http://localhost:3000/"
	const socket = io(host, {
		path: "/api/socket.io",
	})
	// EVENT FROM SERVER
	socket.on("changeTemplate", async (data) => {
		const temp = {
			oldName: template.value,
			newName: data.template,
		}
		console.log(temp)
		await setTemplate(temp)
		router.go()
	})
	socket.on("changeBgm", async (data) => {
		youtubeId.value = await getYoutubeMusic()
		const temp = {
			oldName: youtubeId.value,
			newName: data.bgm,
		}
		await setYoutubeMusic(temp)
		console.log(data)
		selectVideo(data.bgm)
		socket.emit("musicId", data.bgm)
	})
	socket.on("receiveFiles", async (data) => {
		console.log(data)

		const result = await saveFile(data)
		if (result.status == "success") {
			const dateString = data.date
			const date = new Date(dateString)

			// Extract the day, month, and year from the Date object
			const day = String(date.getDate()).padStart(2, "0")
			const month = String(date.getMonth() + 1).padStart(2, "0") // Months are 0-indexed
			const year = String(date.getFullYear()).slice(-2) // Get last 2 digits of the year

			// Concatenate the day, month, and year without any separators
			const formattedDate = `${day}${month}${year}`
			const jsonResult = await changeJsonFile(`playlist/${formattedDate}`, "content.json", data.jsonData)
			console.log(jsonResult)
			if (jsonResult == "success") {
				socket.emit("success", "Berhasil menambahkan playlist ke dalam screen")
				await new Promise((resolve) => {
					setTimeout(() => {
						resolve()
					}, 2000)
				}).then(() => {
					router.go()
				})
				router.go()
			} else {
			}
		}
	})
	socket.on("receiveReminder", async (data) => {
		changeJsonFile("reminder", "reminder.json", data.reminder).then(() => {
			socket.emit("success")
			router.go()
		})
		reminder.value = data
	})
	// SEND DATA TO SERVER
	socket.on("sendPlaylist", async () => {
		socket.emit("resPlaylist", await getAllPlaylist())
	})
	socket.on("sendDataReminder", async () => {
		socket.emit("resDataReminder", await getReminder())
	})
	socket.on("sendDataFiles", async () => {
		socket.emit("resDataFiles", fileData.value.playlist_id)
	})
	socket.on("tes", (response) => {
		console.log(response)
	})

	onMounted(() => {
		// EVENT TO SERVER
		socket.on("connect", () => {
			socket.emit("clientType", routePath + ":" + port)
			socket.emit("musicId", youtubeId.value)
		})
		socket.on("reqDataPlaylist", async () => {
			socket.emit("resDataPlaylist", await getAllPlaylist())
		})
		playContent()
		// Load the YouTube Player API script dynamically
		const tag = document.createElement("script")
		tag.src = "https://www.youtube.com/iframe_api"
		const firstScriptTag = document.getElementsByTagName("script")[0]
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
		setInterval(async () => {
			await changeReminderData()
			console.log("reminder updated")
		}, 1000 * 60 * 60)
		// Wait for the API to be ready before creating the player
		window.onYouTubeIframeAPIReady = () => {
			createPlayer()
		}
	})
	const createPlayer = () => {
		youtubePlayer = new YT.Player("player", {
			height: "315",
			width: "560",
			videoId: "", // Start with no video
			playerVars: {
				autoplay: 1,
				controls: 1,
				loop: 1,
				mute: 1,
			},
			events: {
				onReady: onPlayerReady,
				onStateChange: onPlayerStateChange,
			},
		})
	}
	const onPlayerReady = (event) => {
		event.target.loadVideoById(youtubeId.value)
		event.target.playVideo()
		unmuteWhenPlaying(event.target)
	}

	const onPlayerStateChange = (event) => {
		// Loop the video when it ends
		if (event.data === YT.PlayerState.ENDED) {
			youtubePlayer.mute()
			youtubePlayer.playVideo()
			unmuteWhenPlaying(youtubePlayer)
		}
	}

	// Function to unmute the player once it starts playing
	const unmuteWhenPlaying = (player) => {
		if (unmuteInterval) {
			clearInterval(unmuteInterval)
		}
		unmuteInterval = setInterval(() => {
			if (player.getPlayerState() === YT.PlayerState.PLAYING) {
				player.unMute()
				clearInterval(unmuteInterval)
			}
		}, 1000) // Check every second
	}
	const selectVideo = (videoId) => {
		if (youtubePlayer) {
			youtubePlayer.loadVideoById(videoId)
			youtubePlayer.setPlaybackQuality("tiny")
			youtubePlayer.mute()
			youtubePlayer.playVideo()
			unmuteWhenPlaying(youtubePlayer)
		}
	}
	const playContent = async () => {
		while (template.value != "loading") {
			for (const file of fileList.value) {
				displayText(file.judul)
				await delayWithLogging(2000)
				for (const content of file.dataContent) {
					currentIndex.value = file.dataContent.indexOf(content)
					currentItem.value = content
					// console.log(currentItem.value);
					await delayWithLogging(file.duration * 1000)
				}
			}
		}
	}
	function delayWithLogging(ms) {
		let seconds = 0
		return new Promise((resolve) => {
			const interval = setInterval(() => {
				seconds++
				// console.log(`Elapsed time: ${seconds} seconds`);
			}, 1000)
			setTimeout(() => {
				clearInterval(interval)
				resolve()
			}, ms)
		})
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
	// TEXT FUNCTION ZOOMING
	const visible = ref(false)
	const show = ref(false)
	const zoomingText = ref("")
	function displayText(text) {
		visible.value = true
		show.value = true
		zoomingText.value = text
		setTimeout(() => {
			show.value = false
		}, 2000) // Start fading out after 2 seconds

		setTimeout(() => {
			visible.value = false
		}, 4000) // Hide after fade out
	}
</script>
<style scoped>
	.fixed {
		transition: background-color 2s ease-in-out;
	}
</style>
