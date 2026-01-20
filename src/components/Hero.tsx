"use client";

import React from 'react';
import Image from 'next/image';
import { Play, ArrowRight, ShieldCheck, Star, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 transform translate-x-20 z-0" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/5 rounded-full blur-3xl z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary/20 text-primary font-medium text-sm animate-fade-in">
              <Star className="w-4 h-4 fill-primary" />
              <span>World's #1 Riwayah Specialized Academy</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] text-foreground">
              Master the <span className="text-gradient">Holy Quran</span> in Every Riwayah
            </h1>

            <p className="text-lg text-foreground/70 max-w-xl leading-relaxed">
              Connect with verified scholars and master Quranic recitation across 10 Qira'at. Structured certification tracks, personalized feedback, and traditional authenticity met with modern technology.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <button className="bg-primary text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary-light transition-all duration-300 shadow-xl shadow-primary/20 hover:-translate-y-1">
                Start Your Journey <ArrowRight className="w-5 h-5" />
              </button>
              <button className="glass px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-white/50 transition-all duration-300 border border-border">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Play className="w-4 h-4 text-primary fill-primary" />
                </div>
                How it Works
              </button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-10">
              <div className="space-y-1">
                <span className="text-3xl font-extrabold text-primary">500+</span>
                <p className="text-xs font-semibold uppercase tracking-wider opacity-60">Verified Teachers</p>
              </div>
              <div className="space-y-1">
                <span className="text-3xl font-extrabold text-primary">10+</span>
                <p className="text-xs font-semibold uppercase tracking-wider opacity-60">Riwayat Taught</p>
              </div>
              <div className="space-y-1">
                <span className="text-3xl font-extrabold text-primary">98%</span>
                <p className="text-xs font-semibold uppercase tracking-wider opacity-60">Satisfaction Rate</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl border-[12px] border-white/50 glass aspect-[4/5] md:aspect-square lg:aspect-auto">
              {/* Image Placeholder - User will see the generated hero image */}
              <img
                src="/hero.png"
                alt="Quran Student Learning Online"
                className="w-full h-full object-cover"
              />

              {/* Floating Cards */}
              <div className="absolute top-10 -left-6 glass p-4 rounded-2xl shadow-xl animate-bounce-slow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold opacity-60 uppercase">Certified</p>
                    <p className="text-sm font-bold">Hafs Certification</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-10 -right-6 glass p-4 rounded-2xl shadow-xl animate-float">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                        S{i}
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-bold">150+ Students</p>
                    <p className="text-[10px] opacity-60">Active in Warsh Track</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Background elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl -z-1" />
            <div className="absolute -bottom-5 -left-10 w-32 h-32 bg-secondary/10 rounded-full blur-2xl -z-1" />
          </motion.div>

        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(5px, -5px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;
