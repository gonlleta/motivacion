import React from 'react';
import { Bell, X, Heart, Share2, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../data/motivationData';

export default function NotificationSimulatorBanner({
  notification,
  onClose,
  onSaveFavorite,
  onShare,
  isFavorite
}) {
  if (!notification) return null;

  const category = CATEGORIES.find((c) => c.id === notification.category);

  return (
    <div className="fixed top-3 inset-x-3 z-50 max-w-md mx-auto animate-slide-up">
      <div className="rounded-3xl bg-slate-900/95 backdrop-blur-xl border border-amber-400/40 shadow-2xl shadow-black/80 overflow-hidden">
        {/* Android Status Header */}
        <div className="px-4 pt-3 pb-2 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-slate-950">
              <Bell className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs font-bold tracking-wide text-amber-400 uppercase">
              Impulso • Ahora mismo
            </span>
            {category && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {category.name}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Cerrar notificación"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notification Body + Motivational Photo */}
        <div className="p-4 flex gap-3.5 items-start">
          <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10 relative bg-slate-800">
            <img
              src={notification.image}
              alt={notification.author}
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-serif italic text-white leading-snug mb-1">
              “{notification.quote}”
            </p>
            <p className="text-xs font-medium text-amber-300 mb-1.5">
              — {notification.author}
            </p>
            <p className="text-xs text-slate-300 bg-slate-950/70 rounded-xl p-2 border border-slate-800/80 flex items-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>{notification.reflection}</span>
            </p>
          </div>
        </div>

        {/* Android Notification Action Buttons */}
        <div className="px-4 py-2.5 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-end gap-4 text-xs font-semibold">
          <button
            onClick={() => onSaveFavorite(notification.id)}
            className={`flex items-center gap-1.5 transition ${
              isFavorite ? 'text-rose-400' : 'text-slate-300 hover:text-amber-300'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
            <span>{isFavorite ? 'Guardada' : 'Guardar'}</span>
          </button>

          <button
            onClick={() => onShare(notification)}
            className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Compartir en WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}

