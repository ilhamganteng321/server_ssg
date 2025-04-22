import { sendVerifiedUsers } from "../lib/fonnteService.js";
import { createUserQrcode, getUserQrcode, getUserStatusFlag, updateUserStatusFlag } from "../models/user.bio.models.js";
import { getUserById, getUserRole, updateUserRole } from "../models/user.model.js";

export const activateUser = async (req, res) => {
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