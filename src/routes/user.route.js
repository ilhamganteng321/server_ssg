// src/routes/user.route.js
import express from 'express';
import multer from 'multer';
import { forgotPasswordUser, getKodePos, getUsers, googleLogin, googleLoginCb, loginUser, logoutUser, registerUser, verifyOTP } from '../controllers/user.controller.js';
import { createEducation, createHealthRecord, getEduUser, getHealthUser, getUserFiles, getUserQrcodes, getUserReRegistration, reRegistrationUser, updateEducation, updateHealthRecord } from '../controllers/user.bio.controller.js';
import { authorize, createFolder, uploadFile } from '../lib/googleDrive.js';
import { getUserById } from '../models/user.model.js';
import {getConnection} from '../config/db.js';
import { handlePresensi } from '../controllers/presensi.controller.js';
import { getIbadahByDate, getIbadahByMonth, inputMyUsers } from '../controllers/user.my.controller.js';
import { getUserFilesByUserId } from '../models/user.bio.models.js';
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.get('/', getUsers);
router.get('/kodepos', getKodePos);
router.post('/login',loginUser);
router.post('/register',registerUser);
router.post('/logout',logoutUser);
router.post('/verify', verifyOTP);
router.get('/google', googleLogin);
router.get('/google/callback', googleLoginCb);
router.post('/create-education', createEducation)
router.post('/edit-education', updateEducation)
router.get('/get-education', getEduUser)
router.post('/forgot-password', forgotPasswordUser);
router.post('/create-health', createHealthRecord);
router.post('/edit-health', updateHealthRecord);
router.get('/get-health', getHealthUser);
router.post('/re-registration', reRegistrationUser);
router.get('/get-status-flag', getUserReRegistration);
router.post('/presensi', handlePresensi);
router.get('/user-files', getUserFiles);
router.post('/input-my', inputMyUsers);
router.get('/get-ibadah-date', getIbadahByDate);
router.get('/get-ibadah-month', getIbadahByMonth);
router.get('/user-qrcode', getUserQrcodes);
router.post('/upload-files', upload.array('files'), async (req, res) => {
  const connection = await getConnection();
  try {
    const authClient = await authorize();
    const { id } = req.query;
    console.log("received files", req.files); // Perhatikan ini adalah req.files (bukan req.file)
    
    if (!id) {
      return res.status(400).json({ error: "Missing user ID in request body" });
    }
    
    const userRows = await getUserById(id);
    const user = userRows;
    if (!user) {
      return res.status(400).json({ error: "Missing user ID" });
    }
    
    const userFiles = await getUserFilesByUserId(id);
    if (userFiles.length > 0) {
      return res.status(400).json({ message: "pengguna sudah mengirim file" });
    }
    
    const folderName = user.nama_lengkap;
    const parentFolderId = "1PpgOlD9Mwh_ZX1OGOr7p6XhSOxw6RMWU";
    const userFolderId = await createFolder(authClient, folderName, parentFolderId);

    const files = req.files;
    // Pastikan urutan file yang diupload sesuai dengan urutan ini
    const fileTypes = ['ktp', 'pas_foto', 'surat_izin', 'surat_kesehatan', 'bukti_pembayaran', 'tertanda'];

    // Validasi jumlah file
    if (files.length !== fileTypes.length) {
      return res.status(400).json({ 
        message: `Jumlah file tidak sesuai. Harap upload ${fileTypes.length} file termasuk tanda tangan.`,
        expected: fileTypes.length,
        received: files.length
      });
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileType = fileTypes[i];
      const googleDriveFileId = await uploadFile(
        authClient,
        file.path,
        file.originalname,
        file.mimetype,
        userFolderId
      );

      await connection.execute(
        `INSERT INTO user_files (user_id, file_name, file_type, google_drive_file_id)
         VALUES (?, ?, ?, ?)`,
        [id, file.originalname, fileType, googleDriveFileId]
      );
    }

    res.status(200).json({ message: 'Files uploaded successfully' });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ message: 'Error uploading files', error: error.message });
  } finally {
    connection.release();
  }
});


export default router;
