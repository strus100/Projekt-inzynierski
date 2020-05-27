'use strict';

const videoLocal = document.querySelector('video#videoLocal');

const video2 = document.querySelector('video#video2');

const statusDiv = document.querySelector('div#status');

const audioCheckbox = document.querySelector('input#audio');

const startButton = document.querySelector('button#start');
const callButton = document.querySelector('button#call');

const hangupButton = document.querySelector('button#hangup');

startButton.onclick = start;
callButton.onclick = call;

hangupButton.onclick = hangup;

const pipes = [];

let localStream;
let remoteStream;

function gotStream(stream) {
  console.log('Received local stream');
  videoLocal.srcObject = stream;
  localStream = stream;
  callButton.disabled = false;
}

function gotremoteStream(stream) {
  remoteStream = stream;
  video2.srcObject = stream;
  console.log('Received remote stream');
  console.log(`${pipes.length} element(s) in chain`);
  statusDiv.textContent = `${pipes.length} element(s) in chain`;
 }

function start() {
  console.log('Requesting local stream');
  startButton.disabled = true;
  const options = audioCheckbox.checked ? {audio: true, video: true} : {audio: false, video: true};
  navigator.mediaDevices
      .getUserMedia(options)
      .then(gotStream)
      .catch(function(e) {
        alert('getUserMedia() failed');
        console.log('getUserMedia() error: ', e);
      });
}

function call() {
  callButton.disabled = true;
  hangupButton.disabled = false;
  console.log('Starting call');
  pipes.push(new VideoPipe(localStream, gotremoteStream));
}

function hangup() {
  console.log('Ending call');
  while (pipes.length > 0) {
    const pipe = pipes.pop();
    pipe.close();
  }
  hangupButton.disabled = true;
  callButton.disabled = false;
}