# NodePort (old access)

This folder is not applied with the app manifests.

Before Ingress, the app was reached through a NodePort Service. k3d mapped host **8082** to NodePort **30080**.

```mermaid
flowchart LR
  B[Browser] -->|8082| H[k3d]
  H -->|30080| S[NodePort Service]
  S -->|3000| P[Pod]
```

| Hop | Port |
| --- | --- |
| Browser → host | 8082 |
| k3d → NodePort | 30080 |
| Service → container | 3000 |

Set by cluster create:

```text
--port 8082:30080@agent:0
```

```mermaid
flowchart TB
  subgraph host [Your machine]
    B[Browser :8082]
  end

  subgraph k3d [k3d cluster]
    NP[NodePort 30080]
    S[Service :3000]
    P[Pod :3000]
  end

  B --> NP --> S --> P
```

## Apply

The Deployment (and ClusterIP Service) must already exist in the `project` namespace.

```bash
kubectl apply -f examples/nodeport-service.yaml
```

Open http://127.0.0.1:8082/

This Service is named `todo-app-nodeport` so it can sit beside the ClusterIP `todo-app` Service used by Ingress.
