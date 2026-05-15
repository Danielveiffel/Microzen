import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { saveProfile, getProfile, getDoses } from '../utils/storage';
import { formatDate, getDaysDiff } from '../utils/dateUtils';
import { DensimabLogo } from '../components/DensimabLogo';

const EMPTY_PROFILE = {
  name: '',
  age: '',
  doctor: '',
  doctorPhone: '',
  hospital: '',
  diagnosis: 'Osteoporosis',
  emergencyContact: '',
  emergencyPhone: '',
  notes: '',
};

export default function ProfileScreen() {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [saved, setSaved] = useState(EMPTY_PROFILE);
  const [doseCount, setDoseCount] = useState(0);
  const [firstDoseDate, setFirstDoseDate] = useState(null);
  const [nextDoseDate, setNextDoseDate] = useState(null);

  const loadData = useCallback(async () => {
    const [p, doses] = await Promise.all([getProfile(), getDoses()]);
    if (p) {
      setProfile(p);
      setSaved(p);
    }
    setDoseCount(doses.length);
    if (doses.length > 0) {
      setFirstDoseDate(new Date(doses[0].date));
      setNextDoseDate(new Date(doses[doses.length - 1].nextDose));
    }
  }, []);

  useFocusEffect(useCallback(() => { loadData(); }, [loadData]));

  const handleSave = async () => {
    if (!profile.name.trim()) {
      Alert.alert('Campo requerido', 'Por favor ingresa tu nombre completo.');
      return;
    }
    await saveProfile(profile);
    setSaved(profile);
    setEditing(false);
    Alert.alert('✅ Perfil guardado', 'Tu información fue actualizada correctamente.');
  };

  const handleCancel = () => {
    setProfile(saved);
    setEditing(false);
  };

  const set = (field) => (value) => setProfile((prev) => ({ ...prev, [field]: value }));

  const monthsInTreatment = firstDoseDate
    ? Math.floor(getDaysDiff(new Date(), firstDoseDate) / 30)
    : null;

  const daysUntilNext = nextDoseDate ? getDaysDiff(nextDoseDate) : null;

  const Field = ({ label, field, placeholder, keyboard, multiline }) => (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {editing ? (
        <TextInput
          style={[styles.fieldInput, multiline && styles.fieldInputMulti]}
          value={profile[field]}
          onChangeText={set(field)}
          placeholder={placeholder}
          keyboardType={keyboard || 'default'}
          multiline={multiline}
          numberOfLines={multiline ? 3 : 1}
          placeholderTextColor="#BDBDBD"
        />
      ) : (
        <Text style={[styles.fieldValue, !profile[field] && styles.fieldEmpty]}>
          {profile[field] || '—'}
        </Text>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
          </Text>
        </View>
        <Text style={styles.headerName}>{profile.name || 'Mi Perfil'}</Text>
        {profile.age ? (
          <Text style={styles.headerAge}>{profile.age} años</Text>
        ) : null}
        {profile.doctor ? (
          <Text style={styles.headerDoctor}>Dr. {profile.doctor}</Text>
        ) : null}
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{doseCount}</Text>
          <Text style={styles.statLabel}>Dosis{'\n'}aplicadas</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>
            {monthsInTreatment !== null ? `${monthsInTreatment}m` : '—'}
          </Text>
          <Text style={styles.statLabel}>Meses en{'\n'}tratamiento</Text>
        </View>
        <View style={styles.stat}>
          <Text style={[
            styles.statValue,
            daysUntilNext !== null && daysUntilNext <= 30 && { color: '#F57C00' },
          ]}>
            {daysUntilNext !== null ? (daysUntilNext < 0 ? '!' : `${daysUntilNext}d`) : '—'}
          </Text>
          <Text style={styles.statLabel}>Días para{'\n'}próxima dosis</Text>
        </View>
      </View>

      {/* Personal */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👤 Información Personal</Text>
        <Field label="Nombre completo" field="name" placeholder="Tu nombre completo" />
        <Field label="Edad" field="age" placeholder="Ej: 65" keyboard="numeric" />
      </View>

      {/* Medical */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🏥 Información Médica</Text>
        <Field label="Médico tratante" field="doctor" placeholder="Nombre del médico" />
        <Field label="Teléfono del médico" field="doctorPhone" placeholder="Teléfono o consultorio" keyboard="phone-pad" />
        <Field label="Hospital / Clínica" field="hospital" placeholder="Centro médico" />
        <Field label="Diagnóstico" field="diagnosis" placeholder="Ej: Osteoporosis posmenopáusica" />
      </View>

      {/* Emergency */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🆘 Contacto de Emergencia</Text>
        <Field label="Nombre y parentesco" field="emergencyContact" placeholder="Ej: María García (hija)" />
        <Field label="Teléfono" field="emergencyPhone" placeholder="Número de contacto" keyboard="phone-pad" />
      </View>

      {/* Notes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📝 Notas Médicas</Text>
        <Field
          label="Alergias, medicamentos, observaciones"
          field="notes"
          placeholder="Ej: alérgica a penicilina, toma atorvastatina 20 mg..."
          multiline
        />
      </View>

      {/* Action buttons */}
      {editing ? (
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
            <Text style={styles.cancelBtnText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Guardar cambios</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.editBtn} onPress={() => setEditing(true)}>
          <Text style={styles.editBtnText}>✏️  Editar perfil</Text>
        </TouchableOpacity>
      )}

      {/* Medication info */}
      <View style={styles.medCard}>
        <View style={styles.medLogoRow}>
          <DensimabLogo size="normal" />
        </View>
        <View style={styles.medDivider} />
        {[
          ['Medicamento', 'Densimab (Denosumab)'],
          ['Dosis estándar', '60 mg'],
          ['Vía de administración', 'Subcutánea (inyección)'],
          ['Frecuencia', 'Cada 6 meses (182 días)'],
          ['Indicación', 'Osteoporosis, reducción del riesgo de fractura vertebral, no vertebral y de cadera'],
          ['Mecanismo', 'Inhibidor del RANKL – reduce la resorción ósea'],
        ].map(([label, value], i) => (
          <View key={i} style={styles.medRow}>
            <Text style={styles.medLabel}>{label}:</Text>
            <Text style={styles.medValue}>{value}</Text>
          </View>
        ))}
      </View>

      {/* Important reminder */}
      <View style={styles.warningCard}>
        <Text style={styles.warningTitle}>⚠️ Importante</Text>
        <Text style={styles.warningText}>
          No suspendas Densimab sin consultar a tu médico. Interrumpir el tratamiento
          puede provocar una pérdida acelerada de hueso y aumentar el riesgo de fractura.
          Si tienes dudas, siempre comunícate con tu equipo médico.
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
    padding: 30,
    alignItems: 'center',
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { fontSize: 38, color: '#1565C0', fontWeight: 'bold' },
  headerName: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  headerAge: { fontSize: 15, color: '#90CAF9', marginTop: 4 },
  headerDoctor: { fontSize: 13, color: '#BBDEFB', marginTop: 4 },
  statsRow: {
    flexDirection: 'row',
    margin: 16,
    gap: 10,
  },
  stat: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    elevation: 1,
  },
  statValue: { fontSize: 22, fontWeight: 'bold', color: '#1565C0' },
  statLabel: { fontSize: 11, color: '#888', textAlign: 'center', marginTop: 4, lineHeight: 16 },
  section: {
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
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1565C0', marginBottom: 14 },
  fieldWrap: { marginBottom: 14 },
  fieldLabel: {
    fontSize: 11,
    color: '#888',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 5,
  },
  fieldValue: { fontSize: 16, color: '#333' },
  fieldEmpty: { color: '#BDBDBD' },
  fieldInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
    color: '#333',
  },
  fieldInputMulti: { height: 85, textAlignVertical: 'top' },
  buttonRow: { flexDirection: 'row', marginHorizontal: 16, gap: 12, marginBottom: 12 },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  cancelBtnText: { color: '#666', fontSize: 15, fontWeight: '600' },
  saveBtn: {
    flex: 1,
    backgroundColor: '#1565C0',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  editBtn: {
    backgroundColor: '#1565C0',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  editBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  medCard: {
    backgroundColor: '#E8EAF6',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#C5CAE9',
  },
  medLogoRow: { alignItems: 'flex-start', marginBottom: 14 },
  medDivider: { height: 1, backgroundColor: '#C5CAE9', marginBottom: 14 },
  medTitle: { fontSize: 15, fontWeight: '700', color: '#1A237E', marginBottom: 12 },
  medRow: { flexDirection: 'row', marginBottom: 7 },
  medLabel: { fontSize: 13, color: '#555', fontWeight: '600', width: 120 },
  medValue: { fontSize: 13, color: '#333', flex: 1, lineHeight: 18 },
  warningCard: {
    backgroundColor: '#FFF3E0',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F57C00',
  },
  warningTitle: { fontSize: 14, fontWeight: '700', color: '#E65100', marginBottom: 8 },
  warningText: { fontSize: 13, color: '#555', lineHeight: 20 },
});
