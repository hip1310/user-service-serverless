import { APIGatewayProxyHandler } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";
import { UserService } from "../services/user";
import { IUser } from "../interfaces/user";

let userService = new UserService();

export const getUser: APIGatewayProxyHandler = async (event) => {
  const { userId } = event.pathParameters || {};
  if (!userId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "User ID is required" }),
    };
  }

  try {
    const user = await userService.getUser(userId);
    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "User not found" }),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(user),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: (error as Error).message }),
    };
  }
};

export const createUser: APIGatewayProxyHandler = async (event) => {
  try {
    const { name, email, dob } = JSON.parse(event.body as string) as IUser;

    if (!name || !email || !dob) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid email format" }),
      };
    }

    const user: IUser = {
      userId: uuidv4(),
      name,
      email,
      dob,
    };

    await userService.createUser(user);

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "User created",
        user,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: (error as Error).message }),
    };
  }
};

export const updateUser: APIGatewayProxyHandler = async (event) => {
  const { userId } = event.pathParameters as { userId: string };
  const { name, email, dob } = JSON.parse(event.body as string) as IUser;

  // Validate input
  if (!userId || !name || !email || !dob) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing required fields" }),
    };
  }

  // Validate email format (basic validation)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid email format" }),
    };
  }

  try {
    const user: Partial<IUser> = {
      name,
      email,
      dob,
    };
    // Call service method to update the user
    await userService.updateUser(userId, { ...user });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "User updated",
        user: { userId, name, email, dob },
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: (error as Error).message }),
    };
  }
};

export const deleteUser: APIGatewayProxyHandler = async (event) => {
  const { userId } = event.pathParameters as { userId: string };

  if (!userId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "User ID is required" }),
    };
  }

  try {
    // Call service method to delete the user
    await userService.deleteUser(userId);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "User deleted" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: (error as Error).message }),
    };
  }
};


// Add this for testing purposes
export const setUserService = (service: UserService) => {
  userService = service;
};