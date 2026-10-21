# todo-kubs

pnpm workspace (`apps/*`) with a strict catalog. `PORT` defaults to `3000`.

- `GET /` — todo-app HTML
- `GET /status` — log file (writer appends timestamp + random string every 5s)
- `GET /pingpong` — ping-pong `pong N` (in-memory counter)

```mermaid
flowchart TB
  subgraph host [Your machine]
    B[Browser :8081]
  end

  subgraph k3d [k3d cluster]
    T[Traefik :80]
    IG[Ingress]
    subgraph pod [todo-app pod]
      W[log-writer]
      TA[todo-app :3000]
      V[(emptyDir)]
    end
    PP[ping-pong :3000]
  end

  B -->|8081:80| T --> IG
  IG -->|"/pingpong"| PP
  IG -->|"/"| TA
  W --> V --> TA
```

| Path | App |
| --- | --- |
| `apps/todo-app` | Reader HTTP + writer (same image, two containers) |
| `apps/ping-pong` | Counter |
| `k8s/` | Deployments, ClusterIP Services, Ingress |
| `examples/` | NodePort (not applied with `kubectl apply -f k8s/`) |

Shared dependency versions go in `pnpm-workspace.yaml` `catalog` and are referenced as `"catalog:"`.

## Run

```bash
pnpm install
pnpm start:todo-app
pnpm start:ping-pong

docker build -t todo-app:latest ./apps/todo-app
docker build -t ping-pong:latest ./apps/ping-pong
k3d image import todo-app:latest ping-pong:latest -c k3s-default
kubectl apply -f k8s/
```

- http://127.0.0.1:8081/
- http://127.0.0.1:8081/status
- http://127.0.0.1:8081/pingpong
