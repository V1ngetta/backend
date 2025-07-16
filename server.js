const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Настройки загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});
const upload = multer({ storage });

// 🚀 Роут загрузки фото
app.post('/upload', upload.single('image'), (req, res) => {
  res.json({ url: `/uploads/${req.file.filename}` });
});

// ✅ Тестовый роут к базе
app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
  });
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
