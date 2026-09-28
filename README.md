# TV Playout Automation V5

यह V1–V4 की सुविधाओं को एक integrated browser MCR prototype में जोड़ता है।

## शामिल सुविधाएँ
- 4 channels
- Program Out + Preview
- TAKE workflow
- Play / Pause / Stop / Next
- Emergency Stop
- Current / Next / Remaining
- 24-hour style timeline
- Scheduled time + duration
- Program / Commercial / Promo / News / Live / Filler
- Auto Next
- Auto Schedule
- Loop
- 24/7 mode
- Primary / Backup status
- Backup armed + manual switch
- Channel logo
- Lower Third
- Breaking News
- Ticker controls
- Schedule view
- Event log
- localStorage persistence
- GitHub Pages compatible
- MP4 files from repository `videos/` folder

## GitHub
इन files को repository में upload करें और Settings → Pages → Deploy from branch → main → root चुनें।

उदाहरण:
videos/program1.mp4
videos/commercial.mp4
videos/news.mp4
videos/promo.mp4

## जरूरी सीमा
यह browser/GitHub Pages prototype है। GitHub Pages स्वयं professional 24×7 broadcast playout engine नहीं है। SDI/HDMI, frame-accurate switching, SRT/RTMP, hardware redundancy और reliable server-side scheduling के लिए dedicated Windows/Linux playout server और media engine चाहिए।
