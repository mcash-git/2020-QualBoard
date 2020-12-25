#!/bin/bash
set -e

REPO="979246834305.dkr.ecr.us-east-1.amazonaws.com/2020ip/qualboard-web"

#Get version info
VERSION="$(cat $(pwd)/artifacts/version)"

TAG="${REPO}:${VERSION}"

echo "${TAG}"

#build docker container
docker build -f build/Dockerfile.prod -t $TAG .

#Push docker container
DOCKER_LOGIN=`aws ecr get-login --region us-east-1 --no-include-email`
${DOCKER_LOGIN}

docker push $TAG

echo "${TAG}" > $(pwd)/artifacts/image
echo " Image tag found at ./artifacts/image"

#Cleanup
docker rmi $(docker images --filter=reference="${REPO}:*" -q)