export const addMonths = (date, months) => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

export const subtractDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
};

// Returns positive if targetDate is in the future, negative if in the past
export const getDaysDiff = (targetDate, fromDate = new Date()) => {
  const target = new Date(targetDate);
  const from = new Date(fromDate);
  target.setHours(0, 0, 0, 0);
  from.setHours(0, 0, 0, 0);
  return Math.ceil((target - from) / (1000 * 60 * 60 * 24));
};

export const formatDate = (date) =>
  new Date(date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

export const formatDateShort = (date) =>
  new Date(date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
