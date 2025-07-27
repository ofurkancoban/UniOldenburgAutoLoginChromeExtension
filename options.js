document.addEventListener("DOMContentLoaded", () => {
  const saveBtn = document.getElementById('save');
  const qrFile = document.getElementById('qrfile');
  const secretInput = document.getElementById('secret');
  const statusText = document.getElementById('qrstatus');

  async function getAppKey() {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      enc.encode(chrome.runtime.id),
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );
    return crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: enc.encode("uol-fixed-salt"),
        iterations: 100000,
        hash: "SHA-256"
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  }

  async function encryptData(data) {
    const key = await getAppKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const enc = new TextEncoder();
    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      enc.encode(JSON.stringify(data))
    );
    return { iv: Array.from(iv), data: Array.from(new Uint8Array(encrypted)) };
  }

  saveBtn.addEventListener('click', async () => {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const secret = secretInput.value.trim();

    if (!username || !password || !secret) {
      statusText.innerText = 'Please fill in all fields!';
      return;
    }

    try {
      const encrypted = await encryptData({ username, password, secret });
      await chrome.storage.local.set({ credentials: encrypted });
      statusText.innerText = 'Credentials encrypted and saved!';
    } catch (err) {
      console.error('Encryption error:', err);
      statusText.innerText = 'Error saving credentials!';
    }
  });

  // QR okuma: sadece secret alanını doldur, resim gösterme
  qrFile.addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function () {
      const image = new Image();
      image.src = reader.result;
      image.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        const qrCode = jsQR(imageData.data, canvas.width, canvas.height);
        if (qrCode) {
          const match = qrCode.data.match(/secret=([^&]+)/i);
          if (match) {
            const extractedSecret = match[1].toUpperCase();
            secretInput.value = extractedSecret;
            statusText.innerText = 'Secret extracted from QR!';
          } else {
            statusText.innerText = 'No secret found in QR.';
          }
        } else {
          statusText.innerText = 'QR code not recognized.';
        }
      };
    };
    reader.readAsDataURL(file);
  });
});