import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

class EmailVerificationService {
  constructor() {
    this.otpExpiryMinutes = 10; // OTP expires in 10 minutes
  }

  // Generate a random 6-digit OTP
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Send OTP to user's email (stored in Firestore for verification)
  async sendOTP(email) {
    try {
      const otp = this.generateOTP();
      const expiryTime = new Date();
      expiryTime.setMinutes(expiryTime.getMinutes() + this.otpExpiryMinutes);

      // Store OTP in Firestore with expiry time
      const otpRef = doc(db, 'emailVerification', email);
      await setDoc(otpRef, {
        otp: otp,
        expiryTime: expiryTime,
        attempts: 0,
        createdAt: new Date()
      });

      // In a real app, you would send this via email service
      // For now, we'll log it to console (you can replace this with actual email sending)
      console.log(`OTP for ${email}: ${otp}`);
      console.log(`This OTP expires at: ${expiryTime.toLocaleString()}`);

      return {
        success: true,
        message: `OTP sent to ${email}. Check your email (and console for development).`
      };
    } catch (error) {
      console.error('Error sending OTP:', error);
      return {
        success: false,
        message: 'Failed to send OTP. Please try again.'
      };
    }
  }

  // Verify OTP entered by user
  async verifyOTP(email, enteredOTP) {
    try {
      const otpRef = doc(db, 'emailVerification', email);
      const otpDoc = await getDoc(otpRef);

      if (!otpDoc.exists()) {
        return {
          success: false,
          message: 'OTP not found. Please request a new one.'
        };
      }

      const otpData = otpDoc.data();
      const currentTime = new Date();
      const expiryTime = otpData.expiryTime.toDate();

      // Check if OTP has expired
      if (currentTime > expiryTime) {
        await deleteDoc(otpRef);
        return {
          success: false,
          message: 'OTP has expired. Please request a new one.'
        };
      }

      // Check if too many attempts
      if (otpData.attempts >= 3) {
        await deleteDoc(otpRef);
        return {
          success: false,
          message: 'Too many failed attempts. Please request a new OTP.'
        };
      }

      // Check if OTP matches
      if (otpData.otp === enteredOTP) {
        // Mark email as verified
        await setDoc(doc(db, 'verifiedEmails', email), {
          verified: true,
          verifiedAt: new Date(),
          email: email
        });

        // Clean up OTP document
        await deleteDoc(otpRef);

        return {
          success: true,
          message: 'Email verified successfully!'
        };
      } else {
        // Increment attempts
        await setDoc(otpRef, {
          ...otpData,
          attempts: otpData.attempts + 1
        });

        return {
          success: false,
          message: `Invalid OTP. ${2 - otpData.attempts} attempts remaining.`
        };
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return {
        success: false,
        message: 'Error verifying OTP. Please try again.'
      };
    }
  }

  // Check if email is already verified
  async isEmailVerified(email) {
    try {
      const verifiedRef = doc(db, 'verifiedEmails', email);
      const verifiedDoc = await getDoc(verifiedRef);
      return verifiedDoc.exists();
    } catch (error) {
      console.error('Error checking email verification:', error);
      return false;
    }
  }

  // Resend OTP
  async resendOTP(email) {
    try {
      // Delete existing OTP if any
      const otpRef = doc(db, 'emailVerification', email);
      await deleteDoc(otpRef);

      // Send new OTP
      return await this.sendOTP(email);
    } catch (error) {
      console.error('Error resending OTP:', error);
      return {
        success: false,
        message: 'Failed to resend OTP. Please try again.'
      };
    }
  }

  // Clean up expired OTPs (can be called periodically)
  async cleanupExpiredOTPs() {
    try {
      // This would require a cloud function for production
      // For now, we'll just log that cleanup is needed
      console.log('Cleanup of expired OTPs would happen here');
    } catch (error) {
      console.error('Error cleaning up expired OTPs:', error);
    }
  }
}

export default new EmailVerificationService(); 