import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

const SECTIONS = [
  {
    id: 'calcium',
    title: 'Alimentos ricos en Calcio',
    icon: '🥛',
    color: '#E3F2FD',
    border: '#1565C0',
    tip: 'Objetivo: 1,000–1,200 mg/día. Los lácteos son la fuente más biodisponible.',
    items: [
      { name: 'Leche descremada', detail: '300 mg por taza (240 ml)' },
      { name: 'Yogur natural', detail: '300–400 mg por porción (150 g)' },
      { name: 'Queso Oaxaca o manchego', detail: '200 mg por porción (30 g)' },
      { name: 'Sardinas con hueso', detail: '325 mg por lata (85 g)' },
      { name: 'Salmón en conserva con hueso', detail: '180 mg por 85 g' },
      { name: 'Brócoli cocido', detail: '180 mg por taza' },
      { name: 'Espinaca cocida', detail: '245 mg por taza' },
      { name: 'Almendras', detail: '75 mg por 28 g (23 almendras)' },
      { name: 'Tofu firme (con calcio)', detail: '200 mg por ½ taza' },
      { name: 'Frijoles blancos cocidos', detail: '130 mg por taza' },
      { name: 'Tortillas de maíz nixtamalizadas', detail: '120 mg por 2 tortillas' },
    ],
  },
  {
    id: 'vitD',
    title: 'Fuentes de Vitamina D',
    icon: '☀️',
    color: '#FFF9C4',
    border: '#F9A825',
    tip: 'La exposición solar de 15–20 min en cara y brazos aporta vitamina D de forma gratuita.',
    items: [
      { name: 'Salmón silvestre', detail: '600–1,000 UI por 85 g' },
      { name: 'Atún en agua', detail: '150 UI por 85 g' },
      { name: 'Sardinas en aceite', detail: '300 UI por lata' },
      { name: 'Huevo entero', detail: '40 UI por huevo (en la yema)' },
      { name: 'Champiñones expuestos al sol', detail: '400 UI por ½ taza' },
      { name: 'Leche y jugos fortificados', detail: '100 UI por taza' },
      { name: 'Hígado de res', detail: '50 UI por 85 g' },
    ],
  },
  {
    id: 'nutrients',
    title: 'Otros nutrientes clave',
    icon: '💊',
    color: '#E8F5E9',
    border: '#2E7D32',
    tip: 'El magnesio activa la vitamina D. Sin él, el calcio no se absorbe correctamente.',
    items: [
      { name: 'Magnesio', detail: 'Nueces, semillas de calabaza, frijoles negros, espinaca, aguacate' },
      { name: 'Vitamina K2', detail: 'Natto (soya fermentada), queso gouda, huevo entero' },
      { name: 'Proteína', detail: '1 g/kg de peso corporal: pollo, pescado, huevo, legumbres' },
      { name: 'Zinc', detail: 'Carnes magras, mariscos, semillas de calabaza, lentejas' },
      { name: 'Vitamina C', detail: 'Kiwi, pimientos, fresas, brócoli – forma colágeno óseo' },
      { name: 'Boro', detail: 'Manzana, ciruela, aguacate – mejora metabolismo del calcio' },
      { name: 'Omega-3', detail: 'Salmón, atún, semillas de chía – reduce inflamación ósea' },
    ],
  },
  {
    id: 'avoid',
    title: 'Alimentos a limitar',
    icon: '⚠️',
    color: '#FFEBEE',
    border: '#C62828',
    tip: 'Moderar, no eliminar. Una copa ocasional de vino o una taza de café está bien.',
    items: [
      { name: 'Alcohol', detail: 'Más de 2 bebidas/día inhibe la formación ósea y la absorción de calcio' },
      { name: 'Exceso de sal (sodio)', detail: 'Más de 2,300 mg/día aumenta la pérdida de calcio por la orina' },
      { name: 'Cafeína en exceso', detail: 'Más de 4 tazas de café/día reduce la absorción de calcio' },
      { name: 'Refrescos oscuros', detail: 'El ácido fosfórico interfiere con la absorción de calcio' },
      { name: 'Dietas muy altas en proteína animal', detail: 'Acidifican la sangre y el organismo usa calcio óseo para neutralizarla' },
      { name: 'Vitamina A en exceso', detail: 'Más de 10,000 UI/día de retinol puede reducir la densidad ósea' },
      { name: 'Tabaco', detail: 'Reduce la absorción de calcio y acelera la pérdida ósea' },
    ],
  },
];

