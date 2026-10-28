import React, { useState } from 'react';
import {
  LayoutGrid,
  Sparkles,
  RefreshCw,
  Check,
  ExternalLink,
  Smartphone,
  Palette,
  Type,
  Clock
} from 'lucide-react';
import { CATEGORIES } from '../data/motivationData';
import { pickNotificationQuote } from '../services/notificationService';

const WIDGET_SIZES = [
  { id: '4x2', label: '4×2 Horizontal', desc: 'Ideal para la parte superior de tu pantalla' },
  { id: '2x2', label: '2×2 Compacto', desc: 'Cuadrado minimalista junto a tus apps' },
  { id: '4x4', label: '4×4 Grande', desc: 'Póster completo con foto, frase y micro-acción' }
];

const WIDGET_THEMES = [
  { id: 'photo', label: 'Foto Motivadora HD', preview: 'bg-gradient-to-br from-amber-500/40 to-slate-900' },
  { id: 'glass', label: 'Cristal Oscuro (Glass)', preview: 'bg-slate-900/80' },
  { id: 'gold', label: 'Dorado Estoico', preview: 'bg-gradient-to-br from-amber-950 via-stone-900 to-black' },
  { id: 'aurora', label: 'Aurora Boreal', preview: 'bg-gradient-to-br from-indigo-950 via-teal-950 to-slate-950' }
];

