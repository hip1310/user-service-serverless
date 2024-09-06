export interface IUser {
  userId: string;
  name: string;
  email: string;
  dob: string;
}

export interface IUserService {
  getUser(userId: string): Promise<IUser | null>;
  createUser(user: IUser): Promise<void>;
  updateUser(userId: string, user: Partial<IUser>): Promise<void>;
  deleteUser(userId: string): Promise<void>;
}
