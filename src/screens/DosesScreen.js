import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Modal, TextInput, Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { saveDose, getDoses, deleteDose, getProfile } from '../utils/storage';
import { scheduleReminders } from '../utils/notifications';
import { addMonths, formatDate, formatDateShort, getDaysDiff } from '../utils/dateUtils';

const parseDate = (str) => {
  const parts = str.replace(/\s/g, '').split('/');
  if (parts.length !== 3) return null;
  const [d, m, y] = parts.map(Number);
  if (!d || !m || !y || y < 2000 || y > 2100) return null;
  const date = new Date(y, m - 1, d);
  if (date.getMonth() !== m - 1) return null; // invalid day for month
  return date;
};

const getDoseColor = (days) => {
  if (days < 0) return '#D32F2F';
  if (days <= 15) return '#F57C00';
  if (days <= 30) return '#FBC02D';
  return '#388E3C';
};

const getDoseMessage = (days) => {
  if (days < 0) return `¡Vencida hace ${Math.abs(days)} días!`;
  if (days === 0) return '¡Es HOY!';
  if (days === 1) return '¡Mañana!';
  return `En ${days} días`;
};

export default function DosesScreen() {
  const [doses, setDoses] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [dateInput, setDateInput] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useFocusEffect(useCallback(() => { loadDoses(); }, []));

  const loadDoses = async () => {
    const data = await getDoses();
    setDoses([...data].reverse());
  };

  const registerDose = async (useToday = false) => {
    setLoading(true);
    let doseDate;

    if (useToday) {
      doseDate = new Date();
    } else {
      doseDate = parseDate(dateInput);
      if (!doseDate) {
        Alert.alert('Fecha incorrecta', 'Ingresa la fecha en formato DD/MM/AAAA\nEjemplo: 15/05/2026');
        setLoading(false);
        return;
      }
    }

    const nextDose = addMonths(doseDate, 6);
    const newDose = {
      id: Date.now().toString(),
      date: doseDate.toISOString(),
      nextDose: nextDose.toISOString(),
      notes: notes.trim(),
    };

    const updated = await saveDose(newDose);
    const profile = await getProfile();
    await scheduleReminders(nextDose, profile?.name?.split(' ')[0]);

    setDoses([...updated].reverse());
    setModalVisible(false);
    setDateInput('');
    setNotes('');
    setLoading(false);

    Alert.alert(
      '✅ Dosis registrada',
      `Tu próxima dosis quedó programada para el:\n\n📅 ${formatDate(nextDose)}\n\nRecibirás recordatorios 30, 15, 7, 3 y 1 día antes.`,
      [{ text: 'Entendido' }],
    );
  };

  const confirmDelete = (dose) =>
    Alert.alert(
      'Eliminar registro',
      '¿Seguro que quieres eliminar este registro de dosis?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const updated = await deleteDose(dose.id);
            setDoses([...updated].reverse());
          },
        },
      ],
    );

  const closeModal = () => {
    setModalVisible(false);
    setDateInput('');
    setNotes('');
  };

  const latestDose = doses[0];
  const nextDoseDate = latestDose ? new Date(latestDose.nextDose) : null;
  const daysLeft = nextDoseDate ? getDaysDiff(nextDoseDate) : null;

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Next dose summary */}
        {nextDoseDate && (
          <View style={[styles.nextDoseCard, { borderColor: getDoseColor(daysLeft) }]}>
            <Text style={styles.nextDoseLabel}>PRÓXIMA DOSIS</Text>
            <Text style={[styles.nextDoseDays, { color: getDoseColor(daysLeft) }]}>
              {getDoseMessage(daysLeft)}
            </Text>
            <Text style={styles.nextDoseDate}>📅 {formatDate(nextDoseDate)}</Text>
            <Text style={styles.nextDoseMed}>Densimab (Denosumab) 60 mg · Subcutánea</Text>
          </View>
        )}

        {/* Register button */}
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>+ Registrar Nueva Dosis</Text>
        </TouchableOpacity>

        {/* History */}
        <Text style={styles.historyTitle}>Historial de Dosis</Text>

        {doses.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>💉</Text>
            <Text style={styles.emptyTitle}>Sin dosis registradas</Text>
            <Text style={styles.emptySubtitle}>
              Registra tu primera dosis para activar los recordatorios automáticos.
            </Text>
          </View>
        ) : (
          doses.map((dose, index) => (
            <View key={dose.id} style={styles.doseItem}>
              <View style={[styles.doseCircle, index === 0 && styles.doseCircleActive]}>
                <Text style={styles.doseCircleText}>{doses.length - index}</Text>
              </View>
              <View style={styles.doseContent}>
                <Text style={styles.doseBadge}>
                  {index === 0 ? '🟢 Última dosis' : '⬜ Dosis anterior'}
                </Text>
                <Text style={styles.doseDateText}>Aplicada: {formatDateShort(dose.date)}</Text>
                <Text style={styles.doseNextText}>Siguiente: {formatDateShort(dose.nextDose)}</Text>
                {dose.notes ? (
                  <Text style={styles.doseNotes}>📝 {dose.notes}</Text>
                ) : null}
              </View>
              <TouchableOpacity onPress={() => confirmDelete(dose)} style={styles.deleteBtn}>
                <Text style={{ fontSize: 20 }}>🗑️</Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        {/* Reminders info */}
        <View style={styles.reminderCard}>
          <Text style={styles.reminderTitle}>🔔 Recordatorios automáticos</Text>
          <Text style={styles.reminderSubtitle}>
            Al registrar una dosis, recibirás notificaciones en:
          </Text>
          {['30 días antes', '15 días antes', '7 días antes', '3 días antes', '1 día antes', 'El día de la dosis (8:00 AM)'].map((r, i) => (
            <Text key={i} style={styles.reminderItem}>✓ {r}</Text>
          ))}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Registration modal */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Registrar Dosis</Text>

            <TouchableOpacity
              style={styles.todayButton}
              onPress={() => registerDose(true)}
              disabled={loading}
            >
              <Text style={styles.todayButtonText}>💉 Registrar dosis de hoy</Text>
              <Text style={styles.todayButtonDate}>{formatDateShort(new Date())}</Text>
            </TouchableOpacity>

            <Text style={styles.orDivider}>── o ingresa otra fecha ──</Text>

            <Text style={styles.inputLabel}>Fecha de la dosis (DD/MM/AAAA)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: 15/05/2026"
              value={dateInput}
              onChangeText={setDateInput}
              keyboardType="numeric"
              maxLength={10}
            />

            <Text style={styles.inputLabel}>Notas (opcional)</Text>
            <TextInput
              style={[styles.input, styles.inputMulti]}
              placeholder="Ej: aplicada por Dr. García, sin reacciones adversas"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => registerDose(false)}
                disabled={loading}
              >
                <Text style={styles.saveButtonText}>
                  {loading ? 'Guardando...' : 'Guardar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  nextDoseCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
  },
  nextDoseLabel: { fontSize: 11, fontWeight: '700', color: '#888', letterSpacing: 1 },
  nextDoseDays: { fontSize: 30, fontWeight: 'bold', marginTop: 8 },
  nextDoseDate: { fontSize: 17, color: '#444', marginTop: 6 },
  nextDoseMed: { fontSize: 13, color: '#888', marginTop: 6 },
  addButton: {
    backgroundColor: '#1565C0',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  historyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  emptyState: { alignItems: 'center', padding: 40 },
  emptyIcon: { fontSize: 52, marginBottom: 12 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: '#555' },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 20,
  },
  doseItem: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  doseCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  doseCircleActive: { backgroundColor: '#1565C0' },
  doseCircleText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  doseContent: { flex: 1 },
  doseBadge: { fontSize: 13, fontWeight: '700', color: '#333' },
  doseDateText: { fontSize: 13, color: '#555', marginTop: 3 },
  doseNextText: { fontSize: 13, color: '#1565C0', marginTop: 2 },
  doseNotes: { fontSize: 12, color: '#888', marginTop: 4 },
  deleteBtn: { padding: 8 },
  reminderCard: {
    backgroundColor: '#E8F5E9',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2E7D32',
  },
  reminderTitle: { fontSize: 15, fontWeight: '700', color: '#2E7D32', marginBottom: 6 },
  reminderSubtitle: { fontSize: 13, color: '#444', marginBottom: 10 },
  reminderItem: { fontSize: 13, color: '#444', paddingVertical: 3 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 20,
    textAlign: 'center',
  },
  todayButton: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1565C0',
  },
  todayButtonText: { fontSize: 16, fontWeight: 'bold', color: '#1565C0' },
  todayButtonDate: { fontSize: 13, color: '#555', marginTop: 4 },
  orDivider: { textAlign: 'center', color: '#aaa', fontSize: 13, marginVertical: 16 },
  inputLabel: { fontSize: 14, color: '#555', fontWeight: '600', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
    marginBottom: 16,
  },
  inputMulti: { height: 80, textAlignVertical: 'top' },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 4 },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  cancelButtonText: { color: '#666', fontSize: 15, fontWeight: '600' },
  saveButton: {
    flex: 1,
    backgroundColor: '#1565C0',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  saveButtonText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
});