export default function WidgetConfigurator({
  profile,
  widgetConfig,
  onSaveWidgetConfig,
  currentWidgetQuote,
  onRefreshWidgetQuote
}) {
  const [size, setSize] = useState(widgetConfig?.size || '4x2');
  const [theme, setTheme] = useState(widgetConfig?.theme || 'photo');
  const [sourceCategory, setSourceCategory] = useState(widgetConfig?.sourceCategory || 'profile');
  const [updateInterval, setUpdateInterval] = useState(widgetConfig?.updateInterval || '6h');
  const [showTextShadow, setShowTextShadow] = useState(widgetConfig?.showTextShadow ?? true);
  const [savedToast, setSavedToast] = useState(false);

  const quote = currentWidgetQuote || pickNotificationQuote(profile);
  const categoryObj = CATEGORIES.find((c) => c.id === quote.category);

  const handleSave = () => {
    const updated = {
      size,
      theme,
      sourceCategory,
      updateInterval,
      showTextShadow,
      updatedAt: new Date().toISOString()
    };
    onSaveWidgetConfig(updated);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const handleOpenFloatingWidget = async () => {
    handleSave();
    const width = size === '2x2' ? 300 : 420;
    const height = size === '4x4' ? 420 : 250;

    // Try Document Picture-in-Picture API first if supported, else popup window
    const popup = window.open(
      `/?widgetMode=1&size=${size}&theme=${theme}`,
      'ImpulsoWidgetWindow',
      `width=${width},height=${height},menubar=no,toolbar=no,location=no,status=no,resizable=yes`
    );
    if (!popup) {
      alert('Permite las ventanas emergentes para abrir el widget flotante en tu pantalla.');
    }
  };

  const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
          <LayoutGrid className="w-4 h-4" />
          <span>Widget de Pantalla de Inicio</span>
        </div>
        <h2 className="text-lg font-bold text-white">Configurar tu Widget Motivador</h2>
        <p className="text-xs text-slate-400">
          Personaliza cómo se verá tu widget con frases y fotos en la pantalla principal de tu celular o escritorio.
        </p>
      </div>

      {/* Simulated Android Home Screen with Live Interactive Widget */}
      <div className="p-4 rounded-3xl bg-gradient-to-b from-indigo-950/60 via-slate-900 to-slate-950 border border-slate-800 shadow-2xl space-y-4">
        {/* Phone Status Bar Simulation */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-2">
          <span className="font-semibold text-slate-300">{nowTime}</span>
          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-amber-300">
            Vista Previa Pantalla de Inicio
          </span>
          <span>5G 🔋 98%</span>
        </div>

        {/* THE WIDGET PREVIEW */}
        <div className="flex justify-center py-2">
          <div
            className={`relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl transition-all duration-300 flex flex-col justify-between ${
              size === '2x2'
                ? 'w-56 h-56 p-4'
                : size === '4x2'
                ? 'w-full min-h-[185px] p-4'
                : 'w-full min-h-[310px] p-5'
            }`}
          >
            {/* Background according to selected theme */}
            {theme === 'photo' && (
              <>
                <img
                  src={quote.image}
                  alt={quote.author}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/35" />
              </>
            )}
            {theme === 'glass' && (
              <div className="absolute inset-0 bg-slate-900/85 backdrop-blur-xl" />
            )}
            {theme === 'gold' && (
              <div className="absolute inset-0 bg-gradient-to-br from-amber-950 via-stone-900 to-slate-950" />
            )}
            {theme === 'aurora' && (
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-teal-950 to-slate-950" />
            )}

            {/* Widget Top Bar */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center text-[11px] font-bold">
                  ✨
                </span>
                <span className="text-[11px] font-bold tracking-wide text-amber-300 uppercase">
                  {categoryObj?.name || 'Impulso'}
                </span>
              </div>

              <button
                type="button"
                onClick={onRefreshWidgetQuote}
                className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white/90 border border-white/15 transition"
                title="Cambiar frase del widget"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Widget Quote Content */}
            <div className="relative z-10 my-auto py-2">
              <p
                className={`font-serif italic text-white font-semibold leading-snug ${
                  size === '2x2' ? 'text-xs line-clamp-4' : size === '4x2' ? 'text-sm sm:text-base' : 'text-lg'
                } ${showTextShadow ? 'drop-shadow-md' : ''}`}
              >
                “{quote.quote}”
              </p>
              <p className="text-[11px] font-semibold text-amber-300 mt-1.5">
                — {quote.author}
              </p>
            </div>

            {/* Extra reflection on 4x4 Large Widget */}
            {size === '4x4' && (
              <div className="relative z-10 p-2.5 rounded-2xl bg-black/45 border border-white/10 text-[11px] text-slate-200 flex items-start gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>{quote.reflection}</span>
              </div>
            )}
          </div>
        </div>

        {/* Simulated App Icons Below Widget */}
        <div className="grid grid-cols-4 gap-3 pt-2 px-3 opacity-75">
          {['📞 Teléfono', '💬 Mensajes', '📷 Cámara', '✨ Impulso'].map((appLabel, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg border ${
                  i === 3
                    ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 border-amber-300 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-slate-800/80 border-slate-700'
                }`}
              >
                {appLabel.split(' ')[0]}
              </div>
              <span className="text-[10px] text-slate-300">{appLabel.split(' ')[1]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Widget Size Selector */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3">
        <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-amber-400" />
          <span>1. Tamaño del Widget</span>
        </label>
        <div className="grid grid-cols-3 gap-2.5">
          {WIDGET_SIZES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSize(s.id)}
              className={`p-3 rounded-2xl border text-left transition ${
                size === s.id
                  ? 'bg-amber-500/20 border-amber-400 text-white'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="font-bold text-xs text-amber-300">{s.label}</div>
              <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">{s.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Widget Theme Selector */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3">
        <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Palette className="w-4 h-4 text-amber-400" />
          <span>2. Estilo Visual del Fondo</span>
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          {WIDGET_THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTheme(t.id)}
              className={`p-3 rounded-2xl border flex items-center gap-2.5 text-left transition ${
                theme === t.id
                  ? 'bg-amber-500/20 border-amber-400 text-white'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <span className={`w-6 h-6 rounded-lg border border-white/20 flex-shrink-0 ${t.preview}`} />
              <span className="text-xs font-semibold">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Source & Frequency */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div>
          <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-2">
            <Type className="w-4 h-4 text-amber-400" />
            <span>3. Qué frases mostrar en el Widget</span>
          </label>
          <select
            value={sourceCategory}
            onChange={(e) => setSourceCategory(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
          >
            <option value="profile">✨ Según mi Cuestionario Motivacional (Recomendado)</option>
            <option value="favorites">❤️ Solo mis Frases Favoritas guardadas</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>4. Frecuencia de renovación automática</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: '1h', label: 'Cada 1 hora' },
              { id: '6h', label: 'Cada 6 horas' },
              { id: '24h', label: '1 vez al día' }
            ].map((freq) => (
              <button
                key={freq.id}
                type="button"
                onClick={() => setUpdateInterval(freq.id)}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition ${
                  updateInterval === freq.id
                    ? 'bg-amber-400 text-slate-950 border-amber-400'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                {freq.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons: Save + Launch Floating Widget + Android Instructions */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={handleSave}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:brightness-105 transition"
        >
          {savedToast ? (
            <>
              <Check className="w-4 h-4" />
              <span>¡Configuración del Widget Guardada!</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Guardar y Aplicar Diseño al Widget</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleOpenFloatingWidget}
          className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-amber-400/40 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 transition"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Abrir Widget Flotante Independiente Ahora</span>
        </button>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 text-xs text-slate-400 space-y-1.5 leading-relaxed">
          <div className="font-bold text-slate-200">📱 ¿Cómo ponerlo en la pantalla de tu Android?</div>
          <p>1. Mantén presionado un espacio vacío en la pantalla de inicio de tu celular.</p>
          <p>2. Toca en <strong className="text-amber-300">Widgets</strong> y busca <strong className="text-amber-300">Impulso Motivación</strong>.</p>
          <p>3. Arrástralo a tu pantalla. También puedes tocar el botón <strong className="text-amber-300">📌 Fijar en Widget</strong> en cualquier tarjeta para mostrar esa frase e imagen inmediatamente.</p>
        </div>
      </div>
    </div>
  );
}

