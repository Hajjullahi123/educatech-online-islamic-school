"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Highlighter, MousePointer2, ZoomIn, ZoomOut } from 'lucide-react';
import { useClassroomSync } from '@/hooks/useClassroomSync';

interface QuranSyncProps {
  isTeacher: boolean;
  onStateChange?: (state: any) => void;
  syncState?: any;
}

const SURAHS = [
  {
    name: "Al-Fatihah",
    juz: 1,
    hizb: 1,
    verses: [
      { id: 1, text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", tajweedText: 'بِسْمِ <span class="text-emerald-600 font-bold underline">اللَّهِ</span> الرَّحْمَٰنِ الرَّحِ<span class="text-rose-500 font-bold">ي</span>مِ' },
      { id: 2, text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", tajweedText: 'الْحَمْ<span class="text-sky-500 font-bold">دُ</span> لِلَّهِ رَبِّ الْعَالَمِ<span class="text-rose-500 font-bold">ي</span>نَ' },
      { id: 3, text: "الرَّحْمَٰنِ الرَّحِيمِ", tajweedText: 'الرَّحْمَٰنِ الرَّحِ<span class="text-rose-500 font-bold">ي</span>مِ' },
      { id: 4, text: "مَالِكِ يَوْمِ الدِّينِ", tajweedText: 'مَالِكِ يَوْمِ الدِّ<span class="text-rose-500 font-bold">ي</span>نِ' },
      { id: 5, text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", tajweedText: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِ<span class="text-rose-500 font-bold">ي</span>نُ' },
      { id: 6, text: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", tajweedText: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِ<span class="text-rose-500 font-bold">ي</span>مَ' },
      { id: 7, text: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", tajweedText: 'صِرَاطَ الَّذِينَ أَنْ<span class="text-emerald-600 font-bold">عَ</span>مْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا ال<span class="text-sky-500 font-bold">ضَّالِّ</span>ينَ' }
    ]
  },
  {
    name: "Al-Ikhlas",
    juz: 30,
    hizb: 60,
    verses: [
      { id: 1, text: "قُلْ هُوَ اللَّهُ أَحَدٌ", tajweedText: 'قُلْ هُوَ <span class="text-emerald-600 font-bold underline">اللَّهُ</span> أَحَ<span class="text-sky-500 font-bold">دٌ</span>' },
      { id: 2, text: "اللَّهُ الصَّمَدُ", tajweedText: '<span class="text-emerald-600 font-bold underline">اللَّهُ</span> الصَّمَ<span class="text-sky-500 font-bold">دُ</span>' },
      { id: 3, text: "لَمْ يَلِدْ وَلَمْ يُولَدْ", tajweedText: 'لَمْ يَلِ<span class="text-sky-500 font-bold">دْ</span> وَلَمْ يُولَ<span class="text-sky-500 font-bold">دْ</span>' },
      { id: 4, text: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ", tajweedText: 'وَلَمْ يَكُ<span class="text-emerald-600 font-bold">ن لَّ</span>هُ كُفُوًا أَحَ<span class="text-sky-500 font-bold">دٌ</span>' }
    ]
  },
  {
    name: "An-Nas",
    juz: 30,
    hizb: 60,
    verses: [
      { id: 1, text: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ", tajweedText: 'قُلْ أَعُوذُ بِرَبِّ ال<span class="text-sky-500 font-bold">نَّ</span>اسِ' },
      { id: 2, text: "مَلِكِ النَّاسِ", tajweedText: 'مَلِكِ ال<span class="text-sky-500 font-bold">نَّ</span>اسِ' },
      { id: 3, text: "إِلَٰهِ النَّاسِ", tajweedText: 'إِلَٰهِ ال<span class="text-sky-500 font-bold">نَّ</span>اسِ' },
      { id: 4, text: "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ", tajweedText: '<span class="text-emerald-600 font-bold">مِن شَ</span>رِّ الْوَسْوَاسِ الْخَ<span class="text-sky-500 font-bold">نَّ</span>اسِ' },
      { id: 5, text: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ", tajweedText: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ ال<span class="text-sky-500 font-bold">نَّ</span>اسِ' },
      { id: 6, text: "مِنَ الْجِنَّةِ وَالنَّاسِ", tajweedText: 'مِنَ الْجِ<span class="text-emerald-600 font-bold">نَّ</span>ةِ وَال<span class="text-sky-500 font-bold">نَّ</span>اسِ' }
    ]
  }
];

const QuranSync: React.FC<QuranSyncProps> = ({ isTeacher, onStateChange, syncState: externalSyncState }) => {
  const [activeSurahIndex, setActiveSurahIndex] = useState(0);
  const { syncState, updateState } = useClassroomSync(isTeacher, { surah: 1, verse: 1, highlight: null });
  const [fontSize, setFontSize] = useState(32);
  const [showTajweed, setShowTajweed] = useState(true);

  const activeSurah = SURAHS[activeSurahIndex];

  // Inform parent of sync changes
  useEffect(() => {
    if (onStateChange) onStateChange(syncState);
  }, [syncState, onStateChange]);

  const handleNextSurah = () => {
    setActiveSurahIndex((prev) => (prev + 1) % SURAHS.length);
    updateState({ surah: activeSurahIndex + 2, verse: 1, highlight: null });
  };

  const handlePrevSurah = () => {
    setActiveSurahIndex((prev) => (prev - 1 + SURAHS.length) % SURAHS.length);
    updateState({ surah: activeSurahIndex, verse: 1, highlight: null });
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-primary/5">
      {/* Quran Header / Toolbar */}
      <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">
            {activeSurah.name}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setFontSize(s => Math.max(20, s - 4))} className="p-2 hover:bg-white rounded-lg transition-all"><ZoomOut className="w-4 h-4" /></button>
            <span className="text-[10px] font-bold opacity-30">{fontSize}px</span>
            <button onClick={() => setFontSize(s => Math.min(64, s + 4))} className="p-2 hover:bg-white rounded-lg transition-all"><ZoomIn className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTajweed(!showTajweed)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${showTajweed ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-white border border-slate-100 text-slate-400'}`}
          >
            <Highlighter className="w-4 h-4" /> Tajweed Rules
          </button>
          {isTeacher && (
            <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-amber-100">
              <MousePointer2 className="w-3.5 h-3.5" /> Sync Live
            </div>
          )}
        </div>
      </div>

      {/* Main Quran Text Area */}
      <div className="flex-1 overflow-y-auto p-12 flex flex-col items-center gap-12 custom-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSurahIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl space-y-16 text-center"
          >
            {activeSurah.verses.map((v) => (
              <motion.div
                key={v.id}
                onClick={() => isTeacher && updateState({ highlight: v.id })}
                className={`relative py-6 px-4 rounded-3xl transition-all cursor-pointer ${syncState.highlight === v.id ? 'bg-primary/5 ring-1 ring-primary/20 scale-[1.02]' : 'hover:bg-slate-50'}`}
                style={{ direction: 'rtl', fontFamily: 'var(--font-amiri)' }}
              >
                <p
                  className={`leading-[2] tracking-wide transition-all ${syncState.highlight === v.id ? 'text-primary' : 'text-slate-800'}`}
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {showTajweed ? (
                    <span dangerouslySetInnerHTML={{ __html: v.tajweedText }} />
                  ) : (
                    <span>{v.text}</span>
                  )}
                  <span className="inline-flex w-10 h-10 items-center justify-center rounded-full border border-primary/20 text-sm font-sans mx-4 text-primary align-middle font-bold">
                    {v.id}
                  </span>
                </p>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Footer */}
      <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <button 
          onClick={handlePrevSurah}
          className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-all"
        >
          <ChevronLeft className="w-5 h-5" /> Previous Surah
        </button>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-30">Juz</span>
            <span className="font-bold">{activeSurah.juz}</span>
          </div>
          <div className="w-px h-4 bg-slate-200" />
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-30">Hizb</span>
            <span className="font-bold">{activeSurah.hizb}</span>
          </div>
        </div>

        <button 
          onClick={handleNextSurah}
          className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-all"
        >
          Next Surah <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default QuranSync;
