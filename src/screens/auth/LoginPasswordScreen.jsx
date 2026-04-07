import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../components/shared/Header';
import GlassInput from '../../components/shared/GlassInput';
import GlassButton from '../../components/shared/GlassButton';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';

const LoginPasswordScreen = ({ navigation }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleInitialize = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'UserDashboard' }],
    });
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48' }}
      style={styles.background}
      blurRadius={10}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.95)', '#000000']}
        style={styles.gradient}
      >
        <Header showMenu={false} />
        
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.title}>SECURITY</Text>
            <Text style={styles.subtitle}>Establish your access key</Text>

            <View style={styles.form}>
              <GlassInput 
                label="Access Key (Password)"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <GlassInput 
                label="Confirm Access Key"
                placeholder="••••••••"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <GlassButton 
              variant="primary"
              onPress={handleInitialize}
            >
              Initialize Account
            </GlassButton>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  content: {
    paddingTop: 40,
  },
  title: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: 24,
    color: Colors.white,
    letterSpacing: 4.8,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: Fonts.montserrat.regular,
    fontSize: 10,
    color: Colors.zinc[400],
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 40,
  },
  form: {
    gap: 8,
  },
  buttonContainer: {
    paddingBottom: 48,
  }
});

export default LoginPasswordScreen;