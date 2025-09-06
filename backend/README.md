# Granja Mboré — Backend (FastAPI + SQLModel)

Backend inicial para **Sistema de Gestión Avícola**. Incluye:
- FastAPI + SQLModel
- Postgres (Docker) con fallback a SQLite para desarrollo rápido
- CORS para `http://localhost:5173` (configurable)
- API Key simple (`x-api-key`) para desarrollo
- Rutas CRUD: layouts, incubación, lotes (recría/postura), huevos, alimento, ventas, sensores, health
- Tests básicos con `pytest`

## Requisitos
- Python 3.11+
- Docker (opcional, para Postgres)
- Node/Vite del frontend si querés integrar

## Quickstart (SQLite, sin Docker)
```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # opcional
uvicorn app.main:app --reload
# API: http://127.0.0.1:8000
# Docs: http://127.0.0.1:8000/docs
```

## Postgres con Docker
```bash
cp .env.example .env
# editar .env si querés cambiar passwords
docker compose up -d
# en otra terminal
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
export DATABASE_URL=postgresql+psycopg://mbore:mbore@localhost:5432/mbore
uvicorn app.main:app --reload
```

## Variables de entorno (.env)
```
# Lista separada por comas
CORS_ORIGINS=http://localhost:5173
# Si no seteás API_KEY, no se exigirá
API_KEY=dev-secret-123
# Si no seteás DATABASE_URL se usa SQLite local app.db
# DATABASE_URL=postgresql+psycopg://mbore:mbore@localhost:5432/mbore
```

## Endpoints principales (resumen)
- `GET /healthz`
- `GET/POST /api/layouts` — guardar/leer layouts (JSON del planner)
- `GET/PUT/DELETE /api/layouts/{id}`
- `GET/POST /api/incubation/batches`
- `GET/POST /api/flocks`
- `GET/POST /api/eggs`
- `GET/POST /api/feed`
- `GET/POST /api/sales`
- `POST /api/sensors/ingest` — lecturas IoT

> Todos (excepto `/healthz`) aceptan **header** `x-api-key` si definiste `API_KEY` en `.env`.

## Integración simple desde el frontend (fetch)
```ts
// ejemplo: guardar layout
async function saveLayout(layout) {
  const res = await fetch("http://127.0.0.1:8000/api/layouts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": "dev-secret-123", // si configuraste API_KEY
    },
    body: JSON.stringify(layout),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
```

## Tests
```bash
pytest -q
```

## Roadmap sugerido
- Autenticación real (JWT / OAuth) y usuarios/roles
- Alembic para migraciones
- Validaciones de negocio y reportes
- WebSockets o MQTT para sensores en tiempo real
