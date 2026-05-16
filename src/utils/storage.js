import AsyncStorage from '@react-native-async-storage/async-storage';

const DOSES_KEY = 'densimab_doses';
const PROFILE_KEY = 'densimab_profile';

export const saveDose = async (dose) => {
  try {
    const existing = await getDoses();
    const updated = [...existing, dose];
    await AsyncStorage.setItem(DOSES_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
};

export const getDoses = async () => {
  try {
    const data = await AsyncStorage.getItem(DOSES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const deleteDose = async (doseId) => {
  try {
    const existing = await getDoses();
    const updated = existing.filter((d) => d.id !== doseId);
    await AsyncStorage.setItem(DOSES_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
};

export const saveProfile = async (profile) => {
  try {
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // ignore
  }
};

export const getProfile = async () => {
  try {
    const data = await AsyncStorage.getItem(PROFILE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};
