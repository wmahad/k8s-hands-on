#!/bin/sh
set -eu

helm repo add grafana https://grafana.github.io/helm-charts
helm repo update grafana

kubectl create namespace monitoring --dry-run=client -o yaml | kubectl apply -f -

helm upgrade --install loki grafana/loki \
  --namespace monitoring \
  --values "$(dirname "$0")/loki-values.yaml" \
  --wait \
  --timeout 10m

helm upgrade --install grafana grafana/grafana \
  --namespace monitoring \
  --values "$(dirname "$0")/grafana-values.yaml" \
  --wait \
  --timeout 5m

helm upgrade --install k8smon grafana/k8s-monitoring \
  --namespace monitoring \
  --values "$(dirname "$0")/k8s-monitoring-values.yaml" \
  --wait \
  --timeout 10m
