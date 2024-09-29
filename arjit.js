const hamberger = document.querySelector(".hamberger");
const sideBar = document.querySelector(".sidebar");
const closeBtn = document.querySelector(".hide-sidebar");

let songs = [];
let songIndex = -1;
let currentlyPlayingIndex = null;
let isSuffleEnable = false;
let isRepeatEnable = false;
let homeSong = new Audio("https://res.cloudinary.com/dlt4ash36/video/upload/v1700895570/Heeriyen.mp3");
let audioElement = new Audio();
let playBtnHome = document.getElementById("play-btn-home");
let masterPlayBtn = document.getElementById("masterPlayBtn");
let progressBarContainer = document.querySelector(".progressbar-container");
let customProgress = document.getElementById('customProgress');
let customProgressThumb = document.getElementById('customProgressThumb');
let customProgressBar = document.getElementById('customProgressBar');
let musicStart = document.getElementById("musicStart");
let musicEnd = document.getElementById("musicEnd");
let sideBarSearchIcon = document.querySelector("#sidebar-search");
let headerSearchDiv = document.querySelector(".header-search-div");
let masterSongTitle = document.getElementById("masterSongTitle");
let masterSongInfo = document.getElementById("masterSongInfo");
let masterCover = document.getElementById("masterCover");
let songCards = Array.from(document.getElementsByClassName("song-cards"));
let songCardsBtn = Array.from(document.getElementsByClassName("cover-play-btn"));
let playTitle = document.querySelector(".play");
let musicRepeat = document.getElementById("repeatMode");
let repeatIndicator = document.getElementById("repeat-enable-indicator");
let shuffleMusic = document.getElementById("shuffleMusic");
let shuffleIndicator = document.getElementById("shuffle-enable-indicator");
let footerHeartIcon = document.querySelector(".fa-heart");
let volumeSeekbar = document.querySelector(".volume-seekbar");
let volumeIcon = document.querySelector(".fa-volume-high");
let mute = document.querySelector(".mute");
let searchIcon = document.querySelector(".header-search-icon");
let searchBar = document.getElementById("searchBar");
let pageNavigateBtn = document.querySelector(".back-forward-btn-container");
let dropdownContainer = document.querySelector(".upgrade-dropdown-container");
let dropdown = document.querySelector(".dropdown");
let dropdownInner = document.querySelector(".dropdown-inner");
let dropdownIcon = document.querySelector(".fa-caret-down");
let profileName = document.querySelector(".profile-name");
let profileImage = document.querySelector(".profile-image");
let logOut = document.querySelector("#log-out");
let followBtn = document.getElementById("follow-btn");
const apiUrl = 'https://api.allorigins.win/raw?url=https://api.deezer.com/search?q=arijitsingh';

// Play home song
function homeSongPlay() {
    if (homeSong.paused) {
        homeSong.play();
        playBtnHome.textContent = "Pause";
        masterPlayBtn.classList.remove("fa-circle-play");
        masterPlayBtn.classList.add("fa-circle-pause");
        masterSongTitle.textContent = "Heeriyen";
        masterSongInfo.textContent = "Harshdeep Kaur, Arijit Singh";
        masterCover.src = "https://res.cloudinary.com/dlt4ash36/image/upload/v1700793770/heeriyen-cover.jpg";
        playTitle.textContent = "Pause";
    } else {
        homeSong.pause();
        playBtnHome.textContent = "Play";
        masterPlayBtn.classList.remove("fa-circle-pause");
        masterPlayBtn.classList.add("fa-circle-play");
        masterSongTitle.textContent = "Heeriyen";
        masterSongInfo.textContent = "Harshdeep Kaur, Arijit Singh";
        masterCover.src = "https://res.cloudinary.com/dlt4ash36/image/upload/v1700793770/heeriyen-cover.jpg";
        playTitle.textContent = "Play";
    }

    audioElement.pause();
    resetPlayIcons();
    audioElement.currentTime = 0;
    songIndex = -1;
}

playBtnHome.addEventListener("click", () => {
    homeSongPlay();
});

// Getting songs data from API
async function fetchMusicData() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        songs = data.data || [];
        renderSongs();
    } catch (error) {
        console.log('Error fetching music data:', error);
    }
}

// Call the function to fetch the music data from Deezer API
fetchMusicData();

