import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import GameScreen from './GameScreen';
import { LinearGradient } from 'expo-linear-gradient';

const HomeScreen: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<'easy' | 'hard' | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [gameWon, setGameWon] = useState<boolean>(false); //It will be used for future updates

  const handleGoBack = (time: number, gameWon: boolean) => {
    setTime(formatTime(time)); // Save time
    setGameWon(gameWon); // checks if the user just won or not, it will be used for future updates
    setSelectedLevel(null);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (selectedLevel) {
    return <GameScreen level={selectedLevel} onGoBack={handleGoBack} />;
  }

  return (
    <View style={styles.container}>

      <Text style={styles.title}>⬛ ⬜</Text>
      <Text style={styles.title}>Binario Game</Text>
      {time && <Text style={styles.subtitle}>Último tiempo: {time}</Text>}
      <Text style={styles.subtitle}>Selecciona la dificultad:</Text>
      <LinearGradient
        colors={['#000000', '#ffffff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientBorder}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => setSelectedLevel('easy')}>
            <Text style={styles.buttonText}>Fácil</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
      <LinearGradient
        colors={['#000000', '#ffffff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientBorder}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => setSelectedLevel('hard')}>
            <Text style={styles.buttonText}>Difícil</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  title: { fontSize: 30, fontWeight: 'bold', marginBottom: 20 },
  subtitle: { fontSize: 18, marginBottom: 10 },
  gradientBorder: { padding: 2, borderRadius: 10, marginVertical: 5, },
  buttonContainer: { backgroundColor: 'black', borderRadius: 10, alignItems: 'center', justifyContent: 'center', },
  button: { paddingVertical: 15, paddingHorizontal: 30, borderRadius: 10, },
  buttonText: { fontSize: 18, fontWeight: 'bold', color: 'white', },
});

export default HomeScreen;

