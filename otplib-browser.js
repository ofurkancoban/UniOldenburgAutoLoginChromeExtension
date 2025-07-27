(function () {
  function base32ToBytes(base32) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    let bits = "";
    base32 = base32.replace(/=+$/, "").toUpperCase();
    for (let i = 0; i < base32.length; i++) {
      const val = alphabet.indexOf(base32.charAt(i));
      if (val === -1) continue;
      bits += val.toString(2).padStart(5, "0");
    }
    let bytes = [];
    for (let i = 0; i + 8 <= bits.length; i += 8) {
      bytes.push(parseInt(bits.substring(i, i + 8), 2));
    }
    return new Uint8Array(bytes);
  }

  async function hmacSha1(key, msg) {
    const cryptoKey = await crypto.subtle.importKey("raw", key, { name: "HMAC", hash: "SHA-1" }, false, ["sign"]);
    const signature = await crypto.subtle.sign("HMAC", cryptoKey, msg);
    return new Uint8Array(signature);
  }

  async function generateTOTP(secret) {
    const key = base32ToBytes(secret);
    const time = Math.floor(Date.now() / 1000 / 30);
    const msg = new ArrayBuffer(8);
    const view = new DataView(msg);
    view.setUint32(4, time); // last 4 bytes for counter
    const hmac = await hmacSha1(key, msg);
    const offset = hmac[hmac.length - 1] & 0x0f;
    const binary = ((hmac[offset] & 0x7f) << 24) |
                   ((hmac[offset + 1] & 0xff) << 16) |
                   ((hmac[offset + 2] & 0xff) << 8) |
                   (hmac[offset + 3] & 0xff);
    const otp = (binary % 1e6).toString().padStart(6, "0");
    return otp;
  }

  window.otplib = {
    authenticator: {
      generate: (secret) => generateTOTP(secret) // returns Promise
    }
  };
})();