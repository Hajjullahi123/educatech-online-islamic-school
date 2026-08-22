import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Pricing from '@/components/Pricing';
import { GraduationCap, BookOpen } from 'lucide-react';
import Link from 'next/link';

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
              {
                name: 'Riwayah Al-Bazzi',
                desc: 'The narration of Imam Ibn Kathir al-Makki. Known for unique rules on the connection of the plural "Meem".',
                level: 'Advanced',
                color: 'bg-indigo-500'
              },
              {
                name: 'Riwayah Qumbul',
                desc: 'Secondary narration of Ibn Kathir. Features distinct rules for the "Seen" and "Zay" sounds.',
                level: 'Advanced',
                color: 'bg-violet-500'
              },
              {
                name: 'Riwayah Ad-Duri',
                desc: 'The primary narration of Abu Amr of Basra. Widely practiced in Sudan and parts of East Africa.',
                level: 'Intermediate - Advanced',
                color: 'bg-rose-500'
              },
              {
                name: 'Riwayah Al-Sousi',
                desc: 'Known for its advanced "Idgham al-Kabir" rules, merging adjacent words for fluid recitation.',
                level: 'Advanced',
                color: 'bg-fuchsia-500'
              },
              {
                name: 'Riwayah Hisham',
                desc: 'Narration of Ibn Amir of Damascus. Features unique pronunciation rules for the Hamza.',
                level: 'Advanced',
                color: 'bg-orange-500'
              },
              {
                name: 'Riwayah Ibn Zakwan',
                desc: 'Secondary narration of Ibn Amir. Distinguished by its specific rules for elongation and vocalization.',
                level: 'Advanced',
                color: 'bg-cyan-500'
              },
              {
                name: 'Riwayah Khalaf',
                desc: 'The rigorous recitation of Imam Hamzah. Famous for its distinct "Sakt" (vocal pauses).',
                level: 'Expert',
                color: 'bg-slate-800'
              },
              {
                name: 'Riwayah Khallad',
                desc: 'Secondary narration of Hamzah. Offers a slightly different approach to the Sakt and elongation.',
                level: 'Expert',
                color: 'bg-zinc-700'
              },
              {
                name: 'Riwayah Shu\'bah',
                desc: 'The companion narration to Hafs from Imam Asim. Rich in classical Kufan phonetic nuances.',
                level: 'Intermediate - Advanced',
                color: 'bg-teal-600'
              },
              {
                name: 'Riwayah Abul-Harith',
                desc: 'Narration of Imam Al-Kisa\'i. Focuses on "Imalah" and sophisticated vocal inclinations.',
                level: 'Advanced',
                color: 'bg-lime-600'
              },
              {
                name: 'Riwayah Ad-Duri (Al-Kisa\'i)',
                desc: 'The secondary narration of Al-Kisa\'i, further refining the grammatical precision of the Kufan school.',
                level: 'Advanced',
                color: 'bg-emerald-700'
              }
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
      <section id="certification" className="py-24 relative overflow-hidden">
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

      {/* Teacher Recruitment CTA Section */}
      <section id="teachers" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass p-12 lg:p-20 rounded-[3rem] border border-primary/5 relative overflow-hidden flex flex-col lg:flex-row items-center gap-12">
            <div className="space-y-6 lg:w-3/5 text-center lg:text-left z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-primary font-bold text-xs uppercase tracking-widest">
                <GraduationCap className="w-4 h-4" /> Join Our Faculty
              </div>
              <h3 className="text-4xl lg:text-5xl font-black text-foreground">Are you a Qualified Quran Teacher?</h3>
              <p className="text-foreground/60 text-lg leading-relaxed max-w-2xl">
                We are looking for scholars with verified Ijazah in various Riwayat to join our global mission. Impact students worldwide while maintaining a flexible, well-compensated schedule.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
                <Link href="/teacher/apply" className="bg-primary text-white px-10 py-5 rounded-2xl font-black shadow-2xl shadow-primary/20 hover:scale-105 transition-all">
                  Apply to Teach
                </Link>
                <Link href="#" className="glass px-10 py-5 rounded-2xl font-black hover:bg-black/5 transition-all">
                  View Compensation Plan
                </Link>
              </div>
            </div>
            <div className="lg:w-2/5 flex flex-col gap-6 scale-90 lg:scale-100">
              <div className="glass p-6 rounded-3xl space-y-2 border-l-4 border-emerald-500 shadow-xl shadow-emerald-500/5">
                <p className="font-black text-primary">$35.00/hr</p>
                <p className="text-xs uppercase tracking-widest font-bold opacity-40">Average Teacher Rate</p>
              </div>
              <div className="glass p-6 rounded-3xl space-y-2 border-l-4 border-amber-500 translate-x-6 shadow-xl shadow-amber-500/5">
                <p className="font-black text-secondary">Global Reach</p>
                <p className="text-xs uppercase tracking-widest font-bold opacity-40">Students from 40+ countries</p>
              </div>
              <div className="glass p-6 rounded-3xl space-y-2 border-l-4 border-sky-500 shadow-xl shadow-sky-500/5">
                <p className="font-black text-sky-600">Full Flexibility</p>
                <p className="text-xs uppercase tracking-widest font-bold opacity-40">Set your own teaching hours</p>
              </div>
            </div>

            {/* Background Art */}
            <div className="absolute -bottom-20 -right-20 opacity-5">
              <BookOpen className="w-80 h-80 text-primary" />
            </div>
          </div>
        </div>
      </section>

      <Pricing />

      {/* Footer Placeholder */}
      <footer className="py-12 text-center opacity-40 text-sm">
        &copy; 2026 EducaTech Online Islamic School. All Rights Reserved.
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
