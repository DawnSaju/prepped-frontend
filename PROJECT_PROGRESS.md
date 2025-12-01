# Prepped - AI Medical Intake Agent: Project Progress Summary

## 1. Project Overview
**Prepped** is an intelligent medical intake assistant designed to conduct structured patient interviews, extract clinical data, and generate professional briefings for doctors. The system uses a multi-agent architecture to separate the "empathetic interviewer" role from the "clinical analyst" role.

## 2. Architecture & Tech Stack
*   **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS.
*   **Backend**: Python FastAPI.
*   **AI Core**: Google Gemini 2.5 Flash & 3 Pro (via Google AI Studio SDK).
*   **Database**: Appwrite (Cloud) for session and profile persistence.
*   **Voice**: Twilio (Programmable Voice) for phone-based intake.
*   **Design System**: Custom "Neo-Brutalist" / Skeuomorphic UI with tactile interactions.

## 3. Key Features Implemented

### A. Multi-Agent Workflow
1.  **Agent A (Intake Nurse)**:
    *   Conducts conversational interviews.
    *   Uses **Tools** to extract structured data (`update_profile`) from natural language.
    *   Manages the `MedicalProfile` state (Chief Complaint, Symptoms, Medications).
    *   Detects when sufficient information is gathered to trigger a handoff.
2.  **Agent B (Medical Analyst)**:
    *   Triggered automatically upon interview completion.
    *   Synthesizes the gathered data into a **Doctor Briefing**.
    *   Generates suggested follow-up questions for the physician.
    *   Uses `web_search` (DuckDuckGo) to ground analysis in medical literature.

### B. Data Persistence & Management
*   **Appwrite Integration**:
    *   Migrated from local JSON file storage to Appwrite Database.
    *   **Session Management**: Full CRUD operations for chat sessions.
    *   **Chat History**: All messages (User & AI) are persisted within the session document, allowing conversations to be restored across page reloads.
    *   **User Isolation**: Implemented logic to tag sessions with a `user_id` (generated on client) to ensure users only see their own data.

### C. Voice Interface
*   **Twilio Integration**:
    *   `/initiate-call` endpoint to start outbound calls.
    *   `/voice/webhook` to handle TwiML logic.
    *   Real-time speech-to-text transcription using Gemini.
    *   Text-to-speech response generation using Twilio's Neural voices.

### D. User Interface (Frontend)
*   **Chat Interface**:
    *   Real-time chat with optimistic UI updates.
    *   **Neo-Design System**: Custom components (`NeoButton`, `NeoSlider`, `MessageBubble`) featuring complex shadow layering and gradients.
    *   **Dynamic Sidebar**: Displays the live `MedicalProfile` (Symptoms, Meds) extracted by the AI in real-time.
    *   **Empty State**: Engaging "Start Intake" screen with quick-action prompts.
*   **Authentication**:
    *   Simulated Login/Register flow.
    *   Persistent identity management via `localStorage`.

## 4. Recent "Sprint" Achievements
1.  **Database Migration**: Successfully moved all state management from in-memory/JSON to Appwrite, ensuring data durability.
2.  **History Persistence**: Solved issue where chat history was lost on refresh. Now fetches full message history from Appwrite on session load.
3.  **User Scoping**: Added security layer to filter sessions by User ID, preventing data leakage between users.
4.  **UI Polish**: Refined the "Empty State" of the chat to match the high-fidelity design system, using `NeoButton` components for starter prompts.

## 5. Current State
The application is fully functional for the core "Happy Path":
1.  User logs in.
2.  User starts a chat or voice call.
3.  AI conducts interview and updates the sidebar in real-time.
4.  AI hands off to Analyst for final report.
5.  All data is saved and retrievable.

## 6. Project Structure
```
├── app/                  # Next.js App Router pages
├── components/           # React UI Components
│   ├── ui/               # Low-level design primitives (NeoButton, etc.)
│   ├── ChatInterface.tsx # Main chat logic
│   └── Sidebar.tsx       # Live medical profile view
├── backend/              # FastAPI Server
│   ├── server.py         # API Endpoints
│   └── agent/            # AI Logic
│       ├── agent_logic.py # Gemini Agent definitions
│       ├── memory.py     # Appwrite & Data Models
│       └── tools.py      # Function calling implementations
└── services/             # Frontend API services
```
