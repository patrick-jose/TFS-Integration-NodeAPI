# TFS Integration API

![build-badge](http://almtoro/DefaultCollection/_apis/public/build/definitions/39785640-6265-4b92-8388-a81ec9b1115a/553/badge)

The object this project is create a integration API for TFS and Azure DevOps.

## What this API do?

1. Gets all PullRequests into anyone Team Project
2. Gets all PullRequests for Respository
3. Gets informations about a PullRequest by ID
4. Gets workitems relateds the a PullRequest
5. Creates and Updates a PullRequests states
6. Gets informations about Repositories anyone Team Project
7. Gets informations about a Workitem
8. Create a new tag in a repository

## Getting Started

### Software dependencies

For contribute with this project you need the following dependencies installed in your computer:

- [NodeJS](https://nodejs.org/en/)
- [PM2](http://pm2.keymetrics.io/)
- [Visual Studio Code](https://github.com/Microsoft/vscode)

### Installation process

After install software dependencies you need execute this steps:

#### For windows systems

1. Copy the file `env.ps1.example` to `env.ps1` and set the values for envirionment variables
2. Execute the following command: `.\env.ps1`

#### For linux systems

1. Copy the file `env.sh.example` to `env.sh` and set the values for envirionment variables
2. Execute the following command: `source env.sh`

Posteriorly and agnostic that SO plataform you need execute this command:

```shell
npm install
```

### To run app

#### Using npm

```shell
npm start
```

#### Using docker

You can use [Docker](https://docs.docker.com/) containers to run this app. For this:

1. Execute the frists instalation process
2. Build app:

    ```shell
    docker build -t ${name_of_image_app}:${version} .
    ```

    or

    ```shell
    make build
    ```

3. Execute the container:

    ```shell
    docker run --name tfs_integration_api --env-file=${env_file} \
        -p ${server_port}:${server_port} -d ${container_name}:${app_version}
    ```

    or

    ```shell
    make run
    ```

## API Documentation and Test

The API documentation was created using [Swagger](https://swagger.io/) and is in file [`docs/swagger.yml`](docs/swagger.yml). For access the documentation enough use this URI `/api/v1/docs`.

## License

MIT

## Contribute

And just open a PR. We love PRs!
