import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getUser, setUserService } from "../src/handlers/user";
import { UserService } from "../src/services/user";

jest.mock("../src/services/user"); // Mock the UserService

const mockedUserService = new UserService() as jest.Mocked<UserService>;

beforeEach(() => {
  jest.resetAllMocks();
  setUserService(mockedUserService); // Inject the mocked service
});

test("should return user when user exists", async () => {
  const mockUser = {
    userId: "1",
    name: "John Doe",
    email: "john@example.com",
    dob: "1990-01-01",
  };
  mockedUserService.getUser.mockResolvedValue(mockUser);

  const event: APIGatewayProxyEvent = {
    pathParameters: { userId: "1" },
    // other required properties
  } as any;

  const response = (await getUser(
    event,
    {} as any,
    {} as any
  )) as APIGatewayProxyResult;
  expect(response.statusCode).toBe(200);
  expect(JSON.parse(response.body)).toEqual(mockUser);
});

test("should return 404 when user does not exist", async () => {
  mockedUserService.getUser.mockResolvedValue(null);

  const event: APIGatewayProxyEvent = {
    pathParameters: { userId: "1" },
    // other required properties
  } as any;

  const response = (await getUser(
    event,
    {} as any,
    {} as any
  )) as APIGatewayProxyResult;
  expect(response.statusCode).toBe(404);
  expect(JSON.parse(response.body)).toEqual({ message: "User not found" });
});

test("should return 400 when userId is missing", async () => {
  const event: APIGatewayProxyEvent = {} as any;

  const response = (await getUser(
    event,
    {} as any,
    {} as any
  )) as APIGatewayProxyResult;
  expect(response.statusCode).toBe(400);
  expect(JSON.parse(response.body)).toEqual({ error: "User ID is required" });
});

test("getUser should return 500 on service error", async () => {
  mockedUserService.getUser.mockRejectedValue(new Error("Service error"));

  const event = {
    pathParameters: { userId: "1" },
  } as unknown as APIGatewayProxyEvent;
  const response = (await getUser(
    event,
    {} as any,
    {} as any
  )) as APIGatewayProxyResult;

  expect(response.statusCode).toBe(500);
  expect(JSON.parse(response.body).error).toBe("Service error");
});
