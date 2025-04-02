import Elysia, { t } from "elysia";
import mongoose from "mongoose";

import { IDocument } from "@common/types/db";

import { permissionList, PermissionType } from "./joined_activity";

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
  edit_permission: PermissionType;

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
export type IActivity = IDocument<DActivity>;

export const activityElysiaSchema = t.Object({

  name: t.String({
    description: "활동(동아리) 이름",
    examples: ["LUNA", "웹 개발 동아리"],
  }),
  headline: t.String({
    description: "활동(동아리) 한 줄 소개",
    examples: ["세상을 비추는 달", "웹 개발 동아리입니다."],
  }),
  edit_permission: t.String({
    enum: permissionList,
    description: "활동(동아리) 내용 수정 권한",
  }),

  big_type: t.String({
    description: "활동(동아리) 종류",
    examples: ActivityCategory,
  }),
  small_type: t.String({
    description: "활동(동아리) 소분류",
    examples: ["IT쇼셜벤처", "모바일 개발"],
  }),

  logo_url: t.String({
    description: "활동(동아리) 로고 URL",
    examples: [
      "https://example.com/logo.png",
      "https://example.com/logo.jpg",
    ],
  }),
  key_color: t.String({
    description: "활동(동아리) 키 색상",
    examples: ["#000000", "#FFFFFF"],
  }),

  video_url: t.Optional(t.Union([t.String({
    description: "활동(동아리) 소개 영상 URL",
    examples: [
      "https://www.youtube.com/watch?v=1234123",
      "https://www.youtube.com/watch?v=abcd1234",
    ],
  }), t.Null()])),
  description: t.Optional(t.Union([t.String({
    description: "활동(동아리) 소개",
    examples: [
      "이것은 동아리 소개입니다.",
      "웹 개발 동아리입니다.",
    ],
  }), t.Null()])),
  activity_history: t.Optional(t.Union([t.String({
    description: "활동(동아리) 계획",
    examples: [
      "이것은 동아리 활동 계획입니다.",
      "웹 개발 동아리입니다.",
    ],
  }), t.Null()])),
  awards: t.Optional(t.Union([
    t.Array(
      t.Object({
        type: t.String({
          description: "수상 종류",
          examples: ["대상", "장려상"],
        }),
        name: t.String({
          description: "수상 이름",
          examples: ["개쩌는대회", "웹 개발 대회"],
        }),
        date: t.Optional(t.Union([t.String({
          description: "수상 날짜",
          examples: ["2024-01-01", "2023-12-31"],
        }), t.Null()])),
      }),
    ),
    t.Null(),
  ])),
  images_url: t.Optional(t.Union([t.Array(t.String({
    description: "활동(동아리) 이미지 URL",
    examples: [
      "https://example.com/image.png",
      "https://example.com/image.jpg",
    ],
  })), t.Null()])),
  is_hidden: t.Optional(t.Union([t.Boolean({
    description: "활동(동아리) 숨김 여부",
    examples: [false, true],
  }), t.Null()])),
});

const activitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  headline: { type: String, required: true },
  edit_permission: {
    type: String,
    enum: permissionList,
    default: "member",
  },

  big_type: {
    type: String,
    enum: ActivityCategory,
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
