// qr.js
export function generateQRCode(containerId, url) {
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
