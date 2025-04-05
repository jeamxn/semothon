import Elysia, { t } from "elysia";

import getActivity from "@back/guards/getActivity";

const listQuestion = new Elysia()
  .use(getActivity)
  .get(
    "list-question",
    async ({ activity }) => {

      return {
        success: true,
        data: activity.questions || [],
      };
    },
    {
      params: t.Object({
        id: t.String({ description: "동아리 ID" }),
      }),
      response: {
        200: t.Object({
          success: t.Boolean({
            description: "조회 성공 여부",
            examples: [true],
          }),
          data: t.Array(
            t.Object({
              id: t.String({
                description: "질문 ID",
                examples: ["question1"],
              }),
              title: t.String({
                description: "질문 제목",
                examples: ["이름"],
              }),
              type: t.String({
                description: "답변 유형",
                examples: ["short", "long"],
              }),
              required: t.Boolean({
                description: "필수 답변 여부",
                examples: [true],
              }),
              maxLength: t.Optional(t.Number({
                description: "최대 글자 수",
                examples: [100],
              })),
            })
          ),
        }),
      },
      detail: {
        tags: ["Activity"],
        summary: "활동(동아리) 지원 질문 목록 조회",
        description: "활동(동아리)의 지원 질문 목록을 조회합니다.",
      },
    }
  );

export default listQuestion;
