import { sendPresenUsers } from "../lib/fonnteService.js";
import { getUserHealthById } from "../models/user.bio.models.js";
import { getUserById } from "../models/user.model.js";
import { getUserIdByQRCode, getUserPresensi, insertPresensiKeluar, insertPresensiMasuk } from "../models/user.presensi.models.js";

export const handlePresensi = async (req, res) => {
  try {
    const { qrcode_text, jenis } = req.body;
    console.log('Presensi Request:', req.body);

    if (!qrcode_text || !jenis) {
      return res.status(400).json({ message: 'Data tidak lengkap' });
    }

    const user_id = await getUserIdByQRCode(qrcode_text);
    const idUser = await getUserById(user_id);
    if( !idUser) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }
    console.log('User ID:', user_id);
    if (!user_id) {
      return res.status(404).json({ message: 'QR Code tidak valid' });
    }

    const userHealth = await getUserHealthById(user_id);
    if (!userHealth) {
      return res.status(404).json({ message: 'Data kesehatan tidak ditemukan' });
    }
     
    const namaUser = idUser.nama_lengkap;
    const nomorUserWali = userHealth.kontak_darurat_nomor;

    // Ambil semua presensi user
    const presensiUser = await getUserPresensi(user_id);
    // console.log('Presensi User:', presensiUser);
    // Cek apakah user sudah presensi hari ini untuk jenis yang sama
    const today = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
    const sudahPresensiHariIni = presensiUser.some(p =>
      p.jenis === jenis && new Date(p.waktu_presensi).toISOString().slice(0, 10) === today
    );

    if (sudahPresensiHariIni) {
      return res.status(200).json({
        message: `Peserta sudah presensi ${jenis} hari ini.`,
        status: 'duplikat'
      });
    }

    // Lanjut simpan presensi
    let result;
    if (jenis === 'masuk') {
      result = await insertPresensiMasuk(user_id, qrcode_text);
    } else if (jenis === 'keluar') {
      result = await insertPresensiKeluar(user_id, qrcode_text);
    } else {
      return res.status(400).json({ message: 'Jenis presensi tidak valid' });
    }

    sendPresenUsers(nomorUserWali, namaUser, jenis);

    return res.status(200).json({
      message: `Presensi ${jenis} berhasil disimpan.`,
      status: 'sukses'
    });
  } catch (error) {
    console.error('Presensi Error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan' });
  }
};
