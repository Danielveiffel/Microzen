import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getProfile, getDoses } from '../utils/storage';
import { getDaysDiff, formatDate } from '../utils/dateUtils';
import { DensimabLogo } from '../components/DensimabLogo';

const TIPS = [
  { icon: '🥛', text: 'Consume 1,000–1,200 mg de calcio al día: lácteos, brócoli y sardinas son tus mejores aliados.' },
  { icon: '☀️', text: 'Exponte al sol 15–20 minutos diarios. La vitamina D es esencial para absorber el calcio.' },
  { icon: '🚶', text: 'Camina 30 minutos diarios. Los ejercicios de carga estimulan la formación de hueso nuevo.' },
  { icon: '🚭', text: 'Evita el tabaco y el alcohol en exceso; ambos aceleran la pérdida de densidad ósea.' },
  { icon: '⚖️', text: 'Mantén un peso saludable. El bajo peso es un factor de riesgo importante para la osteoporosis.' },
  { icon: '💊', text: 'No olvides tu dosis de Densimab. La constancia en el tratamiento reduce el riesgo de fractura hasta un 68%.' },
  { icon: '🧘', text: 'El Tai Chi mejora el equilibrio y reduce el riesgo de caídas. ¡Sólo 20 min al día marcan la diferencia!' },
];

const getDoseColor = (days) => {
  if (days === null) return '#999';
  if (days < 0) return '#D32F2F';
  if (days <= 15) return '#F57C00';
  if (days <= 30) return '#FBC02D';
  return '#388E3C';
};

const getDoseMessage = (days) => {
  if (days === null) return 'Registra tu primera dosis';
  if (days < 0) return `¡Dosis vencida hace ${Math.abs(days)} días!`;
  if (days === 0) return '¡Tu dosis es hoy!';
  if (days === 1) return '¡Tu dosis es mañana!';
  if (days <= 30) return `Tu dosis es en ${days} días ⚠️`;
  return `Próxima dosis en ${days} días`;
};

export default function HomeScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [nextDose, setNextDose] = useState(null);
  const [daysLeft, setDaysLeft] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [tipIndex] = useState(Math.floor(Math.random() * TIPS.length));

  const loadData = useCallback(async () => {
    const [p, doses] = await Promise.all([getProfile(), getDoses()]);
    setProfile(p);
    if (doses.length > 0) {
      const last = doses[doses.length - 1];
      const next = new Date(last.nextDose);
      setNextDose(next);
      setDaysLeft(getDaysDiff(next));
    }
  }, []);

  useFocusEffect(useCallback(() => { loadData(); }, [loadData]));

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const color = getDoseColor(daysLeft);
  const tip = TIPS[tipIndex];
  const cycleProgress = daysLeft !== null && daysLeft >= 0
    ? Math.min(100, ((182 - daysLeft) / 182) * 100)
    : null;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <DensimabLogo size="large" light />
        <View style={styles.greetingRow}>
          <Text style={styles.greeting}>
            Hola, {profile?.name?.split(' ')[0] || 'Paciente'} 👋
          </Text>
          <Text style={styles.subGreeting}>Tu salud ósea en un solo lugar</Text>
        </View>
      </View>

      {/* Next dose card */}
      <View style={[styles.doseCard, { borderLeftColor: color }]}>
        <Text style={styles.doseLabel}>PRÓXIMA DOSIS DE DENSIMAB</Text>
        {nextDose ? (
          <>
            <Text style={[styles.doseDays, { color }]}>{getDoseMessage(daysLeft)}</Text>
            <Text style={styles.doseDate}>📅 {formatDate(nextDose)}</Text>
          </>
        ) : (
          <>
            <Text style={styles.doseEmpty}>No tienes dosis registradas aún</Text>
            <TouchableOpacity
              style={styles.registerBtn}
              onPress={() => navigation.navigate('Dosis')}
            >
              <Text style={styles.registerBtnText}>Registrar primera dosis →</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Cycle progress bar */}
      {cycleProgress !== null && (
        <View style={styles.progressContainer}>
          <Text style={styles.progressLabel}>Progreso del ciclo (6 meses)</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${cycleProgress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {182 - daysLeft} de 182 días completados
          </Text>
        </View>
      )}

      {/* Tip of the day */}
      <View style={styles.tipCard}>
        <Text style={styles.tipTitle}>Consejo del día</Text>
        <Text style={styles.tipIcon}>{tip.icon}</Text>
        <Text style={styles.tipText}>{tip.text}</Text>
      </View>

      {/* Quick actions */}
      <Text style={styles.sectionTitle}>Acceso rápido</Text>
      <View style={styles.quickActions}>
        {[
          { screen: 'Dosis', icon: '💉', label: 'Mis Dosis' },
          { screen: 'Dieta', icon: '🥗', label: 'Nutrición' },
          { screen: 'Ejercicios', icon: '🏃', label: 'Ejercicios' },
          { screen: 'Perfil', icon: '👤', label: 'Mi Perfil' },
        ].map(({ screen, icon, label }) => (
          <TouchableOpacity
            key={screen}
            style={styles.quickAction}
            onPress={() => navigation.navigate(screen)}
          >
            <Text style={styles.quickActionIcon}>{icon}</Text>
            <Text style={styles.quickActionLabel}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* About Densimab */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>¿Qué es Densimab?</Text>
        <Text style={styles.infoText}>
          Densimab (Denosumab) es un medicamento biológico que inhibe la resorción ósea,
          reduce la pérdida de masa ósea y disminuye significativamente el riesgo de fracturas
          en pacientes con osteoporosis. Se aplica como inyección subcutánea cada 6 meses.
        </Text>
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  header: {
    backgroundColor: '#1A237E',
    padding: 20,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 14,
  },
  greetingRow: { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)', paddingTop: 12 },
  greeting: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  subGreeting: { fontSize: 13, color: '#90CAF9', marginTop: 3 },
  doseCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  doseLabel: { fontSize: 11, fontWeight: '700', color: '#888', letterSpacing: 1 },
  doseDays: { fontSize: 22, fontWeight: 'bold', marginTop: 8 },
  doseDate: { fontSize: 16, color: '#555', marginTop: 6 },
  doseEmpty: { fontSize: 15, color: '#999', marginTop: 8 },
  registerBtn: {
    backgroundColor: '#1565C0',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    alignItems: 'center',
  },
  registerBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  progressContainer: { marginHorizontal: 16, marginBottom: 16 },
  progressLabel: { fontSize: 13, color: '#666', marginBottom: 6 },
  progressBar: {
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: '#1565C0', borderRadius: 5 },
  progressText: { fontSize: 12, color: '#888', marginTop: 4 },
  tipCard: {
    backgroundColor: '#E3F2FD',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  tipTitle: { fontSize: 12, fontWeight: '700', color: '#1565C0', letterSpacing: 1 },
  tipIcon: { fontSize: 38, marginVertical: 12 },
  tipText: { fontSize: 15, color: '#333', textAlign: 'center', lineHeight: 23 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  quickAction: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '45%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  quickActionIcon: { fontSize: 30, marginBottom: 8 },
  quickActionLabel: { fontSize: 13, fontWeight: '600', color: '#333' },
  infoCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
  },
  infoTitle: { fontSize: 16, fontWeight: 'bold', color: '#1565C0', marginBottom: 10 },
  infoText: { fontSize: 14, color: '#555', lineHeight: 22 },
});
