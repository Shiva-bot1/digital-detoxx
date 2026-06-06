import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUsage, getGoals } from '../services/api';

const NotificationManager = () => {
  const { user } = useAuth();

  // Request browser notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const fireNotification = (title, body, icon = '🌿') => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/logo192.png',
        badge: '/logo192.png',
      });
    }
  };

  // ── Daily reminder check ──────────────────────────────────
  useEffect(() => {
    if (!user) return;

    const checkDailyReminder = () => {
      const settings = JSON.parse(localStorage.getItem('notifySettings') || '{}');
      if (!settings.dailyReminder) return;

      const [rh, rm]  = (settings.reminderTime || '21:00').split(':').map(Number);
      const now       = new Date();
      const nowH      = now.getHours();
      const nowM      = now.getMinutes();
      const lastFired = localStorage.getItem('lastReminderDate');
      const today     = now.toDateString();

      if (nowH === rh && nowM === rm && lastFired !== today) {
        localStorage.setItem('lastReminderDate', today);
        fireNotification(
          'SvaZen Daily Reminder 🌿',
          'Have you logged your screen time today? Take a moment to check in.'
        );
      }
    };

    // Check every minute
    const interval = setInterval(checkDailyReminder, 60000);
    checkDailyReminder(); // run once immediately too
    return () => clearInterval(interval);
  }, [user]);

  // ── Goal check every 10 minutes ───────────────────────────
  useEffect(() => {
    if (!user) return;

    const checkGoals = async () => {
      const settings = JSON.parse(localStorage.getItem('notifySettings') || '{}');
      if (!settings.goalAlert) return;

      try {
        const [usageRes, goalsRes] = await Promise.all([getUsage(), getGoals()]);
        const usage = usageRes.data;
        const goals = goalsRes.data;
        const today = new Date().toDateString();

        goals.forEach(goal => {
          const todayTotal = usage
            .filter(s =>
              s.app_name === goal.app_name &&
              new Date(s.date).toDateString() === today
            )
            .reduce((sum, s) => sum + s.minutes_spent, 0);

          const alertKey = `alerted_${goal.app_name}_${today}`;
          const alreadyAlerted = localStorage.getItem(alertKey);

          if (todayTotal > goal.daily_limit_minutes && !alreadyAlerted) {
            localStorage.setItem(alertKey, 'true');
            fireNotification(
              `Goal Exceeded — ${goal.app_name} ⚠️`,
              `You've spent ${todayTotal} mins on ${goal.app_name} today. Your limit is ${goal.daily_limit_minutes} mins.`
            );
          }
        });
      } catch (err) {
        console.error('Goal check failed:', err);
      }
    };

    const interval = setInterval(checkGoals, 10 * 60 * 1000); // every 10 mins
    checkGoals();
    return () => clearInterval(interval);
  }, [user]);

  // ── Streak milestone check ────────────────────────────────
  useEffect(() => {
    if (!user) return;

    const checkStreak = async () => {
      const settings = JSON.parse(localStorage.getItem('notifySettings') || '{}');
      if (!settings.streakAlert) return;

      try {
        const [usageRes, goalsRes] = await Promise.all([getUsage(), getGoals()]);
        const usage = usageRes.data;
        const goals = goalsRes.data;

        let streak = 0;
        const today = new Date();
        for (let i = 1; i <= 30; i++) {
          const day = new Date();
          day.setDate(today.getDate() - i);
          const dayStr = day.toDateString();
          const dayUsage = usage.filter(s => new Date(s.date).toDateString() === dayStr);
          if (!dayUsage.length) break;
          const underLimit = goals.every(goal => {
            const total = dayUsage
              .filter(s => s.app_name === goal.app_name)
              .reduce((sum, s) => sum + s.minutes_spent, 0);
            return total <= goal.daily_limit_minutes;
          });
          if (underLimit) streak++;
          else break;
        }

        const milestones  = [3, 7, 14, 30];
        const lastAlerted = parseInt(localStorage.getItem('lastStreakAlert') || '0');

        milestones.forEach(m => {
          if (streak >= m && lastAlerted < m) {
            localStorage.setItem('lastStreakAlert', m.toString());
            fireNotification(
              `🏆 ${m}-Day Streak Unlocked!`,
              `You've maintained your digital detox for ${m} days. Ruki is proud of you! 🐾`
            );
          }
        });
      } catch (err) {
        console.error('Streak check failed:', err);
      }
    };

    checkStreak();
  }, [user]);

  return null; // renders nothing — runs silently
};

export default NotificationManager;