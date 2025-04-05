import Elysia, { t } from "elysia";
import mongoose from "mongoose";

import { IDocument } from "@common/types/db";

interface Answer {
  questionId: string;
  answer: string;
  fileUrl?: string;
}

interface DApplication {
  userId: string;
  activityId: string;
  answers: Answer[];
  status: "pending" | "accepted" | "rejected";
  currentStage: number;
}

export type IApplication = IDocument<DApplication>;

export const applicationElysiaSchema = t.Object({
  userId: t.String({
    description: "지원자 ID",
    examples: ["user123"],
  }),
  activityId: t.String({
    description: "활동(동아리) ID",
    examples: ["activity123"],
  }),
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
    })
  ),
  status: t.String({
    description: "지원서 상태",
    examples: ["pending", "accepted", "rejected"],
  }),
  currentStage: t.Number({
    description: "현재 단계",
    examples: [0],
  }),
});

export enum ApplicationStatus {
  PENDING = "pending", // 제출 후 대기
  DOCUMENT_PASSED = "document_passed", // 서류 합격
  DOCUMENT_FAILED = "document_failed", // 서류 불합격
  INTERVIEW_PASSED = "interview_passed", // 면접 합격
  INTERVIEW_FAILED = "interview_failed", // 면접 불합격
  FINAL_PASSED = "final_passed", // 최종 합격
  FINAL_FAILED = "final_failed", // 최종 불합격
}

export enum ApplicationStage {
  DOCUMENT = 0, // 서류 단계
  INTERVIEW = 1, // 면접 단계
  FINAL = 2, // 최종 단계
}

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    activityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Activity",
      required: true,
    },
    answers: [
      {
        questionId: {
          type: String,
          required: true,
        },
        answer: {
          type: String,
          required: true,
        },
        fileUrl: {
          type: String,
          required: false,
        },
      },
    ],
    status: {
      type: String,
      enum: Object.values(ApplicationStatus),
      default: ApplicationStatus.PENDING,
      required: true,
    },
    currentStage: {
      type: Number,
      enum: [ApplicationStage.DOCUMENT, ApplicationStage.INTERVIEW, ApplicationStage.FINAL],
      default: ApplicationStage.DOCUMENT,
      required: true,
    },
    interviewTime: {
      type: Date,
      required: false,
    },
    interviewLocation: {
      type: String,
      required: false,
    },
    interviewNotes: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const ApplicationDB = mongoose.model("Application", applicationSchema);

const ApplicationModel = new Elysia()
  .decorate("applicationModel", {
    db: ApplicationDB,
  });

export default ApplicationModel;