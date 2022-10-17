import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  //парсим токен, убирая ненужный префикс и пробелы
  const token = (req.headers.authorization || '').replace('Bearer', '').trim();
  if (token) {
    try {
      //расшифровываем токен
      const decoded = jwt.verify(token, 'secret123');
      req.userId = decoded._id;
      next();
    } catch (error) {
      return res.status(403).json({
        message: 'Нет доступа',
      });
    }
  } else {
    return res.status(403).json({
      message: 'Нет доступа',
    });
  }
};
