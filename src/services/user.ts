// src/services/DynamoDBService.ts
import { IUserService, IUser } from "../interfaces/user";
import * as AWS from "aws-sdk";

const docClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "Users";

export class UserService implements IUserService {
  async getUser(userId: string): Promise<IUser | null> {
    const params = { TableName: TABLE_NAME, Key: { userId } };
    const result = await docClient.get(params).promise();
    return (result.Item as IUser) || null;
  }

  async createUser(user: IUser): Promise<void> {
    const params = { TableName: TABLE_NAME, Item: user };
    await docClient.put(params).promise();
  }

  async updateUser(userId: string, user: Partial<IUser>): Promise<void> {
    const updateExpression = [];
    const expressionAttributeNames: { [key: string]: string } = {};
    const expressionAttributeValues: { [key: string]: string | undefined } = {};

    for (const key in user) {
      updateExpression.push(`#${key} = :${key}`);
      expressionAttributeNames[`#${key}`] = key;
      expressionAttributeValues[`:${key}`] = user[key as keyof IUser];
    }

    const params = {
      TableName: TABLE_NAME,
      Key: { userId },
      UpdateExpression: `set ${updateExpression.join(", ")}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    };

    await docClient.update(params).promise();
  }

  async deleteUser(userId: string): Promise<void> {
    const params = { TableName: TABLE_NAME, Key: { userId } };
    await docClient.delete(params).promise();
  }
}
