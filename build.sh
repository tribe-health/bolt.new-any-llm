#!/bin/bash

docker buildx build -t tribehealth/bolt-prometheus:latest --push --platform=linux/amd64,linux/arm64 .
