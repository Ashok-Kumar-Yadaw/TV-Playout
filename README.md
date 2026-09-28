# TV Playout V5 AUTO MP4 FIXED

यह version GitHub Pages पर `videos` folder को GitHub Contents API से scan करता है और सभी `.mp4` files को playlist में automatically दिखाता है।

Repository:
https://github.com/Ashok-Kumar-Yadaw/TV-Playout

Live:
https://ashok-kumar-yadaw.github.io/TV-Playout/

Current files जैसे:
- AartiKunjBihariKi.mp4
- AshutoshShashankShekhar.mp4
- GaneshMahaAarti.mp4
- NamamiShamishan.mp4

इनका filename manually डालने की जरूरत नहीं है।

## GitHub पर install
इस ZIP से `index.html`, `style.css`, `app.js` को repository के root में replace करें। `videos/` folder को न हटाएँ।

GitHub Pages में `main` + `/(root)` रखें।

## क्यों यह तरीका
GitHub Pages static hosting directory listing नहीं देता। इसलिए browser सीधे `videos/` folder को scan नहीं कर सकता। यह version GitHub Contents API से MP4 list लेता है और फिर Pages URL से actual MP4 चलाता है।

यदि किसी MP4 पर GitHub Pages direct URL 404 देता है, तो वह file deployment में उपलब्ध नहीं है या filename/path अलग है।
