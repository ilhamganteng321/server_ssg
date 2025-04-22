// src/server.js
import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

// Pastikan port diambil dari environment atau default 3000
const PORT = process.env.PORT || 3000;
app.get('/',(req,res) =>{
  res.send('hallo bang')
})
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
