import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

const CATEGORIES = [
  {
    id: 'weight',
    title: 'Ejercicios de Carga de Peso',
    icon: '🚶',
    color: '#E3F2FD',
    border: '#1565C0',
    description:
      'Obligan al cuerpo a trabajar contra la gravedad, estimulando la formación de hueso nuevo. Son los más recomendados para la osteoporosis.',
    exercises: [
      {
        name: 'Caminata diaria',
        duration: '30–45 min',
        freq: '5 días/semana',
        level: '🟢 Fácil',
        detail:
          'El ejercicio más recomendado. Camina a paso firme en superficies planas. Usa calzado con buen soporte y suela antiderrapante. Puedes ir aumentando el tiempo gradualmente.',
      },
      {
        name: 'Subir y bajar escaleras',
        duration: '10–15 min',
        freq: '3–4 días/semana',
        level: '🟡 Moderado',
        detail:
          'Sube y baja a tu ritmo, siempre con el pasamanos. Es un ejercicio excelente para cadera, rodillas y columna vertebral.',
      },
      {
        name: 'Baile suave (merengue, danzón)',
        duration: '30 min',
        freq: '3 días/semana',
        level: '🟢 Fácil',
        detail:
          'Divertido y muy efectivo. El baile mejora el equilibrio, la coordinación y la densidad ósea al mismo tiempo. ¡Lo mejor es bailar en compañía!',
      },
      {
        name: 'Tai Chi',
        duration: '20–30 min',
        freq: '3–5 días/semana',
        level: '🟢 Fácil',
        detail:
          'Reduce el riesgo de caídas hasta en un 47%. Mejora el equilibrio, la flexibilidad y la fuerza muscular. Ideal para adultos mayores. Busca clases presenciales o videos en YouTube.',
      },
    ],
  },
  {
    id: 'strength',
    title: 'Ejercicios de Fuerza',
    icon: '💪',
    color: '#E8F5E9',
    border: '#2E7D32',
    description:
      'El entrenamiento de resistencia estimula directamente la remodelación ósea y fortalece los músculos que protegen los huesos de fracturas.',
    exercises: [
      {
        name: 'Sentadillas con apoyo en silla',
        duration: '3 series × 10 repeticiones',
        freq: '3 días/semana',
        level: '🟡 Moderado',
        detail:
          'Párate frente a una silla resistente con los pies separados al ancho de los hombros. Baja lentamente hasta casi sentarte (3 segundos), mantén 1 segundo y sube lento. La silla es solo de seguridad.',
      },
      {
        name: 'Elevación de talones (pantorrillas)',
        duration: '3 series × 15 repeticiones',
        freq: '4 días/semana',
        level: '🟢 Fácil',
        detail:
          'Párate con apoyo en respaldo de silla o pared. Sube en puntas de pie, mantén 2 segundos y baja lentamente. Fortalece la tibia, el peroné y los músculos de la pierna.',
      },
      {
        name: 'Bandas de resistencia – bíceps y hombros',
        duration: '3 series × 12 repeticiones',
        freq: '3 días/semana',
        level: '🟡 Moderado',
        detail:
          'Usa una banda elástica liviana (verde o amarilla). Curl de bíceps con los codos pegados al cuerpo. Press de hombro hacia arriba. Aumenta la resistencia gradualmente cada 2–3 semanas.',
      },
      {
        name: 'Puente de cadera',
        duration: '3 series × 10 repeticiones',
        freq: '3 días/semana',
        level: '🟡 Moderado',
        detail:
          'Acuéstate boca arriba con las rodillas dobladas y los pies planos en el suelo. Eleva la cadera hasta formar una línea recta con los hombros, mantén 3 segundos y baja lento. Fortalece cadera, glúteos y columna baja.',
      },
      {
        name: 'Pared sentada (wall sit)',
        duration: '3 series × 20–30 seg',
        freq: '3 días/semana',
        level: '🟡 Moderado',
        detail:
          'Recárgate en la pared y deslízate hasta que los muslos queden paralelos al suelo (como sentado en silla invisible). Mantén la posición. Excelente para fémur y cadera.',
      },
    ],
  },
  {
    id: 'balance',
    title: 'Equilibrio y Coordinación',
    icon: '🧘',
    color: '#FFF9C4',
    border: '#F9A825',
    description:
      'Prevenir caídas es tan importante como fortalecer los huesos. Una caída puede causar una fractura de cadera, que es la complicación más grave de la osteoporosis.',
    exercises: [
      {
        name: 'Pararse en un pie',
        duration: '30 segundos cada pie',
        freq: 'Diario',
        level: '🟡 Moderado',
        detail:
          'Párate cerca de una pared por seguridad. Levanta un pie y mantén el equilibrio. Progresión: ojos abiertos → ojos cerrados → sobre una almohada doblada. Practica cada vez que esperes algo (hervir agua, cepillarte los dientes).',
      },
      {
        name: 'Caminata talón-punta',
        duration: '3 metros ida y vuelta, 5 veces',
        freq: 'Diario',
        level: '🟡 Moderado',
        detail:
          'Camina en línea recta colocando el talón de un pie frente a la punta del otro, como si caminases por una cuerda floja. Mejora la coordinación y el equilibrio dinámico.',
      },
      {
        name: 'Yoga adaptado para osteoporosis',
        duration: '30–45 min',
        freq: '2–3 días/semana',
        level: '🟢 Fácil',
        detail:
          'Busca clases de yoga para adultos mayores o "yoga con silla". Evita posturas con flexión intensa de columna (forward fold profundo) o torsiones bruscas. Posturas recomendadas: Guerrero I, árbol, montaña.',
      },
      {
        name: 'Ejercicios de equilibrio en silla',
        duration: '15 min',
        freq: 'Diario',
        level: '🟢 Fácil',
        detail:
          'Sentado en el borde de la silla, alterna levantando los pies del suelo. Luego párate y siéntate sin usar las manos (sit-to-stand). Ideal para quien está comenzando o tiene limitaciones de movilidad.',
      },
    ],
  },
  {
    id: 'avoid',
    title: 'Ejercicios a Evitar',
    icon: '🚫',
    color: '#FFEBEE',
    border: '#C62828',
    description:
      'Algunos movimientos aumentan significativamente el riesgo de fractura vertebral o de cadera. Habla siempre con tu médico antes de iniciar cualquier rutina.',
    exercises: [
      {
        name: 'Abdominales clásicos (crunches)',
        duration: '—',
        freq: '—',
        level: '🔴 Evitar',
        detail:
          'La flexión brusca de la columna puede causar fracturas vertebrales por compresión, especialmente en vértebras torácicas. Reemplaza con puente de cadera o ejercicios de core con columna neutra.',
      },
      {
        name: 'Ejercicios de alto impacto',
        duration: '—',
        freq: '—',
        level: '🔴 Evitar',
        detail:
          'Correr en superficies duras, saltar, aeróbicos de alto impacto (Zumba intensa, step). Sustituye por caminata, natación o aeróbicos en el agua.',
      },
      {
        name: 'Torsiones bruscas de columna',
        duration: '—',
        freq: '—',
        level: '🔴 Evitar',
        detail:
          'Movimientos de golf, remo con mala técnica, giros rápidos del tronco. El riesgo de fractura vertebral es real. Realiza las torsiones de forma controlada y con rango de movimiento limitado.',
      },
      {
        name: 'Levantamiento de pesos excesivos',
        duration: '—',
        freq: '—',
        level: '🔴 Evitar',
        detail:
          'Nunca levantes pesos que no puedas controlar con buena postura. El peso libre pesado sin técnica adecuada es de alto riesgo. Usa pesas ligeras (1–3 kg) o bandas elásticas.',
      },
      {
        name: 'Inclinación excesiva hacia adelante',
        duration: '—',
        freq: '—',
        level: '🔴 Evitar',
        detail:
          'Agacharse a recoger objetos con la espalda curva, hacer jardinería con inclinación profunda sin apoyo. Aprende a flexionarte desde las caderas manteniendo la espalda recta (bisagra de cadera).',
      },
    ],
  },
];

