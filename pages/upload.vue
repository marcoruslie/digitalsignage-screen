<template>
	<div class="bg-cyan-700 h-svh w-full p-2 flex space-x-3">
		<div class="h-full w-[100%] bg-white rounded-xl p-2 flex-col overflow-auto">
			<div class="flex justify-between items-center">
				<div class="text-Primary font-bold text-2xl">Control Background Music</div>
				<div class="flex space-x-1">
					<input
						type="text"
						v-model="searchQuery"
						placeholder="Search YouTube Videos"
						class="p-2 border rounded" />
					<button
						@click="searchVideos"
						class="p-2 bg-blue-500 text-white rounded">
						Search
					</button>
				</div>
			</div>
			<div class="border-b-2 border-Primary mt-1"></div>

			<div
				id="player"
				class="mt-4 flex w-full justify-center items-center"></div>
			<ul>
				<li
					v-for="video in searchResults"
					:key="video.id.videoId"
					@click="selectVideo(video.id.videoId)"
					class="cursor-pointer hover:bg-gray-200 p-2 flex items-center space-x-2">
					<img
						:src="video.snippet.thumbnails.default.url"
						alt="Thumbnail"
						class="w-16 h-16" />
					<span>{{ video.snippet.title }}</span>
				</li>
			</ul>
		</div>
	</div>
</template>

<script setup>
	const searchQuery = ref("")
	const searchResults = ref([])
	const modalHeader = ref("")
	const modalContent = ref("")
	const isOpen = ref(false)
	const currentVideoId = ref("")
	let youtubePlayer

	// Load the YouTube Player API script dynamically
	onMounted(() => {
		const tag = document.createElement("script")
		tag.src = "https://www.youtube.com/iframe_api"
		const firstScriptTag = document.getElementsByTagName("script")[0]
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

		// Wait for the API to be ready before creating the player
		window.onYouTubeIframeAPIReady = () => {
			createPlayer()
		}
	})

	// Function to create and initialize the YouTube player
	const createPlayer = () => {
		youtubePlayer = new YT.Player("player", {
			height: "315",
			width: "560",
			videoId: "", // Start with no video
			playerVars: {
				loop: 1,
			},
			events: {
				onReady: onPlayerReady,
				onStateChange: onPlayerStateChange,
			},
		})
	}

	const onPlayerReady = (event) => {
		// Do nothing initially
	}
	const onPlayerStateChange = (event) => {
		// Loop the video when it ends
		if (event.data === YT.PlayerState.ENDED) {
			youtubePlayer.playVideo()
		}
	}
	// Function to search for YouTube videos
	const searchVideos = async () => {
		const apiKey = "AIzaSyAgnyIHF_beLeYFv8XDCPz62vnCxm8TcPA"
		const query = searchQuery.value
		const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
			query
		)}&type=video&key=${apiKey}`

		try {
			const response = await fetch(searchUrl)
			const data = await response.json()
			searchResults.value = data.items
		} catch (error) {
			console.error("Error:", error)
		}
	}

	// Function to select and play a video
	const selectVideo = (videoId) => {
		currentVideoId.value = videoId
		if (youtubePlayer) {
			youtubePlayer.loadVideoById(videoId)
			youtubePlayer.setPlaybackQuality("tiny")
			youtubePlayer.playVideo()
		}
	}
</script>
