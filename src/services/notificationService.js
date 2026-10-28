import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { MOTIVATIONAL_QUOTES, CATEGORIES } from '../data/motivationData';

const SEEN_STORAGE_KEY = 'impulso_seen_quotes_v1';

function getSeenIds() {
  try {
    const raw = localStorage.getItem(SEEN_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function markAsSeen(quoteId) {
  try {
    const seen = getSeenIds();
    const updated = [quoteId, ...seen.filter((id) => id !== quoteId)].slice(0, 15);
    localStorage.setItem(SEEN_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore storage errors
  }
}

/**
 * Ranks and dynamically shuffles quotes according to the user's quiz profile
 * so every app open shows a different order and fresh quotes.
 */
export function getPersonalizedQuotes(profile, categoryFilter = 'all', shuffleSeed = Date.now()) {
  const seenIds = new Set(getSeenIds());
  const preferredCategories = new Set(profile?.categories || []);
  const visualStyle = profile?.visualStyle || 'nature';
  const preferredTone = profile?.tone || 'inspirador';

  const scored = MOTIVATIONAL_QUOTES.filter((item) => {
    if (categoryFilter && categoryFilter !== 'all') {
      return item.category === categoryFilter;
    }
    return true;
  }).map((item) => {
    let score = Math.random() * 4; // random jitter so order always changes on every open
    if (preferredCategories.has(item.category)) score += 5;
    if (item.visualTag === visualStyle) score += 2.5;
    if (item.tone === preferredTone) score += 2;
    if (!seenIds.has(item.id)) score += 6; // strong boost for unseen quotes
    return { ...item, matchScore: score, _seed: shuffleSeed };
  });

  return scored.sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Picks a fresh unseen quote every time the app opens or a notification arrives
 */
export function pickNotificationQuote(profile, excludeId = null) {
  const ranked = getPersonalizedQuotes(profile, 'all', Date.now()).filter(
    (q) => q.id !== excludeId
  );
  const chosen = ranked[0] || MOTIVATIONAL_QUOTES[0];
  markAsSeen(chosen.id);
  return chosen;
}

/**
 * Requests notification permissions on both Capacitor (Android APK) and Web Browser
 */
export async function requestNotificationPermission() {
  try {
    if (Capacitor.isNativePlatform()) {
      const result = await LocalNotifications.requestPermissions();
      return result.display === 'granted';
    } else if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
  } catch (err) {
    console.warn('Error requesting notification permission:', err);
  }
  return false;
}

/**
 * Fires an immediate notification (Native Android APK or Web Browser Notification)
 */
export async function triggerInstantNotification(quoteObj) {
  const categoryName = CATEGORIES.find((c) => c.id === quoteObj.category)?.name || 'Motivación';
  const title = `✨ ${categoryName} — Nuevo Impulso`;
  const body = `“${quoteObj.quote}” — ${quoteObj.author}`;

  try {
    if (Capacitor.isNativePlatform()) {
      const hasPerm = await requestNotificationPermission();
      if (hasPerm) {
        await LocalNotifications.schedule({
          notifications: [
            {
              id: Math.floor(Date.now() % 100000),
              title,
              body,
              largeBody: `${body}\n\n💡 ${quoteObj.reflection}`,
              summaryText: 'Impulso Motivación',
              schedule: { at: new Date(Date.now() + 800) },
              extra: { quoteId: quoteObj.id }
            }
          ]
        });
        return { sentNative: true };
      }
    } else if ('Notification' in window) {
      let granted = Notification.permission === 'granted';
      if (Notification.permission === 'default') {
        granted = await requestNotificationPermission();
      }
      if (granted) {
        if ('serviceWorker' in navigator) {
          const reg = await navigator.serviceWorker.getRegistration();
          if (reg && reg.showNotification) {
            await reg.showNotification(title, {
              body: `${body}\n💡 ${quoteObj.reflection}`,
              icon: '/icon.svg',
              badge: '/icon.svg',
              image: quoteObj.image,
              vibrate: [200, 100, 200],
              data: { quoteId: quoteObj.id }
            });
            return { sentWeb: true };
          }
        }
        new Notification(title, {
          body: `${body}\n💡 ${quoteObj.reflection}`,
          icon: '/icon.svg'
        });
        return { sentWeb: true };
      }
    }
  } catch (err) {
    console.warn('Notification fallback to in-app banner:', err);
  }
  return { sentInAppOnly: true };
}

/**
 * Schedules daily recurring notifications on Android APK (Capacitor)
 */
export async function syncScheduledNotifications(schedules, profile) {
  if (!schedules || !Array.isArray(schedules)) return;

  try {
    if (Capacitor.isNativePlatform()) {
      const hasPerm = await requestNotificationPermission();
      if (!hasPerm) return;

      const pending = await LocalNotifications.getPending();
      if (pending.notifications.length > 0) {
        await LocalNotifications.cancel({ notifications: pending.notifications });
      }

      const enabledSchedules = schedules.filter((s) => s.enabled);
      const notificationsToSchedule = enabledSchedules.map((sched, idx) => {
        const [hourStr, minuteStr] = sched.time.split(':');
        const hour = parseInt(hourStr, 10);
        const minute = parseInt(minuteStr, 10);
        const quote = pickNotificationQuote(profile);
        const categoryName = CATEGORIES.find((c) => c.id === quote.category)?.name || 'Impulso';

        return {
          id: 1000 + idx,
          title: `🌟 ${sched.label} • ${categoryName}`,
          body: `“${quote.quote}” — ${quote.author}`,
          largeBody: `“${quote.quote}”\n\n💡 ${quote.reflection}`,
          summaryText: 'Impulso Motivación',
          schedule: {
            on: { hour, minute },
            repeats: true,
            allowWhileIdle: true
          },
          extra: { quoteId: quote.id }
        };
      });

      if (notificationsToSchedule.length > 0) {
        await LocalNotifications.schedule({ notifications: notificationsToSchedule });
      }
    }
  } catch (err) {
    console.warn('Could not sync native notifications:', err);
  }
}
