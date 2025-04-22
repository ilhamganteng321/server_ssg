import crypto from 'crypto';
import { decryptData, encryptData, hashPhoneNumber } from '../lib/encrypt.js';
import { dbPromise, getConnection } from '../config/db.js';

// Mendapatkan semua pengguna
export const getAllUsers = async () => {
  const db = await getConnection();
  try {
    const [rows] = await db.query('SELECT * FROM users');
    return rows;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  } finally {
    db.release();
  }
};

export const kodeposku = async (kodepos) => {
  const db = await dbPromise();
  try {
    const rows = await db.get('select * from kodeposku where kode_pos = ?',[kodepos])
    return rows;
  } catch (error) {
    
  }
}

// Membuat pengguna baru (registrasi lokal)
export const createUser = async (userData) => {
  const db = await getConnection();
  try {
    const {
      nama_lengkap,
      nik,
      jenis_kelamin,
      tempat_lahir,
      tanggal_lahir,
      alamat,
      rt,
      rw,
      kode_pos,
      kelurahan_desa,
      kecamatan,
      kabupaten_kota,
      provinsi,
      domisili_kode_pos,
      domisili_kelurahan_desa,
      domisili_kecamatan,
      domisili_kabupaten_kota,
      domisili_provinsi,
      nomor_hp,
      email,
      golongan_darah,
      password,
      domisili_rt,
      domisili_rw,
      domisili_alamat,
    } = userData;

    const query = `
      INSERT INTO users (
        nama_lengkap, nik, jenis_kelamin, tempat_lahir, tanggal_lahir,
        alamat, rt, rw, kode_pos, kelurahan_desa, kecamatan, kabupaten_kota, provinsi,
        domisili_kode_pos, domisili_kelurahan_desa, domisili_kecamatan, domisili_kabupaten_kota, domisili_provinsi,
        nomor_hp, email, golongan_darah, password, domisili_rt, domisili_rw, domisili_alamat
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ? , ?)
    `;

    const [result] = await db.execute(query, [
      nama_lengkap,
      nik,
      jenis_kelamin,
      tempat_lahir,
      tanggal_lahir,
      alamat,
      rt,
      rw,
      kode_pos,
      kelurahan_desa,
      kecamatan,
      kabupaten_kota,
      provinsi,
      domisili_kode_pos,
      domisili_kelurahan_desa,
      domisili_kecamatan,
      domisili_kabupaten_kota,
      domisili_provinsi,
      nomor_hp,
      email,
      golongan_darah,
      password,
      domisili_rt,
      domisili_rw,
      domisili_alamat,
    ]);

    if (result.affectedRows !== 1) {
      throw new Error('Gagal menambahkan user');
    }

    return result.insertId;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }finally{
    db.release();
  }
};


// Mendapatkan user berdasarkan email
// Ambil user berdasarkan email
export const getUserByEmail = async (email) => {
  const db = await getConnection();
  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    const row = rows[0];

    if (!row) return null;
    row.nama_lengkap = decryptData(JSON.parse(row.nama_lengkap));
    row.nik = decryptData(JSON.parse(row.nik));
    row.alamat = decryptData(JSON.parse(row.alamat));
    row.domisili_alamat = decryptData(JSON.parse(row.domisili_alamat));
    row.nomor_hp = decryptData(JSON.parse(row.nomor_hp));
    
    return row;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw error;
  }finally{
    db.release();
  }
};
// Mendapatkan user berdasarkan NIK

