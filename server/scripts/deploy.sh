#!/bin/bash

kubectl config use-context minikube

for MODULE in api-gateway authentication problem job notification; do
    YAML="k8s/production/minikube/services/$MODULE/deployment.yaml"
    if [ -f "$YAML" ]; then
    echo "📦 Applying $YAML"
    kubectl apply -f "$YAML"
    else
    echo "❌ No deployment.yaml for $MODULE at $YAML"
    fi
done