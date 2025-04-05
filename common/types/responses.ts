import { DActivity } from "@back/models/activity";
import { PermissionType } from "@back/models/joined_activity";

export interface Me {
  _id: string;
  email: string;
  name: string;
  picture: string;
}

export type Activity = DActivity;

export type ActivityWithPermission = DActivity & {
  _id: string;
  my_permission: PermissionType;
};

export type BoardInfo = {
  _id: string;
  activity_id: string;
  name: string;
  show_permission: PermissionType;
  write_permission: PermissionType;
  comment_permission: PermissionType;
}