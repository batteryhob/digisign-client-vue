#!/bin/bash

#Build
yarn build

#Image Push(docker hub or aws ecr)
docker build -t batteryho/digisign-fe:latest .
docker push batteryho/digisign-fe:latest

# EKS Deployment Apply
kubectl delete -f digisign-fe.yaml
kubectl apply -f digisign-fe.yaml