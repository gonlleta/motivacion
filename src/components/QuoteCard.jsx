import React, { useState } from 'react';
import {
  Heart,
  Share2,
  Download,
  Sparkles,
  MessageCircle,
  Check,
  LayoutGrid
} from 'lucide-react';
import { CATEGORIES } from '../data/motivationData';
import { generateMotivationalPoster, shareQuote } from '../utils/imageGenerator';

export default function QuoteCard({
  item,
  isFavorite,
  onToggleFavorite,
  onPinToWidget,
  isPinnedWidget = false,
  featured = false
}) {
  const [downloading, setDownloading] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);
  const [imgError, setImgError] = useState(false);

  const category = CATEGORIES.find((c) => c.id === item.category);

  const handleDownloadPoster = async () => {
    setDownloading(true);
    try {
      const dataUrl = await generateMotivationalPoster(item, category?.name || 'Impulso');
      const link = document.createElement('a');
      link.download = `impulso-${item.id}.png`;
      link.href = dataUrl;
      link.click();
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async (platform) => {
    const res = await shareQuote(item, platform);
    if (res === 'copied') {
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    }
  };

  return (
    <div
      className={`relative rounded-3xl overflow-hidden border transition-all duration-300 shadow-xl ${
        featured
          ? 'min-h-[430px] border-amber-400/40 shadow-amber-500/10'
          : 'min-h-[370px] border-white/10'
      } flex flex-col justify-between group`}
    >
      {/* Background Photo with fallback gradient */}
      {!imgError && (
        <img
          src={item.image}
          alt={item.author}
          onError={() => setImgError(true)}
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
      )}

      {/* Multi-layer Dark Cinematic Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-t ${
          item.gradient || 'from-slate-950 via-slate-900/80 to-slate-900/40'
        }`}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/90" />

      {/* Top Badges */}
      <div className="relative z-10 p-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {category && (
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full border backdrop-blur-md ${category.badgeBg}`}
            >
              {category.name}
            </span>
          )}
          {featured && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 flex items-center gap-1">
              <Sparkles className="w-3 h-3 fill-current" />
              Para ti hoy
            </span>
          )}
        </div>

        <button
          onClick={() => onToggleFavorite(item.id)}
          className={`p-2.5 rounded-full backdrop-blur-md border transition ${
            isFavorite
              ? 'bg-rose-500/25 border-rose-400/50 text-rose-400'
              : 'bg-black/40 border-white/15 text-white/80 hover:text-white'
          }`}
          aria-label="Guardar en favoritos"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Center Motivational Quote */}
      <div className="relative z-10 px-6 py-4 my-auto text-center">
        <blockquote className="font-serif italic text-xl sm:text-2xl text-white font-semibold leading-relaxed drop-shadow-sm mb-3">
          “{item.quote}”
        </blockquote>
        <cite className="not-italic text-xs font-semibold tracking-wider uppercase text-amber-300/90">
          — {item.author}
        </cite>
      </div>

      {/* Bottom Reflection & Action Bar */}
      <div className="relative z-10 p-5 pt-2 space-y-3">
        <div className="p-3 rounded-2xl bg-black/45 backdrop-blur-md border border-white/10 text-xs text-slate-200 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <span>
            <strong className="text-amber-300">Micro-acción:</strong> {item.reflection}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1">
          <button
            onClick={() => handleShare('whatsapp')}
            className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition backdrop-blur-md"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={handleDownloadPoster}
            disabled={downloading}
            className="flex-1 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-slate-100 text-xs font-semibold flex items-center justify-center gap-1.5 transition backdrop-blur-md"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloading ? 'Creando...' : 'Foto HD'}</span>
          </button>

          {onPinToWidget && (
            <button
              onClick={() => onPinToWidget(item)}
              className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition backdrop-blur-md ${
                isPinnedWidget
                  ? 'bg-amber-400 text-slate-950 border-amber-300'
                  : 'bg-white/10 hover:bg-white/20 border-white/15 text-amber-300'
              }`}
              title="Fijar esta frase y foto en tu Widget"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>{isPinnedWidget ? 'En Widget' : 'Widget'}</span>
            </button>
          )}

          <button
            onClick={() => handleShare('native')}
            className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-slate-100 text-xs font-semibold flex items-center justify-center gap-1 transition backdrop-blur-md"
            title="Compartir o copiar frase"
          >
            {copiedToast ? (
              <>
                <Check className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-300">Copiado</span>
              </>
            ) : (
              <Share2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

