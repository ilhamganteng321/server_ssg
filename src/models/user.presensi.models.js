import { getConnection } from "../config/db.js";

export const getUserIdByQRCode = async (qrcode_text) => {
  const db = await getConnection();
  const [rows] = await db.execute(
    'SELECT user_id FROM user_qrcodes WHERE qrcode_text = ?',
    [qrcode_text]
  );
  await db.release();
  return rows.length ? rows[0].user_id : null;
};

export const insertPresensiMasuk = async (user_id, qrcode_text) => {
  const db = await getConnection();
  const [result] = await db.execute(
    'INSERT INTO presensi (user_id, qrcode_text, jenis) VALUES (?, ? , "masuk")',
    [user_id, qrcode_text]
  );
  await db.release();
  return result;
};

export const insertPresensiKeluar = async (user_id, qrcode_text) => {
  const db = await getConnection();
  const [result] = await db.execute(
    'INSERT INTO presensi (user_id, qrcode_text, jenis) VALUES (?, ?, "keluar")',
    [user_id, qrcode_text]
  );
  await db.release();
  return result;
};

export const getUserPresensi = async(user_id) =>{

    let connection;
    try {
        connection = await getConnection();
        const [rows] = await connection.execute(
            'SELECT * FROM presensi WHERE user_id = ?',
            [user_id]
        );
        return rows;
    } catch (error) {
        console.log(error);
        throw error;
    }finally {
        if (connection) {
            connection.release();
        }
    }
}