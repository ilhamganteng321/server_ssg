const bcrypt = require('bcryptjs');
const Joi = require('joi');
const {
  addUserRole,
  createUser,
  getAllUsers,
  getUserByEmail,
  getUserByHp,
  getUserById,
  getUserByNik,
  getUserRole,
  kodeposku
} = require('../models/user.model.js');

const authorizeUrl = require('../lib/gmailLogin.js');
const { oauth2Client } = require('../lib/gmailLogin.js');

const jwt = require('jsonwebtoken');
const generatedToken = require('../lib/token.js');

const {
  decryptData,
  encryptData,
  hashPhoneNumber
} = require('../lib/encrypt.js');

const {
  createUserVerify,
  getAlluserFiles,
  getUserVerify,
  statusUserVerify
} = require('../models/user.bio.models.js');

const {
  sendOtpForgotPassword,
  sendTextMessage
} = require('../lib/fonnteService.js');

const crypto = require('crypto');

const { google } = require('googleapis');
const { getConnection } = require('../config/db.js');
const { getAllUsersStatusFlag } = require('../models/admin.models.js');


// Validasi Input Pengguna (Disesuaikan dengan Tabel Users)
const userSchema = Joi.object({
  nama_lengkap: Joi.string().max(100).required(),
  nik: Joi.string().length(16).required().min(6),
  jenis_kelamin: Joi.string().valid('L', 'P').required(),
  tempat_lahir: Joi.string().max(50).required(),
  tanggal_lahir: Joi.date().iso().required(),
  alamat: Joi.string().required(),
  rt: Joi.string().required(),
  rw: Joi.string().required(),
  kode_pos: Joi.string().required(),
  kelurahan_desa: Joi.string().required(),
  kecamatan: Joi.string().required(),
  kabupaten_kota: Joi.string().required(),
  provinsi: Joi.string().required(),
  email : Joi.string().allow(),
  domisili_kode_pos: Joi.string().allow('', null),
  domisili_kelurahan_desa: Joi.string().allow('', null),
  domisili_kecamatan: Joi.string().allow('', null),
  domisili_kabupaten_kota: Joi.string().allow('', null),
  domisili_provinsi: Joi.string().allow('', null),
  domisili_alamat: Joi.string().allow('', null),
  domisili_rt: Joi.string().allow('', null),
  domisili_rw: Joi.string().allow('', null),
  nomor_hp: Joi.string().max(15).required(),
  agama: Joi.string().valid('Islam', 'Kristen', 'Hindu', 'dll.').default('Islam'),
  golongan_darah: Joi.string().valid('A', 'B', 'AB', 'O').required(),
  password: Joi.string().min(6).required(),
});
// Menambahkan Pengguna Baru (Registrasi)
 const registerUser = async (req, res) => {
  try {
    // Validasi Data
    const { error } = userSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const {
      nama_lengkap, nik, jenis_kelamin, tempat_lahir, tanggal_lahir,
      alamat, rt, rw, kode_pos, kelurahan_desa, kecamatan, kabupaten_kota, provinsi,
      domisili_kode_pos, domisili_kelurahan_desa, domisili_kecamatan, domisili_kabupaten_kota, domisili_provinsi,
      nomor_hp, email, agama, golongan_darah, password, domisili_alamat, domisili_rt, domisili_rw
    } = req.body;
    

    // Cek apakah user sudah terdaftar
    const existingUserNik = await getUserByNik(nik);
    if (existingUserNik) return res.status(400).json({ message: 'NIK sudah terdaftar' });
    const existingUserNoHp = await getUserByHp(nomor_hp);
    if (existingUserNoHp) return res.status(400).json({ message: 'Nomor HP sudah terdaftar' });
    const existingUserEmail = await getUserByEmail(email);
    if (existingUserEmail) return res.status(400).json({ message: 'Email sudah terdaftar' });
    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Enkripsi Data Sensitif
    const encryptedNama = encryptData(nama_lengkap);
    const encryptedAlamat = encryptData(alamat);
    const encryptedNIK = encryptData(nik);
    // const hashedPhone = hashPhoneNumber(nomor_hp);
    const encryptNoHp = encryptData(nomor_hp);

    // Simpan Data Pengguna Baru
    const newUserId = await createUser({
      nama_lengkap: JSON.stringify(encryptedNama),
      nik: JSON.stringify(encryptedNIK),
      jenis_kelamin,
      tempat_lahir,
      tanggal_lahir,
      alamat: JSON.stringify(encryptedAlamat),
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
      nomor_hp : JSON.stringify(encryptNoHp),
      email,
      agama,
      golongan_darah,
      password: hashedPassword,
      domisili_rt,
      domisili_rw,
      domisili_alamat : JSON.stringify(encryptData(domisili_alamat)),
    });
    
    // **Tambahkan ke user_verify setelah user dibuat**
    await createUserVerify(newUserId); // Fungsi untuk memasukkan ke user_verify

    // Generate Token
    const token = generatedToken({ id: newUserId, nomor_hp });
    const data = await getUserById(newUserId);
    const user_verify = await getUserVerify(newUserId);
    const userRole = await addUserRole(newUserId);
    const userRolekun = await getUserRole(newUserId);
    // Simpan Token di Cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000, // 1 jam
    });

    return res.status(201).json({ message: 'Pendaftaran berhasil', userId: newUserId, data, userRolekun, user_verify });
  } catch (err) {
    console.error('Error registering user:', err);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};


 const getUsers = async (req, res) => {
  const users = await getAllUsers();
  // console.log("users", users)
  try {
    const userFiles = await getAlluserFiles();
    const userFlags = await getAllUsersStatusFlag();
    const decryptedUsers = users.map(user =>({
      nama_lengkap : decryptData(JSON.parse(user.nama_lengkap)), // Simpan sebagai JSON
      nik : decryptData(JSON.parse(user.nik)),
      tempat_lahir: user.tempat_lahir,
      tanggal_lahir : user.tanggal_lahir,
      jenis_kelamin : user.jenis_kelamin,
      alamat : decryptData(JSON.parse(user.alamat)),
      rt : user.rt,
      rw : user.rw,
      kode_pos : user.kode_pos,
      kelurahan_desa : user.kelurahan_desa,
      kecamatan : user.kecamatan, 
      kabupaten_kota : user.kabupaten_kota,
      provinsi : user.provinsi,
      nomor_hp : decryptData(JSON.parse(user.nomor_hp)),
      agama : user.agama,
      golongan_darah : user.golongan_darah,
      domisili_alamat: decryptData(JSON.parse(user.domisili_alamat)),
      domisili_kode_pos: user.domisili_kode_pos,
      domisili_kelurahan_desa : user.domisili_kelurahan_desa,
      domisili_kecamatan : user.domisili_kecamatan,
      domisili_kabupaten_kota : user.domisili_kabupaten_kota,
      domisili_provinsi : user.domisili_provinsi,
      domisili_rt : user.domisili_rt,
      domisili_rw : user.domisili_rw,
    }));

    return res.status(200).json({data:decryptedUsers, flag : userFlags , file:userFiles});
  } catch (err) {
    console.error('Error fetching users:', err);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};


 const loginUser = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const { nomor_hp, password } = req.body;

    // Validasi input
    if (!nomor_hp || !password) {
      return res.status(400).json({ message: 'Nomor HP dan password wajib diisi' });
    }

    // Ambil data pengguna berdasarkan nomor HP
    const user = await getUserByHp(nomor_hp);
    if (!user) {
      return res.status(400).json({ message: 'Nomor HP atau password salah' });
    }

    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Nomor HP atau password salah' });
    }

    // Generate token
    const token = generatedToken(user.id);
    const data = await getUserById(user.id);
    const user_verify = await getUserVerify(user.id);
    const userRole = await getUserRole(user.id);
    const verifyStatus = await statusUserVerify(user.id);
    if (!verifyStatus || verifyStatus.isverified === 0) {
      // Generate OTP
      const otp = crypto.randomInt(100000, 999999);
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 menit dari sekarang
      
      // Simpan OTP ke database (MariaDB)
      await connection.execute(
        `INSERT INTO user_otps (user_id, otp_code, expires_at) 
         VALUES (?, ?, ?)`,
        [user.id, otp, expiresAt]
      );
      
      // Kirim OTP (implementasi fungsi sendTextMessage disesuaikan)
      await sendTextMessage(nomor_hp, `Kode OTP Anda: ${otp}`);
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000, // 1 jam
      });

      return res.status(200).json({
        message: "Login berhasil, tetapi akun Anda belum diverifikasi. Silakan periksa WhatsApp Anda untuk kode OTP.",
        userId: user.id,
        token,
        data,
        user_verify,
        userRole
      });
    }    
    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000, // 1 jam
    });

    return res.status(200).json({
      message: 'Login berhasil',
      userId: user.id,
      token,
      data,
      user_verify,
      userRole
    });
    // Cek status verifikasi
    // Verifikasi password
  } catch (err) {
    console.error('Error during login:', err);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  } finally {
    if (connection) connection.release();
  }
};


