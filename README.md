# Challenge stack 2023 IW4

The goal of this challenge is to create a web card game. The game is a simplified version of heartstone game.

## Production
https://cardgame.bliblablou.day/

## Notable features

- Dockerized project with healthchecks:
  - The postgres database, with **docker healthcheck** that will check if the database is up and ready to accept connections.

  - The backend is a node.js application, with a **healthcheck endpoint** that is used by the docker healthcheck.
  
    The healthcheck endpoint is available at `/healthcheck`. It will return a 200 status code if the application is connected to the database, and a 500 status code otherwise.

    The container will wait for the database to be ready (based on the postgres container healthcheck) before launching the application.

  - The frontend is a vue3 application.

    The container will wait for the backend to be ready (based on the backend container healthcheck) before launching the application.

- Automatic data replication to mongodb database without any code duplication. The project use a postgres database for the main data, and a mongodb database for the search & statistics features.

  The sequelize models automatically create the mongodb schema from the his sequelize schema. The data is replicated in realtime to the mongodb database using a hooks. You can find the replication code in the `backend/src/db/syncMongo.js` file.

- **Backend unit tests**, running in github action with `jest` test suite (see the [Launch the tests](#launch-the-tests) section for more details). Also include a **code sanity** check with eslint.

  The `game.spec.js` include socket io tests.

  You can find the backend github action [here](https://github.com/ESGI-69/challenge-node-vue/actions/workflows/backend-test.yml).

- **Frontend tests** include a **code sanity** check with eslint and a **build** runner for ensuring that the build is working.

  You can find the frontend github action [here](https://github.com/ESGI-69/challenge-node-vue/actions/workflows/frontend-test.yml)

- The project use **web socket** for the realtime communication between the frontend and the backend.

## Launch the project locally **for development**

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [node](https://nodejs.org/en/download/) >= 20.0.0 (for the node test suite). You can use [nvm](https://github.com/nvm-sh/nvm) to manage your node versions easily.
- [eslint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) for VSCode (for the code sanity)

### Set the project ready for development 

- Clone the project and go to the project directory
  ```bash
  git clone git@github.com:ESGI-69/challenge-node-vue.git
  cd challenge-node-vue
  ```
- Copy the `.env.example` file to `.env` and fill the variables that are not already filled (see the [environment variables](#environment-variables) section for more details)
  ```bash
  cp .env.example .env
  ```
- Launch the docker developement containers (databases)
  ```bash
  docker compose -f docker-compose.yaml -f docker-compose.dev.yaml up --remove-orphans --build
  ```

  What does this command do ?
  - `-f docker-compose.yaml -f docker-compose.dev.yaml` : use both docker-compose files to launch the containers. The `docker-compose.dev.yaml` file is used to expose the databases ports to the host, only in development mode.
  - `--remove-orphans` : remove the containers that are not in the `docker-compose.yaml` file
  - `--build` : build the images before launching the containers for ensuring that the latest version of the images are used
- Install the backend dependencies
  ```bash
  cd backend
  npm install
  ```
- Migrate the database
  ```bash
  npm run migrate
  ```

  You can also use the `npm run migrate:force` to force the migration. This command is useful if you want to reset the database. **⚠️ Be careful, this command will drop all the tables of the database. ⚠️**. This command will not migrate using the migration files that us have written, so don't use it to test if your migrations are correct.

- Seed the database
  ```bash
  npm run seed
  ```

  This command will create a 3 users with the following credentials:
  - email: `johndoe@example.com`, password: `123456`
  - email: `janedoe@example.com`, password: `123456`
  - email: `admin@example.com`, password: `123456` (this user has the `ADMIN` role)

- Launch the backend
  ```bash
  npm run dev
  ```
- In a new terminal, install the frontend dependencies
  ```bash
  cd frontend
  npm install
  ```
- Launch the frontend
  ```bash
  npm run dev
  ```
- You can now access the frontend on http://localhost:8080 and the backend on http://localhost:3000 🎉

- If you want to reset the database, you can use the `npm run db:reset` command. This command will drop all the tables of the database, and then migrate and seed the database. **⚠️ Be careful, this command will drop all the tables of the database. ⚠️**

### View the mongodb database content

You can access the mongodb database with the credential defined in the `.env` file. (see the [environment variables](#environment-variables) section for more details

For viewing the database content, you have 2 options:

- Using mongo-express. This is a web interface for viewing the database content. It is available at http://localhost:8085. It is already included in the `docker-compose.dev.yaml` file, so you don't need to do anything to use it.

- Using a GUI like [MongoDB Compass](https://www.mongodb.com/products/compass)

## Launch the tests

Theses tests are launched in the CI/CD pipeline, but you can launch them locally for ensuring that your code is clean.

Before launching the tests, you need to install the dependencies of the project (see the [Set the project ready for development](#set-the-project-ready-for-development) section for more details). You also need to launch the docker containers (see the [Set the project ready for development](#set-the-project-ready-for-development) section for more details) and **have a migrated and seeded database**.

When you launching test **ensure that no frontend page is open**. This may interfere with the socket io tests.

There is **mocks** for the **mailer** and the **payment** , so you don't have to set the `SENDINBLUE_KEY` neither the `STRIPE_SECRET` environments variables for launching the tests.

- You can launch the tests with
  ```bash
  cd backend
  npm test
  ```
- You can verify the code sanity (for frontend & backend) with
  ```bash
  cd backend # or cd frontend
  npm run lint
  ```
- You can build the frontend with
  ```bash
  cd frontend
  npm run build
  ```

## Launch the project localy **as in production** (not recommended for development)

- Clone the project
  ```bash
  git clone git@github.com:ESGI-69/challenge-node-vue.git
  ```
- Launch the docker containers
  ```bash
  docker compose -f docker-compose.yaml -f docker-compose.prod.yaml up --remove-orphans --build
  ```

  What does this command do ?
  - `-f docker-compose.yaml -f docker-compose.prod.yaml` : use both docker-compose files to launch the containers. The `docker-compose.prod.yaml` file is used to add the backend & the frontend container to the `docker-compose.yaml` file that contains only the databases containers.
  - `--remove-orphans` : remove the containers that are not in the `docker-compose.yaml` file
  - `--build` : build the images before launching the containers for ensuring that the latest version of the images are used
- You can now access the frontend on http://localhost:8080 and the backend on http://localhost:3000 🎉

## Environment variables

Environment variables are used to configure the application. You can find the list of the environment variables used in the project below. You can set them in the `.env` file at the root of the project.

| Variable name | service | Description | Default value |
| --- | --- | --- | --- |
| `NODE_ENV` | https://github.com/ESGI-69/challenge-node-vue/labels/frontend https://github.com/ESGI-69/challenge-node-vue/labels/backend | The environment of the application | `development` |
| `POSTGRES_USER` | https://github.com/ESGI-69/challenge-node-vue/labels/backend | The username of the postgres database | `root` |
| `POSTGRES_PASSWORD` | https://github.com/ESGI-69/challenge-node-vue/labels/backend | The password of the postgres database | `password` |
| `POSTGRES_DB` | https://github.com/ESGI-69/challenge-node-vue/labels/backend | The name of the postgres database | `app` |
| `MONGO_ROOT_USER` | https://github.com/ESGI-69/challenge-node-vue/labels/backend | The username of the mongodb database | `root` |
| `MONGO_ROOT_PASSWORD` | https://github.com/ESGI-69/challenge-node-vue/labels/backend | The password of the mongodb database | `password` |
| `MONGO_DB` | https://github.com/ESGI-69/challenge-node-vue/labels/backend | The name of the mongodb database | `app` |
| `JWT_SECRET` | https://github.com/ESGI-69/challenge-node-vue/labels/backend | The secret use for the JWT generation (please genereate a random >32 letter string) | |
| `VITE_API` | https://github.com/ESGI-69/challenge-node-vue/labels/frontend | The url that match the proxy in the frontend. For avoiding CORS issues | `/api` |
| `VITE_API_TIMEOUT` | https://github.com/ESGI-69/challenge-node-vue/labels/frontend | The timeout of the api calls, in milliseconds | `30000` |
| `VITE_COOKIE_TOKEN_NAME` | https://github.com/ESGI-69/challenge-node-vue/labels/frontend | The name of the cookie that contains the JWT token | `challenge-token` |
| `FRONTEND_URL` | https://github.com/ESGI-69/challenge-node-vue/labels/backend | The url of the frontend | `http://localhost:8080` |
| `SENDINBLUE_KEY` | https://github.com/ESGI-69/challenge-node-vue/labels/backend | The API key of the sendinblue (brevo) account for the mailer | |
| `SENDINBLUE_EMAIL` | https://github.com/ESGI-69/challenge-node-vue/labels/backend | The email of the sender for the mailer | |
| `SENDINBLUE_NAME` | https://github.com/ESGI-69/challenge-node-vue/labels/backend | The name of the sender for the mailer |  |
| `STRIPE_SECRET` | https://github.com/ESGI-69/challenge-node-vue/labels/backend | The secret key of stripe, example : 'sk_test_abcde' for dev and 'sk_live_abcde' for prod | |
