import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import EmailVerificationService from '../services/EmailVerificationService';

const { width, height } = Dimensions.get('window');
const isSmallScreen = height < 700;

export default function OTPVerificationScreen({ route, navigation }) {
  const { email, password, isSignUp } = route.params;
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [canResend, setCanResend] = useState(false);

  // Countdown timer for resend functionality
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // Start countdown when component mounts
  useEffect(() => {
    setTimeLeft(60); // 60 seconds countdown
  }, []);

  const handleVerifyOTP = async () => {
    if (!otp.trim() || otp.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter a valid 6-digit OTP.');
      return;
    }

    setLoading(true);
    try {
      const result = await EmailVerificationService.verifyOTP(email, otp.trim());
      
      if (result.success) {
        Alert.alert('Success', result.message, [
          {
            text: 'Continue',
            onPress: () => {
              // Navigate back to login with verified email
              navigation.navigate('Login', { 
                verifiedEmail: email,
                message: 'Email verified successfully! You can now sign up.'
              });
            }
          }
        ]);
      } else {
        Alert.alert('Verification Failed', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    setResendLoading(true);
    try {
      const result = await EmailVerificationService.resendOTP(email);
      
      if (result.success) {
        Alert.alert('OTP Sent', result.message);
        setCanResend(false);
        setTimeLeft(60); // Reset countdown
      } else {
        Alert.alert('Failed', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Verify Your Email</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.subtitle}>
            We've sent a verification code to:
          </Text>
          <Text style={styles.email}>{email}</Text>
          
          <Text style={styles.instruction}>
            Enter the 6-digit code to verify your UBC student email address.
          </Text>

          <View style={styles.otpContainer}>
            <TextInput
              style={styles.otpInput}
              value={otp}
              onChangeText={setOtp}
              placeholder="Enter 6-digit code"
              keyboardType="numeric"
              maxLength={6}
              autoFocus
              editable={!loading}
            />
          </View>

          <TouchableOpacity
            style={[styles.verifyButton, (!otp.trim() || otp.length !== 6 || loading) && styles.verifyButtonDisabled]}
            onPress={handleVerifyOTP}
            disabled={!otp.trim() || otp.length !== 6 || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.verifyButtonText}>Verify Email</Text>
            )}
          </TouchableOpacity>

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>
              Didn't receive the code?
            </Text>
            
            {canResend ? (
              <TouchableOpacity
                style={styles.resendButton}
                onPress={handleResendOTP}
                disabled={resendLoading}
              >
                {resendLoading ? (
                  <ActivityIndicator color="#3366FF" size="small" />
                ) : (
                  <Text style={styles.resendButtonText}>Resend Code</Text>
                )}
              </TouchableOpacity>
            ) : (
              <Text style={styles.timerText}>
                Resend available in {formatTime(timeLeft)}
              </Text>
            )}
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              💡 For development: Check the console for the OTP code
            </Text>
            <Text style={styles.infoText}>
              ⏰ OTP expires in 10 minutes
            </Text>
            <Text style={styles.infoText}>
              🔒 Maximum 3 attempts allowed
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  backButtonText: {
    fontSize: 20,
    color: '#3366FF',
  },
  title: {
    fontSize: isSmallScreen ? 18 : 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: isSmallScreen ? 20 : 24,
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: isSmallScreen ? 16 : 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  email: {
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
  },
  instruction: {
    fontSize: isSmallScreen ? 14 : 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  otpContainer: {
    marginBottom: 32,
  },
  otpInput: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: isSmallScreen ? 16 : 18,
    fontSize: isSmallScreen ? 18 : 20,
    textAlign: 'center',
    backgroundColor: '#fff',
    color: '#333',
    letterSpacing: 4,
    fontWeight: '600',
  },
  verifyButton: {
    backgroundColor: '#3366FF',
    borderRadius: 12,
    padding: isSmallScreen ? 16 : 18,
    alignItems: 'center',
    marginBottom: 24,
  },
  verifyButtonDisabled: {
    backgroundColor: '#ccc',
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: '600',
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  resendText: {
    fontSize: isSmallScreen ? 14 : 16,
    color: '#666',
    marginBottom: 8,
  },
  resendButton: {
    padding: 8,
  },
  resendButtonText: {
    color: '#3366FF',
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: '600',
  },
  timerText: {
    fontSize: isSmallScreen ? 14 : 16,
    color: '#999',
  },
  infoContainer: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3366FF',
  },
  infoText: {
    fontSize: isSmallScreen ? 12 : 14,
    color: '#666',
    marginBottom: 4,
    lineHeight: 18,
  },
}); 