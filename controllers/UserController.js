import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import UserModel from '../models/User.js';

export const register = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      passwordHash: hash,
      avatar: req.body.avatarUrl,
    });

    // сохраняем юзера в базе данных
    const user = await doc.save();

    // генерируем токен _id
    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      {
        expiresIn: '30d',
      }
    );

    // вытасктваем захешированный пароль из обьекта юзера
    const { passwordHash, ...userData } = user._doc;
    //возвращаем обьект юзера без хеша пароля
    res.json({ ...userData, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось зарегестрироваться',
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден',
      });
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );
    if (!isValidPass) {
      return res.status(400).json({
        message: 'Неверный логин или пароль',
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      {
        expiresIn: '30d',
      }
    );

    // вытасктваем захешированный пароль из обьекта юзера
    const { passwordHash, ...userData } = user._doc;
    //возвращаем обьект юзера без хеша пароля
    res.json({ ...userData, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось авторизоваться',
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: 'Возникла ошибка при получении данных',
      });
    }

    //  вытаскиваем юзера и возвращаем его клиенту
    const { passwordHash, ...userData } = user._doc;
    res.json(userData);
  } catch (error) {
    return res.status(404).json({
      message: 'Возникла ошибка при получении данных',
    });
  }
};
