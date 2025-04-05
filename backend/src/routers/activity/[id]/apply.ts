import Elysia, { t } from "elysia";

import getActivity from "@back/guards/getActivity";
import getUser from "@back/guards/getUser";
import ApplicationModel, { ApplicationStatus, ApplicationStage } from "@back/models/application";
import exit, { errorElysia } from "@back/utils/error";

const apply = new Elysia()
  .use(getUser)
  .use(getActivity)
  .use(ApplicationModel)
  .post(
    "apply",
    async ({ body, user, activity, applicationModel, error }) => {
      try {
        const existingApplication = await applicationModel.db.findOne({
          userId: user._id,
          activityId: activity._id,
        });

        if (existingApplication) {
          return exit(error, "ALREADY_APPLIED");
        }

        await applicationModel.db.create({
          userId: user._id,
          activityId: activity._id,
          answers: body.answers,
          status: ApplicationStatus.PENDING,
          currentStage: ApplicationStage.DOCUMENT,
        });

        return {
          success: true,
          message: "지원하였습니다."
        };
      } catch (err) {
        console.log(err);
        return exit(error, "CREATE_FAILED");
      }
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
              examples: ["안녕하세요, 저는..."],
            }),
            fileUrl: t.Optional(t.String({
              description: "첨부 파일 URL",
              examples: ["https://example.com/file.pdf"],
            })),
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
        ),
      }),
      response: {
        200: t.Object({
          success: t.Boolean({
            description: "지원 성공 여부",
            examples: [true],
          }),
          message: t.String({
            description: "지원 성공 메시지",
            examples: ["지원하였습니다."],
          }),
        }),
        ...errorElysia(["ALREADY_APPLIED", "CREATE_FAILED"]),
      },
      detail: {
        tags: ["Application"],
        summary: "활동(동아리) 지원",
        description: "활동(동아리)에 지원합니다.",
      },
    }
  );

export default apply;