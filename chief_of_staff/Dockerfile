FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# OAuth token must be injected at runtime via Secret Manager
# Do NOT bake credentials into the image

ENV PORT=8080
EXPOSE 8080

CMD ["python", "main.py"]
