FROM python:3.11-slim
WORKDIR /app
COPY requirements-minimal.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY main.py rag_engine.py agent.py resume_tools.py ./
RUN mkdir -p /app/knowledge
COPY ../../data/knowledge /app/knowledge
EXPOSE 5002
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5002"]
