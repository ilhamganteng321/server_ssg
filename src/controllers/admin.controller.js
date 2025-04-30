const { sendVerifiedUsers } = require('../lib/fonnteService.js');
const { getAllUsersStatusFlag } = require('../models/admin.models.js');
const {
  createUserQrcode,
  getUserQrcode,
  getUserStatusFlag,
  updateUserStatusFlag
} = require('../models/user.bio.models.js');
const {
  getUserById,
  getUserRole,
  updateUserRole
} = require('../models/user.model.js');


 const activateUser = async (req, res) => {
    try {
        const { user_id } = req.query;
        const user = await getUserById(user_id);
        if (!user) {
            return res.status(404).json({ message: "users tidak tersedia" });
        }

        const userStatusRegistration = await getUserStatusFlag(user_id);
        if (!userStatusRegistration) {
            return res.status(404).json({ message: "users belum tersedia" });
        }

        if (userStatusRegistration.flag === 1) {
            return res.status(400).json({ message: "users sudah aktif" });
        }

        const userRole = await getUserRole(user_id);
        if (!userRole) {
            return res.status(404).json({ message: "users tidak tersedia" });
        }
        if (userRole.role === '1a' || userRole.role === '1b') {
            return res.status(400).json({ message: "users sudah aktif" });
        }
        await updateUserRole(user_id, '1a');
        const userQrcode = await getUserQrcode(user_id);
        if (userQrcode) {
            return res.status(400).json({ message: "users sudah aktif" });
        }
        await createUserQrcode(user_id);
        const userStatus = await getUserStatusFlag(user_id);
        if (!userStatus) {
            return res.status(404).json({ message: "users belum tersedia" });
        }
        await updateUserStatusFlag(user_id);
        
        await sendVerifiedUsers(user.nomor_hp);
        return res.status(200).json({ message: "users sudah aktif" });
    } catch (error) {
        console.log(error);
        if (!res.headersSent) {
            return res.status(500).json({ message: "internal server error" });
        }
    }
}

 const getUserStatusFlagUsers = async (req, res) => {
    try {
        const userFlag = await getAllUsersStatusFlag();
        
        if(!userFlag){
            res.status(400).json({message : "gagal mengambil data"})
        }
        return res.status(200).json({data : userFlag});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message : "internal error"})
    }
}

 const getUserStatusFlagOne = async (req, res) => {
    try {
        const { user_id } = req.query;
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

module.exports = {
    activateUser,
    getUserStatusFlagUsers,
    getUserStatusFlagOne
}