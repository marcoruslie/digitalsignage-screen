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
			<SlideShowDesign
				:fileList="fileList"
				:currentIndex="currentIndex"
				:leaving="leaving"
				:currentItem="currentItem" />
		</div>
		<div
			v-else-if="template == 'template2'"
			class="relative flex flex-col justify-between">
			<TwoSideDesign
				v-if="currentItem != ''"
				:currentItem="currentItem" />
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
	</div>
</template>

<script setup>
	import { io } from "socket.io-client"
	const port = "3000"
	const { getTemplate, setTemplate } = useTemplate()
	const template = ref(await getTemplate())
	const { getFileList, getAllPlaylist } = useFileData()
	const router = useRouter()
	const routePath = await $fetch("http://localhost:" + port + "/api/os")

	// Youtube API
	let youtubePlayer
	let unmuteInterval
	// SLIDE SHOW DESIGN VARIABLES
	const fileList = ref(await getFileList())
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
	socket.on("connect", () => {
		socket.emit("clientType", routePath + ":" + port)
	})
	socket.on("tes", (response) => {
		console.log(response)
	})
	socket.on("reqDataPlaylist", async () => {
		socket.emit("resDataPlaylist", await getAllPlaylist())
	})
	socket.on("changeBgm", (data) => {
		console.log(data)
		socket.emit("playMusic", { bgm: data.bgm })
	})

	onMounted(() => {
		playContent()
		// Load the YouTube Player API script dynamically
		const tag = document.createElement("script")
		tag.src = "https://www.youtube.com/iframe_api"
		const firstScriptTag = document.getElementsByTagName("script")[0]
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

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
		event.target.loadVideoById("HPxCrNH2HbY")
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
		console.log(player.getPlayerState() === YT.PlayerState.PLAYING)
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

			youtubePlayer.playVideo()
			youtubePlayer.unMute()
		}
	}
	const pauseVideo = () => {
		if (youtubePlayer) {
			youtubePlayer.pauseVideo()
		}
	}
	const resumeVideo = () => {
		if (youtubePlayer) {
			youtubePlayer.playVideo()
		}
	}
	const playContent = async () => {
		while (template.value != "loading") {
			for (const file of fileList.value) {
				for (const content of file.dataContent) {
					currentIndex.value = file.dataContent.indexOf(content)
					currentItem.value = content
					// console.log(currentItem.value);
					await delayWithLogging(file.duration * 1000) // 10 seconds delay
				}
			}
		}
	}
	const playReminder = async () => {}
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
	const autoClickAnywhere = (x, y) => {
		const event = new MouseEvent("click", {
			view: window,
			bubbles: true,
			cancelable: true,
			clientX: x,
			clientY: y,
		})

		const element = document.elementFromPoint(x, y)
		if (element) {
			element.dispatchEvent(event)
			console.log("CLICKED")
		}
	}
	const autoClickByXPath = (xpath) => {
		const getElementByXpath = (path) => {
			return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
		}
		const element = getElementByXpath(xpath)
		if (element) {
			element.click()
			console.log("CLICKED")
		}
	}
</script>
