# Avícola MBoré – monorepo

## Estructura
- frontend/: React + Vite + Tailwind + shadcn/ui
- backend/: FastAPI (persistencia de layouts)
- docker-compose.yml: levanta ambos

## Desarrollo
1. Copiar .env.example a .env y ajustar.
2. docker compose up --build
3. Frontend: http://localhost:5173
4. Backend (docs): http://localhost:8000/docs

## Scripts útiles
- Frontend: npm run dev / build / lint / typecheck
- Backend: uvicorn main:app --reload / pytest

## Deploy
- Build imágenes y push al registry (pendiente de configurar).
