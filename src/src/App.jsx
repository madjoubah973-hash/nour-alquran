import { useState, useEffect, useRef } from "react";

const SURAHS = [
  { id: 1,  name: "Al-Fatiha",    arabic: "الفاتحة",    verses: 7,   juz: 1,  memorized: true,  progress: 100 },
  { id: 2,  name: "Al-Baqarah",   arabic: "البقرة",     verses: 286, juz: 1,  memorized: false, progress: 12  },
  { id: 3,  name: "Āl ʿImrān",    arabic: "آل عمران",   verses: 200, juz: 3,  memorized: false, progress: 0   },
  { id: 36, name: "Ya-Sin",       arabic: "يس",         verses: 83,  juz: 22, memorized: false, progress: 45  },
  { id: 67, name: "Al-Mulk",      arabic: "الملك",      verses: 30,  juz: 29, memorized: true,  progress: 100 },
  { id: 78, name: "An-Naba'",     arabic: "النبأ",      verses: 40,  juz: 30, memorized: true,  progress: 100 },
  { id: 112,name: "Al-Ikhlas",    arabic: "الإخلاص",   verses: 4,   juz: 30, memorized: true,  progress: 100 },
  { id: 113,name: "Al-Falaq",     arabic: "الفلق",      verses: 5,   juz: 30, memorized: true,  progress: 100 },
  { id: 114,name: "An-Nas",       arabic: "الناس",      verses: 6,   juz: 30, memorized: true,  progress: 100 },
];

