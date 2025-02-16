// QRCode/controller.js
document.addEventListener('DOMContentLoaded', function() {
  // Firebase configuration (replace with your actual values)
  const firebaseConfig = {
    apiKey: "AIzaSyBkhEqivOcbkzd1MySLaNCRuSyeWbEz4UQ",
    authDomain: "simplixliftandearn.firebaseapp.com",
    databaseURL: "https://simplixliftandearn-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "simplixliftandearn",
    storageBucket: "simplixliftandearn.firebasestorage.app",
    messagingSenderId: "901097563834",
    appId: "1:901097563834:web:7639d8d3eca0f986f34483",
    measurementId: "G-T680ZGWH3Y"
  };

  // Initialize Firebase
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  const db = firebase.database();

  // Hide the QR code container on the Controller.
  const qrContainer = document.getElementById("qrContainer");
  if (qrContainer) {
    qrContainer.style.display = "none";
  }
  console.log("Controller: QR code container hidden.");

  // Function to send a control message.
  function sendControlMessage(message) {
    firebase.database().ref("liftandearn/control").set({
      message: message,
      timestamp: Date.now()
    })
    .then(() => {
      console.log("Controller: Sent message:", message);
    })
    .catch((error) => {
      console.error("Controller: Error sending message:", error);
    });
  }

  // Immediately send "controller-online" after a short delay.
  setTimeout(() => {
    sendControlMessage("controller-online");
  }, 2000);

  // Button event listeners.
  const shakeButton = document.getElementById("shakeButton");
  const tiltButton = document.getElementById("tiltButton");
  const logPointsButton = document.getElementById("logPointsButton");
  const displayArea = document.getElementById("displayArea");

  if (shakeButton) {
    shakeButton.addEventListener("click", function() {
      console.log("Controller: Shake button pressed");
      sendControlMessage("shake-action");
      displayArea.innerText = "Shake action received on Controller!";
    });
  }

  if (tiltButton) {
    tiltButton.addEventListener("click", function() {
      console.log("Controller: Tilt button pressed");
      sendControlMessage("tilt-action");
      displayArea.innerText = "Tilt action received on Controller!";
    });
  }

  if (logPointsButton) {
    logPointsButton.addEventListener("click", function() {
      console.log("Controller: Log Points button pressed");
      sendControlMessage("log-points");
      displayArea.innerText = "Log Points action received on Controller!";
    });
  }
});
