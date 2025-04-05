import Elysia, { t } from "elysia";

import getApplication from "@back/guards/getApplication";
import getUser from "@back/guards/getUser";
import { ApplicationStatus, ApplicationStage } from "@back/models/application";
import JoinedActivityModel from "@back/models/joined_activity";
import exit, { errorElysia } from "@back/utils/error";

const status = new Elysia()
  .use(getUser)
  .use(JoinedActivityModel)
  .use(getApplication)
  .patch(
    "status",
    async ({ body, user, joinedActivityModel, application, applicationModel, error }) => {
      const { status, interviewTime, interviewLocation, interviewNotes } = body;

      const user_id = user._id;
      const activity_id = application.activityId;
      const joined_activity = await joinedActivityModel.db.find({
        activity_id,
        user_id,
        permission: {
          $in: ["president", "vice_president"],
        }
      });
      if (!joined_activity || joined_activity.length < 1) return exit(error, "UNAUTHORIZED");

      let currentStage = application.currentStage;
      if (status === ApplicationStatus.DOCUMENT_PASSED) {
        currentStage = ApplicationStage.INTERVIEW;
      } else if (status === ApplicationStatus.INTERVIEW_PASSED) {
        currentStage = ApplicationStage.FINAL;
      }

      const updateData = {
        status,
        currentStage,
        ...(interviewTime && { interviewTime }),
        ...(interviewLocation && { interviewLocation }),
        ...(interviewNotes && { interviewNotes }),
      };

      const updated = await applicationModel.db.updateOne(
        { _id: application._id },
        { $set: updateData },
      );

      if (!updated || updated.matchedCount < 1) {
        return exit(error, "UPDATE_FAILED");
      }

      return {
        success: true,
        message: "지원서 상태가 변경되었습니다.",
      };
    },
    {
      body: t.Object({
        status: t.Enum(ApplicationStatus, {
          description: "변경할 지원서 상태",
          examples: [ApplicationStatus.DOCUMENT_PASSED],
        }),
        interviewTime: t.Optional(t.String({
          description: "면접 시간 (YYYY-MM-DD HH:mm:ss)",
          examples: ["2025-03-20 14:00:00"],
        })),
        interviewLocation: t.Optional(t.String({
          description: "면접 장소",
          examples: ["공학관 101호"],
        })),
        interviewNotes: t.Optional(t.String({
          description: "면접 관련 메모",
          examples: ["필기구 지참 필수"],
        })),
      }),
      response: {
        200: t.Object({
          success: t.Boolean({
            description: "상태 변경 성공 여부",
            examples: [true],
          }),
          message: t.String({
            description: "상태 변경 성공 메시지",
            examples: ["지원서 상태가 변경되었습니다."],
          }),
        }),
        ...errorElysia(["UPDATE_FAILED", "UNAUTHORIZED"]),
      },
      detail: {
        tags: ["Application"],
        summary: "지원서 상태 변경",
        description: "지원서의 상태를 변경합니다. 서류 합격 시 면접 정보를 함께 입력할 수 있습니다. 활동(동아리) 회장/부회장만 접근 가능합니다.",
      },
    }
  );

export default status;