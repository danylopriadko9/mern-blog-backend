import mongoose from 'mongoose';
//создаем модель пользователя и указываем поля
const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String, // тип данных
      required: true, //обязательно ли заполнять
    },
    email: {
      type: String,
      required: true,
      unique: true, // должен ли параметр быть уникальным
    },
    passwordHash: {
      type: String,
      required: true,
    },
    avatarUrl: String,
  },
  {
    timestamps: true,
  }
);

//экспортируем модель под названием 'User'
export default mongoose.model('User', UserSchema);
