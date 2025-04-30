const dotenv = require('dotenv');
dotenv.config();
const crypto = require('crypto');

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
if (!ENCRYPTION_KEY) throw new Error("ENCRYPTION_KEY is not set!");
const IV_LENGTH = 12;

 const hashPhoneNumber = (phone) => {
  return crypto.createHash('sha256').update(phone).digest('hex');
};

 const encryptData = (data) => {
    const iv = crypto.randomBytes(12); // Nonce (IV) untuk ChaCha20
    const cipher = crypto.createCipheriv('chacha20-poly1305', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
  
    return { encrypted, iv: iv.toString('hex'), authTag };
  };
  
  // Fungsi Dekripsi menggunakan ChaCha20-Poly1305
   const decryptData = (encryptedData) => {
    try {
      const { encrypted, iv, authTag } = encryptedData;
  
      const decipher = crypto.createDecipheriv(
        'chacha20-poly1305',
        Buffer.from(ENCRYPTION_KEY, 'hex'),
        Buffer.from(iv, 'hex'),
        { authTagLength: 16 }
      );
  
      decipher.setAuthTag(Buffer.from(authTag, 'hex'));
  
      let decrypted = decipher.update(Buffer.from(encrypted, 'hex'));
      decrypted = Buffer.concat([decrypted, decipher.final()]);
  
      return decrypted.toString();
    } catch (error) {
      console.error("Error decrypting data:", error);
      return null; // Supaya tidak crash
    }
  };
  
  module.exports = {
    encryptData,
    decryptData,
    hashPhoneNumber
  };