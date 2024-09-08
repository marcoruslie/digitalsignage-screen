<template>
    <div v-if="currentItem != ''"
        class="bg-gradient-to-tl from-Primary to-OnPrimaryContainer overflow-hidden h-[95vw] w-[100vh] flex justify-center items-center">
        <img v-if="currentItem.type === 'image'" :src="'/_nuxt/' + currentItem.url" class="w-full" />
        <video v-else autoplay muted class="h-full">
            <source :src="'/_nuxt/' + currentItem.url" type="video/mp4" />
        </video>
    </div>
</template>

<script setup>
const { currentItem } = defineProps(["currentItem"])
</script>
