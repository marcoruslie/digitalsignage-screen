<template>
	<div
		v-if="fileList.length != 0 && currentItem != ''"
		class="bg-gradient-to-tl from-Primary to-OnPrimaryContainer max-h-[90vh] overflow-hidden h-[90vh]">
		<transition
			name="slide"
			class="transition-transform duration-500 ease-in-out h-full overflow-hidden"
			style="overflow: hidden">
			<div
				:key="currentIndex"
				class="flex justify-center items-center w-full transform overflow-hidden"
				style="overflow: hidden"
				:class="{ 'translate-x-full': leaving }">
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
		</transition>
	</div>
</template>

<script setup>
	const { fileList, currentIndex, currentItem, leaving } = defineProps([
		"fileList",
		"currentIndex",
		"currentItem",
		"leaving",
	])
</script>
