import Bun from "bun";
import Elysia, { t } from "elysia";
import { type JWTPayload, SignJWT, jwtVerify } from "jose";
import mongoose from "mongoose";

import { IDocument } from "@common/types/db";

import { DJoinedActivity, joinedActivityElysiaSchema } from "./joined_activity";

interface DUser {
  email: string;
  picture: string;
  name: string;
}
export type IUser = IDocument<DUser>;
export interface UserWithPermission extends IUser {
  permission: DJoinedActivity["permission"];
}

export const userElysiaSchema = t.Object({
  email: t.String({
    description: "사용자 이메일",
    examples: ["jeamxn@khu.ac.kr"],
  }),
  picture: t.String({
    description: "사용자 프로필 사진 URL",
    examples: ["https://example.com/profile.jpg"],
  }),
  name: t.String({
    description: "사용자 이름",
    examples: ["최재민"],
  }),
});

export const userElysiaSchemaWithPermission = t.Object({
  ...userElysiaSchema.properties,
  permission: joinedActivityElysiaSchema.properties.permission,
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  picture: { type: String, required: true },
  name: { type: String, required: true },
});
const UserDB = mongoose.model<IUser>("User", userSchema);

interface TokenPayload extends JWTPayload {
  id: string;
}

const generateToken = async (user: IUser, type: "access" | "refresh") => {
  const { email, _id } = user;
  const payload: TokenPayload = {
    id: _id.toString(),
    email,
  };
  const secret = new TextEncoder().encode(Bun.env.JWT_SECRET ?? "");
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("kiugi")
    .setExpirationTime(type === "access" ? "15m" : "7d")
    .sign(secret);
  return token;
};

const verifyToken = async (token: string): Promise<TokenPayload | null> => {
  try {
    const secret = new TextEncoder().encode(Bun.env.JWT_SECRET ?? "");
    const verify = await jwtVerify(token, secret);
    return verify.payload as TokenPayload;
  } catch {
    return null;
  }
};

const UserModel = new Elysia()
  .decorate("userModel", {
    db: UserDB,
    generateToken,
    verifyToken,
  });

export default UserModel;
