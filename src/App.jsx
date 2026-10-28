import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Bell,
  Heart,
  Compass,
  Sliders,
  RefreshCw,
  Send,
  Clock,
  CheckCircle2,
  Flame,
  PlusCircle,
  Smartphone,
  LayoutGrid
} from 'lucide-react';
import OnboardingQuiz from './components/OnboardingQuiz';
import QuoteCard from './components/QuoteCard';
import NotificationSimulatorBanner from './components/NotificationSimulatorBanner';
import WidgetConfigurator from './components/WidgetConfigurator';
import {
  CATEGORIES,
  MOTIVATIONAL_QUOTES,
  DEFAULT_SCHEDULES
} from './data/motivationData';
import {
  getPersonalizedQuotes,
  pickNotificationQuote,
  triggerInstantNotification,
  syncScheduledNotifications
} from './services/notificationService';
import { shareQuote } from './utils/imageGenerator';

const STORAGE_KEYS = {
  PROFILE: 'impulso_user_profile_v1',
  FAVORITES: 'impulso_favorites_v1',
  CUSTOM_QUOTES: 'impulso_custom_quotes_v1',
  NOTIF_HISTORY: 'impulso_notif_history_v1',
  WIDGET_CONFIG: 'impulso_widget_config_v1',
  WIDGET_QUOTE: 'impulso_widget_quote_v1'
};

