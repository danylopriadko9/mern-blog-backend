import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';

import { UserController, PostController } from './controllers/index.js';

import {
  loginValidation,
  postCreateValidation,
  registerValidation,
} from './validations.js';
import { checkAuth, handelValidationsErrors } from './utils/index.js';

//подключаем db и отлавливаем ошибку подключения
mongoose
  .connect(
    'mongodb+srv://admin:admin@cluster0.ffcgpxg.mongodb.net/blog?retryWrites=true&w=majority'
  )
  .then(() => console.log('DB OK'))
  .catch((err) => console.log('DB ERROR', err));

//создаем обьект который будет представлять приложение
const app = express();

// создаем хранилище , где будут храниться все изображения
const storage = multer.diskStorage({
  // указываем папку хранилища
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  // вытаскиваем оригинальное имя
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
//учим express читать json запросы
app.use(express.json());
// разрешаем отправку запросов на сервер с других доменов
app.use(cors());

//req - хранится информация которую прислал клиент
//res - ответ от сервера

// проверка логина
app.post(
  '/auth/login',
  loginValidation,
  handelValidationsErrors,
  UserController.login
);

// регистрация
app.post(
  '/auth/register',
  registerValidation,
  handelValidationsErrors,
  UserController.register
);

// информация о профиле
app.get('/auth/me', checkAuth, UserController.getMe);

app.use('/uploads', express.static('uploads'));

// загрузка изображения
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get('/tags', PostController.getLastTags);
app.get('/posts/tags', PostController.getLastTags);

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, PostController.update);
app.post(
  '/posts',
  checkAuth,
  handelValidationsErrors,
  postCreateValidation,
  PostController.create
);

//указываем порт на котором будет работать сервер и отлавливаем возможную ошибку
app.listen(4444, (err) => {
  if (err) return console.log(err);
  console.log('Server OK');
});
