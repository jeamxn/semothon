import Elysia from "elysia";
import mongoose, { type Document } from "mongoose";

interface DActivity {
  type: "center" | "major" | "study" | "meeting" | "etc";

  name: string;
  headline: string;
  big_type: string;
  small_type: string;

  logo_url: string;
  key_color: string;

  video_url?: string;
  description?: string;
  activity_history?: string;
  awards?: {
    type: string;
    name: string;
    date?: string;
  }[];
  images_url?: string[];
}
type IActivity = Document<DActivity> & DActivity;

const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["center", "major", "study", "meeting", "etc"],
    required: true,
  },
  name: { type: String, required: true },
  headline: { type: String, required: true },
  big_type: { type: String, required: true },
  small_type: { type: String, required: true },

  logo_url: { type: String, required: true },
  key_color: { type: String, required: true },

  video_url: { type: String },
  description: { type: String },
  activity_history: { type: String },
  awards: [
    {
      type: { type: String, required: true },
      name: { type: String, required: true },
      date: { type: String },
    },
  ],
  images_url: [{ type: String }],
});
const ActivityDB = mongoose.model<IActivity>("Activity", activitySchema);

const createActivity = async (data: DActivity): Promise<IActivity> => {
  const activity = new ActivityDB(data);
  await activity.save();
  return activity;
};

const ActivityModel = new Elysia()
  .decorate("activityModel", {
    db: ActivityDB,
    create: createActivity,
  });

export default ActivityModel;
