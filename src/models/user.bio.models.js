import QRCode from 'qrcode';
import { getConnection } from "../config/db.js";

export const getUserByEducate = async (id) => {
  const db = await getConnection();
  try {
    const [rows] = await db.execute('SELECT * FROM user_education WHERE user_id = ?', [id]);

    if (!rows.length) {
      return null;
    }
    return rows[0];
  } catch (error) {
    console.error('Error fetching user by educate ID:', error);
    throw error;
  } finally {
    await db.release();
  }
};

  export const getUserVerify = async (userId) => {
    let connection;
    try {
      connection = await getConnection();
      
      // Menggunakan execute() untuk prepared statements
      const [rows] = await connection.execute(
        'SELECT * FROM user_verify WHERE user_id = ?', 
        [userId]
      );
  
      // Mengambil baris pertama jika ada
      const row = rows[0] || null;
  
      return rows[0] ? { isverified: rows[0].isverified } : null;
    } catch (error) {
      console.error('Error fetching user verification data:', error);
      throw error;
    } finally {
      if (connection) connection.release();
    }
  };

  export const createUserVerify = async (userId) => {
    const connection = await getConnection();
    try {
      const query = `INSERT INTO user_verify (user_id, isverified) VALUES (?, 0)`;
      const [result] = await connection.query(query, [userId]);
      
      if (result.affectedRows !== 1) {
        throw new Error('Failed to insert into user_verify');
      }
      
      return result.insertId;
    } catch (error) {
      console.error('Error inserting into user_verify:', error);
      throw error;
    } finally {
      if (connection) connection.release();
    }
  };

  export const statusUserVerify = async (userId) => {
    let connection;
    try {
      connection = await getConnection();
      
      // Menggunakan execute() untuk prepared statements
      const [rows] = await connection.execute(
        'SELECT * FROM user_verify WHERE user_id = ?', 
        [userId]
      );
  
      // Mengambil baris pertama jika ada
      const row = rows[0] || null;
  
      return row;
    } catch (error) {
      console.error('Error fetching user verification status:', error);
      throw error;
    } finally {
      if (connection) {
        await connection.release(); // Pastikan koneksi dilepas
      }
    }
  };

  export const createEduUsers = async (userData) => {
    const db = await getConnection();
    try {
      const {
        id,
        pendidikan_terakhir,
        pekerjaan,
        organisasi,
        motivasi
      } = userData;
  
      const query = `
        INSERT INTO user_education (
          user_id, pendidikan_terakhir, pekerjaan, organisasi, motivasi 
        ) VALUES (?, ?, ?, ?, ?)
      `;
  
      const [result] = await db.execute(query, [
        id,
        pendidikan_terakhir,
        pekerjaan,
        organisasi,
        motivasi
      ]);
  
      const insertId = result.insertId;
  
      if (!insertId) {
        throw new Error('Gagal menambahkan riwayat pendidikan');
      }
  
      return insertId;
    } catch (error) {
      console.error('Error creating user education record:', error);
      throw error;
    } finally {
      await db.release();
    }
  };
  
  export const updateEduUsers = async (userData) => {
    const db = await getConnection();
    try {
      const { id, pendidikan_terakhir, pekerjaan, organisasi, motivasi } = userData;
  
      const query = `
        UPDATE user_education 
        SET pendidikan_terakhir = ?, pekerjaan = ?, organisasi = ?, motivasi = ? 
        WHERE user_id = ?
      `;
  
      const [result] = await db.execute(query, [
        pendidikan_terakhir,
        pekerjaan,
        organisasi,
        motivasi,
        id
      ]);
  
      if (result.affectedRows === 0) {
        throw new Error('Gagal memperbarui data pendidikan');
      }
  
      return true;
    } catch (error) {
      console.error('Error updating user education record:', error);
      throw error;
    } finally {
      await db.release();
    }
  };

  export const getEduUsers = async (id) => {
    const db = await getConnection();
    try {
      const [rows] = await db.execute('SELECT * FROM user_education WHERE user_id = ?', [id]);
  
      if (!rows.length) {
        return null;
      }
  
      return rows[0];
    } catch (error) {
      console.error('Error fetching user education by ID:', error);
      throw error;
    } finally {
      await db.release();
    }
  };

  export const getUserHealthById = async (user_id) => {
    const db = await getConnection();
    try {
      const [rows] = await db.execute('SELECT * FROM user_health WHERE user_id = ?', [user_id]);
      if (!rows.length) {
        return null;
      }
      return rows[0];
    } catch (error) {
      console.error('Error fetching user education by ID:', error);
      throw error;
    } finally {
      await db.release();
    }
};

