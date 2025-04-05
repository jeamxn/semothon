import Elysia, { t } from "elysia";
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

export const boardInfoElysiaSchema = t.Object({
  activity_id: t.String({
    description: "활동(동아리) ID",
    examples: ["646c8e4b1a2f2e001c9b5d3e"],
  }),
  name: t.String({
    description: "게시판 이름",
    examples: ["자유 게시판"],
  }),
  show_permission: t.String({
    description: "게시판 조회 권한",
    examples: ["all", "member", "vice_president", "president"],
  }),
  write_permission: t.String({
    description: "게시판 작성 권한",
    examples: ["all", "member", "vice_president", "president"],
  }),
  comment_permission: t.String({
    description: "게시판 댓글 권한",
    examples: ["all", "member", "vice_president", "president"],
  }),
});

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
