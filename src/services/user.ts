// src/services/DynamoDBService.ts
import { IUserService, IUser } from "../interfaces/user";
import  {User} from '../model/userSchema';

export class UserService implements IUserService {
  async getUser(userId: string): Promise<IUser | null> {
    const result=await User.get(userId);
    return (result.toJSON() as IUser) || null;
  }

  async createUser(user: IUser): Promise<void> {
    const newUser = new User(user);
    await newUser.save();
  }

  async updateUser(userId: string, user: Partial<IUser>): Promise<void> {
    await User.update({ userId }, user);
  }

  async deleteUser(userId: string): Promise<void> {
    await User.delete(userId);
  }
}
