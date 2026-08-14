'use client';

import React, { useEffect, useState } from 'react';
import { Download, X, Smartphone, CheckCircle } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    // Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
          (registration) => {
            console.log('[PWA] ServiceWorker registered with scope:', registration.scope);
          },
          (err) => {
            console.error('[PWA] ServiceWorker registration failed:', err);
          }
        );
      });
    }

    // Capture install prompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowBanner(false);
      console.log('[PWA] Al-Qalam Academy installed successfully!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('[PWA] User accepted install prompt');
    }
    setDeferredPrompt(null);
    setShowBanner(false);
  };

  if (!showBanner || isInstalled) return null;

  return (
    <div className="fixed bottom-5 left-5 right-5 md:left-auto md:right-8 md:max-w-md z-[9999] bg-slate-900/95 backdrop-blur-xl border border-emerald-500/30 text-white p-4 rounded-2xl shadow-2xl shadow-emerald-950/50 transition-all duration-300 animate-in slide-in-from-bottom-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 shadow-md flex-shrink-0 flex items-center justify-center">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
              Install Al-Qalam App
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-medium">
                PWA
              </span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
              Install Al-Qalam on your home screen for quick offline access and instant classroom sessions.
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowBanner(false)}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Close install prompt"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3.5 flex items-center justify-end gap-2.5">
        <button
          onClick={() => setShowBanner(false)}
          className="text-xs font-semibold text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-lg transition-colors"
        >
          Maybe Later
        </button>
        <button
          onClick={handleInstallClick}
          className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
        >
          <Download className="w-3.5 h-3.5" />
          Install App
        </button>
      </div>
    </div>
  );
}