const MENU = [
  {
    meal: '☀️ Desayuno',
    items: [
      'Yogur natural con granola artesanal y fresas frescas',
      '1 vaso de leche descremada o bebida de avena enriquecida',
      'Tostada integral con queso panela y jitomate',
      '1 kiwi (vitamina C para absorber calcio)',
    ],
    calcium: '~420 mg',
  },
  {
    meal: '🍽️ Almuerzo',
    items: [
      'Salmón al horno con limón, ajo y hierbas finas',
      'Brócoli y zanahoria al vapor con aceite de oliva',
      'Arroz integral o tortillas de maíz nixtamalizadas',
      'Agua natural o infusión sin azúcar',
    ],
    calcium: '~360 mg',
  },
  {
    meal: '🍎 Colación vespertina',
    items: [
      '23 almendras tostadas sin sal',
      '1 manzana mediana',
      '1 vaso de leche descremada',
    ],
    calcium: '~370 mg',
  },
  {
    meal: '🌙 Cena',
    items: [
      'Sardinas en ensalada: espinaca, tomate, cebolla morada y aceite de oliva',
      '2 tortillas de maíz nixtamalizadas',
      'Agua natural o té de manzanilla',
    ],
    calcium: '~420 mg',
  },
];

export default function DietScreen() {
  const [expanded, setExpanded] = useState(null);
  const [activeTab, setActiveTab] = useState('guide');

  const toggle = (id) => setExpanded(expanded === id ? null : id);

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {['guide', 'menu'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab === 'guide' ? 'Guía Nutricional' : 'Menú del Día'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView>
        {activeTab === 'guide' ? (
          <>
            <View style={styles.introCard}>
              <Text style={styles.introTitle}>Nutrición para huesos fuertes</Text>
              <Text style={styles.introText}>
                Una dieta adecuada complementa el tratamiento con Densimab. Estos son los
                nutrientes clave para mantener y mejorar tu densidad ósea.
              </Text>
            </View>

            {SECTIONS.map((s) => (
              <View key={s.id} style={[styles.section, { borderLeftColor: s.border }]}>
                <TouchableOpacity
                  style={[styles.sectionHeader, { backgroundColor: s.color }]}
                  onPress={() => toggle(s.id)}
                >
                  <Text style={styles.sectionIcon}>{s.icon}</Text>
                  <Text style={styles.sectionTitle}>{s.title}</Text>
                  <Text style={styles.chevron}>{expanded === s.id ? '▲' : '▼'}</Text>
                </TouchableOpacity>

                {expanded === s.id && (
                  <View style={styles.sectionBody}>
                    {s.items.map((item, i) => (
                      <View key={i} style={styles.foodRow}>
                        <Text style={styles.foodName}>• {item.name}</Text>
                        <Text style={styles.foodDetail}>{item.detail}</Text>
                      </View>
                    ))}
                    <View style={styles.tipBox}>
                      <Text style={styles.tipText}>💡 {s.tip}</Text>
                    </View>
                  </View>
                )}
              </View>
            ))}
          </>
        ) : (
          <>
            <View style={styles.introCard}>
              <Text style={styles.introTitle}>Menú ejemplo: ~1,570 mg de calcio</Text>
              <Text style={styles.introText}>
                Este menú supera la dosis diaria recomendada de calcio (1,000–1,200 mg).
                Adapta las porciones según tus necesidades y la indicación de tu médico.
              </Text>
            </View>

            {MENU.map((m, i) => (
              <View key={i} style={styles.mealCard}>
                <Text style={styles.mealTitle}>{m.meal}</Text>
                {m.items.map((item, j) => (
                  <Text key={j} style={styles.mealItem}>• {item}</Text>
                ))}
                <View style={styles.calciumBadge}>
                  <Text style={styles.calciumBadgeText}>🦴 Calcio: {m.calcium}</Text>
                </View>
              </View>
            ))}

            <View style={styles.totalCard}>
              <Text style={styles.totalMain}>Total del día: ~1,570 mg de calcio</Text>
              <Text style={styles.totalSub}>Objetivo mínimo: 1,000–1,200 mg/día</Text>
            </View>

            <View style={styles.hydrationCard}>
              <Text style={styles.hydrationTitle}>💧 Hidratación</Text>
              <Text style={styles.hydrationText}>
                Bebe 8 vasos de agua al día (2 litros). Una buena hidratación ayuda al
                transporte de nutrientes hacia los huesos y reduce el riesgo de cálculos renales
                si tomas suplementos de calcio.
              </Text>
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
  foodRow: { marginBottom: 10 },
  foodName: { fontSize: 14, fontWeight: '600', color: '#333' },
  foodDetail: { fontSize: 13, color: '#666', marginTop: 2 },
  tipBox: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  tipText: { fontSize: 13, color: '#555', lineHeight: 20 },
  mealCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  mealTitle: { fontSize: 16, fontWeight: 'bold', color: '#1565C0', marginBottom: 10 },
  mealItem: { fontSize: 14, color: '#444', marginBottom: 5, lineHeight: 21 },
  calciumBadge: {
    backgroundColor: '#E8F5E9',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  calciumBadgeText: { fontSize: 13, color: '#2E7D32', fontWeight: '600' },
  totalCard: {
    backgroundColor: '#1565C0',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  totalMain: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  totalSub: { fontSize: 14, color: '#90CAF9', marginTop: 4 },
  hydrationCard: {
    backgroundColor: '#E1F5FE',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#0288D1',
  },
  hydrationTitle: { fontSize: 15, fontWeight: '700', color: '#01579B', marginBottom: 8 },
  hydrationText: { fontSize: 14, color: '#444', lineHeight: 21 },
});
