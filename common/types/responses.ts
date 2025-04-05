import { DActivity } from "@back/models/activity";

export interface Me {
  _id: string;
  email: string;
  name: string;
  picture: string;
}

export type Activity = DActivity;
