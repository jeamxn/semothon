import dayjs from "dayjs";
import Elysia, { t } from "elysia";

import ActivityModel from "@back/models/activity";
import exit, { errorElysia } from "@back/utils/error";

const listRecruiting = new Elysia()
  .use(ActivityModel)
  .get(
    "list-recruiting",
    async ({ activityModel, error }) => {
      const now = dayjs().format("YYYY-MM-DD HH:mm:ss");

      const activities = await activityModel.db.find({
        $or: [
          { is_always_recruiting: true },
          {
            document_screening_period: {
              $exists: true,
              $ne: null,
            },
            "document_screening_period.start": { $lte: now },
            "document_screening_period.end": { $gte: now },
          },
        ],
        is_hidden: { $ne: true },
      }).select("_id name headline logo_url key_color big_type small_type document_screening_period is_always_recruiting");

      if (!activities) {
        return exit(error, "FETCH_ACTIVITIES_FAILED");
      }

      return {
        success: true,
        data: activities.map((activity: any) => ({
          _id: activity._id.toString(),
          name: activity.name,
          headline: activity.headline,
          logo_url: activity.logo_url,
          key_color: activity.key_color,
          big_type: activity.big_type,
          small_type: activity.small_type,
          document_screening_period: activity.document_screening_period,
          is_always_recruiting: activity.is_always_recruiting,
        })),
      };
    },
    {
      response: {
        200: t.Object({
          success: t.Boolean({
            description: "조회 성공 여부",
            examples: [true],
          }),
          data: t.Array(
            t.Object({
              _id: t.String({
                description: "활동(동아리) ID",
                examples: ["507f1f77bcf86cd799439011"],
              }),
              name: t.String({
                description: "활동(동아리) 이름",
                examples: ["LUNA"],
              }),
              headline: t.String({
                description: "활동(동아리) 한 줄 소개",
                examples: ["세상을 비추는 달"],
              }),
              logo_url: t.String({
                description: "활동(동아리) 로고 URL",
                examples: ["https://example.com/logo.png"],
              }),
              key_color: t.String({
                description: "활동(동아리) 키 색상",
                examples: ["#000000"],
              }),
              big_type: t.String({
                description: "활동(동아리) 종류",
                examples: ["center", "major", "study", "meeting", "etc"],
              }),
              small_type: t.String({
                description: "활동(동아리) 소분류",
                examples: ["IT쇼셜벤처"],
              }),
              document_screening_period: t.Optional(t.Object({
                start: t.String({
                  description: "서류 전형 시작일",
                  examples: ["2025-03-07 21:00:00"],
                }),
                end: t.String({
                  description: "서류 전형 종료일",
                  examples: ["2025-03-14 21:00:00"],
                }),
              })),
              is_always_recruiting: t.Optional(t.Boolean({
                description: "상시 모집 여부",
                examples: [false],
              })),
            })
          ),
        }),
        ...errorElysia(["FETCH_ACTIVITIES_FAILED"]),
      },
      detail: {
        tags: ["Activity"],
        summary: "모집 중인 활동(동아리) 목록 조회",
        description: "현재 모집 중인 활동(동아리) 목록을 조회합니다. 상시 모집이거나 서류 전형 기간 내인 활동(동아리)이 조회됩니다.",
      },
    }
  );

export default listRecruiting; 