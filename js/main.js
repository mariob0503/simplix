// main.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-analytics.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";
import { generateQRCode } from "./qr.js";

// -------------------------------------------------
// 1) Firebase configuration (replace with your actual values)
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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

// -------------------------------------------------
// 2) Check if this instance is the Controller or the Display
const urlParams = new URLSearchParams(window.location.search);
const isController = urlParams.has("controller");
console.log("Is Controller:", isController);

// -------------------------------------------------
// 3) On the Display side (no ?controller):
//    - Clear old message so the QR code is shown on refresh
//    - Generate the QR code that points to ?controller
if (!isController) {
  // Clear old message
  set(ref(db, "liftandearn/control"), null)
    .then(() => {
      console.log("Display: Cleared old control message.");
      // Generate the QR code that points to this same page + ?controller
      generateQRCode("qrContainer", window.location.href + "?controller");
    })
    .catch((error) => {
      console.error("Display: Error clearing old message:", error);
      // Even if there's an error, still generate the QR code
      generateQRCode("qrContainer", window.location.href + "?controller");
    });
} else {
  // On the Controller side: hide the QR code container
  const qrContainer = document.getElementById("qrContainer");
  if (qrContainer) {
    qrContainer.style.display = "none";
  }
  console.log("Controller: Hiding QR code container.");

  // After 2 seconds, send "controller-online" so the Display knows we connected
  setTimeout(() => {
    sendControlMessage("controller-online");
  }, 2000);
}

// -------------------------------------------------
// 4) Real-time listener on the Display side
if (!isController) {
  const controlRef = ref(db, "liftandearn/control");
  onValue(controlRef, (snapshot) => {
    const data = snapshot.val();
    console.log("Display received control message:", data);
    if (data) {
      // If the Controller just came online, hide the QR code & show message
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
}

// -------------------------------------------------
// 5) Function to send a message from the Controller
function sendControlMessage(msg) {
  set(ref(db, "liftandearn/control"), {
    message: msg,
    timestamp: Date.now()
  })
    .then(() => {
      console.log("Controller: Sent message:", msg);
    })
    .catch((error) => {
      console.error("Controller: Error sending message:", error);
    });
}

// -------------------------------------------------
// 6) Button event listeners for both sides
document.getElementById("shakeButton").addEventListener("click", () => {
  if (isController) {
    console.log("Controller: Shake button pressed");
    sendControlMessage("shake-action");
    document.getElementById("displayArea").innerText = "Shake action received on Controller!";
  } else {
    document.getElementById("displayArea").innerText = "Shake action received on Display!";
  }
});

document.getElementById("tiltButton").addEventListener("click", () => {
  if (isController) {
    console.log("Controller: Tilt button pressed");
    sendControlMessage("tilt-action");
    document.getElementById("displayArea").innerText = "Tilt action received on Controller!";
  } else {
    document.getElementById("displayArea").innerText = "Tilt action received on Display!";
  }
});

document.getElementById("logPointsButton").addEventListener("click", () => {
  if (isController) {
    console.log("Controller: Log Points button pressed");
    sendControlMessage("log-points");
    document.getElementById("displayArea").innerText = "Log Points action received on Controller!";
  } else {
    document.getElementById("displayArea").innerText = "Log Points action received on Display!";
  }
});
