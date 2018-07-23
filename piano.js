const keys = document.querySelectorAll('.key');
const keysText = {
  normal: ['a', 'w', 's', 'e', 'd', 'f', 't', 'g', 'y', 'h', 'u', 'j'],
  gama: ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'h' ]
};
const recordedSounds = [];
const recordButtonText = document.getElementById('record');
const resetButtonText = document.getElementById('reset');
const playButtonText = document.getElementById('play');
const playButton = document.getElementById('btn-play');
const resetButton = document.getElementById('btn-reset');
const switchButton = document.getElementById('switch');
const minInterval = 50;
var startingTime = 0;
var lastTime = 0;
var isRecording = false;
var toReset = false;
var keysTextType = 'normal';



changeKeyText = () => {
  var type = keysText.normal;
  if (keysTextType === 'normal') {
    type = keysText.gama;
    keysTextType = 'gama';
    switchButton.classList.add('active');
  } else {
    keysTextType = 'normal';
    switchButton.classList.remove('active');
  }
  keys.forEach((key, index) => {
    key.querySelector('kbd').innerText = type[index];
  });
  
};

playSong = () => {
  let counter = 0;
  const playIt = setInterval(() => {
    playButtonText.classList.add('active-record');
    recordedSounds.forEach(e => {
      if (e.time === counter) {
        e.audioFile.currentTime = 0;
        e.audioFile.play();
      }
    });
    counter = counter + minInterval;
    if ((counter > lastTime+1000) || (counter > 60000)) {
      clearInterval(playIt);
      playButtonText.classList.remove('active-record');
  
    }
  }, minInterval);
  playIt;
};


startRecording = () => {
  isRecording = true;
  toReset = false;
  resetButtonText.innerText = 'Stop';
  recordButtonText.classList.add('active-record');
  playButton.disabled = false;
  resetButton.disabled = false;
  startingTime = new Date().getTime();
};

recordReset = () => {
  resetButtonText.innerText = 'Reset';
  if (toReset) {
    recordedSounds.length = 0;
    resetButtonText.innerText = 'Stop';
    playButton.disabled = true;
    resetButton.disabled = true;
  }
  isRecording = false;
  toReset = true;
  recordButtonText.classList.remove('active-record');
  keys.forEach(key => {
    key.classList.remove('playing');
  });
};

keyTime = () => {
  const localTime = new Date().getTime();
  lastTime = localTime - startingTime;
  return Math.ceil(lastTime / minInterval) * minInterval;
};

function playSound(e) {
  const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);
  const key = document.querySelector(`.key[data-key="${e.keyCode}"]`);
  if (!audio) return;
  if (isRecording) {
    recordedSounds.push({
      time: keyTime(),
      audioFile: audio
    });
  }
  audio.currentTime = 0;
  audio.play();
  key.classList.add('playing');
}

function clickKey() {
  const keyCode = this.getAttribute('data-key');
  const audio = document.querySelector(`audio[data-key="${keyCode}"]`);
  if (isRecording) {
    recordedSounds.push({
      time: keyTime(),
      audioFile: audio
    });
  }
  audio.currentTime = 0;
  audio.play();
  this.classList.add('playing');
}

function removeTransition(e) {
  if (e.propertyName !== 'height') return;
  this.classList.remove('playing');
}

keys.forEach(key => {
  key.addEventListener('click', clickKey);
  key.addEventListener('transitionend', removeTransition);
});

window.addEventListener('keydown', playSound);