const VERSES_SAMPLE = [
  { id: 1, arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", transliteration: "Bismillāhi r-raḥmāni r-raḥīm", translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful.", strength: 5 },
  { id: 2, arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", transliteration: "Al-ḥamdu lillāhi rabbi l-ʿālamīn", translation: "All praise is due to Allah, Lord of the worlds.", strength: 4 },
  { id: 3, arabic: "الرَّحْمَٰنِ الرَّحِيمِ", transliteration: "Ar-raḥmāni r-raḥīm", translation: "The Entirely Merciful, the Especially Merciful.", strength: 3 },
  { id: 4, arabic: "مَالِكِ يَوْمِ الدِّينِ", transliteration: "Māliki yawmi d-dīn", translation: "Sovereign of the Day of Recompense.", strength: 2 },
  { id: 5, arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", transliteration: "Iyyāka naʿbudu wa-iyyāka nastaʿīn", translation: "It is You we worship and You we ask for help.", strength: 1 },
  { id: 6, arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", transliteration: "Ihdinā ṣ-ṣirāṭa l-mustaqīm", translation: "Guide us to the straight path.", strength: 5 },
  { id: 7, arabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", transliteration: "Ṣirāṭa llaḏīna anʿamta ʿalayhim", translation: "The path of those upon whom You have bestowed favor.", strength: 1 },
];

const BADGES = [
  { id: 1, icon: "🌙", name: "Premier Pas",      desc: "1ère sourate mémorisée",  earned: true  },
  { id: 2, icon: "⭐", name: "Étoile Montante",  desc: "7 jours de suite",         earned: true  },
  { id: 3, icon: "🔥", name: "Flamme Sacrée",    desc: "30 jours de suite",        earned: false },
  { id: 4, icon: "📖", name: "Lecteur Assidu",   desc: "100 versets révisés",      earned: true  },
  { id: 5, icon: "🏆", name: "Gardien du Coran", desc: "1 Juz mémorisé",           earned: false },
  { id: 6, icon: "💎", name: "Diamant",          desc: "Coran complet",            earned: false },
];

const RECITERS = [
  { id: 1, name: "Mishary Rashid Alafasy", arabic: "مشاري العفاسي",    style: "Murattal" },
  { id: 2, name: "Abdul Rahman Al-Sudais", arabic: "عبدالرحمن السديس", style: "Murattal" },
  { id: 3, name: "Saud Al-Shuraim",        arabic: "سعود الشريم",       style: "Murattal" },
  { id: 4, name: "Maher Al-Muaiqly",       arabic: "ماهر المعيقلي",     style: "Murattal" },
];

const QUOTES = [
  { text: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ", source: "Sahih al-Bukhari", translation: "Le meilleur d'entre vous est celui qui apprend le Coran et l'enseigne." },
  { text: "إِنَّ هَذَا الْقُرْآنَ مَأْدُبَةُ اللَّهِ", source: "Hadith", translation: "Ce Coran est le banquet d'Allah." },
  { text: "اقْرَأِ الْقُرْآنَ فَإِنَّهُ يَأْتِي يَوْمَ الْقِيَامَةِ شَفِيعًا", source: "Sahih Muslim", translation: "Récitez le Coran, car il viendra au Jour du Jugement comme intercesseur." },
];

const WEEKLY_DATA = [
  { day: "Lun", verses: 12 },
  { day: "Mar", verses: 8  },
  { day: "Mer", verses: 15 },
  { day: "Jeu", verses: 10 },
  { day: "Ven", verses: 18 },
  { day: "Sam", verses: 6  },
  { day: "Dim", verses: 4  },
];const css = `
  @import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap');

  :root {
    --obsidian:   #0A0E1A;
    --obsidian2:  #111827;
    --obsidian3:  #1C2333;
    --emerald:    #1DB87E;
    --emerald-dim:#15855A;
    --emerald-glow:rgba(29,184,126,0.15);
    --gold:       #C9A84C;
    --gold-dim:   #9A7A32;
    --gold-glow:  rgba(201,168,76,0.12);
    --ivory:      #F5F0E8;
    --ivory-dim:  #BDB5A6;
    --red:        #E05252;
    --card:       rgba(28,35,51,0.85);
    --border:     rgba(201,168,76,0.18);
    --radius:     16px;
    --radius-lg:  24px;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--obsidian); color: var(--ivory); font-family: 'Inter', sans-serif; min-height: 100vh; }
  .app { max-width: 430px; margin: 0 auto; min-height: 100vh; background: var(--obsidian); position: relative; overflow: hidden; }
  .ambient { position: fixed; top: 0; left: 50%; transform: translateX(-50%); width: 430px; pointer-events: none; z-index: 0; }
  .ambient-orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.18; }
  .orb1 { width: 300px; height: 300px; top: -80px; left: -60px; background: var(--emerald); }
  .orb2 { width: 200px; height: 200px; top: 200px; right: -40px; background: var(--gold); opacity: 0.12; }
  .bottom-nav { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 430px; background: rgba(17,24,39,0.95); backdrop-filter: blur(20px); border-top: 1px solid var(--border); display: flex; justify-content: space-around; align-items: center; padding: 10px 0 20px; z-index: 100; }
  .nav-btn { display: flex; flex-direction: column; align-items: center; gap: 4px; background: none; border: none; color: var(--ivory-dim); font-size: 10px; font-family: 'Inter', sans-serif; cursor: pointer; padding: 6px 14px; border-radius: 12px; transition: all 0.25s ease; }
  .nav-btn.active { color: var(--emerald); }
  .nav-icon { width: 42px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 10px; font-size: 20px; transition: all 0.25s ease; }
  .nav-btn.active .nav-icon { background: var(--emerald-glow); }
  .scroll-content { padding: 0 0 100px; position: relative; z-index: 1; }
  .header { padding: 52px 20px 16px; display: flex; justify-content: space-between; align-items: center; }
  .header-greeting { font-size: 13px; color: var(--ivory-dim); }
  .header-name { font-size: 22px; font-weight: 700; color: var(--ivory); margin-top: 2px; }
  .streak-pill { display: flex; align-items: center; gap: 6px; background: rgba(201,168,76,0.12); border: 1px solid rgba(201,168,76,0.3); border-radius: 20px; padding: 8px 14px; }
  .streak-number { font-size: 18px; font-weight: 700; color: var(--gold); }
  .streak-label { font-size: 11px; color: var(--ivory-dim); line-height: 1.2; }
  .card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-lg); backdrop-filter: blur(10px); }
  .section { padding: 0 16px; margin-bottom: 20px; }
  .section-title { font-size: 13px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ivory-dim); margin-bottom: 12px; padding: 0 4px; }
  .progress-hero { margin: 0 16px 20px; background: linear-gradient(135deg, rgba(29,184,126,0.08) 0%, rgba(201,168,76,0.06) 100%); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 24px 20px; }
  .progress-top { display: flex; align-items: center; justify-content: space-between; }
  .progress-left h2 { font-size: 18px; font-weight: 700; margin-bottom: 4px; }
  .progress-left p { font-size: 13px; color: var(--ivory-dim); }
  .ring-wrap { position: relative; width: 90px; height: 90px; }
  .ring-svg { transform: rotate(-90deg); }
  .ring-bg { fill: none; stroke: rgba(255,255,255,0.08); stroke-width: 8; }
  .ring-fill { fill: none; stroke: url(#ringGrad); stroke-width: 8; stroke-linecap: round; transition: stroke-dashoffset 1s ease; }
  .ring-center { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); text-align: center; }
  .ring-pct { font-size: 20px; font-weight: 700; color: var(--emerald); }
  .ring-sub { font-size: 9px; color: var(--ivory-dim); }
  .progress-stats { display: flex; gap: 0; margin-top: 20px; }
  .pstat { flex: 1; text-align: center; padding: 12px 0; border-right: 1px solid var(--border); }
  .pstat:last-child { border-right: none; }
  .pstat-val { font-size: 22px; font-weight: 700; color: var(--ivory); }
  .pstat-val.em { color: var(--emerald); }
  .pstat-val.gd { color: var(--gold); }
  .pstat-label { font-size: 11px; color: var(--ivory-dim); margin-top: 2px; }
  .actions { display: flex; gap: 10px; padding: 0 16px; margin-bottom: 20px; }
  .action-btn { flex: 1; border: none; border-radius: var(--radius); padding: 16px 8px; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 6px; font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 600; transition: all 0.2s ease; }
  .btn-icon { font-size: 26px; }
  .btn-primary { background: linear-gradient(135deg, var(--emerald), #13956A); color: #fff; }
  .btn-secondary { background: rgba(201,168,76,0.12); border: 1px solid rgba(201,168,76,0.3); color: var(--gold); }
  .btn-tertiary { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: var(--ivory); }
  .review-list { display: flex; flex-direction: column; gap: 10px; }
  .review-card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px 16px; display: flex; align-items: center; gap: 14px; }
  .review-urgency { width: 6px; height: 40px; border-radius: 3px; flex-shrink: 0; }
  .urg-high { background: var(--red); }
  .urg-med  { background: var(--gold); }
  .urg-low  { background: var(--emerald); }
  .review-info { flex: 1; }
  .review-surah { font-size: 13px; font-weight: 600; color: var(--ivory); }
  .review-meta { font-size: 11px; color: var(--ivory-dim); margin-top: 2px; }
  .review-arabic { font-family: 'Amiri', serif; font-size: 18px; color: var(--gold); text-align: right; direction: rtl; }
  .review-btn { background: var(--emerald-glow); border: 1px solid rgba(29,184,126,0.3); color: var(--emerald); border-radius: 10px; padding: 8px 14px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; white-space: nowrap; }
  .chart-wrap { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 20px 16px; }
  .chart-title { font-size: 15px; font-weight: 600; margin-bottom: 6px; }
  .chart-sub { font-size: 12px; color: var(--ivory-dim); margin-bottom: 18px; }
  .bars { display: flex; align-items: flex-end; gap: 6px; height: 80px; }
  .bar-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; }
  .bar-outer { width: 100%; background: rgba(255,255,255,0.06); border-radius: 4px; position: relative; overflow: hidden; }
  .bar-inner { position: absolute; bottom: 0; left: 0; right: 0; border-radius: 4px; transition: height 0.8s ease; background: rgba(29,184,126,0.35); }
  .bar-today .bar-inner { background: linear-gradient(to top, var(--emerald), #56E8B0); }
  .bar-day { font-size: 10px; color: var(--ivory-dim); margin-top: 6px; }
  .surah-item { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px 16px; display: flex; align-items: center; gap: 14px; cursor: pointer; transition: all 0.2s ease; }
  .surah-num { width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0; background: var(--emerald-glow); border: 1px solid rgba(29,184,126,0.2); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: var(--emerald); }
  .surah-name { font-size: 14px; font-weight: 600; color: var(--ivory); }
  .surah-sub { font-size: 11px; color: var(--ivory-dim); margin-top: 2px; }
  .surah-arabic { font-family: 'Amiri', serif; font-size: 20px; color: var(--gold); }
  .prog-bar { height: 3px; background: rgba(255,255,255,0.08); border-radius: 2px; margin-top: 6px; }
  .prog-fill { height: 100%; border-radius: 2px; background: var(--emerald); transition: width 0.6s ease; }
  .prog-fill.complete { background: var(--gold); }
  .mode-overlay { position: fixed; inset: 0; background: var(--obsidian); z-index: 200; overflow-y: auto; }
  .mode-header { padding: 50px 20px 20px; display: flex; align-items: center; gap: 14px; border-bottom: 1px solid var(--border); }
  .back-btn { width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.07); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 18px; color: var(--ivory); flex-shrink: 0; }
  .mode-title { font-size: 18px; font-weight: 700; }
  .mode-sub { font-size: 12px; color: var(--ivory-dim); margin-top: 2px; }
  .verse-card { margin: 20px 16px; background: linear-gradient(135deg, rgba(29,184,126,0.06), rgba(201,168,76,0.04)); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 28px 20px; text-align: center; }
  .verse-num { display: inline-flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 50%; background: var(--gold-glow); border: 1px solid rgba(201,168,76,0.3); font-size: 13px; font-weight: 700; color: var(--gold); margin-bottom: 16px; }
  .verse-arabic { font-family: 'Amiri', serif; font-size: 28px; line-height: 1.7; color: var(--ivory); direction: rtl; margin-bottom: 16px; }
  .verse-trans { font-size: 13px; color: var(--ivory-dim); line-height: 1.7; font-style: italic; }
  .verse-translit { font-size: 12px; color: var(--emerald); margin-top: 8px; }
  .strength-row { display: flex; gap: 6px; justify-content: center; margin: 16px; }
  .str-dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,0.15); transition: background 0.3s; }
  .str-dot.filled { background: var(--emerald); }
  .verse-nav { display: flex; gap: 10px; padding: 0 16px 20px; }
  .vnav-btn { flex: 1; padding: 16px; border-radius: var(--radius); border: none; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600; transition: all 0.2s; }
  .vnav-prev { background: rgba(255,255,255,0.07); color: var(--ivory); }
  .vnav-next { background: linear-gradient(135deg, var(--emerald), #13956A); color: #fff; }
  .recall-btns { display: flex; gap: 8px; padding: 0 16px 20px; }
  .recall-btn { flex: 1; padding: 14px 8px; border-radius: var(--radius); border: none; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 600; transition: all 0.2s; }
  .recall-hard { background: rgba(224,82,82,0.15); border: 1px solid rgba(224,82,82,0.3); color: #E05252; }
  .recall-ok { background: rgba(201,168,76,0.12); border: 1px solid rgba(201,168,76,0.3); color: var(--gold); }
  .recall-easy { background: var(--emerald-glow); border: 1px solid rgba(29,184,126,0.3); color: var(--emerald); }
  .reciter-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 0 16px 20px; }
  .reciter-card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px 12px; text-align: center; cursor: pointer; transition: all 0.2s; }
  .reciter-card.selected { border-color: var(--emerald); background: var(--emerald-glow); }
  .reciter-avatar { width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, var(--emerald-dim), var(--gold-dim)); margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; font-size: 22px; }
  .reciter-name { font-size: 12px; font-weight: 600; color: var(--ivory); }
  .reciter-arabic { font-family: 'Amiri', serif; font-size: 14px; color: var(--gold); direction: rtl; margin-top: 2px; }
  .player-bar { margin: 0 16px 20px; background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 20px; }
  .player-title { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
  .player-sub { font-size: 12px; color: var(--ivory-dim); margin-bottom: 16px; }
  .player-seek { width: 100%; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; margin-bottom: 12px; }
  .player-fill { height: 100%; width: 35%; background: var(--emerald); border-radius: 2px; }
  .player-controls { display: flex; align-items: center; justify-content: center; gap: 20px; }
  .ctl-btn { background: none; border: none; cursor: pointer; color: var(--ivory-dim); font-size: 22px; padding: 4px; transition: color 0.2s; }
  .ctl-play { width: 52px; height: 52px; border-radius: 50%; background: linear-gradient(135deg, var(--emerald), #13956A); border: none; cursor: pointer; font-size: 22px; display: flex; align-items: center; justify-content: center; color: #fff; box-shadow: 0 0 20px rgba(29,184,126,0.4); }
  .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 0 16px; margin-bottom: 20px; }
  .stat-tile { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 18px 14px; text-align: center; }
  .stat-tile-icon { font-size: 26px; margin-bottom: 8px; }
  .stat-tile-val { font-size: 26px; font-weight: 800; margin-bottom: 2px; }
  .stat-tile-val.em { color: var(--emerald); }
  .stat-tile-val.gd { color: var(--gold); }
  .stat-tile-label { font-size: 11px; color: var(--ivory-dim); }
  .heatmap { padding: 0 16px; margin-bottom: 20px; }
  .heatmap-grid { display: grid; grid-template-columns: repeat(14, 1fr); gap: 3px; }
  .hmap-cell { aspect-ratio: 1; border-radius: 3px; }
  .hmap-0 { background: rgba(255,255,255,0.04); }
  .hmap-1 { background: rgba(29,184,126,0.2); }
  .hmap-2 { background: rgba(29,184,126,0.4); }
  .hmap-3 { background: rgba(29,184,126,0.65); }
  .hmap-4 { background: var(--emerald); }
  .badges-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; padding: 0 16px; }
  .badge-card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px 8px; text-align: center; }
  .badge-card.earned { border-color: rgba(201,168,76,0.4); }
  .badge-icon { font-size: 32px; margin-bottom: 6px; filter: grayscale(1) brightness(0.5); }
  .badge-card.earned .badge-icon { filter: none; }
  .badge-name { font-size: 11px; font-weight: 600; color: var(--ivory-dim); }
  .badge-card.earned .badge-name { color: var(--gold); }
  .badge-desc { font-size: 10px; color: var(--ivory-dim); margin-top: 2px; opacity: 0.6; }
  .ai-bubble { margin: 0 16px 12px; background: linear-gradient(135deg, rgba(29,184,126,0.07), rgba(201,168,76,0.05)); border: 1px solid rgba(29,184,126,0.2); border-radius: var(--radius-lg); padding: 16px; }
  .ai-header { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
  .ai-avatar { width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg, var(--emerald), var(--gold-dim)); display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
  .ai-name { font-size: 13px; font-weight: 700; color: var(--emerald); }
  .ai-role { font-size: 11px; color: var(--ivory-dim); }
  .ai-text { font-size: 13px; color: var(--ivory); line-height: 1.65; }
  .ai-chip { background: rgba(29,184,126,0.1); border: 1px solid rgba(29,184,126,0.25); color: var(--emerald); border-radius: 20px; padding: 6px 12px; font-size: 11px; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; margin-top: 12px; margin-right: 6px; }
  .quote-card { margin: 0 16px 20px; background: linear-gradient(135deg, rgba(201,168,76,0.08), rgba(29,184,126,0.05)); border: 1px solid rgba(201,168,76,0.2); border-radius: var(--radius-lg); padding: 22px 20px; text-align: center; }
  .quote-arabic { font-family: 'Amiri', serif; font-size: 22px; color: var(--gold); direction: rtl; line-height: 1.8; margin-bottom: 10px; }
  .quote-translation { font-size: 12px; color: var(--ivory-dim); font-style: italic; line-height: 1.6; }
  .quote-source { font-size: 11px; color: var(--emerald); margin-top: 8px; font-weight: 600; }
  .goal-card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px; }
  .goal-header { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
  .goal-icon { font-size: 24px; }
  .goal-title { font-size: 14px; font-weight: 600; color: var(--ivory); }
  .goal-sub { font-size: 12px; color: var(--ivory-dim); }
  .goal-progress-bar { height: 6px; background: rgba(255,255,255,0.08); border-radius: 3px; }
  .goal-progress-fill { height: 100%; border-radius: 3px; background: linear-gradient(90deg, var(--emerald), #56E8B0); }
  .goal-remaining { font-size: 12px; color: var(--ivory-dim); margin-top: 8px; text-align: right; }
  .search-bar { margin: 0 16px 16px; display: flex; align-items: center; gap: 10px; background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 12px 14px; }
  .search-input { flex: 1; background: none; border: none; outline: none; color: var(--ivory); font-family: 'Inter', sans-serif; font-size: 14px; }
  .mic-section { margin: 0 16px 20px; background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 24px; text-align: center; }
  .mic-btn { width: 80px; height: 80px; border-radius: 50%; border: none; background: linear-gradient(135deg, var(--emerald), #13956A); margin: 0 auto 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 32px; box-shadow: 0 0 0 0 rgba(29,184,126,0.4); }
  .mic-btn.listening { animation: micPulse 1.2s infinite; }
  @keyframes micPulse { 0% { box-shadow: 0 0 0 0 rgba(29,184,126,0.5); } 70% { box-shadow: 0 0 0 20px rgba(29,184,126,0); } 100% { box-shadow: 0 0 0 0 rgba(29,184,126,0); } }
  .mic-label { font-size: 14px; font-weight: 600; color: var(--ivory); }
  .mic-sub { font-size: 12px; color: var(--ivory-dim); margin-top: 4px; }
  .voice-result { margin-top: 14px; padding: 12px; background: rgba(29,184,126,0.07); border: 1px solid rgba(29,184,126,0.2); border-radius: 12px; }
  .voice-match { font-size: 12px; font-weight: 600; color: var(--emerald); }
  .voice-score { font-size: 28px; font-weight: 800; color: var(--ivory); }
  .tabs { display: flex; gap: 0; padding: 0 16px; margin-bottom: 16px; }
  .tab { flex: 1; padding: 10px 4px; text-align: center; font-size: 13px; font-weight: 600; cursor: pointer; color: var(--ivory-dim); border-bottom: 2px solid transparent; transition: all 0.2s; }
  .tab.active { color: var(--emerald); border-bottom-color: var(--emerald); }
  .juz-tag { display: inline-block; padding: 2px 8px; background: rgba(29,184,126,0.1); border: 1px solid rgba(29,184,126,0.2); border-radius: 6px; font-size: 10px; color: var(--emerald); margin-left: 6px; }
  .notif-dot { position: absolute; top: 4px; right: 4px; width: 8px; height: 8px; border-radius: 50%; background: var(--emerald); border: 2px solid #111827; }
  .geo-bg { position: absolute; top: 0; right: 0; width: 200px; height: 200px; opacity: 0.04; pointer-events: none; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .fade-up { animation: fadeUp 0.4s ease both; }
  .fade-up-1 { animation-delay: 0.05s; }
  .fade-up-2 { animation-delay: 0.10s; }
  .fade-up-3 { animation-delay: 0.15s; }
  .fade-up-4 { animation-delay: 0.20s; }
  @keyframes pulsePlay { 0%,100% { box-shadow: 0 0 20px rgba(29,184,126,0.4); } 50% { box-shadow: 0 0 35px rgba(29,184,126,0.65); } }
  .play-anim { animation: pulsePlay 2s infinite; }
`;

function GeoSVG() {
  return (
    <svg className="geo-bg" viewBox="0 0 200 200" fill="none">
      <polygon points="100,10 190,55 190,145 100,190 10,145 10,55" stroke="#C9A84C" strokeWidth="1"/>
      <polygon points="100,30 170,67 170,133 100,170 30,133 30,67" stroke="#1DB87E" strokeWidth="0.5"/>
      <polygon points="100,50 150,75 150,125 100,150 50,125 50,75" stroke="#C9A84C" strokeWidth="0.5"/>
      <line x1="100" y1="10" x2="100" y2="190" stroke="#C9A84C" strokeWidth="0.3"/>
      <line x1="10" y1="55" x2="190" y2="145" stroke="#C9A84C" strokeWidth="0.3"/>
      <line x1="10" y1="145" x2="190" y2="55" stroke="#C9A84C" strokeWidth="0.3"/>
    </svg>
  );
}

function ProgressRing({ pct }) {
  const r = 36, circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div className="ring-wrap">
      <svg className="ring-svg" width="90" height="90">
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1DB87E"/>
            <stop offset="100%" stopColor="#56E8B0"/>
          </linearGradient>
        </defs>
        <circle className="ring-bg" cx="45" cy="45" r={r}/>
        <circle className="ring-fill" cx="45" cy="45" r={r} strokeDasharray={circ} strokeDashoffset={offset}/>
      </svg>
      <div className="ring-center">
        <div className="ring-pct">{pct}%</div>
        <div className="ring-sub">objectif</div>
      </div>
    </div>
  );
}

function WeeklyChart() {
  const max = Math.max(...WEEKLY_DATA.map(d => d.verses));
  return (
    <div className="chart-wrap">
      <div className="chart-title">Révisions hebdomadaires</div>
      <div className="chart-sub">76 versets cette semaine · +12%</div>
      <div className="bars">
        {WEEKLY_DATA.map((d, i) => (
          <div key={i} className={`bar-col ${i === 4 ? 'bar-today' : ''}`}>
            <div className="bar-outer" style={{ height: 60 }}>
              <div className="bar-inner" style={{ height: `${(d.verses / max) * 100}%` }}/>
            </div>
            <div className="bar-day" style={{ color: i === 4 ? '#1DB87E' : undefined }}>{d.day}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Heatmap() {
  const cells = Array.from({ length: 84 }, () => {
    const v = Math.random();
    if (v > 0.85) return 4;
    if (v > 0.65) return 3;
    if (v > 0.45) return 2;
    if (v > 0.25) return 1;
    return 0;
  });
  return (
    <div className="heatmap">
      <div className="section-title" style={{ padding: 0, marginBottom: 12 }}>Activité des 84 derniers jours</div>
      <div className="heatmap-grid">
        {cells.map((c, i) => <div key={i} className={`hmap-cell hmap-${c}`}/>)}
      </div>
    </div>
  );
}function HomePage({ setMode }) {
  const quote = QUOTES[0];
  return (
    <div className="scroll-content">
      <div className="header fade-up">
        <div>
          <div className="header-greeting">بِسْمِ اللَّهِ · Bonjour,</div>
          <div className="header-name">Abdullah 🌙</div>
        </div>
        <div className="streak-pill">
          <span>🔥</span>
          <div>
            <div className="streak-number">24</div>
            <div className="streak-label">jours<br/>de suite</div>
          </div>
        </div>
      </div>
      <div className="progress-hero fade-up fade-up-1" style={{ position: 'relative', overflow: 'hidden' }}>
        <GeoSVG/>
        <div className="progress-top">
          <div className="progress-left">
            <h2>Révision du jour</h2>
            <p>12 / 15 versets révisés</p>
          </div>
          <ProgressRing pct={80}/>
        </div>
        <div className="progress-stats">
          <div className="pstat"><div className="pstat-val em">15</div><div className="pstat-label">À réviser</div></div>
          <div className="pstat"><div className="pstat-val gd">7</div><div className="pstat-label">Mémorisés</div></div>
          <div className="pstat"><div className="pstat-val">42</div><div className="pstat-label">min aujourd'hui</div></div>
        </div>
      </div>
      <div className="actions fade-up fade-up-2">
        <button className="action-btn btn-primary" onClick={() => setMode('memorize')}><span className="btn-icon">📖</span>Nouvelle<br/>mémorisation</button>
        <button className="action-btn btn-secondary" onClick={() => setMode('review')}><span className="btn-icon">🔄</span>Révision<br/>du jour</button>
        <button className="action-btn btn-tertiary" onClick={() => setMode('listen')}><span className="btn-icon">🎧</span>Mode<br/>écoute</button>
      </div>
      <div className="ai-bubble fade-up fade-up-3">
        <div className="ai-header">
          <div className="ai-avatar">✨</div>
          <div><div className="ai-name">Assistant Hifdh IA</div><div className="ai-role">Planification personnalisée</div></div>
        </div>
        <div className="ai-text">Mashallah ! Aujourd'hui, je recommande de consolider <strong style={{color:'#C9A84C'}}>Al-Baqarah 1–5</strong>. Je suggère aussi 10 min d'écoute avec Alafasy.</div>
        <div><button className="ai-chip">Voir mon planning</button><button className="ai-chip">Analyser mes lacunes</button></div>
      </div>
      <div className="section fade-up fade-up-4">
        <div className="section-title">⏰ Révisions urgentes</div>
        <div className="review-list">
          {[
            { surah: "Al-Baqarah", verses: "2:1–5", urgency: "high", arabic: "الٓمٓ", label: "Dû hier" },
            { surah: "Ya-Sin", verses: "36:1–3", urgency: "med", arabic: "يٰسٓ", label: "Aujourd'hui" },
            { surah: "Al-Mulk", verses: "67:1–5", urgency: "low", arabic: "تَبَارَكَ", label: "Dans 2 jours" },
          ].map((r, i) => (
            <div key={i} className="review-card">
              <div className={`review-urgency urg-${r.urgency}`}/>
              <div className="review-info">
                <div className="review-surah">{r.surah} · <span style={{color:'#1DB87E',fontSize:11}}>{r.label}</span></div>
                <div className="review-meta">{r.verses}</div>
              </div>
              <div className="review-arabic">{r.arabic}</div>
              <button className="review-btn">Réviser</button>
            </div>
          ))}
        </div>
      </div>
      <div className="section"><WeeklyChart/></div>
      <div className="quote-card">
        <div className="quote-arabic">{quote.text}</div>
        <div className="quote-translation">{quote.translation}</div>
        <div className="quote-source">{quote.source}</div>
      </div>
    </div>
  );
}

function MemorizePage({ onBack }) {
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [listening, setListening] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const verse = VERSES_SAMPLE[idx];
  const next = () => { setIdx(i => Math.min(i+1, VERSES_SAMPLE.length-1)); setRevealed(false); setShowResult(false); };
  const prev = () => { setIdx(i => Math.max(i-1, 0)); setRevealed(false); setShowResult(false); };
  const handleMic = () => { setListening(true); setTimeout(() => { setListening(false); setShowResult(true); }, 2400); };
  return (
    <div className="mode-overlay">
      <div className="mode-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <div><div className="mode-title">Nouvelle mémorisation</div><div className="mode-sub">Al-Fatiha · Verset {idx+1} / {VERSES_SAMPLE.length}</div></div>
      </div>
      <div style={{ margin:'16px 16px 0', height:4, background:'rgba(255,255,255,0.06)', borderRadius:2 }}>
        <div style={{ height:'100%', width:`${((idx+1)/VERSES_SAMPLE.length)*100}%`, background:'linear-gradient(90deg,#1DB87E,#56E8B0)', borderRadius:2, transition:'width 0.4s' }}/>
      </div>
      <div className="verse-card">
        <div className="verse-num">{verse.id}</div>
        <div className="verse-arabic">{verse.arabic}</div>
        {revealed && <><div className="verse-translit">{verse.transliteration}</div><div className="verse-trans">{verse.translation}</div></>}
        {!revealed && <button onClick={() => setRevealed(true)} style={{ marginTop:8, background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', color:'#BDB5A6', borderRadius:10, padding:'10px 20px', cursor:'pointer', fontSize:13, fontFamily:'Inter' }}>Voir la traduction</button>}
      </div>
      <div className="strength-row">
        {[1,2,3,4,5].map(n => <div key={n} className={`str-dot ${n <= verse.strength ? 'filled' : ''}`}/>)}
      </div>
      <div className="mic-section">
        <button className={`mic-btn ${listening ? 'listening' : ''}`} onClick={handleMic} style={{display:'flex'}}>{listening ? '🎤' : '🎙'}</button>
        <div className="mic-label">{listening ? "En cours d'écoute..." : 'Réciter ce verset'}</div>
        <div className="mic-sub">Appuie pour commencer</div>
        {showResult && <div className="voice-result"><div className="voice-match">✅ Très bien récité !</div><div className="voice-score">94<span style={{fontSize:16,color:'#BDB5A6'}}>/100</span></div></div>}
      </div>
      {revealed && (
        <div className="recall-btns">
          <button className="recall-btn recall-hard" onClick={next}>😓 Difficile<br/><span style={{fontSize:10,fontWeight:400}}>1 jour</span></button>
          <button className="recall-btn recall-ok" onClick={next}>🤔 Passable<br/><span style={{fontSize:10,fontWeight:400}}>3 jours</span></button>
          <button className="recall-btn recall-easy" onClick={next}>✅ Facile<br/><span style={{fontSize:10,fontWeight:400}}>7 jours</span></button>
        </div>
      )}
      <div className="verse-nav">
        <button className="vnav-btn vnav-prev" onClick={prev} disabled={idx===0}>← Précédent</button>
        <button className="vnav-btn vnav-next" onClick={next}>{idx===VERSES_SAMPLE.length-1 ? '🏁 Terminer' : 'Suivant →'}</button>
      </div>
    </div>
  );
}

function ReviewPage({ onBack }) {
  const [tab, setTab] = useState('due');
  const dueVerses = VERSES_SAMPLE.filter(v => v.strength <= 3);
  return (
    <div className="mode-overlay">
      <div className="mode-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <div><div className="mode-title">Révision du jour</div><div className="mode-sub">{dueVerses.length} versets en attente</div></div>
      </div>
      <div className="tabs">
        <div className={`tab ${tab==='due'?'active':''}`} onClick={()=>setTab('due')}>À réviser ({dueVerses.length})</div>
        <div className={`tab ${tab==='all'?'active':''}`} onClick={()=>setTab('all')}>Tous ({VERSES_SAMPLE.length})</div>
      </div>
      <div style={{ margin:'0 16px 16px', padding:'12px 14px', background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:12 }}>
        <div style={{ fontSize:12, color:'#C9A84C', fontWeight:600, marginBottom:4 }}>⚡ Répétition Espacée Active</div>
        <div style={{ fontSize:12, color:'#BDB5A6' }}>Les versets les plus oubliés apparaissent en premier.</div>
      </div>
      <div style={{ padding:'0 16px', display:'flex', flexDirection:'column', gap:10 }}>
        {(tab==='due' ? dueVerses : VERSES_SAMPLE).map(v => (
          <div key={v.id} className="verse-card" style={{ margin:0, textAlign:'right' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
              <div style={{ fontSize:12, color:'#BDB5A6' }}>Al-Fatiha · {v.id}</div>
              <div style={{ display:'flex', gap:3 }}>{[1,2,3,4,5].map(n => <div key={n} style={{ width:8, height:8, borderRadius:'50%', background: n<=v.strength?'#1DB87E':'rgba(255,255,255,0.1)' }}/>)}</div>
            </div>
            <div className="verse-arabic">{v.arabic}</div>
            <div className="recall-btns" style={{ marginTop:10, padding:0 }}>
              <button className="recall-btn recall-hard" style={{fontSize:11}}>😓 Difficile</button>
              <button className="recall-btn recall-ok" style={{fontSize:11}}>🤔 Ok</button>
              <button className="recall-btn recall-easy" style={{fontSize:11}}>✅ Facile</button>
            </div>
          </div>
        ))}
      </div>
      <div style={{height:40}}/>
    </div>
  );
}

function ListenPage({ onBack }) {
  const [reciter, setReciter] = useState(0);
  const [playing, setPlaying] = useState(false);
  return (
    <div className="mode-overlay">
      <div className="mode-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <div><div className="mode-title">Mode Écoute</div><div className="mode-sub">Récitateurs · Murattal</div></div>
      </div>
      <div style={{ margin:'20px 16px 8px', fontSize:13, fontWeight:600, color:'#BDB5A6', textTransform:'uppercase', letterSpacing:'0.08em' }}>Choisir un récitateur</div>
      <div className="reciter-grid">
        {RECITERS.map((r,i) => (
          <div key={i} className={`reciter-card ${reciter===i?'selected':''}`} onClick={()=>setReciter(i)}>
            <div className="reciter-avatar">🎙</div>
            <div className="reciter-name">{r.name.split(' ').slice(-1)[0]}</div>
            <div className="reciter-arabic">{r.arabic}</div>
          </div>
        ))}
      </div>
      <div className="player-bar">
        <div className="player-title">{RECITERS[reciter].name}</div>
        <div className="player-sub">Al-Fatiha · {RECITERS[reciter].style}</div>
        <div className="player-seek"><div className="player-fill"/></div>
        <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'#BDB5A6',marginBottom:16}}><span>1:24</span><span>3:47</span></div>
        <div className="player-controls">
          <button className="ctl-btn">⏮</button>
          <button className="ctl-btn">↩</button>
          <button className={`ctl-play ${playing?'play-anim':''}`} onClick={()=>setPlaying(p=>!p)}>{playing?'⏸':'▶'}</button>
          <button className="ctl-btn">↪</button>
          <button className="ctl-btn">⏭</button>
        </div>
      </div>
      <div style={{height:40}}/>
    </div>
  );
}

function SurahsPage() {
  const [search, setSearch] = useState('');
  const filtered = SURAHS.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.arabic.includes(search));
  return (
    <div className="scroll-content">
      <div style={{ padding:'52px 20px 16px' }}>
        <div style={{ fontSize:13, color:'#BDB5A6' }}>Mon Hifdh</div>
        <div style={{ fontSize:22, fontWeight:700 }}>Sourates <span style={{color:'#1DB87E'}}>6 / 114</span></div>
      </div>
      <div style={{ padding:'0 16px', marginBottom:20, display:'flex', flexDirection:'column', gap:10 }}>
        {[
          { icon:'📚', title:'Juz 30', sub:'Sourates courtes', pct:72, left:'8 sourates restantes' },
          { icon:'🌟', title:'Juz ʿAmma complet', sub:'Objectif mensuel', pct:45, left:'~12 sourates restantes' },
          { icon:'🏆', title:'Coran complet', sub:'Objectif de vie', pct:5, left:'108 sourates restantes' },
        ].map((g,i) => (
          <div key={i} className="goal-card">
            <div className="goal-header">
              <div className="goal-icon">{g.icon}</div>
              <div><div className="goal-title">{g.title}</div><div className="goal-sub">{g.sub}</div></div>
              <div style={{ marginLeft:'auto', fontSize:18, fontWeight:800, color:'#1DB87E' }}>{g.pct}%</div>
            </div>
            <div className="goal-progress-bar"><div className="goal-progress-fill" style={{ width:`${g.pct}%` }}/></div>
            <div className="goal-remaining">{g.left}</div>
          </div>
        ))}
      </div>
      <div className="search-bar">
        <span>🔍</span>
        <input className="search-input" placeholder="Rechercher une sourate..." value={search} onChange={e=>setSearch(e.target.value)}/>
      </div>
      <div style={{ padding:'0 16px', display:'flex', flexDirection:'column', gap:8 }}>
        {filtered.map(s => (
          <div key={s.id} className="surah-item">
            <div className="surah-num">{s.id}</div>
            <div style={{ flex:1 }}>
              <div className="surah-name">{s.name}<span className="juz-tag">Juz {s.juz}</span></div>
              <div className="surah-sub">{s.verses} versets</div>
              <div className="prog-bar"><div className={`prog-fill ${s.progress===100?'complete':''}`} style={{ width:`${s.progress}%` }}/></div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div className="surah-arabic">{s.arabic}</div>
              <div style={{ fontSize:11, color:s.progress===100?'#C9A84C':'#BDB5A6', marginTop:4 }}>{s.progress===100?'✅ Mémorisé':`${s.progress}%`}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatsPage() {
  return (
    <div className="scroll-content">
      <div style={{ padding:'52px 20px 20px', textAlign:'center' }}>
        <div style={{ fontSize:24, fontWeight:700, marginBottom:4 }}>Mes Statistiques</div>
        <div style={{ fontSize:13, color:'#BDB5A6' }}>Progression depuis le 1er janvier 2025</div>
      </div>
      <div className="stats-grid">
        {[
          { icon:'📖', val:'6',   cls:'em', label:'Sourates mémorisées' },
          { icon:'🔥', val:'24',  cls:'gd', label:'Jours de suite' },
          { icon:'✅', val:'847', cls:'em', label:'Versets révisés' },
          { icon:'⏱', val:'67h', cls:'',   label:'Temps total' },
          { icon:'🎯', val:'91%', cls:'em', label:'Taux de rappel' },
          { icon:'🌟', val:'12',  cls:'gd', label:'Badges obtenus' },
        ].map((s,i) => (
          <div key={i} className="stat-tile">
            <div className="stat-tile-icon">{s.icon}</div>
            <div className={`stat-tile-val ${s.cls}`}>{s.val}</div>
            <div className="stat-tile-label">{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ padding:'0 16px', marginBottom:20 }}><WeeklyChart/></div>
      <Heatmap/>
      <div style={{ padding:'0 16px', marginBottom:8 }}><div className="section-title" style={{padding:0}}>🏅 Badges & Récompenses</div></div>
      <div className="badges-grid">
        {BADGES.map(b => (
          <div key={b.id} className={`badge-card ${b.earned?'earned':''}`}>
            <div className="badge-icon">{b.icon}</div>
            <div className="badge-name">{b.name}</div>
            <div className="badge-desc">{b.desc}</div>
          </div>
        ))}
      </div>
      <div style={{ margin:'20px 16px 0', background:'linear-gradient(135deg,rgba(201,168,76,0.1),rgba(29,184,126,0.07))', border:'1px solid rgba(201,168,76,0.25)', borderRadius:20, padding:'20px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
          <div><div style={{ fontSize:13, color:'#BDB5A6' }}>Niveau actuel</div><div style={{ fontSize:22, fontWeight:800, color:'#C9A84C' }}>⭐ Niveau 8 · Gardien</div></div>
          <div style={{ fontSize:48 }}>🏅</div>
        </div>
        <div style={{ height:8, background:'rgba(255,255,255,0.07)', borderRadius:4, marginBottom:8 }}>
          <div style={{ height:'100%', width:'65%', background:'linear-gradient(90deg,#C9A84C,#F0D07C)', borderRadius:4 }}/>
        </div>
        <div style={{ fontSize:12, color:'#BDB5A6' }}>1 300 / 2 000 XP · Prochain : Maître du Hifdh</div>
      </div>
    </div>
  );
}

function ProfilePage() {
  return (
    <div className="scroll-content">
      <div style={{ padding:'52px 20px 0', textAlign:'center' }}>
        <div style={{ width:90, height:90, borderRadius:'50%', background:'linear-gradient(135deg,#1DB87E,#C9A84C)', margin:'0 auto 14px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:40 }}>👤</div>
        <div style={{ fontSize:22, fontWeight:700 }}>Abdullah Al-Farouq</div>
        <div style={{ fontSize:13, color:'#BDB5A6', marginBottom:6 }}>عبدالله الفاروق</div>
        <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.3)', borderRadius:20, padding:'6px 16px' }}>
          <span>⭐</span><span style={{ fontSize:13, fontWeight:700, color:'#C9A84C' }}>Niveau 8 · Gardien du Coran</span>
        </div>
      </div>
      <div style={{ display:'flex', gap:10, padding:'20px 16px' }}>
        {[['6','Sourates'],['24','Jours 🔥'],['847','Versets']].map(([v,l],i) => (
          <div key={i} style={{ flex:1, textAlign:'center', background:'rgba(28,35,51,0.85)', border:'1px solid rgba(201,168,76,0.18)', borderRadius:14, padding:'14px 8px' }}>
            <div style={{ fontSize:24, fontWeight:800, color:i===1?'#C9A84C':'#1DB87E' }}>{v}</div>
            <div style={{ fontSize:11, color:'#BDB5A6' }}>{l}</div>
          </div>
        ))}
      </div>
      <div className="quote-card">
        <div style={{ fontSize:11, color:'#1DB87E', fontWeight:600, marginBottom:10 }}>💬 Citation du jour</div>
        <div className="quote-arabic" style={{fontSize:18}}>{QUOTES[2].text}</div>
        <div className="quote-translation">{QUOTES[2].translation}</div>
        <div className="quote-source">{QUOTES[2].source}</div>
      </div>
      <div style={{ padding:'0 16px', display:'flex', flexDirection:'column', gap:8 }}>
        {[
          { icon:'🔔', label:'Rappels quotidiens', sub:'Fajr, Dhuhr, Maghrib', value:'✓ Activés' },
          { icon:'🌙', label:'Mode sombre', sub:'Interface sombre', value:'✓ Activé' },
          { icon:'☁️', label:'Synchro Cloud', sub:'Firebase · Sauvegardé', value:'✓ Sync' },
          { icon:'🌐', label:'Mode hors ligne', sub:'Données téléchargées', value:'✓ Prêt' },
          { icon:'🎯', label:'Mes objectifs', sub:'Juz 30 · Coran complet', value:'›' },
        ].map((s,i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 16px', background:'rgba(28,35,51,0.85)', border:'1px solid rgba(201,168,76,0.18)', borderRadius:14, cursor:'pointer' }}>
            <div style={{ fontSize:22 }}>{s.icon}</div>
            <div style={{ flex:1 }}><div style={{ fontSize:14, fontWeight:600, color:'#F5F0E8' }}>{s.label}</div><div style={{ fontSize:12, color:'#BDB5A6' }}>{s.sub}</div></div>
            <div style={{ fontSize:12, color:'#1DB87E', fontWeight:600 }}>{s.value}</div>
          </div>
        ))}
      </div>
      <div style={{ textAlign:'center', padding:'28px 16px', color:'#BDB5A6', fontSize:12 }}>نور القرآن · Version 2.4.1</div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState('home');
  const [mode, setMode] = useState(null);
  const NAV = [
    { id:'home',    icon:'🏠', label:'Accueil'  },
    { id:'surahs',  icon:'📖', label:'Sourates' },
    { id:'stats',   icon:'📊', label:'Stats'    },
    { id:'profile', icon:'👤', label:'Profil'   },
  ];
  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="ambient">
          <div className="ambient-orb orb1"/>
          <div className="ambient-orb orb2"/>
        </div>
        {mode==='memorize' && <MemorizePage onBack={()=>setMode(null)}/>}
        {mode==='review'   && <ReviewPage   onBack={()=>setMode(null)}/>}
        {mode==='listen'   && <ListenPage   onBack={()=>setMode(null)}/>}
        {!mode && tab==='home'    && <HomePage setMode={setMode}/>}
        {!mode && tab==='surahs'  && <SurahsPage/>}
        {!mode && tab==='stats'   && <StatsPage/>}
        {!mode && tab==='profile' && <ProfilePage/>}
        {!mode && (
          <nav className="bottom-nav">
            {NAV.map(n => (
              <button key={n.id} className={`nav-btn ${tab===n.id?'active':''}`} onClick={()=>setTab(n.id)}>
                <div className="nav-icon" style={{position:'relative'}}>
                  {n.icon}
                  {n.id==='home' && <div className="notif-dot"/>}
                </div>
                {n.label}
              </button>
            ))}
          </nav>
        )}
      </div>
    </>
  );
                                            }
