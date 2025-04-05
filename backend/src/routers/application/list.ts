import dayjs from "dayjs";
import Elysia, { t } from "elysia";
import { ObjectId } from "mongoose";

import getUser from "@back/guards/getUser";
import ApplicationModel from "@back/models/application";

interface ApplicationResponse {
  _id: string;
  userId: string;
  activityId: string;
  answers: Array<{
    questionId: string;
    answer: string;
    fileUrl?: string;
  }>;
  status: string;
  currentStage: number;
  createdAt: string;
  updatedAt: string;
}

const list = new Elysia()
  .use(getUser)
  .use(ApplicationModel)
  .get(
    "",
    async ({ user, applicationModel }) => {
      const applications = await applicationModel.db
        .find({ userId: (user._id as ObjectId).toString() })
        .lean() as unknown as ApplicationResponse[];

      return applications.map(application => ({
        ...application,
        _id: application._id.toString(),
        userId: application.userId.toString(),
        activityId: application.activityId.toString(),
        createdAt: dayjs(application.createdAt).format("YYYY-MM-DD HH:mm:ss"),
        updatedAt: dayjs(application.updatedAt).format("YYYY-MM-DD HH:mm:ss")
      }));
    }, {
      detail: {
        tags: ["Application"],
        summary: "지원서 목록 조회",
        description: "사용자가 제출한 지원서 목록을 조회합니다.",
      },
      response: {
        200: t.Array(
          t.Object({
            _id: t.String({
              description: "지원서 ID",
              examples: ["507f1f77bcf86cd799439011"],
            }),
            userId: t.String({
              description: "지원자 ID",
              examples: ["507f1f77bcf86cd799439012"],
            }),
            activityId: t.String({
              description: "활동(동아리) ID",
              examples: ["507f1f77bcf86cd799439013"],
            }),
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
                  description: "첨부 파일 URL",
                  examples: ["https://example.com/resume.pdf"],
                }))
              }),
              {
                description: "질문에 대한 답변 목록"
              }
            ),
            status: t.String({
              description: "지원서 상태",
              examples: ["pending"],
            }),
            currentStage: t.Number({
              description: "현재 단계",
              examples: [0],
            }),
            createdAt: t.String({
              description: "생성 일시",
              examples: ["2025-03-14 12:00:00"],
            }),
            updatedAt: t.String({
              description: "수정 일시",
              examples: ["2025-03-14 12:00:00"],
            })
          }, {
            description: "지원서 정보"
          })
        ),
      }
    });

export default list;