// Logout Pengguna
 const logoutUser = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    return res.status(200).json({ message: 'Logout berhasil' });
  } catch (err) {
    console.error('Error logging out:', err);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};


 const verifyOTP = async (req, res) => {
  const db = await getConnection();
  
  try {
    const { userId, otp } = req.body;

    console.log("ini user id", userId, otp);

    if (!userId || !otp) {
      return res.status(400).json({ message: 'User ID dan OTP wajib diisi' });
    }

    // Ambil OTP dari database
    const [otpRecords] = await db.execute(
      `SELECT * FROM user_otps WHERE user_id = ? AND otp_code = ?`,
      [userId, otp]
    );

    const otpRecord = otpRecords[0];

    if (!otpRecord) {
      return res.status(400).json({ message: 'OTP tidak valid atau sudah kedaluwarsa' });
    }

    // (Optional) Cek waktu kadaluarsa OTP jika ada field misalnya `expires_at`

    // Hapus OTP setelah diverifikasi
    await db.execute(`DELETE FROM user_otps WHERE user_id = ?`, [userId]);

    // Update status verifikasi user
    await db.execute(`UPDATE user_verify SET isverified = 1 WHERE user_id = ?`, [userId]);
    const data = await getUserById(userId);
    const user_verify = await getUserVerify(userId);
    const userRole = await getUserRole(userId);


    // Buat JWT toke
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000, // 1 jam
    });

    return res.status(200).json({
      message: 'Verifikasi OTP berhasil, akun Anda telah diverifikasi',
      token,
      userId,
      data,
      user_verify,
      userRole
    });
  } catch (err) {
    console.error('Error verifying OTP:', err.message);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  } finally {
    db.release(); // pastikan koneksi dikembalikan ke pool
  }
};


 const coba = async (req, res) => {
  try {
    const{nomor_hp , password} = req.body;
    const otp = '123456'
    await sendWhatsAppOTP(nomor_hp,otp);

  } catch (error) {
    
  }
} 

 const googleLogin = (req, res) => {
  res.redirect(authorizeUrl); 
}

 const googleLoginCb = async (req, res) => {
  try {
    const { code } = req.query;
    console.log("Received Code:", code);
    const { tokens } = await oauth2Client.getToken(code);
    console.log("Received Tokens:", tokens);

  oauth2Client.setCredentials(tokens);

  const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
  const { data } = await oauth2.userinfo.get();

  if (!data || !data.email || !data.name) {
    return res.status(400).json({ message: 'Gagal login dengan Google' , data: data});
  }

  console.log("email " , data.email);

  let user = await getUserByEmail(data.email);
  if (!user) {
    // Buat user baru jika belum ada di database
    res.cookie('google_temp_data', JSON.stringify({
      email: data.email,
      nama_lengkap: data.name
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 10 * 60 * 1000, // 10 menit
      path: '/' // Penting: agar cookie bisa diakses di seluruh halaman
    });

return res.redirect(`/register-stepper.html?email=${encodeURIComponent(data.email)}&name=${encodeURIComponent(data.name)}`);
  }

  // const token = generatedToken(user.id);
    // const dataUser = await getUserById(user.id);
    const user_verify = await getUserVerify(user.id);
    const userRole = await getUserRole(user.id);
  // Generate token JWT
  const authToken = generatedToken(user.id);

  res.cookie('token', authToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 3600000, // 1 jam
  });

  return res.status(200).json({ message: 'Login berhasil', token: authToken, user, user_verify, userRole });
  } catch (err) {
  console.error('Error during Google login:', err);
  return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
}

 const getKodePos = async (req, res) =>{
  try {
    const { kode_pos } = req.query;

    // console.log("ini kod pos",kode_pos);
    const user = await kodeposku(kode_pos);
    // console.log(user)
    if(!user){
      res.status(404).json({message : "kode pos tidak tersedia"})
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({message : "internal server error"})
  }
}

 const forgotPasswordUser = async (req, res) => {
  try {
    const { nomor_hp } = req.query;

    const user = await getuserByHp(nomor_hp);
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    const otp = crypto.randomInt(100000, 999999);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await connection.execute(
      `INSERT INTO user_otps (user_id, otp_code, expires_at) 
       VALUES (?, ?, ?)`,
      [user.id, otp, expiresAt]
    );
    await sendOtpForgotPassword(user.nomor_hp, otp)
    res.status(200).json({message : "Berhasil mengirimkan otp ke nomor hp anda"});
  } catch (error) {
    res.status(500).json({message : "Error server"})
    console.error('Error sending OTP:', error);
  }
}

module.exports = {
  registerUser,
  getUsers,
  loginUser,
  logoutUser,
  verifyOTP,
  coba,
  googleLogin,
  googleLoginCb,
  getKodePos,
  forgotPasswordUser
};

//  const verifyOtpForgotPassword = async (req, res) => {
//   try {
//     const { otp } =  
//   } catch (error) {
    
//   }
// }