import DailyIbadahModel from '../models/user.my.models.js'

export const inputMyUsers = async (req, res) =>{
        const data = req.body;      
        try {
          const existing = await DailyIbadahModel.findByUserAndDate(data.user_id, data.date);
      
          if (existing.length > 0) {
            return res.status(409).json({
              status: 'exists',
              message: 'anda sudah mengisi data ibadah pada tanggal ini'
            });
          }
      
          await DailyIbadahModel.insert(data);
      
          res.status(201).json({
            status: 'success',
            message: 'Data ibadah berhasil disimpan'
          });
      
        } catch (err) {
          console.error(err);
          res.status(500).json({ status: 'error', message: 'Terjadi kesalahan server' });
        }
}

export const getIbadahByDate = async(req, res) =>{
        const {user_id} = req.query;
        const { date } = req.body;      
        try {
          const rows = await DailyIbadahModel.findByUserAndDate(user_id, date);
      
          if (rows.length === 0) {
            return res.status(404).json({
              status: 'not_found',
              message: 'Belum ada data pada tanggal tersebut'
            });
          }
      
          res.json({
            status: 'success',
            data: rows[0]
          });
      
        } catch (error) {
          console.error('Error in getIbadahByDate:', error);
          res.status(500).json({ status: 'error', message: 'Terjadi kesalahan server' });
        }
};

export const getIbadahByMonth = async (req, res) => {
    const { user_id } = req.query;
    const { month, year } = req.body;

    try {
        const rows = await DailyIbadahModel.findMyByMonth(user_id, month, year);
    
        if (rows.length === 0) {
          return res.status(404).json({
            status: 'not_found',
            message: 'Belum ada data pada bulan tersebut'
          });
        }
    
        res.json({
          status: 'success',
          data: rows[0]
        });
    
      } catch (error) {
        console.error('Error in getIbadahByDate:', error);
        res.status(500).json({ status: 'error', message: 'Terjadi kesalahan server' });
      }
}
