const keys = document.querySelectorAll('.key');
const recordedSounds = [];
const recordButtonText = document.getElementById('record');
const resetButtonText = document.getElementById('reset');
const playButton = document.getElementById('btn-play');
const resetButton = document.getElementById('btn-reset');
var startingTime = 1000;
var lastTime = 0;
var isRecording = false;
var toReset = false;

playSong = () => {
  let counter = 0;
  const playIt = setInterval(() => {
    counter = counter + 100;
    recordedSounds.forEach(e => {
      if (e.time == counter) {
        e.audioFile.play();
      }
    });
    if ((counter > lastTime) || (counter > 60000)) {
      clearInterval(playIt)
    }
  }, 100);
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
  return Math.ceil(lastTime / 100) * 100;
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
