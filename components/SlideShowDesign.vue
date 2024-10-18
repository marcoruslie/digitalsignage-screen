<template>
	<div class="bg-gradient-to-tl from-Primary to-OnPrimaryContainer overflow-hidden h-[95vh] flex justify-center">

		<img v-if="currentItem1.type === 'image'" :src="'/_nuxt/' + currentItem1.url" class="h-full object-contain" />
		<video v-else autoplay muted class="h-full object-contain">
			<source :src="'/_nuxt/' + currentItem1.url" type="video/mp4" />
		</video>
	</div>
</template>

<script setup>
const { currentItem1 } = defineProps(["currentItem1"])
</script>
