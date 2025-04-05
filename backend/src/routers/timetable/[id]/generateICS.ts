import Elysia, { t } from "elysia";

import getTimetable from "@back/guards/getTimetable";
import getUser from "@back/guards/getUser";
import timetableAuthorityService from "@back/guards/timetableAuthorityService";
import TimetableModel from "@back/models/timetable";

const generateICSLink = new Elysia()
  .use(getUser)
  .use(TimetableModel)
  .use(timetableAuthorityService)
  .use(getTimetable)
  .get(
    "/ics-link",
    async ({ user, timetable, timetableModel }) => {
      const token = await timetableModel.generateIcsAccessToken(timetable._id.toString(), user._id.toString());
      
      const link = `${process.env.NEXT_PUBLIC_API_URL}/timetable/${timetable._id.toString()}/export.ics?token=${token}`;

      return { link };
    },
    {
      params: t.Object({
        timetable_id: t.String({ description: "캘린더 ID" }),
      }),
      response: t.Object({
        link: t.String({ description: "ICS 구독 링크" }),
      }),
      detail: {
        tags: ["Timetable"],
        summary: "ICS 파일 링크 생성",
        description: "해당 캘린더에 대한 .ics 파일 링크를 생성합니다.",
      }
    }
  );

export default generateICSLink;
