(async () => {
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

  async function decryptData(encryptedObj) {
    const key = await getAppKey();
    const iv = new Uint8Array(encryptedObj.iv);
    const data = new Uint8Array(encryptedObj.data);
    const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);
    return JSON.parse(new TextDecoder().decode(decrypted));
  }

  function waitForXPath(xpath, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        const el = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (el) {
          clearInterval(interval);
          resolve(el);
        }
      }, 300);
      setTimeout(() => {
        clearInterval(interval);
        reject('XPath not found: ' + xpath);
      }, timeout);
    });
  }

  console.log('AutoLogin started...');
  let stepsDone = [];

  const encrypted = (await chrome.storage.local.get(['credentials'])).credentials;
  if (!encrypted) {
    console.log('No credentials found.');
    return;
  }
  const { username, password, secret } = await decryptData(encrypted);

  async function handleStep() {
    const url = window.location.href;

    if (url.includes("/oauth2/grant") && !stepsDone.includes("username")) {
      const usernameInput = await waitForXPath('/html/body/div[1]/div/div/div[2]/div/div/form/div[1]/div/input');
      usernameInput.value = username;
      const nextBtn = await waitForXPath('/html/body/div[1]/div/div/div[2]/div/div/form/div[2]/button');
      nextBtn.click();
      stepsDone.push("username");
      return;
    }

    if (url.includes("/app/login") && !stepsDone.includes("password")) {
      const passwordInput = await waitForXPath('/html/body/div[1]/div/div/div[2]/div/div[1]/form/div[2]/div/input');
      passwordInput.value = password;
      const nextBtn2 = await waitForXPath('/html/body/div[1]/div/div/div[2]/div/div[1]/form/div[3]/button[1]');
      nextBtn2.click();
      stepsDone.push("password");
      return;
    }

    if (url.includes("/app/contractcontinue") && !stepsDone.includes("2fa")) {
      const otpInput = await waitForXPath('//*[@id="nffc"]');
      const token = await window.otplib.authenticator.generate(secret);
      otpInput.value = token;
      const nextBtn3 = await waitForXPath('/html/body/div/div/div/div[2]/div/div[1]/form/div[3]/button[1]');
      nextBtn3.click();
      stepsDone.push("2fa");

      chrome.runtime.sendMessage({ action: 'loginComplete' });
      return;
    }
  }

  const interval = setInterval(async () => {
    try {
      await handleStep();
    } catch (e) {
      console.log('Waiting for next page...');
    }
  }, 2000);
})();