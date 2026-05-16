import React, { useEffect } from 'react';
import { Platform, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

import HomeScreen from './src/screens/HomeScreen';
import DosesScreen from './src/screens/DosesScreen';
import DietScreen from './src/screens/DietScreen';
import ExerciseScreen from './src/screens/ExerciseScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { DensimabLogo } from './src/components/DensimabLogo';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Inicio: '🏠',
  Dosis: '💉',
  Dieta: '🥗',
  Ejercicios: '🏃',
  Perfil: '👤',
};

export default function App() {
  useEffect(() => {
    registerForNotifications();
  }, []);

  async function registerForNotifications() {
    if (!Device.isDevice) return;

    const { status: existing } = await Notifications.getPermissionsAsync();
    let finalStatus = existing;
    if (existing !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') return;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('densimab', {
        name: 'Densimab Recordatorios',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#1565C0',
      });
    }
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused }) => (
              <Text style={{ fontSize: focused ? 26 : 22 }}>
                {TAB_ICONS[route.name]}
              </Text>
            ),
            tabBarActiveTintColor: '#1565C0',
            tabBarInactiveTintColor: '#999',
            tabBarStyle: {
              backgroundColor: '#fff',
              borderTopWidth: 1,
              borderTopColor: '#E0E0E0',
              height: 65,
              paddingBottom: 10,
            },
            tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
            headerStyle: { backgroundColor: '#1A237E' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
          })}
        >
          <Tab.Screen
            name="Inicio"
            component={HomeScreen}
            options={{
              headerTitle: () => <DensimabLogo size="small" light />,
              headerTitleAlign: 'center',
            }}
          />
          <Tab.Screen name="Dosis" component={DosesScreen} options={{ title: 'Mis Dosis' }} />
          <Tab.Screen name="Dieta" component={DietScreen} options={{ title: 'Nutrición' }} />
          <Tab.Screen name="Ejercicios" component={ExerciseScreen} options={{ title: 'Ejercicios' }} />
          <Tab.Screen name="Perfil" component={ProfileScreen} options={{ title: 'Mi Perfil' }} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
