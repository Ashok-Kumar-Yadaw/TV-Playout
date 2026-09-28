# TV Playout Automation V5 FIXED

पुराने V5 में MP4 path resolution की समस्या थी। इस version में:
- GitHub Pages के current folder से relative MP4 URL resolve होता है
- `videos/news.mp4` जैसे paths सही तरह load होते हैं
- playlist default में गलत/example files नहीं चलतीं
- local PC से MP4 select करके temporary browser playback भी संभव है
- media error log में दिखाई देता है

GitHub structure:
repository/
  index.html
  style.css
  app.js
  videos/
    news.mp4

GitHub Pages: Settings → Pages → Deploy from branch → main → root.

यदि MP4 का नाम `My News.mp4` है तो exact path `videos/My News.mp4` डालें।