// **CREATE: Tambah Data Kesehatan**
export const createUserHealth = async (userData) => {
  let connection;
  try {
      connection = await getConnection(); // Get MariaDB connection
      
      const { 
          user_id, 
          riwayat_penyakit, 
          memiliki_disabilitas, 
          kontak_darurat_nama, 
          kontak_darurat_nomor, 
          hubungan_darurat 
      } = userData;

      const query = `
          INSERT INTO user_health 
          (user_id, riwayat_penyakit, memiliki_disabilitas, kontak_darurat_nama, kontak_darurat_nomor, hubungan_darurat)
          VALUES (?, ?, ?, ?, ?, ?)
      `;

      // Execute query for MariaDB
      const [result] = await connection.execute(query, [
          user_id, 
          riwayat_penyakit, 
          memiliki_disabilitas, 
          kontak_darurat_nama, 
          kontak_darurat_nomor, 
          hubungan_darurat
      ]);

      // For MariaDB, the insertId is available in the result object
      return result.insertId;

  } catch (error) {
      console.error("Error inserting user health record:", error);
      
      // Handle specific MariaDB errors
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
          throw new Error('User ID tidak valid atau tidak ditemukan');
      }
      
      throw new Error('Gagal menyimpan data kesehatan pengguna');
  } finally {
      if (connection) {
          connection.release(); // Always release connection back to pool
      }
  }
};
// **UPDATE: Perbarui Data Kesehatan**
export const updateUserHealth = async (userData) => {
  let connection;
  try {
      connection = await getConnection(); // Get MariaDB connection
      
      const { 
          user_id, 
          riwayat_penyakit, 
          memiliki_disabilitas, 
          kontak_darurat_nama, 
          kontak_darurat_nomor, 
          hubungan_darurat 
      } = userData;

      const query = `
          UPDATE user_health 
          SET 
              riwayat_penyakit = ?, 
              memiliki_disabilitas = ?, 
              kontak_darurat_nama = ?, 
              kontak_darurat_nomor = ?, 
              hubungan_darurat = ?
          WHERE user_id = ?
      `;

      // Execute query for MariaDB
      const [result] = await connection.execute(query, [
          riwayat_penyakit, 
          memiliki_disabilitas, 
          kontak_darurat_nama, 
          kontak_darurat_nomor, 
          hubungan_darurat,
          user_id
      ]);

      // For MariaDB, check affectedRows instead of changes
      if (result.affectedRows === 0) {
          throw new Error("Data kesehatan pengguna tidak ditemukan atau tidak ada perubahan");
      }

      return true;
  } catch (error) {
      console.error("Error updating user health record:", error);
      
      // Handle specific MariaDB errors
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
          throw new Error('User ID tidak valid atau tidak ditemukan');
      }
      
      throw new Error(error.message || 'Gagal memperbarui data kesehatan');
  } finally {
      if (connection) {
          connection.release(); // Always release connection back to pool
      }
  }
};

export const createUserReRegistration = async (user_id) => {
    let connection;
    try{
        connection = await getConnection();
        const query = `INSERT INTO user_re_registration (user_id, flag) VALUES (?, '0')`;
        const [result] = await connection.execute(query, [user_id]);
        return result.insertId;
    }
    catch (error){
        console.error("Error inserting user re-registration:", error);
        throw error;
    }finally{
        if (connection) {
            connection.release(); // Always release connection back to pool
        }
    }
}

export const getUserStatusFlag = async (user_id) => {
  const db = await getConnection();
try {
  const [rows] = await db.execute(
    'SELECT flag FROM user_re_registration WHERE user_id = ?', 
    [user_id]
  );

  if (!rows.length) {
    return null;
  }

  const row = rows[0];
  return row; // hanya kembalikan nilai flag
} catch (error) {
  console.error('Error fetching flag by user_id:', error);
  throw error;
} finally {
  await db.release();
}
};

export const updateUserStatusFlag = async (user_id) => {
  const db = await getConnection();
  try {
    // Update flag
    const [result] = await db.execute(
      'UPDATE user_re_registration SET flag = 1 WHERE user_id = ?', 
      [user_id]
    );

    // Update role (asumsikan tipe datanya adalah VARCHAR)
    const [rows] = await db.execute(
      'UPDATE m_user_t SET role = ? WHERE user_id = ?', 
      ['1a', user_id]
    );

    if (rows.affectedRows === 0) {
      throw new Error('Failed to update user role');
    }

    if (result.affectedRows === 0) {
      throw new Error('Failed to update status flag');
    }

    return true;
  } catch (error) {
    console.error('Error updating status flag:', error);
    throw error;
  } finally {
    await db.release();
  }
};

export const createUserQrcode = async (user_id) => {
  const db = await getConnection();
  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [user_id]);
    if (!rows.length) throw new Error('User tidak ditemukan');

    const user = rows[0];
    const gender = user.jenis_kelamin === 'L' ? 'A' : 'B';
    const angkatan = '51';

    // Cek berapa banyak user QR yang sudah ada (khusus gender dan angkatan ini misalnya)
    const [countRows] = await db.execute(
      'SELECT COUNT(*) as total FROM user_qrcodes u JOIN users us ON u.user_id = us.id WHERE us.jenis_kelamin = ?',
      [user.jenis_kelamin]
    );

    const total = countRows[0].total + 1;

    // Format jadi 4 digit angka: 1 -> 0001
    const no_urut = String(total).padStart(4, '0');

    const kode = `${gender}${angkatan}${no_urut}`;
    const qrData = `Kode: ${kode}\nNama: ${user.nama_lengkap}\nNo Induk: ${user.nik}`;
    const qrImage = await QRCode.toDataURL(qrData);

    // Simpan ke tabel user_qrcodes
    const [hasil] = await db.execute(
      'INSERT INTO user_qrcodes (user_id, qrcode_text, qrcode_image) VALUES (?, ?, ?)',
      [user_id, kode, qrImage]
    );

    if (hasil.affectedRows !== 1) {
      throw new Error('Gagal menyimpan QR code');
    }

    return true;
  } catch (error) {
    console.error('Error generate QR:', error);
    throw error;
  } finally {
    await db.release();
  }
};

export const getUserQrcode = async (user_id) => {
  const db = await getConnection();
  try {
    const [rows] = await db.execute('SELECT * FROM user_qrcodes WHERE user_id = ?', [user_id]);
    if (!rows.length) return null;

    return rows[0];
  } catch (error) {
    console.error('Error fetching QR code by user_id:', error);
    throw error;
  } finally {
    await db.release();
  }
}

export const getUserFilesByUserId= async(userId) => {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute(
      `SELECT file_name, file_type, google_drive_file_id
       FROM user_files
       WHERE user_id = ?`,
      [userId]
    );
    return rows;
  } finally {
    connection.release();
  }
}

