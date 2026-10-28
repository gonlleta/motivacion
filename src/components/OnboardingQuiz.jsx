import React, { useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, Check, Bell, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { QUIZ_QUESTIONS, DEFAULT_SCHEDULES } from '../data/motivationData';
import { requestNotificationPermission } from '../services/notificationService';

export default function OnboardingQuiz({ initialProfile, onComplete, onCancel }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [name, setName] = useState(initialProfile?.name || '');
  const [moodOption, setMoodOption] = useState(initialProfile?.moodOption || null);
  const [obstacleOption, setObstacleOption] = useState(initialProfile?.obstacleOption || null);
  const [selectedCategories, setSelectedCategories] = useState(
    initialProfile?.categories || ['metas', 'disciplina']
  );
  const [visualOption, setVisualOption] = useState(initialProfile?.visualOption || 'mountains');
  const [schedules, setSchedules] = useState(initialProfile?.schedules || DEFAULT_SCHEDULES);

  const currentQuestion = QUIZ_QUESTIONS[stepIndex];
  const progressPercent = Math.round(((stepIndex + 1) / QUIZ_QUESTIONS.length) * 100);

  const toggleCategory = (catId) => {
    setSelectedCategories((prev) => {
      if (prev.includes(catId)) {
        return prev.length > 1 ? prev.filter((id) => id !== catId) : prev;
      }
      return [...prev, catId];
    });
  };

  const updateSchedule = (id, field, value) => {
    setSchedules((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const canProceed = () => {
    if (stepIndex === 0) return Boolean(moodOption);
    if (stepIndex === 1) return Boolean(obstacleOption);
    if (stepIndex === 2) return selectedCategories.length > 0;
    if (stepIndex === 3) return Boolean(visualOption);
    return true;
  };

  const handleNext = async () => {
    if (stepIndex < QUIZ_QUESTIONS.length - 1) {
      // Auto-add boosted categories when moving past step 1 or 2
      if (stepIndex === 0 && moodOption) {
        const qOpt = QUIZ_QUESTIONS[0].options.find((o) => o.id === moodOption);
        if (qOpt?.boostCategories) {
          setSelectedCategories((prev) => Array.from(new Set([...prev, ...qOpt.boostCategories])));
        }
      }
      if (stepIndex === 1 && obstacleOption) {
        const qOpt = QUIZ_QUESTIONS[1].options.find((o) => o.id === obstacleOption);
        if (qOpt?.boostCategories) {
          setSelectedCategories((prev) => Array.from(new Set([...prev, ...qOpt.boostCategories])));
        }
      }
      setStepIndex((s) => s + 1);
    } else {
      // Final step: request permission, fire confetti, build profile
      await requestNotificationPermission();

      const moodObj = QUIZ_QUESTIONS[0].options.find((o) => o.id === moodOption);
      const visualObj = QUIZ_QUESTIONS[3].options.find((o) => o.id === visualOption);

      try {
        confetti({
          particleCount: 70,
          spread: 65,
          origin: { y: 0.6 }
        });
      } catch {
        // Ignore confetti errors
      }

      onComplete({
        name: name.trim() || 'Campeón/a',
        moodOption,
        obstacleOption,
        categories: selectedCategories,
        visualOption,
        visualStyle: visualObj?.visualTag || 'nature',
        tone: moodObj?.tone || 'inspirador',
        schedules,
        completedAt: new Date().toISOString()
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-5 max-w-md mx-auto relative overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed -top-28 -left-24 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl" />
      <div className="pointer-events-none fixed -bottom-28 -right-24 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl" />

      {/* Top Bar & Progress */}
      <div className="z-10 pt-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Personalización • Paso {stepIndex + 1} de {QUIZ_QUESTIONS.length}</span>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="text-xs text-slate-400 hover:text-slate-200 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800"
            >
              Cerrar
            </button>
          )}
        </div>

        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Question Content */}
      <div className="z-10 my-auto py-6 animate-fade-in" key={currentQuestion.id}>
        {stepIndex === 0 && (
          <div className="mb-5">
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
              ¿Cómo te llamas? (Opcional)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Gonza"
              className="w-full px-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-800 focus:border-amber-400 focus:outline-none text-slate-100 placeholder-slate-500 text-sm"
            />
          </div>
        )}

        <h1 className="text-2xl font-bold tracking-tight text-white mb-2 leading-snug">
          {currentQuestion.title}
        </h1>
        <p className="text-sm text-slate-400 mb-6">
          {currentQuestion.subtitle}
        </p>

        {/* Standard Single / Multi Choice Options */}
        {!currentQuestion.isScheduleStep && (
          <div className="space-y-3">
            {currentQuestion.options.map((opt) => {
              let isSelected = false;
              if (stepIndex === 0) isSelected = moodOption === opt.id;
              if (stepIndex === 1) isSelected = obstacleOption === opt.id;
              if (stepIndex === 2) isSelected = selectedCategories.includes(opt.id);
              if (stepIndex === 3) isSelected = visualOption === opt.id;

              const handleSelect = () => {
                if (stepIndex === 0) setMoodOption(opt.id);
                if (stepIndex === 1) setObstacleOption(opt.id);
                if (stepIndex === 2) toggleCategory(opt.id);
                if (stepIndex === 3) setVisualOption(opt.id);
              };

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={handleSelect}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/10 border-amber-400/80 shadow-lg shadow-amber-500/10'
                      : 'bg-slate-900/70 border-slate-800/90 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span className="text-2xl flex-shrink-0">{opt.emoji}</span>
                    <div>
                      <div className="font-semibold text-sm text-slate-100">
                        {opt.label}
                      </div>
                      {opt.description && (
                        <div className="text-xs text-slate-400 mt-0.5">
                          {opt.description}
                        </div>
                      )}
                    </div>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 border ${
                      isSelected
                        ? 'bg-amber-400 border-amber-400 text-slate-950'
                        : 'border-slate-700 bg-slate-950'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Step 5: Notification Schedule Configuration */}
        {currentQuestion.isScheduleStep && (
          <div className="space-y-3.5">
            {schedules.map((sched) => (
              <div
                key={sched.id}
                className={`p-4 rounded-2xl border transition-all ${
                  sched.enabled
                    ? 'bg-slate-900/90 border-amber-500/50'
                    : 'bg-slate-900/40 border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-white">{sched.label}</div>
                      <div className="text-xs text-slate-400">Frase + Foto personalizada</div>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sched.enabled}
                      onChange={(e) => updateSchedule(sched.id, 'enabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500" />
                  </label>
                </div>

                {sched.enabled && (
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-300">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      Horario programado:
                    </span>
                    <input
                      type="time"
                      value={sched.time}
                      onChange={(e) => updateSchedule(sched.id, 'time', e.target.value)}
                      className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-amber-300 font-semibold focus:outline-none focus:border-amber-400"
                    />
                  </div>
                )}
              </div>
            ))}

            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-200/90 leading-relaxed">
              💡 Al finalizar el cuestionario activaremos tu feed personalizado y podrás probar cómo llegan las notificaciones con foto y frase al instante.
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation Buttons */}
      <div className="z-10 flex items-center gap-3 pt-3 border-t border-slate-900">
        {stepIndex > 0 && (
          <button
            type="button"
            onClick={() => setStepIndex((s) => s - 1)}
            className="px-4 py-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 transition flex items-center gap-1.5 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Atrás
          </button>
        )}

        <button
          type="button"
          disabled={!canProceed()}
          onClick={handleNext}
          className={`flex-1 py-3.5 px-6 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition shadow-lg ${
            canProceed()
              ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 hover:brightness-105 shadow-amber-500/20'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <span>
            {stepIndex === QUIZ_QUESTIONS.length - 1
              ? 'Crear mi Plan Motivacional'
              : 'Continuar'}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

