/* 
  controller.js
  This file runs on the CONTROLLER side (e.g., a smartphone).
  It hides the QR code container and sends messages to the DISPLAY
  via Firebase Realtime Database.
*/

document.addEventListener('DOMContentLoaded', function() {

  // 1) Load Firebase scripts from your HTML (before this file),
  //    or inline here if you prefer. For example:
  //    <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js"></script>
  //    <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js"></script>
  //    <script src="controller.js"></script>

  // 2) Initialize Firebase. Use the same config as in display.js.
  const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT.firebaseio.com",
    projectId: "YOUR_PROJECT",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
  };
  const app = firebase.initializeApp(firebaseConfig);
  const db = firebase.database();

  // 3) On load, hide the QR container if it exists.
  const qrContainer = document.getElementById("qrContainer");
  if (qrContainer) {
    qrContainer.style.display = "none";
  }
  console.log("Controller: Hiding QR code container.");

  // 4) Send a "controller-online" message so the Display knows we've connected.
  function sendMessage(msg) {
    db.ref("liftandearn/control").set({
      message: msg,
      timestamp: Date.now()
    }).then(() => {
      console.log("Controller: Sent message:", msg);
    }).catch((error) => {
      console.error("Controller: Error sending message:", error);
    });
  }

  // 5) Send "controller-online" on load, so the Display hides its QR code immediately.
  setTimeout(() => {
    sendMessage("controller-online");
  }, 2000);

  // 6) Button event listeners
  const shakeButton = document.getElementById("shakeButton");
  const tiltButton = document.getElementById("tiltButton");
  const logPointsButton = document.getElementById("logPointsButton");
  const displayArea = document.getElementById("displayArea");

  if (shakeButton) {
    shakeButton.addEventListener("click", () => {
      console.log("Controller: Shake button pressed");
      sendMessage("shake-action");
      if (displayArea) {
        displayArea.innerText = "Shake action received on Controller!";
      }
    });
  }

  if (tiltButton) {
    tiltButton.addEventListener("click", () => {
      console.log("Controller: Tilt button pressed");
      sendMessage("tilt-action");
      if (displayArea) {
        displayArea.innerText = "Tilt action received on Controller!";
      }
    });
  }

  if (logPointsButton) {
    logPointsButton.addEventListener("click", () => {
      console.log("Controller: Log Points button pressed");
      sendMessage("log-points");
      if (displayArea) {
        displayArea.innerText = "Log Points action received on Controller!";
      }
    });
  }
});
