<template>
	<div v-if="currentItem1 != ''"
		class="bg-gradient-to-tl from-Primary to-OnPrimaryContainer overflow-hidden h-[95vh] flex justify-center">
		<img v-if="currentItem1.type === 'image'" :src="'/_nuxt/' + currentItem1.url" class="h-full" />
		<video v-else autoplay muted class="h-full">
			<source :src="'/_nuxt/' + currentItem1.url" type="video/mp4" />
		</video>
	</div>
</template>

<script setup>
const { currentItem1 } = defineProps(["currentItem1"])
</script>