// Ambil user berdasarkan NIK (dengan enkripsi)
export const getUserByNik = async (nik) => {
  let connection;
  try {
    connection = await getConnection();
  
    // 1. Ambil semua user untuk memeriksa yang cocok (karena data di database terenkripsi)
    const [allUsers] = await connection.execute('SELECT * FROM users');
    
    let matchedUser = null;
    
    // 2. Loop melalui semua user untuk menemukan yang cocok
    for (const user of allUsers) {
      try {
        // 3. Dekripsi nomor HP yang tersimpan
        const decryptedHp = decryptData(JSON.parse(user.nik));
        
        // 4. Bandingkan dengan nomor HP input
        if (decryptedHp === nik) {
          matchedUser = user;
          break;
        }
      } catch (decryptError) {
        console.error('Gagal mendekripsi nomor HP:', decryptError);
        continue;
      }
    }

    if (!matchedUser) return null;
    
    // 5. Verifikasi ulang sebelum mengembalikan
    const finalDecrypted = decryptData(JSON.parse(matchedUser.nik));
    if (finalDecrypted !== nik) {
      throw new Error('Verifikasi nomor HP gagal');
    }
    
    return matchedUser;
  } catch (error) {
    console.error('Error fetching user by phone number:', error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
};
// Ambil user berdasarkan nomor HP
export const getUserByHp = async (nomor_hp) => {
  let connection;
  try {
    connection = await getConnection();
  
    // 1. Ambil semua user untuk memeriksa yang cocok (karena data di database terenkripsi)
    const [allUsers] = await connection.execute('SELECT * FROM users');
    
    let matchedUser = null;
    
    // 2. Loop melalui semua user untuk menemukan yang cocok
    for (const user of allUsers) {
      try {
        // 3. Dekripsi nomor HP yang tersimpan
        const decryptedHp = decryptData(JSON.parse(user.nomor_hp));
        
        // 4. Bandingkan dengan nomor HP input
        if (decryptedHp === nomor_hp) {
          matchedUser = user;
          break;
        }
      } catch (decryptError) {
        console.error('Gagal mendekripsi nomor HP:', decryptError);
        continue;
      }
    }

    if (!matchedUser) return null;
    
    // 5. Verifikasi ulang sebelum mengembalikan
    const finalDecrypted = decryptData(JSON.parse(matchedUser.nomor_hp));
    if (finalDecrypted !== nomor_hp) {
      throw new Error('Verifikasi nomor HP gagal');
    }
    
    return matchedUser;
  } catch (error) {
    console.error('Error fetching user by phone number:', error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
};

export const addUserRole = async (id) => {
  const conn = await getConnection();
  try{
    const query = `INSERT INTO m_user_t (user_id, role) VALUES (?, '0a')`;
    const [result] = await conn.query(query, [id]);
      
      if (result.affectedRows !== 1) {
        throw new Error('Failed to insert into user_verify');
      }
      
      console.log('User role added successfully:', result);
      return result.insertId;
  }catch (e){
    console.error('Error inserting into user_verify:', e);
    throw e;
  }finally{
    conn.release();
  }
}

export const updateUserRole = async (userId, role) => {
  const db = await getConnection();
  try {
    const query = 'UPDATE m_user_t SET role = ? WHERE user_id = ?';
    const [result] = await db.execute(query, [role, userId]);

    if (result.affectedRows === 0) {
      throw new Error('User not found or no changes made');
    }

    return result;
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  } finally {
    db.release();
  }
}

export const getUserRole = async (userId) => {
  const db = await getConnection();
  try {
    const [rows] = await db.execute('SELECT * FROM m_user_t WHERE user_id = ?', [userId]);

    const row = rows[0] ? { role: rows[0].role } : null; 
    return row;
  } catch (error) {
    console.error('Error fetching user role:', error);
    throw error;
  } finally {
    db.release();
  }
}

// Mendapatkan user berdasarkan ID
// Ambil user berdasarkan ID
export const getUserById = async (id) => {
  const db = await getConnection();
  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
    const row = rows[0];

    if (!row) return null;

    row.nama_lengkap = decryptData(JSON.parse(row.nama_lengkap));
    row.nik = decryptData(JSON.parse(row.nik));
    row.alamat = decryptData(JSON.parse(row.alamat));
    row.domisili_alamat = decryptData(JSON.parse(row.domisili_alamat));
    row.nomor_hp = decryptData(JSON.parse(row.nomor_hp));
    // row.domisili_rt = decryptData(JSON.parse(row.domisili_kecamatan));
    // row.domisili_rw = decryptData(JSON.parse(row.domisili_kabupaten_kota));
    return row;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error;
  }finally{
    db.release();
  }
};

// Menghasilkan dan menyimpan OTP
export const generateOTP = async (userId) => {
  const db = await getConnection();
  try {
    const otpCode = crypto.randomInt(100000, 999999).toString();
    await db.run(
      'INSERT INTO user_otps (user_id, otp_code, expires_at) VALUES (?, ?, datetime("now", "+5 minutes"))',
      [userId, otpCode]
    );
    return otpCode;
  } catch (error) {
    console.error('Error generating OTP:', error);
    throw error;
  }
};

// Verifikasi OTP
export const verifyOTP = async (userId, otpCode) => {
  const db = await getConnection();
  try {
    const row = await db.get(
      'SELECT * FROM user_otps WHERE user_id = ? AND otp_code = ? AND expires_at > datetime("now")',
      [userId, otpCode]
    );

    if (!row) return false;

    await db.run('DELETE FROM user_otps WHERE user_id = ?', [userId]);
    await db.run('UPDATE users SET is_verified = 1 WHERE id = ?', [userId]);

    return true;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
};

// Bersihkan OTP yang kedaluwarsa
export const cleanExpiredOTPs = async () => {
  const db = await getConnection();
  try {
    await db.run('DELETE FROM user_otps WHERE expires_at <= datetime("now")');
  } catch (error) {
    console.error('Error cleaning expired OTPs:', error);
    throw error;
  }
};