import dayjs from "dayjs";
import Elysia from "elysia";
import mongoose, { ObjectId } from "mongoose";

import { IDocument } from "@common/types/db";

interface DBoardComment {
  user_id: ObjectId;
  post_id: ObjectId;
  parent_id: ObjectId | null;
  comment: string;
  created_at: string;
}
type IBoardComment = IDocument<DBoardComment>;

const BoardInfoComment = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  parent_id: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },
  comment: {
    type: String,
    required: true,
  },
  created_at: {
    type: String,
    default: dayjs().format("YYYY-MM-DD HH:mm:ss"),
  },
});
const BoardCommentDB = mongoose.model<IBoardComment>("BoardComment", BoardInfoComment);

const BoardCommentModel = new Elysia()
  .decorate("boardComment", {
    db: BoardCommentDB,
  });

export default BoardCommentModel;
