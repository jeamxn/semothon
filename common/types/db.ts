import { ObjectId, type Document } from "mongoose";
export type IDocument<T> = Document<ObjectId, any, T> & T;
