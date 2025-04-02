import dayjs from "dayjs";
import Elysia from "elysia";
import mongoose, { ObjectId } from "mongoose";

import { IDocument } from "@common/types/db";

interface DBoardPost {
  board_id: ObjectId;
  user_id: ObjectId;
  title: string;
  content: string;
  created_at: string;
}
type IBoardPost = IDocument<DBoardPost>;

const BoardInfoPost = new mongoose.Schema({
  board_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  created_at: {
    type: String,
    default: dayjs().format("YYYY-MM-DD HH:mm:ss"),
  },
});
const BoardPostDB = mongoose.model<IBoardPost>("BoardPost", BoardInfoPost);

const BoardPostModel = new Elysia()
  .decorate("boardPost", {
    db: BoardPostDB,
  });

export default BoardPostModel;
