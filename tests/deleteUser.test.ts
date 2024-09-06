import { UserService } from "../src/services/user";
import { setUserService, deleteUser } from "../src/handlers/user";
import { APIGatewayProxyResult } from "aws-lambda";

jest.mock("../src/services/user"); // Mock the UserService

const mockedUserService = new UserService() as jest.Mocked<UserService>;

beforeEach(() => {
  jest.resetAllMocks();
  setUserService(mockedUserService); // Inject the mocked service
});

test("should delete a user successfully", async () => {
  mockedUserService.deleteUser.mockResolvedValue(undefined); // Assuming deleteUser returns void

  const event = {
    pathParameters: { userId: "1" },
  } as any;

  const response = (await deleteUser(
    event,
    {} as any,
    {} as any
  )) as APIGatewayProxyResult;
  expect(response.statusCode).toBe(200);
  expect(JSON.parse(response.body)).toEqual({ message: "User deleted" });
});

test("should return 400 when userId is missing", async () => {
  const event = {
    pathParameters: {},
  } as any;

  const response = (await deleteUser(
    event,
    {} as any,
    {} as any
  )) as APIGatewayProxyResult;
  expect(response.statusCode).toBe(400);
  expect(JSON.parse(response.body)).toEqual({ error: "User ID is required" });
});

test("deleteUser should return 500 on service error", async () => {
  mockedUserService.deleteUser.mockRejectedValue(new Error("Service error"));

  const event = { pathParameters: { userId: "1" } } as any;
  const response = (await deleteUser(
    event,
    {} as any,
    {} as any
  )) as APIGatewayProxyResult;

  expect(response.statusCode).toBe(500);
  expect(JSON.parse(response.body).error).toBe("Service error");
});
