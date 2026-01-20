import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />

      {/* Riwayah Tracks Section */}
      <section id="tracks" className="py-24 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-primary font-bold tracking-widest uppercase text-sm">Learning Pathways</h2>
            <h3 className="text-4xl lg:text-5xl font-extrabold">Riwayah Specialization Tracks</h3>
            <p className="text-foreground/60 max-w-2xl mx-auto">
              Choose your path to mastery. Each track includes structured curriculum, personal teacher matching, and recognized certification upon completion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Riwayah Hafs',
                desc: 'The most common recitation method. Perfect for beginners and those building a strong foundation in Tajweed.',
                level: 'Beginner - Advanced',
                color: 'bg-emerald-500'
              },
              {
                name: 'Riwayah Warsh',
                desc: 'Popular in North Africa. Focuses on distinct elongation and vocal techniques (Madd).',
                level: 'Intermediate - Advanced',
                color: 'bg-amber-500'
              },
              {
                name: 'Riwayah Qalun',
                desc: 'Common in Libya and parts of Tunisia. Unique rules for merging and separating letters.',
                level: 'Intermediate - Advanced',
                color: 'bg-sky-500'
              },
            ].map((track, i) => (
              <div key={i} className="glass p-8 rounded-[2rem] group hover:-translate-y-2 transition-all duration-300 border border-primary/5">
                <div className={`w-14 h-14 rounded-2xl ${track.color} mb-6 flex items-center justify-center text-white shadow-lg shadow-black/5`}>
                  <span className="text-2xl font-bold">{track.name[track.name.length - 1]}</span>
                </div>
                <h4 className="text-2xl font-bold mb-3">{track.name}</h4>
                <p className="text-foreground/70 mb-6 text-sm leading-relaxed">
                  {track.desc}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-primary/5">
                  <span className="text-xs font-bold uppercase tracking-widest opacity-40">{track.level}</span>
                  <button className="text-primary font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                    Explore Track <ArrowIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Verification Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-primary rounded-[3rem] p-12 lg:p-20 text-white relative">
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="200" cy="200" r="190" stroke="white" strokeWidth="20" strokeDasharray="50 50" />
            </svg>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-4xl font-extrabold">Shariah Compliant & Ijazah Verified</h3>
              <p className="text-emerald-100/80 leading-relaxed text-lg">
                Our curriculum is vetted by a Global Shariah Advisory Board. Every teacher must hold a verified Ijazah with a connected chain (Sanad) back to the Prophet (PBUH).
              </p>
              <ul className="space-y-4">
                {[
                  'Verified Ijazah Documents',
                  'Rigorous Proficiency Testing',
                  'Monthly Academic Reviews',
                  'Child Protection Certified'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl space-y-2 hover:bg-white/20 transition-all">
                <span className="text-5xl font-black">100%</span>
                <p className="text-sm font-medium opacity-70 uppercase tracking-widest">Teacher Verification</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl space-y-2 mt-8 hover:bg-white/20 transition-all">
                <span className="text-5xl font-black">24h</span>
                <p className="text-sm font-medium opacity-70 uppercase tracking-widest">Support Response</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Placeholder */}
      <footer className="py-12 text-center opacity-40 text-sm">
        &copy; 2026 Al-Qalam Quran Academy. All Rights Reserved.
      </footer>
    </main>
  );
}

function ArrowIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
    </svg>
  );
}
