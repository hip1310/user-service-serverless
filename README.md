# Serverless Framework AWS NodeJS User CRUD Microservice

### Deployment

In order to deploy the example, you need to run the following command:

```
serverless deploy
```

After running deploy, you should see output similar to:

```
Deploying "user-service-serverless" to stage "dev" (us-east-1)

✔ Service deployed to stack user-service-serverless-dev (145s)

endpoints:
  POST - https://xxxxx.execute-api.us-east-1.amazonaws.com/dev/users
  GET - https://xxxxx.execute-api.us-east-1.amazonaws.com/dev/users/{userId}
  PUT - https://xxxxx.execute-api.us-east-1.amazonaws.com/dev/users/{userId}
  DELETE - https://xxxxx.execute-api.us-east-1.amazonaws.com/dev/users/{userId}
functions:
  createUser: user-service-serverless-dev-createUser (29 MB)
  getUser: user-service-serverless-dev-getUser (29 MB)
  updateUser: user-service-serverless-dev-updateUser (29 MB)
  deleteUser: user-service-serverless-dev-deleteUser (29 MB)
```

### Local development

The easiest way to develop and test your function is to use the Serverless Framework's `dev` command:

```
serverless dev
```

This will start a local emulator of AWS Lambda and tunnel your requests to and from AWS Lambda, allowing you to interact with your function as if it were running in the cloud.

Now you can invoke the function as before, but this time the function will be executed locally. Now you can develop your function locally, invoke it, and see the results immediately without having to re-deploy.

When you are done developing, don't forget to run `serverless deploy` to deploy the function to the cloud.


# API Documentation

This document provides information on how to interact with the user management API.

## Endpoints

### Get User

Retrieve user information by their ID.

**Endpoint:**

```bash
GET https://ptgtimq91e.execute-api.us-east-1.amazonaws.com/dev/users/{userId}
```

**Example Request:**

```bash
curl --location 'https://ptgtimq91e.execute-api.us-east-1.amazonaws.com/dev/users/1aef2650-bc1d-4222-9e39-29ca6924095a'
```

### Create User

Create a new user with the specified details.

**Endpoint:**

```bash
POST https://ptgtimq91e.execute-api.us-east-1.amazonaws.com/dev/users
```

**Headers:**

```bash
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "test",
  "email": "johndoe@yopmail.com",
  "dob": "1990-01-01"
}
```

**Example Request:**

```bash
curl --location 'https://ptgtimq91e.execute-api.us-east-1.amazonaws.com/dev/users' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "test",
    "email": "johndoe@yopmail.com",
    "dob": "1990-01-01"
}'
```

### Update User

Update the details of an existing user.

**Endpoint:**

```bash
PUT https://ptgtimq91e.execute-api.us-east-1.amazonaws.com/dev/users/{userId}
```

**Headers:**

```bash
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "test",
  "email": "johndoe@yopmail.com",
  "dob": "1990-01-01"
}
```

**Example Request:**

```bash
curl --location --request PUT 'https://ptgtimq91e.execute-api.us-east-1.amazonaws.com/dev/users/1aef2650-bc1d-4222-9e39-29ca6924095a' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "test",
    "email": "johndoe@yopmail.com",
    "dob": "1990-01-01"
}'
```

### Delete User

Remove a user from the system.

**Endpoint:**

```bash
DELETE https://ptgtimq91e.execute-api.us-east-1.amazonaws.com/dev/users/{userId}
```

**Headers:**

```bash
Content-Type: application/json
```

**Example Request:**

```bash
curl --location --request DELETE 'https://ptgtimq91e.execute-api.us-east-1.amazonaws.com/dev/users/1aef2650-bc1d-4222-9e39-29ca6924095a' \
--header 'Content-Type: application/json'
```

---
