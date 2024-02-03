const videoGrid = document.getElementById('video-grid');
const startStreamButton = document.getElementById('start-stream');
const stopStreamButton = document.getElementById('stop-stream');
let localStream;
const peers = {}; // Object to store other users' video elements

// Function to start streaming video
async function startStreaming() {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    const videoElement = document.createElement('video');
    videoElement.srcObject = localStream;
    videoElement.autoplay = true;
    videoElement.muted = true; // Mute local stream
    videoElement.classList.add('video');
    videoGrid.appendChild(videoElement);

    // When a new user starts streaming, create a video element for them
    const peerStream = new MediaStream();
    addPeerStream(peerStream);

    // Update the peer's stream when a new track is added
    localStream.getTracks().forEach(track => {
      peerStream.addTrack(track);
    });
  } catch (error) {
    console.error('Error accessing media devices:', error);
  }
}

// Function to add a new peer's stream
function addPeerStream(stream) {
  const videoElement = document.createElement('video');
  videoElement.srcObject = stream;
  videoElement.autoplay = true;
  videoElement.classList.add('video');
  videoGrid.appendChild(videoElement);
  return videoElement;
}

// Function to stop streaming video
function stopStreaming() {
  if (localStream) {
    const tracks = localStream.getTracks();
    tracks.forEach(track => track.stop());
    videoGrid.innerHTML = ''; // Clear the video grid

    // Remove other users' video elements
    for (let peerId in peers) {
      peers[peerId].remove();
      delete peers[peerId];
    }
  }
}

// Event listeners for buttons
startStreamButton.addEventListener('click', startStreaming);
stopStreamButton.addEventListener('click', stopStreaming);
