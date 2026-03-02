import * as UserModel from "../models/User.js";

export async function getUserByEmail(email) {
  return UserModel.findByEmail(email);
}

export async function createUser(data) {
  return UserModel.create(data);
}
