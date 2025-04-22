import { FonnteClient } from 'fonnte-wa';

// Initialize the client
// Note: One API key corresponds to one device in Fonnte's system
const client = new FonnteClient({
  apiKey: '5r4viyewc6Nk1KMhXzvz',
  // Optional parameters
  // baseUrl: 'https://api.fonnte.com', // Default API URL
  // timeout: 30000 // Request timeout in milliseconds
});

export async function sendTextMessage(nomor_hp, kode_otp) {
  const response = await client.sendMessage({
    target: nomor_hp, // Target phone number with country code
    message: `Hallo dari lpm SSG (Santri Siap Guna)! ${kode_otp}`
});
  
  // console.log(response);
}

export async function sendOtpForgotPassword(nomor_hp, kode_otp) {
  const response = await client.sendMessage({
    target: nomor_hp,
    message: `Hallo dari lpm SSG (Santri Siap Guna)! kode otp lupa passoword : ${kode_otp}`,
  });  
  // console.log(response);
}

export async function sendVerifiedUsers(nomor_hp) {
  const response = await client.sendMessage({
    target: nomor_hp, // Target phone number with country code
    message: `Hallo dari lpm SSG (Santri Siap Guna)! , selamat anda sudah terdaftar sebagai pengguna di aplikasi SSG`,
});
}