import dayjs from "dayjs";
import Elysia, { t } from "elysia";

import applicationAuthorityService from "@back/guards/applicationAuthorityService";
import getApplication from "@back/guards/getApplication";
import exit, { errorElysia } from "@back/utils/error";

const update = new Elysia()
  .use(getApplication)
  .use(applicationAuthorityService())
  .patch(
    "",
    async ({ body, application, applicationModel, error }) => {
      const activity = application.activityId;
      if (!activity.document_screening_period) {
        return exit(error, "NOT_RECRUITING_PERIOD");
      }
      
      if (dayjs(new Date()).isSameOrBefore(dayjs(activity.document_screening_period.end, "YYYY-MM-DD HH:mm:ss"))) {
        return exit(error, "RECRUITMENT_ENDED");
      }

      const updateData = {
        ...body,
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
        message: "지원서 수정되었습니다.",
      };
    },
    {
      body: t.Object({
        answers: t.Array(
          t.Object({
            questionId: t.String({
              description: "질문 ID",
              examples: ["question1"],
            }),
            answer: t.String({
              description: "답변 내용",
              examples: ["안녕하세요, 저는 열정적인 개발자입니다."],
            }),
            fileUrl: t.Optional(t.String({
              description: "첨부 파일 URL (선택사항)",
              examples: ["https://example.com/resume.pdf"],
            }))
          }),
          {
            description: "질문에 대한 답변 목록",
            examples: [[
              {
                questionId: "question1",
                answer: "홍길동",
              },
              {
                questionId: "question2",
                answer: "안녕하세요, 저는 열정적인 개발자입니다.",
                fileUrl: "https://example.com/resume.pdf"
              }
            ]]
          }
        )
      }),
      response: {
        200: t.Object({
          success: t.Boolean({
            description: "지원서 수정 성공 여부",
            examples: [true],
          }),
          message: t.String({
            description: "지원서 수정 성공 메시지",
            examples: ["지원서 수정되었습니다."],
          }),
        }),
        ...errorElysia(["UPDATE_FAILED", "RECRUITMENT_ENDED", "NO_APPLICATION", "NOT_RECRUITING_PERIOD"]),
      },
      detail: {
        tags: ["Application"],
        summary: "지원서 수정",
        description: "지원서의 답변을 수정합니다.",
      },
    }
  );

export default update;