export default function App() {
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return saved ? JSON.parse(saved) : ['q1', 'q5'];
    } catch {
      return ['q1', 'q5'];
    }
  });

  const [customQuotes, setCustomQuotes] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_QUOTES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [notifHistory, setNotifHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIF_HISTORY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [widgetConfig, setWidgetConfig] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WIDGET_CONFIG);
      return saved ? JSON.parse(saved) : { size: '4x2', theme: 'photo', sourceCategory: 'profile', updateInterval: '6h' };
    } catch {
      return { size: '4x2', theme: 'photo', sourceCategory: 'profile', updateInterval: '6h' };
    }
  });

  const [widgetQuote, setWidgetQuote] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WIDGET_QUOTE);
      return saved ? JSON.parse(saved) : MOTIVATIONAL_QUOTES[0];
    } catch {
      return MOTIVATIONAL_QUOTES[0];
    }
  });

  const [showQuiz, setShowQuiz] = useState(!profile);
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'explore' | 'widget' | 'favorites' | 'settings'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeNotification, setActiveNotification] = useState(null);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [shuffleSeed, setShuffleSeed] = useState(() => Date.now());
  const [currentQuote, setCurrentQuote] = useState(() => pickNotificationQuote(profile));
  const [sessionCount, setSessionCount] = useState(1);

  // Custom quote form state
  const [newQuoteText, setNewQuoteText] = useState('');
  const [newQuoteAuthor, setNewQuoteAuthor] = useState('');
  const [newQuoteCategory, setNewQuoteCategory] = useState('metas');

  // Persist changes
  useEffect(() => {
    if (profile) {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
      syncScheduledNotifications(profile.schedules || DEFAULT_SCHEDULES, profile);
    }
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_QUOTES, JSON.stringify(customQuotes));
  }, [customQuotes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIF_HISTORY, JSON.stringify(notifHistory));
  }, [notifHistory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WIDGET_CONFIG, JSON.stringify(widgetConfig));
  }, [widgetConfig]);

  useEffect(() => {
    if (widgetQuote) {
      localStorage.setItem(STORAGE_KEYS.WIDGET_QUOTE, JSON.stringify(widgetQuote));
    }
  }, [widgetQuote]);

  const handlePinToWidget = (quoteObj) => {
    setWidgetQuote(quoteObj);
    setActiveTab('widget');
  };

  const handleRefreshWidgetQuote = () => {
    const nextQuote = pickNotificationQuote(profile);
    setWidgetQuote(nextQuote);
  };

  // Listen for PWA install prompt
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Minute-by-minute schedule watcher for active app/PWA session
  useEffect(() => {
    if (!profile?.schedules) return;
    let lastTriggeredMinute = '';

    const interval = setInterval(() => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const currentHM = `${hh}:${mm}`;

      if (currentHM === lastTriggeredMinute) return;

      const match = profile.schedules.find((s) => s.enabled && s.time === currentHM);
      if (match) {
        lastTriggeredMinute = currentHM;
        handleSendMotivationNow();
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [profile]);

  // Rotate quote every time the user opens or returns to the app
  useEffect(() => {
    const rotateOnAppOpen = () => {
      if (document.visibilityState === 'visible' && profile) {
        const fresh = pickNotificationQuote(profile, currentQuote?.id);
        setCurrentQuote(fresh);
        setWidgetQuote(fresh);
        setShuffleSeed(Date.now());
        setSessionCount((c) => c + 1);
      }
    };
    document.addEventListener('visibilitychange', rotateOnAppOpen);
    return () => document.removeEventListener('visibilitychange', rotateOnAppOpen);
  }, [profile, currentQuote]);

  const allQuotesPool = useMemo(() => {
    const ranked = getPersonalizedQuotes(profile, selectedCategory, shuffleSeed);
    const customFiltered = customQuotes.filter(
      (q) => selectedCategory === 'all' || q.category === selectedCategory
    );
    return [...customFiltered, ...ranked];
  }, [profile, selectedCategory, customQuotes, shuffleSeed]);

  const handleNextDynamicQuote = (categoryOverride = selectedCategory) => {
    const pool = getPersonalizedQuotes(profile, categoryOverride, Date.now()).filter(
      (q) => q.id !== currentQuote?.id
    );
    const next = pool[0] || pickNotificationQuote(profile, currentQuote?.id);
    setCurrentQuote(next);
    setWidgetQuote(next);
    setSessionCount((c) => c + 1);
  };

  const favoriteQuotesList = useMemo(() => {
    const combined = [...customQuotes, ...MOTIVATIONAL_QUOTES];
    return combined.filter((q) => favorites.includes(q.id));
  }, [favorites, customQuotes]);

  const toggleFavorite = (quoteId) => {
    setFavorites((prev) =>
      prev.includes(quoteId) ? prev.filter((id) => id !== quoteId) : [...prev, quoteId]
    );
  };

  const handleCompleteQuiz = (newProfile) => {
    setProfile(newProfile);
    setShowQuiz(false);
    // Trigger an immediate welcome notification 900ms after finishing the quiz
    setTimeout(() => {
      const welcomeQuote = pickNotificationQuote(newProfile);
      setActiveNotification(welcomeQuote);
      triggerInstantNotification(welcomeQuote);
      setNotifHistory((prev) => [
        { ...welcomeQuote, sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
        ...prev.slice(0, 14)
      ]);
    }, 900);
  };

  const handleSendMotivationNow = async () => {
    const chosen = pickNotificationQuote(profile, currentQuote?.id);
    setCurrentQuote(chosen);
    setWidgetQuote(chosen);
    setSessionCount((c) => c + 1);
    setActiveNotification(chosen);
    await triggerInstantNotification(chosen);
    setNotifHistory((prev) => [
      { ...chosen, sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      ...prev.slice(0, 14)
    ]);
  };

  const handleUpdateSchedule = (id, field, value) => {
    if (!profile) return;
    const updatedSchedules = (profile.schedules || DEFAULT_SCHEDULES).map((s) =>
      s.id === id ? { ...s, [field]: value } : s
    );
    setProfile({ ...profile, schedules: updatedSchedules });
  };

  const handleCreateCustomQuote = (e) => {
    e.preventDefault();
    if (!newQuoteText.trim()) return;
    const defaultImg =
      MOTIVATIONAL_QUOTES.find((q) => q.category === newQuoteCategory)?.image ||
      MOTIVATIONAL_QUOTES[0].image;

    const created = {
      id: `custom_${Date.now()}`,
      category: newQuoteCategory,
      quote: newQuoteText.trim(),
      author: newQuoteAuthor.trim() || profile?.name || 'Mi Propia Voz',
      reflection: 'Recuerda por qué escribiste este recordatorio para ti.',
      image: defaultImg,
      gradient: 'from-amber-950/90 via-slate-900/85 to-slate-950',
      visualTag: 'nature',
      tone: 'inspirador'
    };

    setCustomQuotes((prev) => [created, ...prev]);
    setFavorites((prev) => [created.id, ...prev]);
    setNewQuoteText('');
    setNewQuoteAuthor('');
    setActiveNotification(created);
  };

  if (showQuiz) {
    return (
      <OnboardingQuiz
        initialProfile={profile}
        onComplete={handleCompleteQuiz}
        onCancel={profile ? () => setShowQuiz(false) : null}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-28 max-w-md mx-auto relative shadow-2xl shadow-black border-x border-slate-900/80">
      {/* Simulated / Real Notification Popup */}
      <NotificationSimulatorBanner
        notification={activeNotification}
        onClose={() => setActiveNotification(null)}
        onSaveFavorite={toggleFavorite}
        onShare={(q) => shareQuote(q, 'whatsapp')}
        isFavorite={activeNotification ? favorites.includes(activeNotification.id) : false}
      />

      {/* Top Sticky App Header */}
      <header className="sticky top-0 z-30 bg-slate-950/85 backdrop-blur-xl border-b border-slate-900 px-5 py-3.5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Impulso Diario</span>
          </div>
          <h1 className="text-lg font-bold text-white">
            Hola, {profile?.name || 'Campeón/a'} 👋
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSendMotivationNow}
            className="px-3 py-2 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 hover:brightness-105 active:scale-95 transition"
            title="Recibir notificación con frase y foto ahora"
          >
            <Bell className="w-3.5 h-3.5 fill-current" />
            <span>¡Motívame!</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="px-4 pt-4 space-y-6">
        {/* TAB 1: HOME (PARA TI) */}
        {activeTab === 'home' && (
          <div className="space-y-5 animate-fade-in">
            {/* Personalized Profile Summary Banner */}
            <div className="p-4 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/60 border border-slate-800/90 flex items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300">
                  <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>Feed calibrado con tu cuestionario</span>
                </div>
                <p className="text-xs text-slate-400">
                  Enfocado en{' '}
                  {(profile?.categories || ['metas'])
                    .map((cid) => CATEGORIES.find((c) => c.id === cid)?.name)
                    .filter(Boolean)
                    .join(', ')}
                </p>
              </div>
              <button
                onClick={() => setShowQuiz(true)}
                className="px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-xs font-semibold text-amber-300 border border-slate-700 flex items-center gap-1.5 flex-shrink-0 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Test</span>
              </button>
            </div>

            {/* Horizontal Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  handleNextDynamicQuote('all');
                }}
                className={`px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === 'all'
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
                }`}
              >
                ✨ Para Ti
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    handleNextDynamicQuote(cat.id);
                  }}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition ${
                    selectedCategory === cat.id
                      ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Single Dynamic Quote Card that changes on every open / notification */}
            {currentQuote && (
              <div className="space-y-4" key={currentQuote.id}>
                <QuoteCard
                  item={currentQuote}
                  featured={true}
                  isFavorite={favorites.includes(currentQuote.id)}
                  onToggleFavorite={toggleFavorite}
                  onPinToWidget={handlePinToWidget}
                  isPinnedWidget={widgetQuote?.id === currentQuote.id}
                />

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleNextDynamicQuote(selectedCategory)}
                    className="flex-1 py-3.5 px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-amber-400/40 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Descubrir Otra Frase y Foto Ahora</span>
                  </button>
                </div>

                <p className="text-[11px] text-center text-slate-500">
                  🔄 Esta tarjeta y tu Widget cambian automáticamente cada vez que abres la app o recibes una notificación (Impulso #{sessionCount}).
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB WIDGET CONFIGURATOR */}
        {activeTab === 'widget' && (
          <WidgetConfigurator
            profile={profile}
            widgetConfig={widgetConfig}
            onSaveWidgetConfig={setWidgetConfig}
            currentWidgetQuote={widgetQuote}
            onRefreshWidgetQuote={handleRefreshWidgetQuote}
          />
        )}

        {/* TAB 2: EXPLORE & CREATE CUSTOM QUOTE */}
        {activeTab === 'explore' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-white mb-1">Explorar Pilares</h2>
              <p className="text-xs text-slate-400 mb-4">
                Elige una categoría para ver sus mejores fotografías y reflexiones.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {CATEGORIES.map((cat) => {
                  const isPreferred = profile?.categories?.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setActiveTab('home');
                      }}
                      className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 text-left transition flex flex-col justify-between group"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${cat.badgeBg}`}
                        >
                          {cat.name.split(' ')[0]}
                        </span>
                        {isPreferred && (
                          <span className="text-[10px] text-amber-400 font-semibold">★ Tu Pilar</span>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-white group-hover:text-amber-300 transition">
                          {cat.name}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                          {cat.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Create Custom Motivational Quote */}
            <form
              onSubmit={handleCreateCustomQuote}
              className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3.5"
            >
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <PlusCircle className="w-4 h-4" />
                <span>Crear mi propia frase motivadora</span>
              </div>
              <p className="text-xs text-slate-400">
                Agrega tu mantra o meta personal. Se convertirá en un póster con foto y entrará en tus notificaciones.
              </p>

              <textarea
                rows={3}
                value={newQuoteText}
                onChange={(e) => setNewQuoteText(e.target.value)}
                placeholder="Escribe aquí tu frase o meta personal..."
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                required
              />

              <div className="grid grid-cols-2 gap-2.5">
                <input
                  type="text"
                  value={newQuoteAuthor}
                  onChange={(e) => setNewQuoteAuthor(e.target.value)}
                  placeholder="Autor (ej. Tu nombre)"
                  className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
                <select
                  value={newQuoteCategory}
                  onChange={(e) => setNewQuoteCategory(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-bold text-xs hover:brightness-105 transition"
              >
                Guardar y Crear Tarjeta Motivadora
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: FAVORITES */}
        {activeTab === 'favorites' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Tus Frases Guardadas</h2>
                <p className="text-xs text-slate-400">
                  Tu colección personal para los momentos en que más lo necesitas.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold">
                {favoriteQuotesList.length}
              </span>
            </div>

            {favoriteQuotesList.length === 0 ? (
              <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
                <Heart className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-sm font-semibold text-slate-300">
                  Aún no tienes frases favoritas
                </p>
                <p className="text-xs text-slate-500">
                  Toca el corazón en cualquier foto motivadora para guardarla aquí.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {favoriteQuotesList.map((item) => (
                  <QuoteCard
                    key={item.id}
                    item={item}
                    isFavorite={true}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: NOTIFICATIONS & PROFILE SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-5 animate-fade-in">
            {/* Test Instant Notification Card */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-slate-900 border border-amber-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                  <Bell className="w-4 h-4" />
                  <span>Simulador y Prueba de Notificación</span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-semibold">
                  Activo
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Envía ahora mismo una notificación real a tu dispositivo con una frase y foto elegida según las respuestas de tu cuestionario.
              </p>
              <button
                onClick={handleSendMotivationNow}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:brightness-105 transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar Notificación Motivadora Ahora</span>
              </button>
            </div>

            {/* Scheduled Hours */}
            <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3.5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Horarios Diarios Programados</span>
                </h3>
              </div>

              <div className="space-y-2.5">
                {(profile?.schedules || DEFAULT_SCHEDULES).map((sched) => (
                  <div
                    key={sched.id}
                    className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/90 flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-200">{sched.label}</div>
                      <input
                        type="time"
                        value={sched.time}
                        onChange={(e) => handleUpdateSchedule(sched.id, 'time', e.target.value)}
                        className="mt-1 bg-slate-900 border border-slate-700 rounded-lg px-2 py-0.5 text-xs text-amber-300 font-bold"
                      />
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sched.enabled}
                        onChange={(e) => handleUpdateSchedule(sched.id, 'enabled', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500" />
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Retake Questionnaire */}
            <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-white">Cuestionario Motivacional</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    ¿Cambió tu estado de ánimo o tus objetivos? Vuelve a realizar el test para recalibrar tus frases y fotos.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowQuiz(true)}
                className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 font-semibold text-xs flex items-center justify-center gap-2 transition"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Repetir Cuestionario de Personalización</span>
              </button>
            </div>

            {/* Notification History Log */}
            {notifHistory.length > 0 && (
              <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Últimas Notificaciones Recibidas</span>
                </h3>
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {notifHistory.map((nh, idx) => (
                    <div
                      key={`${nh.id}_${idx}`}
                      onClick={() => setActiveNotification(nh)}
                      className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center gap-3 cursor-pointer hover:border-amber-500/40 transition"
                    >
                      <img
                        src={nh.image}
                        alt={nh.author}
                        className="w-11 h-11 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-slate-200 line-clamp-1 font-medium">
                          “{nh.quote}”
                        </p>
                        <p className="text-[11px] text-amber-400 mt-0.5">
                          {nh.author} • Enviada a las {nh.sentAt}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Install as App / APK Info */}
            {deferredPrompt && (
              <div className="p-4 rounded-3xl bg-indigo-950/50 border border-indigo-500/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-6 h-6 text-indigo-400 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-white">Instalar en tu pantalla de inicio</div>
                    <div className="text-[11px] text-slate-400">Acceso directo sin navegador</div>
                  </div>
                </div>
                <button
                  onClick={async () => {
                    deferredPrompt.prompt();
                    await deferredPrompt.userChoice;
                    setDeferredPrompt(null);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-indigo-500 text-white text-xs font-bold"
                >
                  Instalar
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Bottom Mobile Navigation Bar */}
      <nav className="fixed bottom-0 inset-x-0 z-40 max-w-md mx-auto bg-slate-950/90 backdrop-blur-xl border-t border-slate-900 px-4 py-2 flex items-center justify-around">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl transition ${
            activeTab === 'home' ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[11px] font-semibold">Para Ti</span>
        </button>

        <button
          onClick={() => setActiveTab('explore')}
          className={`flex flex-col items-center gap-1 py-1.5 px-2.5 rounded-2xl transition ${
            activeTab === 'explore' ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Categorías</span>
        </button>

        <button
          onClick={() => setActiveTab('widget')}
          className={`flex flex-col items-center gap-1 py-1.5 px-2.5 rounded-2xl transition ${
            activeTab === 'widget' ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Widget</span>
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex flex-col items-center gap-1 py-1.5 px-2.5 rounded-2xl transition relative ${
            activeTab === 'favorites' ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Heart className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Favoritos</span>
          {favorites.length > 0 && (
            <span className="absolute top-1 right-2.5 w-2 h-2 rounded-full bg-rose-500" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center gap-1 py-1.5 px-2.5 rounded-2xl transition ${
            activeTab === 'settings' ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Sliders className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Alertas</span>
        </button>
      </nav>
    </div>
  );
}

