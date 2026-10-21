# todo-app

Node + pnpm app on k3d. `PORT` sets the listen port (default `3000`). `GET /` returns a small HTML todo page.

```mermaid
flowchart TB
  subgraph host [Your machine]
    B[Browser :8082]
    I[todo-app:latest image]
  end

  subgraph k3d [k3d cluster]
    NP[NodePort 30080]
    S[Service :3000]
    D[Deployment]
    P[Pod :3000]
  end

  B -->|k3d map 8082:30080| NP
  NP --> S
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
```

| File | Role |
| --- | --- |
| `index.js` | HTTP server, `GET /` |
| `package.json` | pnpm `12.14.0`, `pnpm start` |
| `Dockerfile` | `node:26-alpine` + Corepack/pnpm |
| `k8s/deployment.yaml` | 1 replica, `PORT=3000`, resources |
| `k8s/service.yaml` | NodePort `30080` → `3000` |

## Ports

```mermaid
flowchart LR
  B[Browser] -->|8082| H[k3d]
  H -->|30080| S[Service]
  S -->|3000| P[Pod]
```

| Hop | Port |
| --- | --- |
| Browser → host | 8082 |
| k3d → NodePort | 30080 |
| Service → container | 3000 |

`8082` exists because the cluster was created with `--port 8082:30080@agent:0`.

## Run

```bash
docker build -t todo-app:latest .
k3d image import todo-app:latest -c k3s-default
kubectl apply -f k8s/
```

Open http://127.0.0.1:8082/
