import Elysia from "elysia";
import mongoose, { ObjectId } from "mongoose";

import { IDocument } from "@common/types/db";

import { permissionList, PermissionType } from "./joined_activity";

interface DBoardInfo {
  activity_id: ObjectId;
  name: string;
  show_permission: PermissionType;
  write_permission: PermissionType;
  comment_permission: PermissionType;
}
type IBoardInfo = IDocument<DBoardInfo>;

const BoardInfoSchema = new mongoose.Schema({
  activity_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  show_permission: {
    type: String,
    enum: permissionList,
    default: "all",
  },
  write_permission: {
    type: String,
    enum: permissionList,
    default: "member",
  },
  comment_permission: {
    type: String,
    enum: permissionList,
    default: "member",
  },
});
const BoardInfoDB = mongoose.model<IBoardInfo>("BoardInfo", BoardInfoSchema);

const BoardInfoModel = new Elysia()
  .decorate("boardInfo", {
    db: BoardInfoDB,
  });

export default BoardInfoModel;
