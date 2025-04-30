const { FonnteClient } = require('fonnte-wa');

// Initialize the client
// Note: One API key corresponds to one device in Fonnte's system
const client = new FonnteClient({
  apiKey: '5r4viyewc6Nk1KMhXzvz',
  // Optional parameters
  // baseUrl: 'https://api.fonnte.com', // Default API URL
  // timeout: 30000 // Request timeout in milliseconds
});

 async function sendTextMessage(nomor_hp, kode_otp) {
  const response = await client.sendMessage({
    target: nomor_hp, // Target phone number with country code
    message: `Hallo dari lpm SSG (Santri Siap Guna)! ${kode_otp}`
});
  
  // console.log(response);
}

 async function sendOtpForgotPassword(nomor_hp, kode_otp) {
  const response = await client.sendMessage({
    target: nomor_hp,
    message: `Hallo dari lpm SSG (Santri Siap Guna)! kode otp lupa passoword : ${kode_otp}`,
  });  
  // console.log(response);
}

 async function sendVerifiedUsers(nomor_hp) {
  const response = await client.sendMessage({
    target: nomor_hp, // Target phone number with country code
    message: `Hallo dari lpm SSG (Santri Siap Guna)! , selamat anda sudah terdaftar sebagai pengguna di aplikasi SSG`,
});
}

 async function sendPresenUsers(nomor_hp, nama_lengkap, jenis){
  const response = await client.sendMessage({
    target: nomor_hp, // Target phone number with country code
    message: `Hallo dari lpm SSG (Santri Siap Guna)! , ${nama_lengkap} Hari ini sudah melakukan presensi ${jenis}`,
});
}

module.exports = {
  sendTextMessage,
  sendOtpForgotPassword,
  sendVerifiedUsers,
  sendPresenUsers
}