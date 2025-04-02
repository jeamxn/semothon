import dayjs from "dayjs";
import Elysia from "elysia";
import mongoose, { ObjectId, type Document } from "mongoose";

interface DJoinedActivity {
  activity_id: ObjectId;
  user_id: ObjectId;
  permission: "president" | "vice_president" | "member";
  joined_at: String;
}
type IJoinedActivity = Document<DJoinedActivity> & DJoinedActivity;

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
  activityId,
  userId,
}: {
  activityId: ObjectId;
  userId: ObjectId;
}): Promise<IJoinedActivity[] | null> => {
  const joinedActivity = await JoinedActivityDB.find({
    activityId,
    userId,
  });
  return joinedActivity;
};

const JoinedActivityModel = new Elysia()
  .decorate("joinedActivityModel", {
    db: JoinedActivityDB,
    find: findByActivityIdAndUserId,
  });

export default JoinedActivityModel;
