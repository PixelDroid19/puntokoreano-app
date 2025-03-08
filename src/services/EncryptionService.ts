// src/services/EncryptionService.ts
import axios from 'axios';
import CryptoJS from 'crypto-js';
import ENDPOINTS from '@/api';

interface EncryptionKeyResponse {
  success: boolean;
  data: {
    key: string;
    sessionId: string;
  };
}

class EncryptionService {
  /**
   * Fetches an encryption key from the server
   * @returns Promise with the encryption key and session ID
   */
  static async getEncryptionKey(): Promise<{ key: string; sessionId: string }> {
    try {
      const response = await axios.get<EncryptionKeyResponse>(
        ENDPOINTS.AUTH.ENCRYPTION_KEY.url
      );
      
      if (response.data.success) {
        return response.data.data;
      }
      
      throw new Error('Failed to get encryption key');
    } catch (error) {
      console.error('Error fetching encryption key:', error);
      throw error;
    }
  }

  /**
   * Encrypts a password using AES encryption
   * @param password - The password to encrypt
   * @param key - The encryption key
   * @returns The encrypted password string
   */
  static encryptPassword(password: string, key: string): string {
    // Generate a random initialization vector
    const iv = CryptoJS.lib.WordArray.random(16);
    
    // Encrypt the password using AES
    const encrypted = CryptoJS.AES.encrypt(
      password,
      CryptoJS.enc.Hex.parse(key),
      { iv: iv }
    );
    
    // Return the IV and encrypted password as a combined string
    return iv.toString(CryptoJS.enc.Hex) + ':' + encrypted.toString();
  }
}

export default EncryptionService;