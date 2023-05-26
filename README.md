# Challenge stack 2023 IW4

The goal of this challenge is to create a web card game. The game is a simplified version of ??? game.

## Notable features

- Dockerized project with healthchecks:
  - The postgres database, with docker healthcheck that will check if the database is up and ready to accept connections.

  - The backend is a node.js application, with a healthcheck endpoint that is used by the docker healthcheck.
  
    The healthcheck endpoint is available at `/healthcheck`. It will return a 200 status code if the application is connected to the database, and a 500 status code otherwise.

    The container will wait for the database to be ready (based on the postgres container healthcheck) before launching the application.

  - The frontend is a vue3 application.

    The container will wait for the backend to be ready (based on the backend container healthcheck) before launching the application.

- Backend unit tests, running in github action with the node.js test suite `node:test` (see the [Launch the tests](#launch-the-tests) section for more details). Also include a code sanity check with eslint.

  You can find the backend github action [here](https://github.com/ESGI-69/challenge-node-vue/actions/workflows/backend-test.yml).

- Frontend unit tests, running in github action with the vitest test suite (see the [Launch the tests](#launch-the-tests) section for more details). Also include a code sanity check with eslint.

  You can find the frontend github action [here](https://github.com/ESGI-69/challenge-node-vue/actions/workflows/frontend-test.yml)

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

## Launch the tests

Theses tests are launched in the CI/CD pipeline, but you can launch them locally for ensuring that your code is clean.

- You can launch the tests with
  ```bash
  cd backend # or cd frontend
  npm test
  ```
- You can verify the code sanity (for frontend & backend) with
  ```bash
  cd backend # or cd frontend
  npm run lint
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

| Variable name | Description | Default value |
| --- | --- | --- |
| `NODE_ENV` | The environment of the application | `development` |
| `POSTGRES_USER` | The username of the postgres database | `root` |
| `POSTGRES_PASSWORD` | The password of the postgres database | `password` |
| `POSTGRES_DB` | The name of the postgres database | `app` |
| `JWT_SECRET` | The secret use for the JWT generation | |
