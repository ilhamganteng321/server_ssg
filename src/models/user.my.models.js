import { getConnection } from '../config/db.js';

const DailyIbadahModel = {
  findMyByMonth: async (user_id, month,year) => {
    let db;
    try {
      db = await getConnection(); // Make sure to await the connection
      const [rows] = await db.query(`
        SELECT * FROM daily_ibadah
        WHERE user_id = ? AND MONTH(date) = ? AND YEAR(date) = ?
        ORDER BY date ASC
      `, [user_id, month, year]);
      return rows;
    } catch (error) {
      console.error('Error in findMyByMonth:', error);
      throw error;
    } finally {
      if (db) db.release(); // Release the connection back to the pool
    }
  },
  findByUserAndDate: async (user_id, date) => {
    let db;
    try {
      db = await getConnection(); // Make sure to await the connection
      const [rows] = await db.query(
        'SELECT * FROM daily_ibadah WHERE user_id = ? AND date = ?',
        [user_id, date]
      );
      return rows;
    } catch (error) {
      console.error('Error in findByUserAndDate:', error);
      throw error;
    } finally {
      if (db) db.release(); // Release the connection back to the pool
    }
  },

  insert: async (data) => {
    let db;
    try {
      db = await getConnection(); // Make sure to await the connection

      const {
        user_id, date,
        sholat_wajib = 0, sholat_tahajud = 0, sholat_dhuha = 0,
        sholat_rawatib = 0, sholat_sunnah_lainnya = 0,
        tilawah_quran = 0, terjemah_quran = 0, shaum_sunnah = 0,
        shodaqoh = 0, dzikir_pagi_petang = 0,
        istighfar_1000x = 0, sholawat_100x = 0,
        menyimak_mq_pagi = 0
      } = data;

      await db.query(`
        INSERT INTO daily_ibadah (
          user_id, date,
          sholat_wajib, sholat_tahajud, sholat_dhuha,
          sholat_rawatib, sholat_sunnah_lainnya,
          tilawah_quran, terjemah_quran, shaum_sunnah,
          shodaqoh, dzikir_pagi_petang,
          istighfar_1000x, sholawat_100x,
          menyimak_mq_pagi
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        user_id, date,
        sholat_wajib, sholat_tahajud, sholat_dhuha,
        sholat_rawatib, sholat_sunnah_lainnya,
        tilawah_quran, terjemah_quran, shaum_sunnah,
        shodaqoh, dzikir_pagi_petang,
        istighfar_1000x, sholawat_100x,
        menyimak_mq_pagi
      ]);
    } catch (error) {
      console.error('Error in insert:', error);
      throw error;
    } finally {
      if (db) db.release(); // Release the connection back to the pool
    }
  }
};

export default DailyIbadahModel;