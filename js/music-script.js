// 定义全局常量
const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
mainAudio = wrapper.querySelector("#main-audio"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
progressBar = wrapper.querySelector(".progress-bar"),
progressArea = wrapper.querySelector(".progress-area"),
musicList = wrapper.querySelector(".music-list"),
showMoreBtn = wrapper.querySelector("#more-music"),
hideMusicBtn = wrapper.querySelector("#close");

// 定义音乐索引号变量
let musicIndex = 1;

// 浏览器事件监听，页面加载完成后触发 loadMusic函数
window.addEventListener("load", function(){
    loadMusic(musicIndex);
    playNow();
})

// 加载音乐
function loadMusic(indexNumb){
    musicName.innerText = allMusic[indexNumb-1].name;
    musicArtist.innerText = allMusic[indexNumb-1].artist;
    musicImg.src = `images/${allMusic[indexNumb-1].img}.jpg`;
    mainAudio.src = `songs/${allMusic[indexNumb-1].src}.mp3`;
}

// 播放音乐
function playMusic(){
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
}

// 暂停音乐
function pauseMusic(){
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
}

// 下一首
function nextMusic(){
    musicIndex++;
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playNow();
}

// 上一首
function prevMusic(){
    musicIndex--;
    musicIndex < 1 ? musicIndex = allMusic.length :  musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playNow();
}

// 播放、暂停按钮添加事件监听
playPauseBtn.addEventListener("click", function(){
    const isMusicPaused = wrapper.classList.contains("paused");
    isMusicPaused ? pauseMusic() : playMusic();playNow();
});

// 下一首按钮添加事件监听
nextBtn.addEventListener("click", function(){
    nextMusic();
})

// 上一首按钮添加事件监听
prevBtn.addEventListener("click", function(){
    prevMusic();
})

// 添加音乐事件监听，当前播放位置发生改变时触发
mainAudio.addEventListener("timeupdate", function(e){
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;

    // 进度条宽度
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    let musicCurrentTime = wrapper.querySelector(".current");
    let musicDuration = wrapper.querySelector(".duration");

    // 添加音乐事件监听，浏览器加载当前帧时触发
    mainAudio.addEventListener("loadeddata", function(){
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec < 10){
            totalSec = `0${totalSec}`;
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`;
    })

    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if(currentSec < 10){
        currentSec = `0${currentSec}`;
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

// 添加进度条事件监听
progressArea.addEventListener("click", function(e){
    let progressWidthval = progressArea.clientWidth;
    let clickOffSetX = e.offsetX;
    let songDuration = mainAudio.duration;

    mainAudio.currentTime = (clickOffSetX / progressWidthval) * songDuration;
    playMusic();
});

// 添加重播按钮事件监听
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", function(){
    let getText = repeatBtn.innerText;
    switch(getText){
        case "repeat" :
            repeatBtn.innerText = "repeat_one";
            break;
        case "repeat_one" :
            repeatBtn.innerText = "shuffle";
            break;
        case "shuffle" :
            repeatBtn.innerText = "repeat";
            break;
    }
});

// 添加音乐事件监听，当监测到音乐结束时触发，判断重复播放按钮状态
mainAudio.addEventListener("ended", function(){
    let getText = repeatBtn.innerText;
    switch(getText){
        case "repeat" :
            nextMusic();
            break;
        case "repeat_one" :
            mainAudio.currentTime = 0;
            loadMusic(musicIndex);
            playMusic();
            playNow();
            break;
        case "shuffle" :
            let randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            do{
                randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            }while(musicIndex == randIndex);
            musicIndex = randIndex;
            loadMusic(musicIndex);
            playMusic();
            playNow();
            break;
    }
});

// 添加更多按钮事件监听
showMoreBtn.addEventListener("click", function(){
    musicList.classList.toggle("show");
});

// 添加隐藏按钮事件监听
hideMusicBtn.addEventListener("click", function(){
    showMoreBtn.click();
});

// 音乐列表
const ulTag = wrapper.querySelector("ul");
// 循环 allMusic 数组
for(let i = 0; i < allMusic.length; i++){
    let liTag = `<li li-index="${i+1}">
                    <div class="row">
                        <span>${allMusic[i].name}</span>
                        <p>${allMusic[i].artist}</p>
                    </div>
                    <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
                    <span id="${allMusic[i].src}" class="audio-duration">0:00</span>
                </li>`;
    // 在ul标签内部，最后一个子元素之后插入html
    ulTag.insertAdjacentHTML("beforeend", liTag);

    let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

    // 添加音乐标签事件监听
    liAudioTag.addEventListener("loadeddata", function(){
        let audioDuration = liAudioTag.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec < 10){
            totalSec = `0${totalSec}`;
        }
        liAudioDuration.innerText = `${totalMin}:${totalSec}`;
        liAudioDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`);
    });
}

// 正在播放函数
const allLiTags = ulTag.querySelectorAll("li");
function playNow(){
    for (let j = 0; j < allLiTags.length; j++){
        let audioTag = allLiTags[j].querySelector(".audio-duration");
        if(allLiTags[j].classList.contains("playing")){
            allLiTags[j].classList.remove("playing");
            let addDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText = addDuration;
        }
        if(allLiTags[j].getAttribute("li-index") == musicIndex){
            allLiTags[j].classList.add("playing");
            audioTag.innerText = "playing";
        }
        allLiTags[j].setAttribute("onclick", "clicked(this)");
    }
}

// 音乐列表点击函数
function clicked(element){
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex;
    loadMusic(musicIndex);
    playMusic();
    playNow();
}