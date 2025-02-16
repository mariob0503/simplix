// QRCode/display.js
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

  // Initialize Firebase (using the namespaced version)
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  const db = firebase.database();

  // Clear any old control message so the QR code is shown on refresh.
  firebase.database().ref("liftandearn/control").set(null)
    .then(() => {
      console.log("Display: Cleared old control message.");
      // Generate the QR code (points to the Controller URL)
      generateQRCode("qrContainer", window.location.href + "?controller");
    })
    .catch((error) => {
      console.error("Display: Error clearing control message:", error);
      generateQRCode("qrContainer", window.location.href + "?controller");
    });

  // Listen for control messages
  const controlRef = firebase.database().ref("liftandearn/control");
  controlRef.on("value", (snapshot) => {
    const data = snapshot.val();
    console.log("Display received control message:", data);
    if (data) {
      if (data.message === "controller-online") {
        document.getElementById("qrContainer").style.display = "none";
        document.getElementById("displayArea").innerText = "Control taken by Controller.";
      } else if (data.message === "shake-action") {
        document.getElementById("displayArea").innerText = "Shake action received on Display!";
      } else if (data.message === "tilt-action") {
        document.getElementById("displayArea").innerText = "Tilt action received on Display!";
      } else if (data.message === "log-points") {
        console.log("Display: Received 'log-points'. Redirecting...");
        window.location.href = "https://mariob0503.github.io/simplix/";
      }
    }
  });
});
