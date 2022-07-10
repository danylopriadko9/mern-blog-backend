import mongoose from 'mongoose';
//создаем модель поста и указываем поля
const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String, // тип данных
      required: true, //обязательно ли заполнять
    },
    text: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
      default: [],
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    imageUrl: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // связь между таблицами
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

//экспортируем модель под названием 'Post'
export default mongoose.model('Post', PostSchema);
