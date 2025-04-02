import Elysia, { t } from "elysia";

import activityAuthorityService from "@back/guards/activityAuthorityService";
import { activityElysiaSchema } from "@back/models/activity";
import exit from "@back/utils/error";

const basic_update = new Elysia()
  .use(activityAuthorityService("vice_president"))
  .post(
    "basic",
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
          name: activityElysiaSchema.properties.name,
          edit_permission: activityElysiaSchema.properties.edit_permission,
          big_type: activityElysiaSchema.properties.big_type,
          small_type: activityElysiaSchema.properties.small_type,
          logo_url: activityElysiaSchema.properties.logo_url,
          key_color: activityElysiaSchema.properties.key_color,
          is_hidden: activityElysiaSchema.properties.is_hidden,
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
      },
      detail: {
        tags: ["Activity"],
        summary: "활동(동아리) 기본 정보 수정하기",
        description: "1개의 활동(동아리)의 정보를 수정합니다.",
      }
    },
  );

export default basic_update;
