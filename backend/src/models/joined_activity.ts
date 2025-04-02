import dayjs from "dayjs";
import Elysia from "elysia";
import mongoose, { ObjectId } from "mongoose";

import { IDocument } from "@common/types/db";

export const permissionList = [
  // 위로 갈수록 권한이 높음
  "president",
  "vice_president",
  "member",
  // 아래로 갈수록 권한이 낮음
] as const;
export type PermissionType = typeof permissionList[number];

interface DJoinedActivity {
  activity_id: ObjectId;
  user_id: ObjectId;
  permission: PermissionType;
  joined_at: String;
}
type IJoinedActivity = IDocument<DJoinedActivity>;

const joinedActivitySchema = new mongoose.Schema({
  activity_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  permission: {
    type: String,
    enum: ["president", "vice_president", "member"],
    default: "member",
  },
  joined_at: {
    type: String,
    default: dayjs().format("YYYY-MM-DD HH:mm:ss"),
  },
});
const JoinedActivityDB = mongoose.model<IJoinedActivity>("JoinedActivity", joinedActivitySchema);

const findByActivityIdAndUserId = async ({
  activity_id,
  user_id,
}: {
  activity_id: ObjectId;
  user_id: ObjectId;
}): Promise<IJoinedActivity[] | null> => {
  const joinedActivity = await JoinedActivityDB.find({
    activity_id,
    user_id,
  });
  return joinedActivity;
};

const JoinedActivityModel = new Elysia()
  .decorate("joinedActivityModel", {
    db: JoinedActivityDB,
    find: findByActivityIdAndUserId,
  });

export default JoinedActivityModel;
