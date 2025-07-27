# Secure AutoLogin for Uni Oldenburg
A Chrome extension that automates the login process for Uni Oldenburg's authentication system. 
It supports:

- ✅ Auto-filling username and password
- ✅ Generating TOTP codes for 2FA
- ✅ Secure credential storage with AES-GCM encryption

# Features
- One-click auto login
- Encrypted local storage (AES-256-GCM)
- QR code scanning for TOTP secret
- Support for multi-step authentication (OAuth2)

# Installation
1. Clone this repository:
   ```bash
   https://github.com/ofurkancoban/UniOldenburgAutoLoginChromeExtension.git
   
2.	Open chrome://extensions in Chrome.
	3.	Enable Developer Mode.
	4.	Click Load Unpacked and select the extension folder.

# Security
- All credentials are encrypted using AES-GCM.
- Optional Master Password support.
- No external servers, everything runs locally.

# Roadmap
- Master password protection
- Timeout for stored credentials
- Support for multiple accounts
- General SSO support for other universities