const Joi = require('joi');

const {
  createEduUsers,
  createUserHealth,
  createUserReRegistration,
  getEduUsers,
  getUserByEducate,
  getUserHealthById,
  getUserStatusFlag,
  updateEduUsers,
  updateUserHealth,
  getUserFilesByUserId,
  getUserQrcode
} = require('../models/user.bio.models.js');

const { getUserById } = require('../models/user.model.js');


const userEducateSchema = Joi.object({
  id: Joi.number().required(),
  pendidikan_terakhir: Joi.string().max(5).required(),
  pekerjaan: Joi.string().allow("").optional(),
  organisasi: Joi.string().allow("").optional(),
  motivasi: Joi.string().allow("").optional(),
});

const healthSchema = Joi.object({
    user_id: Joi.number().required(),
    riwayat_penyakit: Joi.string().allow('').optional(),
    memiliki_disabilitas: Joi.string().valid("Ya", "Tidak").required(),
    kontak_darurat_nama: Joi.string().required(),
    kontak_darurat_nomor: Joi.string().pattern(/^[0-9]+$/).required(),
    hubungan_darurat: Joi.string().valid("Orang tua", "Saudara", "Pasangan", "Teman", "Lainnya").required()
});

 const createEducation = async (req, res) => {
  const { id, pendidikan_terakhir, pekerjaan, organisasi, motivasi } = req.body;

  const { error } = userEducateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const existingEducate = await getUserByEducate(id);
    if (existingEducate) {
      return res.status(400).json({ message: "Riwayat pendidikan sudah terdaftar" });
    }

    const newUserEduId = await createEduUsers({
      id,
      pendidikan_terakhir,
      pekerjaan,
      organisasi,
      motivasi,
    });

    return res.status(201).json({
      message: "Data pendidikan berhasil ditambahkan"
      // userEducationId: newUserEduId,
    });
  } catch (err) {
    return res.status(500).json({ message: "Terjadi kesalahan server"});
  }
};

 const updateEducation = async (req, res) => {
  const { id, pendidikan_terakhir, pekerjaan, organisasi, motivasi } = req.body;

  const { error } = userEducateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const existingEducate = await getUserByEducate(id);
    if (!existingEducate) {
      return res.status(404).json({ message: "Riwayat pendidikan tidak ditemukan" });
    }

    await updateEduUsers({
      id,
      pendidikan_terakhir,
      pekerjaan,
      organisasi,
      motivasi,
    });

    return res.status(200).json({ message: "Data pendidikan berhasil diperbarui" });
  } catch (err) {
    return res.status(500).json({ message: "Terjadi kesalahan server"});
  }
};

 const getEduUser = async (req, res) => {
  try {
    const { id } = req.query; // atau req.params.id jika dari URL

    const user = await getEduUsers(id);
    if (!user) {
      return res.status(404).json({ message: "User belum menambahkan data pendidikan" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan server"});
  }
};


 const createHealthRecord = async (req, res) => {
    const { error } = healthSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const { user_id, riwayat_penyakit, memiliki_disabilitas, kontak_darurat_nama, kontak_darurat_nomor, hubungan_darurat } = req.body;

        // Periksa apakah data kesehatan sudah ada untuk user ini
        const existingHealth = await getUserHealthById(user_id);
        if (existingHealth) return res.status(400).json({ message: "Data kesehatan sudah terdaftar" });

        await createUserHealth({ user_id, riwayat_penyakit, memiliki_disabilitas, kontak_darurat_nama, kontak_darurat_nomor, hubungan_darurat });

        return res.status(201).json({ message: "Data kesehatan berhasil ditambahkan" });
    } catch (err) {
        return res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
    }
};

 const updateHealthRecord = async (req, res) => {
    const { error } = healthSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const { user_id, riwayat_penyakit, memiliki_disabilitas, kontak_darurat_nama, kontak_darurat_nomor, hubungan_darurat } = req.body;

        // Periksa apakah data kesehatan ada
        const existingHealth = await getUserHealthById(user_id);
        if (!existingHealth) return res.status(404).json({ message: "Data kesehatan tidak ditemukan" });

        await updateUserHealth({ user_id, riwayat_penyakit, memiliki_disabilitas, kontak_darurat_nama, kontak_darurat_nomor, hubungan_darurat });

        return res.status(200).json({ message: "Data kesehatan berhasil diperbarui" });
    } catch (err) {
        return res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
    }
};

 const getHealthUser = async (req, res) => {
  try {
    const { user_id } = req.query;

    const user = await getUserHealthById(user_id);
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "users tidak tersedia" }); // ← kasih return di sini
    }

    return res.status(200).json({data : user}); // hanya dijalankan kalau user ada
  } catch (error) {
    console.log(error);
    if (!res.headersSent) {
      return res.status(500).json({ message: "internal server error" });
    }
  }
};


 const reRegistrationUser = async (req, res) => {
  try {
    const { user_id } = req.query;
    const user = await getUserById(user_id);
    console.log("usernya : ",user);
    if (!user) {
      return res.status(404).json({ message: "users tidak tersedia" });
    }
    const userStatusRegistration = await getUserStatusFlag(user_id);
    console.log("status registrasi" , userStatusRegistration);
    if (!userStatusRegistration) {
      await createUserReRegistration(user_id);
      return res.status(200).json({ message: "Registrasi ulang dikirm tunnggu admin verifikasi", data: userStatusRegistration });
    }
    console.log("registarasi" , userStatusRegistration);
    if (userStatusRegistration.flag === '1') {
      return res.status(400).json({ message: "kamu sudah menjadi peserta" });
    }
    if(userStatusRegistration){
      return res.status(400).json({ message: "users sudah daftar ulang, silakan tunggu verifikasi admin", data: userStatusRegistration });
    }
  
    } catch (error) {
  }
}

 const getUserReRegistration = async (req, res) => {
  try {
    const { user_id } = req.query;

    const user = await getUserById(user_id);
    if (!user) {
      return res.status(404).json({ message: "users tidak tersedia" });
    }

    const userStatusRegistration = await getUserStatusFlag(user_id);
    if (!userStatusRegistration) {
      return res.status(404).json({ message: "users tidak tersedia" });
    }

    return res.status(200).json({data : userStatusRegistration});
  } catch (error) {
    console.log(error);
    if (!res.headersSent) {
      return res.status(500).json({ message: "internal server error" });
    }
  }
}

 const getUserFiles = async (req, res) =>{
  const { userId } = req.query;
  try {
    const files = await getUserFilesByUserId(userId);
    const formattedFiles = files.map(file => ({
      file_name: file.file_name,
      file_type: file.file_type,
      drive_link: `https://drive.google.com/file/d/${file.google_drive_file_id}/view`
    }));
    res.status(200).json({ files: formattedFiles });
  } catch (error) {
    console.error('Error fetching user files:', error);
    res.status(500).json({ error: 'Failed to fetch user files' });
  }
}

 const getUserQrcodes = async (req, res) => {
  try {
    const { user_id } = req.query;
    const user = await getUserById(user_id);
    if (!user) {
      return res.status(404).json({ message: "users tidak tersedia" });
    }

    const qrcode = await getUserQrcode(user_id);
    if (!qrcode) {
      return res.status(404).json({ message: "users tidak tersedia" });
    }
    return res.status(200).json({data : qrcode});
  } catch (error) {
    
  }
}

module.exports = {
  createEducation,
  updateEducation,
  getEduUser,
  createHealthRecord,
  updateHealthRecord,
  getHealthUser,
  reRegistrationUser,
  getUserReRegistration,
  getUserFiles,
  getUserQrcodes
};