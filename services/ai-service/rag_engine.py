"""RAG + LangChain + Chroma vector store for campus placement Q&A."""
import os
from pathlib import Path

KNOWLEDGE_DIR = Path(__file__).resolve().parent.parent.parent / "data" / "knowledge"
CHROMA_DIR = Path(__file__).resolve().parent / "chroma_db"

SYSTEM_PROMPT = """You are CampusAI, an expert career coach for Indian MBA campus placement.
Use the provided context from placement data and guides. Be concise, actionable, and encouraging.
If salary is discussed, use INR (LPA). Never fabricate exact guarantees."""

_vectorstore = None
_llm = None


def _get_llm():
    global _llm
    if _llm is not None:
        return _llm
    api_key = os.getenv("OPENAI_API_KEY", "").strip()
    if not api_key:
        return None
    try:
        from langchain_openai import ChatOpenAI
        _llm = ChatOpenAI(model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"), temperature=0.3)
        return _llm
    except Exception:
        return None


def build_vectorstore():
    global _vectorstore
    if _vectorstore is not None:
        return _vectorstore

    docs_text = []
    if KNOWLEDGE_DIR.exists():
        for p in KNOWLEDGE_DIR.glob("**/*"):
            if p.suffix in (".md", ".txt"):
                docs_text.append(p.read_text(encoding="utf-8"))

    if not docs_text:
        docs_text = ["Campus placement focuses on MBA scores, e-test, and work experience for salary."]

    try:
        from langchain.text_splitter import RecursiveCharacterTextSplitter
        from langchain_community.vectorstores import Chroma
        from langchain_community.embeddings import HuggingFaceEmbeddings
        from langchain.schema import Document

        splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=80)
        documents = []
        for i, text in enumerate(docs_text):
            for chunk in splitter.split_text(text):
                documents.append(Document(page_content=chunk, metadata={"source_id": i}))

        embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )
        _vectorstore = Chroma.from_documents(
            documents=documents,
            embedding=embeddings,
            persist_directory=str(CHROMA_DIR),
        )
        return _vectorstore
    except Exception:
        _vectorstore = {"fallback": True, "chunks": docs_text}
        return _vectorstore


def retrieve_context(query: str, k: int = 4) -> str:
    vs = build_vectorstore()
    if isinstance(vs, dict) and vs.get("fallback"):
        chunks = vs["chunks"]
        q = query.lower()
        scored = sorted(
            chunks,
            key=lambda c: sum(1 for w in q.split() if len(w) > 3 and w in c.lower()),
            reverse=True,
        )
        return "\n\n".join(scored[:2])
    retriever = vs.as_retriever(search_kwargs={"k": k})
    docs = retriever.invoke(query)
    return "\n\n".join(d.page_content for d in docs)


def rag_answer(query: str, student_profile: dict | None = None) -> dict:
    context = retrieve_context(query)
    profile_snippet = ""
    if student_profile:
        profile_snippet = f"\nStudent profile: {student_profile}"

    llm = _get_llm()
    if llm:
        from langchain.prompts import ChatPromptTemplate
        from langchain.schema.output_parser import StrOutputParser

        prompt = ChatPromptTemplate.from_messages([
            ("system", SYSTEM_PROMPT),
            ("human", "Context:\n{context}\n\nQuestion: {question}{profile}"),
        ])
        chain = prompt | llm | StrOutputParser()
        answer = chain.invoke({
            "context": context,
            "question": query,
            "profile": profile_snippet,
        })
        mode = "openai-rag"
    else:
        answer = _fallback_answer(query, context, student_profile)
        mode = "local-rag-fallback"

    return {"answer": answer, "mode": mode, "sources_used": min(4, len(context.split("\n\n")) or 1)}


def _fallback_answer(query: str, context: str, profile: dict | None) -> str:
    lines = [
        "**CampusAI (Offline RAG Mode)** — Set `OPENAI_API_KEY` for full GenAI.",
        "",
        f"**Your question:** {query}",
        "",
        "**Insights from knowledge base:**",
        context[:1200] + ("..." if len(context) > 1200 else ""),
    ]
    if profile:
        lines.append(f"\n**Profile considered:** {profile}")
    lines.append("\n**Tip:** Improve mba_p and etest_p; add work experience for stronger packages.")
    return "\n".join(lines)
