#!/bin/bash

KUBECONFIG_PATH="/home/shreedev44/.kube/config"

for MODULE in api-gateway authentication problem job notification; do
    YAML="k8s/production/minikube/services/$MODULE/deployment.yaml"
    if [ -f "$YAML" ]; then
        echo "📦 Applying $YAML"
        kubectl apply --kubeconfig="$KUBECONFIG_PATH" -f "$YAML"
    else
        echo "❌ No deployment.yaml for $MODULE at $YAML"
    fi
done
