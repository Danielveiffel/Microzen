import * as Notifications from 'expo-notifications';
import { subtractDays } from './dateUtils';

export const scheduleReminders = async (nextDoseDate, patientName) => {
  await Notifications.cancelAllScheduledNotificationsAsync();

  const name = patientName || 'Paciente';
  const scheduledIds = [];
  const reminderDays = [30, 15, 7, 3, 1];

  for (const days of reminderDays) {
    const reminderDate = subtractDays(nextDoseDate, days);
    reminderDate.setHours(9, 0, 0, 0);

    if (reminderDate > new Date()) {
      try {
        const id = await Notifications.scheduleNotificationAsync({
          content: {
            title: '💉 Recordatorio Densimab',
            body:
              days === 1
                ? `${name}, mañana es tu dosis de Densimab. ¡No olvides tu cita!`
                : `${name}, tu próxima dosis de Densimab es en ${days} días.`,
            sound: true,
            data: { type: 'dose_reminder', daysLeft: days },
          },
          trigger: { date: reminderDate, channelId: 'densimab' },
        });
        scheduledIds.push(id);
      } catch {
        // continue scheduling remaining reminders
      }
    }
  }

  // Day-of reminder at 8 AM
  const doseDay = new Date(nextDoseDate);
  doseDay.setHours(8, 0, 0, 0);
  if (doseDay > new Date()) {
    try {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: '💉 ¡Hoy es tu dosis de Densimab!',
          body: `${name}, hoy debes aplicarte tu dosis. Comunícate con tu médico si tienes dudas.`,
          sound: true,
          data: { type: 'dose_day' },
        },
        trigger: { date: doseDay, channelId: 'densimab' },
      });
      scheduledIds.push(id);
    } catch {
      // ignore
    }
  }

  return scheduledIds;
};