// Update the custom progress bar with the current song's progress
function updateCustomProgressBar() {
    let currentTime = homeSong.paused ? audioElement.currentTime : homeSong.currentTime;
    let duration = homeSong.paused ? audioElement.duration : homeSong.duration;
    const progress = (currentTime / duration) * 100;

    customProgress.style.width = `${progress}%`;
    customProgressThumb.style.left = `calc(${progress}% - 5px)`;
}

// Seek functionality on custom progress bar click
customProgressBar.addEventListener('click', (event) => {
    const progressBarWidth = customProgressBar.clientWidth;
    const clickX = event.clientX - customProgressBar.getBoundingClientRect().left;
    let duration = homeSong.paused ? audioElement.duration : homeSong.duration;

    if (duration) {
        const seekTime = (clickX / progressBarWidth) * duration;
        if (homeSong.paused) {
            audioElement.currentTime = seekTime;
        } else {
            homeSong.currentTime = seekTime;
        }
    }
});

// Update the custom progress bar while the song is playing
audioElement.addEventListener('timeupdate', updateCustomProgressBar);
homeSong.addEventListener('timeupdate', updateCustomProgressBar);

// Reset progress bar when audioElement or homeSong ends
audioElement.addEventListener("ended", () => customProgress.value = 0);
homeSong.addEventListener("ended", () => customProgress.value = 0);

// Time update function
function timeUpdate() {
    let currentTime = homeSong.paused ? audioElement.currentTime : homeSong.currentTime;
    let duration = homeSong.paused ? audioElement.duration : homeSong.duration;

    if (duration) {
        let progressValue = (currentTime / duration) * 100;
        customProgress.value = progressValue;

        let progressMinutes = Math.floor(currentTime / 60);
        let progressSeconds = Math.floor(currentTime % 60);
        musicStart.textContent = `${progressMinutes}:${progressSeconds < 10 ? '0' : ''}${progressSeconds}`;

        let durationMinutes = Math.floor(duration / 60);
        let durationSeconds = Math.floor(duration % 60);
        musicEnd.textContent = `${durationMinutes}:${durationSeconds < 10 ? '0' : ''}${durationSeconds}`;
    }
}

// Call timeUpdate() function by audioElement and homeSong
audioElement.addEventListener("timeupdate", timeUpdate);
homeSong.addEventListener("timeupdate", timeUpdate);

// Rendering songs on webpage
function renderSongs() {
    songs.forEach((song, index) => {
        const cover = document.querySelectorAll('.song-cover img')[index];
        const title = document.querySelectorAll('.song-title')[index];
        const artist = document.querySelectorAll('.song-artist')[index];
        const playBtn = document.querySelectorAll('.cover-play-btn')[index];

        cover.src = song.album.cover;
        title.textContent = song.title;
        artist.textContent = song.artist.name;

        playBtn.addEventListener('click', () => {
            songIndex = index;
            displaySongDetails(songIndex);
        });
    });
}

// Change the song info on master play
function displaySongDetails(index) {
    let song = songs[index];
    masterSongTitle.textContent = song.title;
    masterSongInfo.textContent = song.artist.name;
    masterCover.src = song.album.cover;
    customProgress.value = 0;
}

// play/pause song by card's button function
function playPauseSong(index) {
    if (index === currentlyPlayingIndex && audioElement.paused) {
        audioElement.play();
        updatePlayButton(index, "pause");
    } else if (index === currentlyPlayingIndex && !audioElement.paused) {
        audioElement.pause();
        updatePlayButton(index, "play");
    } else {
        resetPlayIcons();
        audioElement.src = songs[index].preview;
        audioElement.load();
        audioElement.play();
        currentlyPlayingIndex = index;
        updatePlayButton(index, "pause");
    }

    homeSong.pause();
    homeSong.currentTime = 0;
    playBtnHome.textContent = "Play";
}

// Update play button icons
function updatePlayButton(index, action) {
    const playBtn = document.querySelectorAll('.cover-play-btn')[index];
    if (action === "pause") {
        playBtn.classList.remove('fa-circle-play');
        playBtn.classList.add('fa-circle-pause');
        masterPlayBtn.classList.remove("fa-circle-play");
        masterPlayBtn.classList.add("fa-circle-pause");
        playTitle.textContent = "Pause";
    } else {
        playBtn.classList.remove('fa-circle-pause');
        playBtn.classList.add('fa-circle-play');
        masterPlayBtn.classList.remove("fa-circle-pause");
        masterPlayBtn.classList.add("fa-circle-play");
        playTitle.textContent = "Play";
    }
}
