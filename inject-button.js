// Eğer buton zaten varsa tekrar oluşturma
if (!document.getElementById('autoLoginBtn')) {
  const btn = document.createElement('button');
  btn.id = 'autoLoginBtn';
  btn.style.position = 'fixed';
  btn.style.bottom = '20px';
  btn.style.right = '20px';
  btn.style.width = '60px';
  btn.style.height = '60px';
  btn.style.background = '#4e8c8b';
  btn.style.color = '#fff';
  btn.style.border = 'none';
  btn.style.borderRadius = '50%';
  btn.style.zIndex = 9999;
  btn.style.cursor = 'pointer';
  btn.style.display = 'flex';
  btn.style.alignItems = 'center';
  btn.style.justifyContent = 'center';
  btn.style.fontSize = '22px';
  btn.style.fontWeight = 'bold';
  btn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
  btn.style.transition = 'background 0.3s ease';

  // SVG ikonlar
  const arrowSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M10.624.191c-.324.023-.655.011-.97.073c-2.883.568-5.244 2.01-7.074 4.3C1.42 6.014.624 7.652.243 9.48c-.25 1.2-.294 2.402-.191 3.627c.237 2.832 1.377 5.233 3.345 7.26c.332.341.775.348 1.1.055c.39-.35.442-.735.124-1.149c-.271-.353-.588-.671-.85-1.03c-1.625-2.208-2.343-4.674-2.04-7.411c.305-2.773 1.6-5.022 3.723-6.795c1.517-1.267 3.288-1.983 5.248-2.24c.272-.037.552-.083.803-.186c.32-.132.478-.564.4-.923c-.085-.384-.355-.483-.702-.477c-.194.004-.387 0-.58 0v-.02zm4.639 3.41c-.312-.008-.582.197-.722.512c-.176.4-.027.854.367 1.096c.123.075.256.134.385.199c1.485.737 2.619 1.834 3.319 3.342c.257.554.423 1.15.636 1.726c.162.441.509.656.92.579c.425-.08.67-.392.668-.952c-.016-.081-.035-.261-.082-.435c-.535-1.97-1.579-3.616-3.21-4.847c-.598-.453-1.28-.812-1.958-1.14a.782.782 0 0 0-.323-.08zm-6.939.23a.903.903 0 0 0-.492.144c-.648.388-1.325.764-1.88 1.266c-2.323 2.098-3.262 4.755-2.905 7.84c.55 4.74 4.6 8.021 8.9 7.904l.868-.001a.99.99 0 0 0 .109-.007c2.491-.312 4.58-1.387 6.146-3.36c.488-.615.86-1.336 1.2-2.049c.248-.523-.032-.982-.56-1.12c-.38-.1-.72.112-.974.509c-.473.737-.89 1.54-1.491 2.16c-1.479 1.52-3.322 2.28-5.466 2.199c-2.405-.091-4.337-1.127-5.758-3.056c-1.088-1.475-1.49-3.168-1.32-4.984c.184-1.987 1.038-3.644 2.57-4.927c.423-.354.908-.633 1.365-.946c.458-.314.568-.715.314-1.15c-.153-.262-.371-.413-.626-.422zm3.417 2.167C8.724 6.056 6.02 8.625 6 12c-.02 3.29 2.712 6.017 6 6.02c3.339.005 6.078-2.618 6.062-6.025c-.014-3.545-2.87-6.084-6.028-5.995a5.726 5.726 0 0 0-.293-.002zm10.752 1.164a.91.91 0 0 0-.137.002c-.404.033-.642.295-.74.646c-.053.187-.01.432.064.62a9.546 9.546 0 0 1 .648 3.753a9.994 9.994 0 0 1-1.32 4.76c-1.617 2.84-4.04 4.53-7.243 5.12c-.343.063-.694.095-1.033.174c-.434.103-.688.473-.641.882c.044.38.34.646.769.684c.132.012.265.002.398.002l-.001-.003c.145 0 .29.005.434-.002c.084-.004.167-.028.25-.04c1.847-.282 3.518-.99 5.037-2.068c1.708-1.213 3.001-2.78 3.897-4.665c1.1-2.317 1.375-4.752.906-7.264c-.13-.694-.354-1.376-.584-2.046c-.125-.362-.389-.537-.704-.555zm-10.449.862c.13 0 .261.016.392.05c.708.18 1.16.787 1.158 1.553c.027.504-.211.888-.588 1.183c-.207.163-.236.32-.176.558c.264 1.052.52 2.107.763 3.164c.13.568-.019.872-.522 1.174c-.675.404-1.666.354-2.29-.13c-.315-.244-.427-.573-.331-.966c.252-1.031.494-2.064.762-3.09c.086-.33.041-.554-.225-.794c-.581-.523-.682-1.253-.317-1.903a1.57 1.57 0 0 1 1.374-.8z"/></svg>`;
  const spinnerSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 50 50">
      <circle cx="25" cy="25" r="20" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="31.4 31.4" stroke-dashoffset="0">
        <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" from="0 25 25" to="360 25 25"/>
      </circle>
    </svg>`;
  const tickSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#fff" viewBox="0 0 24 24">
      <path d="M20.285 6.709l-11.024 11.025-5.285-5.285 1.414-1.414 3.871 3.871 9.611-9.611z"/>
    </svg>`;

  let state = 'idle'; // idle | loading | success
  btn.innerHTML = arrowSVG;

  // Butonu ekle
  document.body.appendChild(btn);

  // Tıklama → spinner göster ve background'a mesaj gönder
  btn.addEventListener('click', () => {
    if (state !== 'idle') return;
    state = 'loading';
    btn.innerHTML = spinnerSVG;
    chrome.runtime.sendMessage({ action: 'runLogin' });
  });

  // Background'dan gelen mesajları dinle
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === 'loginInProgress') {
      // spinner aktif kalsın
      if (state === 'idle') {
        state = 'loading';
        btn.innerHTML = spinnerSVG;
      }
    } else if (msg.action === 'loginSuccess') {
      state = 'success';
      btn.innerHTML = tickSVG;
      btn.style.background = '#28a745';
      setTimeout(() => {
        btn.remove(); // 2 sn sonra buton kaybolur
      }, 2000);
    }
  });
}