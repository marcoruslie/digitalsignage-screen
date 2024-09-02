<template>
	<div
		v-if="currentItem != ''"
		class="bg-gradient-to-tl from-Primary to-OnPrimaryContainer max-h-[90vh] overflow-hidden h-[90vh] flex justify-center">
		<img
			v-if="currentItem.type === 'image'"
			:src="'/_nuxt/' + currentItem.url"
			class="h-full" />
		<video
			v-else
			autoplay
			muted
			class="h-full">
			<source
				:src="'/_nuxt/' + currentItem.url"
				type="video/mp4" />
		</video>
	</div>
</template>

<script setup>
	const { currentItem } = defineProps(["currentItem"])
</script>
