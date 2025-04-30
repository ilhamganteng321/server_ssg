const { getConnection } = require ("../config/db.js");

 const getAllUsersStatusFlag = async (req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const [rows] = await connection.query("SELECT * FROM user_re_registration");
        if (rows.length === 0) {
            return res.status(404).json({ message: "users tidak tersedia" });
        }
        return rows;
    } catch (error) {
        console.log(error);
    }
}

 const getOneUserStatusFlag = async (user_id) => {
    let connection;
    try {
        connection = await getConnection();
        const [rows] = await connection.query("SELECT * FROM user_re_registration WHERE user_id = ?", [user_id]);
        if (rows.length === 0) {
            return null;
        }
        return rows[0];
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getAllUsersStatusFlag,
    getOneUserStatusFlag
}