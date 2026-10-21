# todo-app

Node + pnpm app on k3d. `PORT` sets the listen port (default `3000`).

- `GET /` — HTML todo page
- `GET /status` — current timestamp + startup random string (in memory)

```mermaid
flowchart TB
  subgraph host [Your machine]
    B[Browser :8081]
    I[todo-app:latest image]
  end

  subgraph k3d [k3d cluster]
    T[Traefik :80]
    IG[Ingress /]
    S[Service ClusterIP :3000]
    D[Deployment]
    P[Pod :3000]
  end

  B -->|k3d map 8081:80| T
  T --> IG
  IG --> S
  S -->|selector app=todo-app| P
  D --> P
  I -->|k3d image import| P
```

## Pieces

```mermaid
flowchart LR
  JS[index.js] --> DF[Dockerfile]
  DF --> IMG[todo-app:latest]
  IMG --> DEP[k8s/deployment.yaml]
  DEP --> POD[Pod]
  SVC[k8s/service.yaml] --> POD
  ING[k8s/ingress.yaml] --> SVC
```

| File | Role |
| --- | --- |
| `index.js` | HTTP server |
| `package.json` | pnpm `12.14.0`, `pnpm start` |
| `Dockerfile` | `node:26-alpine` + Corepack/pnpm |
| `k8s/deployment.yaml` | 1 replica, `PORT=3000`, resources |
| `k8s/service.yaml` | ClusterIP `:3000` |
| `k8s/ingress.yaml` | Traefik `/` → Service |
| `examples/nodeport-service.yaml` | NodePort example, not in `k8s/` |

## Ports

```mermaid
flowchart LR
  B[Browser] -->|8081| H[k3d / Traefik :80]
  H --> I[Ingress]
  I -->|3000| S[Service]
  S -->|3000| P[Pod]
```

| Hop | Port |
| --- | --- |
| Browser → host | 8081 |
| k3d load balancer → Traefik | 80 |
| Service → container | 3000 |

`8081` exists because the cluster was created with `-p 8081:80@loadbalancer`.

Optional NodePort (not applied with `kubectl apply -f k8s/`): see [examples/README.md](examples/README.md).

## Run

```bash
docker build -t todo-app:latest .
k3d image import todo-app:latest -c k3s-default
kubectl apply -f k8s/
```

- http://127.0.0.1:8081/
- http://127.0.0.1:8081/status
