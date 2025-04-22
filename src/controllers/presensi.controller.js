import { getUserIdByQRCode, getUserPresensi, insertPresensiKeluar, insertPresensiMasuk } from "../models/user.presensi.models.js";

export const handlePresensi = async (req, res) => {
  try {
    const { qrcode_text, jenis } = req.body;

    if (!qrcode_text || !jenis) {
      return res.status(400).json({ message: 'Data tidak lengkap' });
    }

    const user_id = await getUserIdByQRCode(qrcode_text);
    if (!user_id) {
      return res.status(404).json({ message: 'QR Code tidak valid' });
    }

    // Ambil semua presensi user
    const presensiUser = await getUserPresensi(user_id);
    console.log('Presensi User:', presensiUser);
    // Cek apakah user sudah presensi hari ini untuk jenis yang sama
    const today = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
    const sudahPresensiHariIni = presensiUser.some(p =>
      p.jenis === jenis && new Date(p.waktu_presensi).toISOString().slice(0, 10) === today
    );

    if (sudahPresensiHariIni) {
      return res.status(200).json({
        message: `Kamu sudah presensi ${jenis} hari ini.`,
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

    return res.status(200).json({
      message: `Presensi ${jenis} berhasil disimpan.`,
      status: 'sukses'
    });
  } catch (error) {
    console.error('Presensi Error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan' });
  }
};
