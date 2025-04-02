import Bun from "bun";
import Elysia from "elysia";
import { type JWTPayload, SignJWT, jwtVerify } from "jose";
import mongoose, { type Document } from "mongoose";

interface DUser {
  email: string;
  picture: string;
  name: string;
}
type IUser = Document<DUser> & DUser;

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
