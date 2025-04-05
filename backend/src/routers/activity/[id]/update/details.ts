import Elysia, { t } from "elysia";

import activityAuthorityService from "@back/guards/activityAuthorityService";
import { activityElysiaSchema } from "@back/models/activity";
import exit, { errorElysia } from "@back/utils/error";

const details = new Elysia()
  .use(activityAuthorityService())
  .post(
    "details",
    async ({ activity, body, activityModel, error }) => {
      const updated = await activityModel.db.updateOne(
        { _id: activity._id },
        {
          $set: {
            ...body,
          },
        }
      );
      if (!updated || updated.matchedCount < 1) {
        return exit(error, "UPDATE_FAILED");
      }
      return {
        success: true,
        message: "활동(동아리) 정보 수정 성공",
      };
    },
    {
      body: t.Partial(
        t.Object({
          headline: activityElysiaSchema.properties.headline,
          video_url: activityElysiaSchema.properties.video_url,
          description: activityElysiaSchema.properties.description,
          activity_history: activityElysiaSchema.properties.activity_history,
          awards: activityElysiaSchema.properties.awards,
          images_url: activityElysiaSchema.properties.images_url,
          questions: activityElysiaSchema.properties.questions,
          is_hidden: activityElysiaSchema.properties.is_hidden,
          is_always_recruiting: activityElysiaSchema.properties.is_always_recruiting,
          document_screening_period: activityElysiaSchema.properties.document_screening_period,
          document_result_date: activityElysiaSchema.properties.document_result_date,
          interview_period: activityElysiaSchema.properties.interview_period,
          interview_result_date: activityElysiaSchema.properties.interview_result_date,
          final_result_date: activityElysiaSchema.properties.final_result_date,
        })
      ),
      response: {
        200: t.Object({
          success: t.Boolean({
            description: "활동(동아리) 정보 수정 성공 여부",
            examples: [true],
          }),
          message: t.String({
            description: "활동(동아리) 정보 수정 성공 메시지",
            examples: ["활동(동아리) 정보 수정 성공"],
          }),
        }),
        ...errorElysia(["UPDATE_FAILED"]),
      },
      detail: {
        tags: ["Activity"],
        summary: "활동(동아리) 세부 정보 수정하기",
        description: "1개의 활동(동아리)의 정보를 수정합니다.",
      }
    },
  );

export default details;
