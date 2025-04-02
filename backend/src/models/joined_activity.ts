import Elysia from "elysia";
import mongoose, { ObjectId, type Document } from "mongoose";

interface DJoinedActivity {
  activityId: ObjectId;
  userId: ObjectId;
  permission: "president" | "vice_president" | "member";
  joinedAt: String;
}
type IJoinedActivity = Document<DJoinedActivity> & DJoinedActivity;

const joinedActivitySchema = new mongoose.Schema({
  email: { type: String, required: true },
  picture: { type: String, required: true },
  name: { type: String, required: true },
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
