<template>
	<div
		class="bg-gradient-to-tl from-Primary to-OnPrimaryContainer overflow-hidden h-[95vh] flex flex-col items-center justify-center">
		<div
			class="flex bg-OnPrimaryContainer text-OnPrimary items-center justify-center text-[1.7vw] font-bold w-full text-center py-1">
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
</template>

<script setup>
const { currentItem1 } = defineProps(["currentItem1"])
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
</script>