const WEEKLY_PLAN = [
  { day: 'Lunes', color: '#1565C0', activities: ['Caminata 30 min', 'Sentadillas con silla (3×10)', 'Pararse en un pie (2 min)'] },
  { day: 'Martes', color: '#42A5F5', activities: ['Tai Chi 20 min', 'Elevación de talones (3×15)', 'Estiramientos suaves 10 min'] },
  { day: 'Miércoles', color: '#1565C0', activities: ['Caminata 35 min', 'Bandas de resistencia', 'Puente de cadera (3×10)'] },
  { day: 'Jueves', color: '#78909C', activities: ['Descanso activo', 'Caminata ligera 15 min', 'Yoga adaptado 30 min'] },
  { day: 'Viernes', color: '#1565C0', activities: ['Caminata 30 min', 'Pared sentada (3×25 seg)', 'Caminata talón-punta'] },
  { day: 'Sábado', color: '#42A5F5', activities: ['Baile suave 30 min', 'Elevación de talones', 'Ejercicios de equilibrio'] },
  { day: 'Domingo', color: '#9E9E9E', activities: ['Descanso y recuperación', 'Estiramientos suaves', 'Respiración profunda'] },
];

export default function ExerciseScreen() {
  const [expanded, setExpanded] = useState(null);
  const [expandedEx, setExpandedEx] = useState(null);
  const [activeTab, setActiveTab] = useState('exercises');

  const toggle = (id) => setExpanded(expanded === id ? null : id);
  const toggleEx = (key) => setExpandedEx(expandedEx === key ? null : key);

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {['exercises', 'plan'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab === 'exercises' ? 'Ejercicios' : 'Plan Semanal'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView>
        {activeTab === 'exercises' ? (
          <>
            <View style={styles.introCard}>
              <Text style={styles.introTitle}>Muévete para fortalecer tus huesos</Text>
              <Text style={styles.introText}>
                El ejercicio regular, junto con Densimab y una buena nutrición, forma el
                trípode del tratamiento de la osteoporosis. Empieza despacio y aumenta
                gradualmente. Siempre consulta a tu médico antes de iniciar.
              </Text>
            </View>

            {CATEGORIES.map((cat) => (
              <View key={cat.id} style={[styles.section, { borderLeftColor: cat.border }]}>
                <TouchableOpacity
                  style={[styles.sectionHeader, { backgroundColor: cat.color }]}
                  onPress={() => toggle(cat.id)}
                >
                  <Text style={styles.sectionIcon}>{cat.icon}</Text>
                  <Text style={styles.sectionTitle}>{cat.title}</Text>
                  <Text style={styles.chevron}>{expanded === cat.id ? '▲' : '▼'}</Text>
                </TouchableOpacity>

                {expanded === cat.id && (
                  <View style={styles.sectionBody}>
                    <Text style={styles.sectionDesc}>{cat.description}</Text>
                    {cat.exercises.map((ex, i) => {
                      const key = `${cat.id}_${i}`;
                      return (
                        <TouchableOpacity
                          key={i}
                          style={styles.exItem}
                          onPress={() => toggleEx(key)}
                        >
                          <View style={styles.exHeader}>
                            <Text style={styles.exName}>{ex.name}</Text>
                            <Text style={styles.exLevel}>{ex.level}</Text>
                          </View>
                          {ex.freq !== '—' && (
                            <View style={styles.exMeta}>
                              <Text style={styles.exMetaText}>⏱ {ex.duration}</Text>
                              <Text style={styles.exMetaText}>📅 {ex.freq}</Text>
                            </View>
                          )}
                          {expandedEx === key && (
                            <Text style={styles.exDetail}>{ex.detail}</Text>
                          )}
                          <Text style={styles.exTap}>
                            {expandedEx === key ? '▲ Menos detalle' : '▼ Ver detalle'}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            ))}
          </>
        ) : (
          <>
            <View style={[styles.introCard, { backgroundColor: '#E8F5E9' }]}>
              <Text style={[styles.introTitle, { color: '#2E7D32' }]}>Plan semanal sugerido</Text>
              <Text style={styles.introText}>
                Este plan combina los tres tipos de ejercicio recomendados: carga de peso,
                fuerza y equilibrio. Ajústalo según tu condición física y las indicaciones
                de tu médico o fisioterapeuta.
              </Text>
            </View>

            {WEEKLY_PLAN.map((day, i) => (
              <View key={i} style={styles.dayCard}>
                <View style={[styles.dayBadge, { backgroundColor: day.color }]}>
                  <Text style={styles.dayText}>{day.day}</Text>
                </View>
                <View style={styles.dayActivities}>
                  {day.activities.map((act, j) => (
                    <Text key={j} style={styles.activity}>• {act}</Text>
                  ))}
                </View>
              </View>
            ))}

            <View style={styles.safetyCard}>
              <Text style={styles.safetyTitle}>⚠️ Reglas de seguridad</Text>
              {[
                'Calienta 5 min antes y enfría 5 min después de cada sesión',
                'Usa calzado antiderrapante con buen soporte de tobillo',
                'Si sientes dolor inusual, para inmediatamente y consulta a tu médico',
                'Mantén siempre una superficie de apoyo cerca (silla o pared)',
                'Hidratate: bebe agua antes, durante y después del ejercicio',
                'No hagas ejercicio si tienes fiebre o te sientes mal',
                'Progresa gradualmente: aumenta la intensidad semana a semana',
              ].map((rule, i) => (
                <Text key={i} style={styles.safetyItem}>• {rule}</Text>
              ))}
            </View>
          </>
        )}
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  activeTab: { borderBottomWidth: 3, borderBottomColor: '#1565C0' },
  tabText: { fontSize: 14, color: '#888', fontWeight: '600' },
  activeTabText: { color: '#1565C0' },
  introCard: {
    backgroundColor: '#E3F2FD',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  introTitle: { fontSize: 16, fontWeight: 'bold', color: '#1565C0', marginBottom: 8 },
  introText: { fontSize: 14, color: '#444', lineHeight: 21 },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 10,
    borderLeftWidth: 4,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  sectionIcon: { fontSize: 22, marginRight: 10 },
  sectionTitle: { flex: 1, fontSize: 15, fontWeight: '700', color: '#333' },
  chevron: { fontSize: 12, color: '#888' },
  sectionBody: { padding: 16, paddingTop: 8 },
  sectionDesc: { fontSize: 14, color: '#555', lineHeight: 21, marginBottom: 14 },
  exItem: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  exHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  exName: { flex: 1, fontSize: 14, fontWeight: '700', color: '#333' },
  exLevel: { fontSize: 11, marginLeft: 8 },
  exMeta: { flexDirection: 'row', marginTop: 6, gap: 12 },
  exMetaText: { fontSize: 12, color: '#666' },
  exDetail: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 8,
  },
  exTap: { fontSize: 11, color: '#1565C0', marginTop: 8, textAlign: 'right' },
  dayCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    elevation: 1,
  },
  dayBadge: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 6,
    width: 76,
    alignItems: 'center',
    marginRight: 12,
  },
  dayText: { color: '#fff', fontWeight: 'bold', fontSize: 13, textAlign: 'center' },
  dayActivities: { flex: 1 },
  activity: { fontSize: 13, color: '#444', marginBottom: 4, lineHeight: 19 },
  safetyCard: {
    backgroundColor: '#FFF9C4',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F9A825',
  },
  safetyTitle: { fontSize: 15, fontWeight: 'bold', color: '#E65100', marginBottom: 10 },
  safetyItem: { fontSize: 13, color: '#555', marginBottom: 6, lineHeight: 19 },
});
