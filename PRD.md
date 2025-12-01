# Product Requirements Document (PRD): Prepped (working title)

## 1. Problem Statement
**The "White Coat" Gap:**
Patients often struggle to communicate effectively during short medical appointments. Due to anxiety, medical illiteracy, or simple forgetfulness, they often fail to mention critical symptoms or ask key questions. Doctors, constrained by time, spend valuable minutes gathering basic history rather than diagnosing.

**The Opportunity:**
An autonomous AI agent can bridge this gap by acting as an asynchronous "medical intake advocate." By interviewing the patient *before* the visit in a low-pressure environment, the agent can structure the data, perform preliminary research, and arm the patient with a "Doctor-Ready Briefing."

---

## 2. Solution Overview
**"Prepped"** is a multi-agent system designed to prepare patients for high-stakes medical conversations. It does not diagnose; it organizes.

### Core Value Propositions:
* **For the Patient:** Reduces anxiety by ensuring they feel "heard" and prepared.
* **For the Provider:** Increases appointment efficiency by presenting a synthesized, clinically relevant history.
* **The "Good" Factor:** Increases healthcare accessibility for those who struggle to advocate for themselves.

---

## 3. User Personas
* **"Anxious Alex":** Has a new, worrying symptom. Googling it makes them panic. They need an empathetic voice to calm them down and organize their thoughts before seeing a doctor.
* **"Chronic Casey":** Has a complex history (multiple conditions/meds). They struggle to remember dates and dosages. They need an "external brain" to track their timeline.

---

## 4. Agentic Architecture
The system utilizes a **Sequential Handoff Pattern** (Level 3 Multi-Agent System) involving two specialized agents coordinated by a central logic layer.

### 4.1. Agent A: The "Intake Nurse" (Interviewer)
* **Role:** Active Listener & Data Extractor.
* **Persona:** Warm, professional, patient, non-judgmental.
* **Type:** Loop Agent (Conversational).
* **Responsibilities:**
    * Conduct a structured interview based on the user's initial complaint.
    * Detect ambiguity (e.g., User says "It hurts," Agent asks "Is it a sharp pain or a dull ache?").
    * **Safety Guardrail:** If the user mentions a life-threatening emergency (e.g., "chest pain," "trouble breathing"), immediately terminate the loop and direct to emergency services.
* **Tools:**
    * `ProfileUpdater`: Writes structured data (symptom, duration, severity) to the Memory Bank.

### 4.2. Agent B: The "Medical Analyst" (Researcher)
* **Role:** Synthesizer & Fact-Checker.
* **Persona:** Objective, precise, analytical.
* **Type:** Sequential/Task Agent.
* **Trigger:** Activates only after Agent A determines the interview is complete.
* **Responsibilities:**
    * Review the structured profile created by Agent A.
    * Identify medical terminology that might clarify the patient's description (grounding).
    * Generate a list of "High-Value Questions" the patient should ask the doctor.
* **Tools:**
    * `GoogleSearch` (Built-in): To find standard care guidelines or definitions for the symptoms identified.
    * `MedicalTermLookup` (Custom): To map colloquialisms ("tummy ache") to clinical terms ("abdominal pain").

---

## 5. Memory & Context Strategy
This system relies on **Context Engineering** to manage the "Context Window" limitations and maintain state.

### 5.1. The "Memory Bank" (Structured State)
Instead of relying solely on the chat log (which gets messy), the system maintains a structured JSON object that acts as the "Source of Truth."
* **Main Complaint:** (String)
* **Symptom Timeline:** (List of Objects)
* **Current Medications:** (List)
* **Family History:** (List)

### 5.2. Context Compaction
* **Input:** The raw transcript of the conversation with Agent A (potentially hundreds of tokens of "umms" and "ahhs").
* **Process:** Agent A continuously extracts facts into the Memory Bank.
* **Output:** Agent B receives *only* the structured Memory Bank, not the full chat transcript. This creates a "clean slate" for analysis, reducing hallucinations and costs.

---

## 6. Functional Requirements (Behavioral)

### 6.1. The Interview Loop
* The system must start with an open-ended question ("What brings you in today?").
* The system must ask **one question at a time** (avoiding cognitive overload).
* The system must confirm understanding ("So it started 3 days ago, correct?") before committing to Memory.

### 6.2. The Handoff
* The system must detect "Saturation" (when the user has no new info).
* The system must explicitly inform the user: "I have enough information. I am now generating your briefing."

### 6.3. The Output Artifact (The "Briefing")
The final output is not a chat message, but a generated document containing:
1.  **Chief Complaint:** 1-sentence summary.
2.  **History of Present Illness (HPI):** Chronological bullet points.
3.  **Medication Reconciliation:** List of current meds.
4.  **Patient Questions:** 3-5 suggested questions for the doctor (e.g., "Should I be worried about X?", "Does this interact with my current meds?").

---

## 7. Safety, Privacy & Ethics (Critical for "Agents for Good")

### 7.1. Data Minimization
* **Requirement:** No PII (Name, SSN, Insurance ID) is required for the clinical interview.
* **Implementation:** The system will explicitly instruct the user *not* to share identifiers.

### 7.2. "Not a Doctor" Guardrails
* **Requirement:** The agents must never provide a diagnosis or treatment plan.
* **Implementation:** System instructions (prompts) will include negative constraints: *"Do not diagnose. Do not suggest medication. Use phrases like 'This information may be relevant to...' instead of 'You have...'."*

### 7.3. Hallucination Control
* **Requirement:** Medical facts must be grounded.
* **Implementation:** Agent B is restricted to using information found via the Google Search tool or the Memory Bank. It cannot generate medical advice from its own training data without citation.

---

## 8. Success Metrics (ROI)
* **Completeness Score:** Does the final report contain the 4 key components (Complaint, Onset, Location, Severity)?
* **User Confidence:** (Post-interaction survey) "Do you feel more prepared for your visit?"
* **Efficiency:** Average time to complete profile < 5 minutes.