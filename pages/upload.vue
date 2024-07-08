<template>
    <button @click="playVideo">Play Video</button>
    <br>
    <button @click="pauseVideo">Pause Video</button>
    <br>
    <button @click="resumeVideo">Resume Video</button>
    <div class="">
        <div id="player"></div>
    </div>
</template>

<script setup>
let youtubePlayer;

onMounted(() => {
    // Load the YouTube Player API script dynamically
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
});

// Function to create and initialize the YouTube player
const playVideo = () => {
    if (YT && YT.Player) {
        youtubePlayer = new YT.Player('player', {
            height: '315',
            width: '560',
            videoId: 'WqGOaOHu5uY', // Replace with your video ID
            events: {
                'onReady': onPlayerReady
            }
        });
    }
};

// Function called when the player is ready
const onPlayerReady = (event) => {
    event.target.playVideo(); // Automatically start playing the video
};

// Function to pause the video
const pauseVideo = () => {
    if (youtubePlayer) {
        youtubePlayer.pauseVideo();
    }
};

const resumeVideo = () => {
  if (youtubePlayer) {
    youtubePlayer.playVideo();
  }
};
</script>