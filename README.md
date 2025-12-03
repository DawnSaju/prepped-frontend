![Prepped Cover](https://github.com/DawnSaju/prepped-frontend/blob/master/public/cover.png?raw=true)

### Problem Statement

Patients frequently struggle to communicate effectively during short medical appointments. Anxiety, low medical literacy, or simply forgetting details can lead to incomplete histories. Doctors, often pressed for time, must spend valuable minutes gathering basic information rather than diagnosing.

Why this matters: Incomplete information can lead to misdiagnosis or delayed treatment. Patients often leave feeling unheard and confused. This gap disproportionately affects vulnerable populations who may struggle to advocate for themselves.

### Why agents?

- Traditional chatbots are insufficient because a patient intake is a stateful, multi-step process, not a single Q&A turn. 
- State Management: An agent needs to remember and structure information (symptoms, timeline) across a long conversation. 
- Active Reasoning: The system must decide what question to ask next based on previous answers (e.g., "You mentioned knee pain; is there swelling?"). 
- Tool Use: The agent needs to research medical definitions (via Google Search) to ground its analysis and generate a structured artifact (the briefing).

### What you created

- Architecture: A Sequential Multi-Agent System with a shared Memory Bank.
- Agent A (Intake Nurse): A conversational loop agent that interviews the patient. It uses a custom tool (update_profile) to extract structured data into the Memory Bank.
- Memory Bank: A persistent, structured state (JSON) holding the patient's profile (Symptoms, Meds, History).
- Agent B (Medical Analyst): A sequential task agent that triggers after the interview. It reviews the Memory Bank and uses Google Search to generate a professional "Doctor Briefing."
- Clean User Interface: A Next.js frontend that visualizes the agent's "brain" (live profile updates) alongside the chat.

### Demo

- **Live Demo**: [https://prepped-agentic.vercel.app/](https://prepped-agentic.vercel.app/)
- **Backend FastAPI**: [https://prepped-backend.onrender.com/](https://prepped-backend.onrender.com/)
- **Product Demo Video**: [https://youtu.be/VHMoi2eT4TM](https://youtu.be/VHMoi2eT4TM)

### Key Capabilities Demonstrated:

- Real-time Extraction: Watch the "Live Profile" sidebar update instantly as the user chats.
- Smart Handoff: The system autonomously decides when it has enough info to switch from "Nurse" to "Analyst."
- Emergency Mode: A simulated voice call feature for accessible intake.

### Tech Stack:
- Frontend: NextJS, TypeScript, Tailwind CSS.
- Backend: Python, FastAPI.
- AI Models: Google ADK Package for Agent and Google Gemini 2.5 Flash LLM Model.
- Auth & Database: Appwrite (Google OAuth for secure login, Cloud Database for session persistence).
- Tools: Custom Python functions (update_profile), Google Search, Twilio (simulated for voice).

### Deployment:
- Frontend: NextJS, Deployed on Vercel 
- Backend: FastAPI, Deployed on Render

### Process:
I followed the AgentOps Lifecycle:
- Prototype: Started with a simple script to test the prompts.
- Architecture: Decided on the Stack: Next.js + Python to enable a seamless UI.
- Security: Implemented Appwrite Authentication to ensure patient data is isolated and secure, adhering to the best privacy practices.
- Refinement: Iterated on the system instructions to ensure the "Nurse" was empathetic and the "Analyst" was objective.
- Observability: Built the "Glass Box" UI to make the agent's internal state visible to the user.

### If I had more time, this is what I'd do

- MCP Integration: Build an MCP server to push the "Doctor Briefing" directly into a hospital's Electronic Health Record system (e.g., Epic or Cerner) via FHIR standards.
- Multilingual Support: Add a translation layer so the interview can happen in the patient's native language, but the report is generated in English for the doctor.
