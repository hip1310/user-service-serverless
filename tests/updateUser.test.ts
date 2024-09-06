import { UserService } from "../src/services/user";
import { setUserService, updateUser } from "../src/handlers/user";
import { APIGatewayProxyResult } from "aws-lambda";

jest.mock("../src/services/user"); // Mock the UserService

const mockedUserService = new UserService() as jest.Mocked<UserService>;

beforeEach(() => {
  jest.resetAllMocks();
  setUserService(mockedUserService); // Inject the mocked service
});

test("should update a user successfully", async () => {
  const updatedUser = {
    name: "John Doe",
    email: "john@example.com",
    dob: "1990-01-01",
  };
  mockedUserService.updateUser.mockResolvedValue(undefined); // Assuming updateUser returns void

  const event = {
    pathParameters: { userId: "1" },
    body: JSON.stringify(updatedUser),
  } as any;

  const response = (await updateUser(
    event,
    {} as any,
    {} as any
  )) as APIGatewayProxyResult;
  expect(response.statusCode).toBe(200);
  expect(JSON.parse(response.body).message).toBe("User updated");
  expect(JSON.parse(response.body).user).toMatchObject({
    userId: "1",
    ...updatedUser,
  });
});

test("should return 400 when required fields are missing", async () => {
  const event = {
    pathParameters: { userId: "1" },
    body: JSON.stringify({}),
  } as any;

  const response = (await updateUser(
    event,
    {} as any,
    {} as any
  )) as APIGatewayProxyResult;
  expect(response.statusCode).toBe(400);
  expect(JSON.parse(response.body)).toEqual({
    error: "Missing required fields",
  });
});

test("should return 400 for invalid email format", async () => {
  const event = {
    pathParameters: { userId: "1" },
    body: JSON.stringify({
      name: "John Doe",
      email: "invalidemail",
      dob: "1990-01-01",
    }),
  } as any;

  const response = (await updateUser(
    event,
    {} as any,
    {} as any
  )) as APIGatewayProxyResult;
  expect(response.statusCode).toBe(400);
  expect(JSON.parse(response.body)).toEqual({ error: "Invalid email format" });
});

test("updateUser should return 500 on service error", async () => {
  mockedUserService.updateUser.mockRejectedValue(new Error("Service error"));

  const event = {
    pathParameters: { userId: "1" },
    body: JSON.stringify({
      name: "John Doe",
      email: "john.doe@example.com",
      dob: "1990-01-01",
    }),
  } as any;
  const response = (await updateUser(
    event,
    {} as any,
    {} as any
  )) as APIGatewayProxyResult;

  expect(response.statusCode).toBe(500);
  expect(JSON.parse(response.body).error).toBe("Service error");
});
