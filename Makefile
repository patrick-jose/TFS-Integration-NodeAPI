# ----------------------------------------------------------------------------------------
# Make Variables
# ----------------------------------------------------------------------------------------
image_name = ${DOCKER_IMAGE_NAME}
container_name = ${DOCKER_CONTAINER_NAME}
app_version = ${APP_VERSION}
server_port = ${SERVER_PORT}
docker_registy=${DOCKER_REGISTRY}
username=${DOCKER_REGISTRY_LOGIN}
password=${DOCKER_REGISTRY_PASSWORD}
env_file = .env

# ----------------------------------------------------------------------------------------
# Make Commands
# ----------------------------------------------------------------------------------------
all: build run

build:
	docker build -t ${image_name}:${app_version} .

push:
	docker login https://${docker_registy} --username=${username} --password=${password}
	docker tag ${image_name}:${app_version} ${docker_registy}/${image_name}:${app_version}
	docker push ${docker_registy}/${image_name}:${app_version}

down:
	docker-compose down

up:
	docker-compose up -d

run:
	docker run --name tfs_integration_api --env-file=${env_file} \
		-p ${server_port}:${server_port} -d ${container_name}:${app_version}

shell:
	docker exec -it ${container_name} sh

rm:
	docker rm $(docker ps -aq)
