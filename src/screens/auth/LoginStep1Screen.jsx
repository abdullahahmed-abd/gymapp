import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import Header from '../../components/shared/Header';
import GlassInput from '../../components/shared/GlassInput';
import GlassButton from '../../components/shared/GlassButton';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';

const LoginStep1Screen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

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
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Text style={styles.title}>INITIALIZE</Text>
            <Text style={styles.subtitle}>Enter your credentials to proceed</Text>

            <View style={styles.form}>
              <GlassInput 
                label="Full Name"
                placeholder="e.g. John Doe"
                value={name}
                onChangeText={setName}
              />
              <GlassInput 
                label="Email Address"
                placeholder="john@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <GlassInput 
                label="Phone Number"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <GlassButton 
            variant="primary"
            onPress={() => navigation.navigate('LoginOTP')}
          >
            Continue →
          </GlassButton>
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
    paddingHorizontal: 24,
    paddingBottom: 48,
  }
});

export default LoginStep1Screen;