/* 
  display.js
  This file runs on the DISPLAY side (e.g., a large screen).
  It clears any old control message, shows a QR code,
  and listens for messages from the CONTROLLER (on another device).
*/

document.addEventListener('DOMContentLoaded', function() {

  // 1) Load Firebase scripts from your HTML (before this file),
  //    or inline here if you prefer. For example:
  //    <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js"></script>
  //    <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js"></script>
  //    <script src="display.js"></script>

  // 2) Initialize Firebase. Replace with your actual config.
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

  // 3) Utility: Generate a QR code that points to the Controller side.
  //    For example, you can add "?controller" to the current URL or use a separate link.
  function generateQRCode(containerId, url) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    new QRCode(container, {
      text: url,
      width: 128,
      height: 128,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    });
  }

  // 4) On load, clear old control message so the Display is fresh.
  const controlRef = db.ref("liftandearn/control");
  controlRef.set(null)
    .then(() => {
      console.log("Display: Old message cleared. Generating QR code...");
      // Generate a QR code that points to the same page with ?controller appended,
      // or to a separate controller page if you prefer.
      generateQRCode("qrContainer", window.location.href + "?controller");
    })
    .catch((error) => {
      console.error("Display: Error clearing old message:", error);
      // Even on error, try generating the QR code anyway.
      generateQRCode("qrContainer", window.location.href + "?controller");
    });

  // 5) Listen for new messages in the Realtime Database.
  controlRef.on("value", (snapshot) => {
    const data = snapshot.val();
    console.log("Display received message:", data);
    if (data) {
      // If the Controller says "controller-online", hide QR code & show a "control taken" message.
      if (data.message === "controller-online") {
        document.getElementById("qrContainer").style.display = "none";
        document.getElementById("displayArea").innerText = "Control taken by Controller.";
      }
      else if (data.message === "shake-action") {
        document.getElementById("displayArea").innerText = "Shake action received on Display!";
      }
      else if (data.message === "tilt-action") {
        document.getElementById("displayArea").innerText = "Tilt action received on Display!";
      }
      else if (data.message === "log-points") {
        console.log("Display: 'log-points' received. Redirecting now...");
        window.location.href = "https://mariob0503.github.io/simplix/";
      }
    }
  });

  // 6) Basic UI references
  const qrContainer = document.getElementById("qrContainer");
  const displayArea = document.getElementById("displayArea");

  // (Optional) If you want to handle local button clicks on the Display side,
  // you can attach event listeners here. But typically, the Display is just a listener.
});
