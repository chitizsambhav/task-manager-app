
## Task Manager API

This is a Node.js API for managing tasks. It provides endpoints for creating, reading, updating, and deleting tasks, as well as user authentication and authorization. The API uses MongoDB for data storage, and includes features such as file uploads, email notifications, and image resizing.
## Installation

To install the API, clone the repository and run npm install to install the required dependencies:

`git clone git@github.com:ibrahimahmed237/Task-manager-api.git`

- To install run `npm install`
- To run project: `npm run start`
## Configuration

The API requires several environment variables to be set in order to run properly. These can be set in a .env file in the root directory of the project. Here are the required variables add them to .env file:


- PORT: The port number the API will listen on.
- MONGODB_URL: The connection URL for the MongoDB database.
- JWT_SECRET: The secret key used to sign JSON Web - - Tokens for user authentication.
- 
## Usage

To start the API, run To start the API, run npm run devin the terminal. The API will listen on the port specified in the PORT` environment variable.

Once the API is running, you can use a tool like Postman to interact with the endpoints. Here are the available endpoints:

POST /users: Creates a new user.

POST /users/login: Logs in a user and returns an authentication token.

POST /users/logout: Logs out the current user and invalidates their authentication token.

POST /users/logoutAll: Logs out the current user from all devices and invalidates all their authentication tokens.

GET /users/me: Gets the profile of the current user.

PATCH /users/me: Updates the profile of the current user.

DELETE /users/me: Deletes the current user and all their tasks.

POST /tasks: Creates a new task for the current user.

GET /tasks: Gets all tasks for the current user.

GET /tasks/:id: Gets a specific task by ID.

PATCH /tasks/:id: Updates a specific task by ID.

DELETE /tasks/:id: Deletes a specific task by ID.

All endpoints except for POST /users and POST /users/login require authentication. To authenticate, include an Authorization header in the request with the value Bearer <authentication-token>, where <authentication-token> is the token returned by the POST /users/login endpoint.
## Used Technologies

- Node.js
- Express
- Mongoose
- JWT (JSON Web Tokens)
- bcryptjs
- NodeMailer and Gmail API (for email notifications)
- Sharp (for image resizing)
- Multer (for file uploads)
- Validator (for data validation)
- Jest (for testing)
- Supertest (for integration testing)
- env-cmd (for managing environment variables)
## Testing

To run the tests, run npm test in the terminal. This will run both unit tests and integration tests.
