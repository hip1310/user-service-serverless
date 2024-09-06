import { UserService } from "../src/services/user";
import { setUserService, createUser } from "../src/handlers/user";
import { APIGatewayProxyResult } from "aws-lambda";

jest.mock("../src/services/user"); // Mock the UserService

const mockedUserService = new UserService() as jest.Mocked<UserService>;

beforeEach(() => {
  jest.resetAllMocks();
  setUserService(mockedUserService); // Inject the mocked service
});

test("should create a user successfully", async () => {
  const newUser = {
    name: "John Doe",
    email: "john@example.com",
    dob: "1990-01-01",
  };
  mockedUserService.createUser.mockResolvedValue(undefined); // Assuming createUser returns void

  const event = {
    body: JSON.stringify(newUser),
  } as any;

  const response = (await createUser(
    event,
    {} as any,
    {} as any
  )) as APIGatewayProxyResult;
  expect(response.statusCode).toBe(201);
  expect(JSON.parse(response.body).message).toBe("User created");
  expect(JSON.parse(response.body).user).toMatchObject({
    ...newUser,
    userId: expect.any(String),
  });
});

test("should return 400 when required fields are missing", async () => {
  const event = {
    body: JSON.stringify({}),
  } as any;

  const response = (await createUser(
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
    body: JSON.stringify({
      name: "John Doe",
      email: "invalidemail",
      dob: "1990-01-01",
    }),
  } as any;

  const response = (await createUser(
    event,
    {} as any,
    {} as any
  )) as APIGatewayProxyResult;
  expect(response.statusCode).toBe(400);
  expect(JSON.parse(response.body)).toEqual({ error: "Invalid email format" });
});

test("createUser should return 500 on service error", async () => {
  mockedUserService.createUser.mockRejectedValue(new Error("Service error"));

  const event = {
    body: JSON.stringify({
      name: "John Doe",
      email: "john.doe@example.com",
      dob: "1990-01-01",
    }),
  } as any;

  const response = (await createUser(
    event,
    {} as any,
    {} as any
  )) as APIGatewayProxyResult;

  expect(response.statusCode).toBe(500);
  expect(JSON.parse(response.body).error).toBe("Service error");
});
