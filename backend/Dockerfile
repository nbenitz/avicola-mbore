FROM python:3.11-slim
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
# Variables por defecto (overridable en compose)
ENV CORS_ORIGINS=http://localhost:8080
ENV API_KEY=dev-secret-123
# DATABASE_URL se setea en docker-compose apuntando a db
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
