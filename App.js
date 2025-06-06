import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, TextInput, FlatList } from 'react-native';

export default function App() {
  const [breathing, setBreathing] = useState(false);
  const [reflection, setReflection] = useState('');
  const [reflections, setReflections] = useState([]);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const startBreathing = () => {
    if (breathing) return;
    setBreathing(true);
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.5, duration: 3000, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 3000, useNativeDriver: true }),
      ])
    ).start();
    setTimeout(() => {
      scaleAnim.stopAnimation();
      setBreathing(false);
      scaleAnim.setValue(1);
    }, 60000);
  };

  const addReflection = () => {
    if (reflection.trim().length === 0) return;
    const entry = { text: reflection.trim(), date: new Date().toISOString() };
    setReflections(prev => [...prev, entry].sort((a, b) => new Date(a.date) - new Date(b.date)));
    setReflection('');
  };

  const renderItem = ({ item }) => (
    <View style={styles.reflectionItem}>
      <Text style={styles.reflectionDate}>{new Date(item.date).toLocaleString()}</Text>
      <Text style={styles.reflectionText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.breatheButton} onPress={startBreathing} disabled={breathing}>
        <Text style={styles.buttonText}>{breathing ? 'Respirando...' : 'Iniciar Respiración'}</Text>
      </TouchableOpacity>
      <View style={styles.breathContainer}>
        <Animated.View style={[styles.circle, { transform: [{ scale: scaleAnim }] }]} />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Escribe tu reflexión"
        value={reflection}
        onChangeText={setReflection}
      />
      <TouchableOpacity style={styles.saveButton} onPress={addReflection}>
        <Text style={styles.buttonText}>Guardar Reflexión</Text>
      </TouchableOpacity>
      <FlatList
        data={reflections}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  breatheButton: {
    backgroundColor: '#8ecae6',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#219ebc',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  breathContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ffb703',
    opacity: 0.7,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    width: '100%',
    backgroundColor: '#fff',
  },
  list: {
    marginTop: 20,
    width: '100%',
  },
  reflectionItem: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  reflectionDate: {
    fontSize: 12,
    color: '#555',
  },
  reflectionText: {
    fontSize: 16,
    marginTop: 5,
  },
});
