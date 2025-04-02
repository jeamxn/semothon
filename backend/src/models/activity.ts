import Elysia, { t } from "elysia";
import mongoose, { type Document } from "mongoose";

export const ActivityCategory = [
  "center",
  "major",
  "study",
  "meeting",
  "etc",
] as const;
export type ActivityCategoryType = typeof ActivityCategory[number];

interface Award {
  type: string;
  name: string;
  date?: string;
}

interface DActivity {
  name: string;
  headline: string;

  big_type: ActivityCategoryType;
  small_type: string;

  logo_url: string;
  key_color: string;

  video_url?: string;
  description?: string;
  activity_history?: string;
  awards?: Award[];
  images_url?: string[];

  is_hidden?: boolean;
}
export type IActivity = Document<DActivity> & DActivity;

export const activityElysiaSchema = t.Object({
  // type: t.Union(
  //   ActivityCategory.map((category) => t.Literal(category)),
  // ),
  
  name: t.String(),
  headline: t.String(),

  big_type: t.String(),
  small_type: t.String(),

  logo_url: t.String(),
  key_color: t.String(),

  video_url: t.Optional(t.Union([t.String(), t.Null()])),
  description: t.Optional(t.Union([t.String(), t.Null()])),
  activity_history: t.Optional(t.Union([t.String(), t.Null()])),
  awards: t.Optional(t.Union([
    t.Array(
      t.Object({
        type: t.String(),
        name: t.String(),
        date: t.Optional(t.Union([t.String(), t.Null()])),
      }),
    ),
    t.Null(),
  ])),
  images_url: t.Optional(t.Union([t.Array(t.String()), t.Null()])),
  is_hidden: t.Optional(t.Union([t.Boolean(), t.Null()])),
});

const activitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  headline: { type: String, required: true },

  big_type: {
    type: String,
    enum: ["center", "major", "study", "meeting", "etc"],
    required: true,
  },
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
  is_hidden: { type: Boolean, default: false },
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
