const { google } = require("googleapis");

 const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:3333/api/users/google/callback"
);

const SCOPE = [
    // 'https://www.googleapis.com/auth/userinfo.password',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
]

const authorizeUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent', // Pastikan pengguna memberikan izin baru
    scope: SCOPE,
    include_granted_scopes: true,
});

 module.exports =  authorizeUrl;