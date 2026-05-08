# Practice Lab — Product Requirements Document

**Product:** CPL Practice Lab (App 3 of 3, Tier 1, Mini-App Library)
**Document Version:** 1.4 — Draft
**Status:** Pending Engineering Review
**Source Spec:** App3_Practice_Lab_Spec
**Audience:** Product, Engineering, Design
**Last Updated:** April 25, 2026
**Changelog:**
- v1.4 — New §9 Testing & Behavioral Evaluation: three-layer strategy (deterministic CI tests, prompt behavioral evals against the real LLM, production monitoring), with explicit handling of the "is the bot good?" problem via heuristic checks, LLM-as-judge, and CPL human review. CPL eval-set authorship called out as a gating dependency. Subsequent sections renumbered §10–§17. Acceptance criteria updated.
- v1.3 — Removed server-side session storage. Conversation state now lives entirely in React state on the frontend and is sent in the request body on each call. Backend is fully stateless: no Blobs, no datastore, no `/api/sessions` endpoints. Sections 1, 4, 8.1, 8.2, 9 revised.
- v1.2 — Backend section (§8.2) substantially expanded: repository layout, registry mechanism, generic engine, worked request lifecycle, error model, testing strategy.
- v1.1 — Switched deployment to Netlify (frontend + Netlify Functions backend). Open question about hosting (§14) closed.

---

## 1. Executive Summary

The Practice Lab is a hub-and-spoke web application that lets new CPL members practice individual conversation skills in short, standalone exercises. The hub presents a browsable library of mini-apps. Each mini-app is an independent chatbot session that generates a scenario, accepts a typed user response, and returns structured AI feedback assessing the user's conversational skill — never the correctness of their views.

This PRD covers the hub plus the **6 confirmed mini-apps**. The 4 proposed mini-apps in the source spec are deferred until CPL confirms them and are out of scope for v1.

**Tech stack at a glance**
- Frontend: React (TypeScript), Vite build, Tailwind CSS
- Backend: Python 3.11+, deployed as **Netlify Functions** (serverless handlers)
- LLM: Google AI Studio (Gemini), accessed server-side from Functions
- Session state (v1): **Held entirely in the frontend.** The rolling 6-turn context window lives in React state and is sent on each request. The backend is fully stateless.
- Datastore (v1): **None.** No database, no Blobs, no Redis.
- Deployment target: **Netlify** — single site hosts the static React build and the Python Functions, exposed under `/api/*` via Netlify's redirects

---

## 2. Goals and Non-Goals

### 2.1 Goals
- Give new CPL members a low-friction way to practice one conversation skill at a time.
- Provide warm, honest, actionable feedback modeled on best teaching practice.
- Ship an extensible architecture so new mini-apps can be added without rebuilding the hub.
- Maintain strict AI neutrality on political and value-laden content.

### 2.2 Non-Goals (v1)
- Full conversation simulation across multiple skills.
- Cross-session tracking, progress dashboards, or skill-level analytics.
- Assessment, scoring, or certification.
- Voice input or audio playback.
- Multi-user or facilitator review modes.

---

## 3. Target Users

Relatively new CPL members. No prior experience with CPL frameworks is assumed. Users arrive curious but uncertain about specific skills. The product must be usable cold — no onboarding flow, no required reading.

---

## 4. Product Architecture

### 4.1 High-Level Shape

```
   ┌──────────────────────────┐         ┌─────────────────────────────────┐
   │         Browser          │         │         Netlify Site            │
   │                          │         │                                 │
   │  ┌────────────────────┐  │         │  ┌───────────────┐              │
   │  │  React UI          │  │ ──GET── │  │ Static React  │              │       ┌──────────────┐
   │  │                    │  │ <─────  │  │ build (CDN)   │              │       │ LLM Provider │
   │  │  Session state:    │  │         │  └───────────────┘              │       │ (Google AI Studio) │
   │  │  • mini_app_id     │  │         │                                 │       └──────┬───────┘
   │  │  • current scenario│  │ ──POST─▶│  ┌───────────────┐              │              │
   │  │  • turns[] (≤6)    │  │ <──────  │  │   Netlify     │  ────────────────────────▶ │
   │  └────────────────────┘  │         │  │  Functions    │  <─────────────────────────  │
   │                          │         │  │   (Python)    │              │
   └──────────────────────────┘         │  └───────────────┘              │
                                        │                                 │
                                        │      (no datastore)             │
                                        └─────────────────────────────────┘
```

The Netlify site serves the static React build from its CDN. The same site exposes Python Netlify Functions under `/api/*` (configured via `netlify.toml` redirects). All LLM calls happen inside Functions; the browser never holds an API key.

**Session state lives entirely in the browser.** The React app holds the active mini-app id, the current scenario, and the rolling 6-turn context window in component state. Each call to `/scenarios` or `/responses` includes the conversation history in the request body. The backend treats every request as standalone — no session lookup, no datastore, no per-user state.

### 4.2 Extensibility Principle

Each mini-app is defined by a **MiniAppDefinition** object on the backend that declares: its id, display metadata, scenario-generation prompt, evaluation criteria, and feedback schema. Adding a new mini-app means adding a new definition file — no changes to the hub, the routing, or the React shell. The evaluation engine is generic and reads each mini-app's criteria from its definition.

This is non-negotiable: the source spec calls out that each mini-app has different evaluation metrics, so the engine must be data-driven, not hard-coded per mini-app.

---

## 5. Hub Requirements

### 5.1 Hub Landing Page

- Renders a grid of mini-app cards.
- Each card shows: name, one-sentence skill description, estimated time, Start button.
- Cards are loaded from a backend endpoint (`GET /api/mini-apps`) so adding a mini-app on the backend automatically appears in the hub with no frontend deploy.
- No required ordering. No locked or sequenced cards.

### 5.2 Hub Navigation Behavior

- Clicking Start on a card routes to `/lab/{mini_app_id}` and begins a fresh session.
- A persistent "Back to Hub" affordance is visible inside every mini-app.
- Returning to the hub from inside a mini-app **terminates the current session** for that mini-app. State is not preserved.

---

## 6. Shared Mini-App Behavior

Every mini-app implements the same six-step flow. This is a contract — variations are not permitted in v1.

1. **Orientation screen.** Static text per mini-app explaining the skill and what the user will do. One Continue button.
2. **Scenario presentation.** Backend generates a scenario via the LLM and returns it. The user reads it.
3. **Response capture.** A text area accepts the user's typed response. There is no character cap in v1, but the UI surfaces a soft suggestion (e.g., "1–3 sentences is usually enough") where appropriate per mini-app.
4. **Submit.** The frontend posts the response to the evaluation endpoint.
5. **Feedback display.** The user's response is shown verbatim alongside the AI assessment. Both are visible at the same time, on the same screen.
6. **Next action.** Two buttons: "Try again with same scenario" and "New scenario." A third affordance returns to the hub.

### 6.1 Feedback Format Contract

Feedback rendered to the user **must always** include:
- The user's response, displayed exactly as written.
- An AI assessment containing: what worked, what could be improved, and a concrete suggestion or alternative phrasing.

Tone: warm, encouraging, honest. Never purely affirming. Always actionable. Never moralizes about the content of the user's views — only their conversational skill.

### 6.2 Rolling Context Window

Each mini-app session maintains a **6-turn rolling context window**. New scenarios start a fresh context within the same session. The window is per-mini-app, per-session, and is discarded when the user returns to the hub.

### 6.3 AI Neutrality

The AI must not take political or moral sides in scenarios or feedback. Scenarios may involve sensitive topics; assessments must focus exclusively on the user's conversational skill, not the validity of their views. This is enforced by system prompt and re-checked by a lightweight neutrality post-filter (see §11).

---

## 7. Confirmed Mini-Apps

Each mini-app below specifies the inputs the engine consumes, the criteria it evaluates against, and the outputs it returns. Criteria names are stable identifiers — they map directly to fields in the feedback schema.

### 7.1 Mini-App 1 — Reflect & Check
**Skill:** Active Listening A: reflecting back with check-in.
**Scenario:** A simulated partner statement on a values- or beliefs-related topic.
**User task:** Reflect the essence of what was said, then end with a check-in question.
**Evaluation criteria:**
- `accuracy` — does the reflection capture the core of what was said?
- `tone` — is the reflection neutral and non-judgmental?
- `check_in_quality` — is the question open and genuinely inviting correction?
- `additions_or_omissions` — what was missed or added that wasn't in the original?

**Output:** user response (verbatim) + per-criterion assessment + suggested improvement or alternative phrasing.

### 7.2 Mini-App 2 — Follow the Thread
**Skill:** Active Listening B: asking follow-up questions.
**Scenario:** A simulated speaker statement.
**User task:** Write one or more follow-up questions.
**Evaluation criteria:**
- `connectedness` — does the question follow from what the speaker said?
- `openness` — open-ended vs. leading?
- `curiosity` — does it seem genuinely interested?
- `disguised_argument_check` — is the question actually a challenge in disguise?

**Output:** user questions (verbatim) + per-question assessment on each criterion + suggested alternative for any question scoring poorly.

### 7.3 Mini-App 3 — Read Between the Lines
**Skill:** Identifying language that can be taken multiple ways.
**Scenario:** A statement containing one or more ambiguous or loaded phrases.
**User task:** Identify the ambiguous phrase(s) and explain why different people might read them differently.
**Evaluation criteria:**
- `identification_accuracy` — did the user find the key ambiguous phrase(s)?
- `explanation_quality` — does the user articulate multiple plausible interpretations?
- `non_judgment` — does the explanation treat all interpretations as valid?

**Output:** user response (verbatim) + assessment + any phrases the user missed + an example of how the phrase might be heard differently by different people.

### 7.4 Mini-App 4 — Say It With Context
**Skill:** Sharing views with enough context to invite curiosity.
**Scenario:** A topic or question (AI-generated; may optionally accept user-supplied topic in v1).
**User task:** Write a statement sharing their view on the topic.
**Evaluation criteria:**
- `context` — enough background (experience, values, reasoning) to explain the view?
- `invitation` — does it leave room for engagement?
- `tone` — assertive without being dismissive?
- `curiosity_inducing` — would a listener with a different view want to ask a follow-up?

**Output:** user statement (verbatim) + per-criterion assessment + specific suggestions for adding context or adjusting tone.

### 7.5 Mini-App 5 — Under the Surface
**Skill:** Identifying possible moral foundations underlying a statement.
**Scenario:** A statement on a policy, social, or personal topic.
**User task:** Identify the values or moral foundations that appear to underlie it (e.g., fairness, loyalty, care, authority, liberty, sanctity).
**Evaluation criteria:**
- `plausibility` — are the identified values reasonable?
- `depth` — surface content vs. deepest central value?
- `plurality` — has the user considered that more than one foundation may be present?
- `non_judgment` — does the user treat the values as genuine rather than as bad faith?

**Output:** user response (verbatim) + assessment + other foundations the user may have overlooked + a brief explanation of why moral foundations matter for conversation.

**IP dependency:** CPL's moral foundations framework. The framework definition lives in a backend resource file that the mini-app's system prompt loads.

### 7.6 Mini-App 6 — What Did You Mean by That?
**Skill:** Asking clarifying questions.
**Scenario:** A statement containing an unclear term, claim, or assertion.
**User task:** Write a clarifying question that seeks understanding, not challenge.
**Evaluation criteria:**
- `relevance` — does the question target a genuinely unclear part?
- `tone` — curious vs. skeptical or adversarial?
- `openness` — open-ended vs. leading?
- `distinction_from_debate_moves` — genuine clarification or veiled argument?

**Output:** user question (verbatim) + per-criterion assessment + flag if a debate-move pattern is present + suggested alternative phrasing if needed.

---

## 8. Functional Requirements

### 8.1 Frontend (React)

- **Routing:** `/` → hub, `/lab/:miniAppId` → mini-app. Client-side routing via React Router.
- **State (the load-bearing change for v1.3):** session state lives entirely in React. A `<MiniAppShell>` component holds:
  ```ts
  type Turn = { user: string; feedback: FeedbackPayload };
  type SessionState = {
    miniAppId: string;
    currentScenario: string | null;
    turns: Turn[];   // bounded to 6 (rolling window)
  };
  ```
  This state is created when a user enters a mini-app, mutated on each scenario/response round-trip, and discarded when the user returns to the hub or refreshes. No localStorage. No IndexedDB. No `session_id` is sent to the backend — the backend has no notion of a session.
- **Sending history with every request:** `POST /api/scenarios` and `POST /api/responses` both include the relevant turn slice in their request body. The frontend is responsible for trimming the array to ≤6 entries before sending.
- **Components:** `<HubPage>`, `<MiniAppCard>`, `<MiniAppShell>`, `<OrientationScreen>`, `<ScenarioPanel>`, `<ResponseEditor>`, `<FeedbackPanel>`, `<BackToHubLink>`.
- **Feedback rendering:** `<FeedbackPanel>` is generic. It receives a `criteria: CriterionAssessment[]` array and renders each criterion as a labeled section. This keeps all six mini-apps on the same component without bespoke layouts.
- **Accessibility:** WCAG 2.1 AA. All interactive controls reachable by keyboard. Sufficient color contrast. The user's verbatim response and the AI assessment are rendered as semantic regions with appropriate ARIA labels.
- **Loading states:** Scenario generation and evaluation each require an LLM round-trip. The UI must show non-blocking progress indicators with descriptive text ("Generating scenario…", "Evaluating your response…").
- **Error states:** Network errors, LLM timeouts, and content-policy refusals each have distinct, friendly recovery paths (retry, new scenario, return to hub).

### 8.2 Backend (Python Netlify Functions)

The backend is a set of Python Netlify Functions, each handling one route. Functions are stateless across invocations — every request starts cold (or warm-pooled by Netlify), so any state that must outlive a single request lives in Netlify Blobs.

#### 8.2.1 Repository Layout

```
practice-lab/
├── netlify.toml                       # build config + /api/* redirects
├── frontend/                          # React (Vite + TS), see §8.1
└── netlify/
    └── functions/
        ├── health.py                  # GET  /api/health
        ├── mini_apps_list.py          # GET  /api/mini-apps
        ├── mini_apps_get.py           # GET  /api/mini-apps/:id
        ├── scenarios_create.py        # POST /api/scenarios
        ├── responses_create.py        # POST /api/responses
        └── _lib/                      # shared modules (NOT exposed as functions)
            ├── definitions/           # ← mini-app definitions live here
            │   ├── __init__.py        # registry assembly
            │   ├── reflect_and_check.py
            │   ├── follow_the_thread.py
            │   ├── read_between_the_lines.py
            │   ├── say_it_with_context.py
            │   ├── under_the_surface.py
            │   └── what_did_you_mean.py
            ├── registry.py            # MiniAppRegistry (lookup by id)
            ├── models.py              # Pydantic models
            ├── engine.py              # generic scenario + evaluation engine
            ├── llm_client.py          # Google AI Studio client wrapper
            ├── safety.py              # neutrality + content-safety checks
            └── ip_resources/          # CPL IP loaded into prompts
                ├── moral_foundations.md
                ├── neutrality_norms.md
                └── feedback_tone_rubric.md
```

The split between `netlify/functions/*.py` (one per route) and `netlify/functions/_lib/` (shared logic) is the load-bearing structure. Functions are thin HTTP adapters; all real work lives in `_lib`. Netlify treats files prefixed with `_` as non-deployable shared code, so this layout works natively.

#### 8.2.2 HTTP API

The API is fully stateless. There are no session endpoints. Every call to `/api/scenarios` or `/api/responses` is self-contained: the client supplies the `mini_app_id` and the relevant turn history.

| Method | Path | Function | Purpose |
|---|---|---|---|
| GET | `/api/health` | `health.py` | Liveness probe. |
| GET | `/api/mini-apps` | `mini_apps_list.py` | List all registered mini-apps for the hub. |
| GET | `/api/mini-apps/{id}` | `mini_apps_get.py` | Get a single mini-app's metadata and orientation copy. |
| POST | `/api/scenarios` | `scenarios_create.py` | Generate a new scenario. Body includes `mini_app_id` and prior `turns` (≤6). |
| POST | `/api/responses` | `responses_create.py` | Evaluate a user response. Body includes `mini_app_id`, `scenario`, `user_response`, and prior `turns` (≤6). |

**Request shape — `POST /api/scenarios`:**
```json
{
  "mini_app_id": "reflect-and-check",
  "turns": [
    { "user": "...", "feedback": { /* FeedbackPayload */ } }
  ]
}
```

**Request shape — `POST /api/responses`:**
```json
{
  "mini_app_id": "reflect-and-check",
  "scenario": "What I'm hearing is that you think...",
  "user_response": "So if I understand you correctly...",
  "turns": [
    { "user": "...", "feedback": { /* FeedbackPayload */ } }
  ]
}
```

Path parameters are extracted from the request URL inside each function. Response shape is JSON with a uniform error envelope: `{"error": {"code": "...", "message": "..."}}` on failure, raw payload on success.

**Trust boundary, written down explicitly:** the backend trusts the client-supplied `turns` array. A user editing dev-tools can submit fabricated history. For this product — no scoring, no certification, no cross-session state — that's an accepted tradeoff. If a future version introduces tracking or scoring, this decision must be revisited (see §16).

#### 8.2.3 Core Models

```python
# _lib/models.py

class CriterionSpec(BaseModel):
    """Declares one evaluation dimension for a mini-app."""
    name: str                 # stable id, e.g. "accuracy", "tone"
    label: str                # human-readable, e.g. "Accuracy"
    description: str          # what this criterion measures
    rubric: str               # guidance the LLM uses to assess this criterion

class CriterionAssessment(BaseModel):
    """One slot in the structured feedback returned to the frontend."""
    name: str                 # matches CriterionSpec.name
    verdict: str              # short label: "strong" | "partial" | "needs work"
    what_worked: str | None
    what_to_improve: str | None

class FeedbackPayload(BaseModel):
    """Generic feedback shape returned for ANY mini-app."""
    user_response: str                     # echoed verbatim, never modified
    criteria: list[CriterionAssessment]    # one entry per CriterionSpec
    suggestion: str                        # concrete alternative or improvement
    extras: dict[str, Any] = {}            # mini-app-specific fields (see §8.2.5)

class MiniAppDefinition(BaseModel):
    """The single source of truth for one mini-app."""
    id: str                                # url-safe, stable
    name: str
    skill_one_liner: str
    estimated_time: str
    orientation_copy: str

    # Prompt building blocks
    scenario_system_prompt: str            # how to generate a scenario
    evaluation_system_prompt: str          # how to assess a response
    criteria: list[CriterionSpec]
    ip_resources: list[str] = []           # filenames in _lib/ip_resources/ to inject

    # Optional hooks for mini-apps that need extra structured output
    extras_schema: dict | None = None      # JSON schema fragment for FeedbackPayload.extras
    response_validator: Callable[[str], None] | None = None  # raises ValidationError if user input is malformed
```

Two design choices worth flagging:

1. **`criteria` is a list, not a fixed shape.** Mini-app 1 has four criteria; mini-app 3 has three. The frontend renders whatever it gets. This is what makes the evaluation engine generic.
2. **`extras` plus `extras_schema`** is the escape hatch for mini-app-specific output that doesn't fit the per-criterion pattern. Examples: Mini-App 3 needs to return *missed phrases*; Mini-App 5 needs to return *other moral foundations the user didn't consider*; Mini-App 6 needs a *debate-move flag*. Rather than bending the core schema, each definition declares its own `extras_schema` and the engine validates returned extras against it.

#### 8.2.4 The Registry — How Extensibility Actually Works

The registry is the mechanism that turns "add a Python file" into "the mini-app appears everywhere in the system." There are three viable patterns. The PRD prescribes pattern A:

**Pattern A (chosen): explicit registration in `definitions/__init__.py`.**

```python
# _lib/definitions/__init__.py
from .reflect_and_check import REFLECT_AND_CHECK
from .follow_the_thread import FOLLOW_THE_THREAD
from .read_between_the_lines import READ_BETWEEN_THE_LINES
from .say_it_with_context import SAY_IT_WITH_CONTEXT
from .under_the_surface import UNDER_THE_SURFACE
from .what_did_you_mean import WHAT_DID_YOU_MEAN

ALL_DEFINITIONS: list[MiniAppDefinition] = [
    REFLECT_AND_CHECK,
    FOLLOW_THE_THREAD,
    READ_BETWEEN_THE_LINES,
    SAY_IT_WITH_CONTEXT,
    UNDER_THE_SURFACE,
    WHAT_DID_YOU_MEAN,
]
```

```python
# _lib/registry.py
from .definitions import ALL_DEFINITIONS

class MiniAppRegistry:
    def __init__(self, definitions: list[MiniAppDefinition]):
        self._by_id = {d.id: d for d in definitions}
        self._validate_unique_ids(definitions)

    def list(self) -> list[MiniAppDefinition]:
        return list(self._by_id.values())

    def get(self, mini_app_id: str) -> MiniAppDefinition:
        if mini_app_id not in self._by_id:
            raise UnknownMiniAppError(mini_app_id)
        return self._by_id[mini_app_id]

REGISTRY = MiniAppRegistry(ALL_DEFINITIONS)
```

Why explicit registration over auto-discovery (pattern B) or a YAML manifest (pattern C):
- Auto-discovery (`importlib` scanning a directory) is fragile in serverless cold-starts and hides the dependency graph.
- A YAML manifest moves prompts away from code and away from version control alongside their criteria, which is exactly where they belong.
- Explicit registration makes "what mini-apps exist" a single greppable line and keeps prompts, criteria, and validators co-located.

**The promise to the team: adding a 7th mini-app is a 2-step change.**

1. Create `_lib/definitions/new_app.py` exporting one `MiniAppDefinition`.
2. Add one import + one list entry in `_lib/definitions/__init__.py`.

That's it. No frontend change. No new HTTP route. No engine change. No infra change. The hub fetches `/api/mini-apps`, the new card appears, and `/api/sessions/{id}/scenarios` and `/api/sessions/{id}/responses` route through the same engine using the new definition.

#### 8.2.5 Example Mini-App Definition (Mini-App 1, abbreviated)

```python
# _lib/definitions/reflect_and_check.py
from .._lib.models import MiniAppDefinition, CriterionSpec

REFLECT_AND_CHECK = MiniAppDefinition(
    id="reflect-and-check",
    name="Reflect & Check",
    skill_one_liner="Reflect what you heard, then check in to confirm.",
    estimated_time="5–10 minutes",
    orientation_copy=(
        "You'll see a statement from a simulated conversation partner. "
        "Your job is to reflect back the essence of what they said in your "
        "own words, then end with a check-in question that genuinely invites "
        "them to correct you if you got it wrong."
    ),
    scenario_system_prompt=(
        "Generate one statement from a simulated conversation partner on a "
        "topic involving values or beliefs. The statement should be 2–4 "
        "sentences, present a coherent view, and avoid extreme or "
        "dehumanizing framing. Do not include any preamble — return only the "
        "statement."
    ),
    evaluation_system_prompt=(
        "You are evaluating a user's reflection-and-check-in response. "
        "Assess strictly on conversational skill, never on whether the "
        "user's content matches the partner's view politically or morally. "
        "Return JSON matching the supplied schema."
    ),
    criteria=[
        CriterionSpec(
            name="accuracy",
            label="Accuracy",
            description="Does the reflection capture the core of what was said?",
            rubric="Reward responses that preserve the partner's central claim and "
                   "key qualifiers. Penalize additions, omissions, or distortions.",
        ),
        CriterionSpec(
            name="tone",
            label="Tone",
            description="Is the reflection neutral and non-judgmental?",
            rubric="Reward neutral framing. Penalize loaded words, sarcasm, or "
                   "implied judgment.",
        ),
        CriterionSpec(
            name="check_in_quality",
            label="Check-in quality",
            description="Is the question open and genuinely inviting correction?",
            rubric="Reward open-ended questions that invite correction. Penalize "
                   "closed yes/no questions or questions that seek validation.",
        ),
        CriterionSpec(
            name="additions_or_omissions",
            label="Additions or omissions",
            description="What was added or missed compared to the original.",
            rubric="Identify any content present in the user's reflection that "
                   "was not in the partner's statement, and any central content "
                   "from the partner's statement that the user omitted.",
        ),
    ],
    ip_resources=["neutrality_norms.md", "feedback_tone_rubric.md"],
)
```

Mini-App 5 (`under_the_surface.py`) would additionally declare:

```python
ip_resources=["neutrality_norms.md", "feedback_tone_rubric.md", "moral_foundations.md"],
extras_schema={
    "type": "object",
    "properties": {
        "overlooked_foundations": {
            "type": "array",
            "items": {"type": "string"},
            "description": "Moral foundations the user did not consider.",
        },
        "why_it_matters": {"type": "string"},
    },
    "required": ["overlooked_foundations", "why_it_matters"],
},
```

#### 8.2.6 The Generic Engine

```python
# _lib/engine.py

class Engine:
    def __init__(self, llm: LLMClient, ip_loader: IPResourceLoader, safety: SafetyChecker):
        self._llm = llm
        self._ip = ip_loader
        self._safety = safety

    async def generate_scenario(self, definition: MiniAppDefinition,
                                history: list[Turn]) -> str:
        system = self._compose_scenario_system_prompt(definition)
        scenario = await self._llm.complete(system=system, history=history)
        self._safety.check_scenario(scenario)   # raises on failure
        return scenario

    async def evaluate_response(self, definition: MiniAppDefinition,
                                scenario: str, user_response: str,
                                history: list[Turn]) -> FeedbackPayload:
        if definition.response_validator:
            definition.response_validator(user_response)

        system = self._compose_evaluation_system_prompt(definition)
        schema = self._build_feedback_schema(definition)  # core + extras_schema
        raw = await self._llm.complete_structured(
            system=system, history=history,
            user_msg=self._format_eval_user_msg(scenario, user_response),
            json_schema=schema,
        )
        payload = FeedbackPayload(**raw, user_response=user_response)
        self._safety.check_feedback(payload)    # neutrality + no moral verdicts
        return payload

    def _compose_scenario_system_prompt(self, d: MiniAppDefinition) -> str:
        return "\n\n".join([
            d.scenario_system_prompt,
            self._ip.load_many(d.ip_resources),
            GLOBAL_NEUTRALITY_PREAMBLE,
        ])

    def _build_feedback_schema(self, d: MiniAppDefinition) -> dict:
        # Builds JSON schema dynamically: one slot per CriterionSpec + extras
        criterion_props = {
            c.name: {"$ref": "#/definitions/CriterionAssessment"} for c in d.criteria
        }
        schema = {...}  # composed from criterion_props and d.extras_schema
        return schema
```

The engine never knows what mini-app it's running. It reads the definition, composes prompts, calls the LLM, validates output, runs safety checks, and returns. Every code path it executes is the same for all six mini-apps.

#### 8.2.7 Function Handlers (thin adapters)

```python
# netlify/functions/responses_create.py
import json
from _lib.registry import REGISTRY
from _lib.engine import Engine
from _lib.llm_client import LLMClient
from _lib.safety import SafetyChecker
from _lib.ip_resources_loader import IPResourceLoader
from _lib.models import Turn

def handler(event, context):
    body = json.loads(event["body"])
    mini_app_id  = body["mini_app_id"]
    scenario     = body["scenario"]
    user_response = body["user_response"]
    turns        = [Turn(**t) for t in body.get("turns", [])][-6:]  # enforce ≤6

    definition = REGISTRY.get(mini_app_id)   # 404 if unknown

    engine = Engine(LLMClient(), IPResourceLoader(), SafetyChecker())
    feedback = await engine.evaluate_response(
        definition=definition,
        scenario=scenario,
        user_response=user_response,
        history=turns,
    )
    return _ok(feedback.model_dump())
```

The handler does I/O (parse request, validate inputs, return JSON). The engine does work. The definition declares behavior. There is no session lookup and no datastore call — the request body is everything the function needs.

The frontend is responsible for sending only the most recent 6 turns; the backend additionally enforces `[-6:]` as a defensive cap so a misbehaving client cannot blow up the LLM context window.

#### 8.2.8 Session State (Frontend-Held)

There is no backend session store in v1. State lives in the React `<MiniAppShell>` component (see §8.1):

```ts
// frontend: state shape
type SessionState = {
  miniAppId: string;
  currentScenario: string | null;
  turns: Turn[];   // bounded to 6 (rolling window)
};
```

**Lifecycle:**
- Created when the user clicks Start on a hub card.
- Mutated on each `/api/scenarios` and `/api/responses` round-trip.
- Discarded when the user returns to the hub, refreshes, or navigates away.
- Never persisted. No localStorage, no IndexedDB, no cookies.

**Why this works for v1:**
- The 6-turn window is small (a few KB at most). Sending it on every request is cheap.
- Functions are genuinely stateless. No cold-start penalty for a session lookup. No quota concerns. No cleanup job needed.
- Simpler ops: one less moving part to operate, monitor, and pay for.

**What this costs:**
- A page refresh ends the active session. This is already required by §5.2.
- The backend cannot enforce a 30-minute session TTL because there is no backend session. The 6-turn rolling window naturally bounds context size; a stale session is not a security or correctness issue.
- The backend cannot independently audit "how long was this session" or "how many turns did this user take" without client-supplied data. v1 does not need this; v2 telemetry plans must account for it.

#### 8.2.9 Request Lifecycle (worked example: submit a response)

```
1. Browser POSTs to /api/responses with full context in body:
   {
     "mini_app_id": "reflect-and-check",
     "scenario": "...",
     "user_response": "What I'm hearing is...",
     "turns": [ /* 0–6 prior turns from React state */ ]
   }

2. netlify.toml redirect routes to netlify/functions/responses_create.py.

3. Handler:
     a. Parse body. Validate required fields. Trim turns[] to last 6.
     b. REGISTRY.get(mini_app_id) → returns MiniAppDefinition (404 if unknown).

4. Engine.evaluate_response(definition, scenario, user_response, history):
     a. Compose system prompt:
        evaluation_system_prompt
        + loaded IP resources (e.g., neutrality_norms.md)
        + global neutrality preamble.
     b. Build feedback JSON schema dynamically from definition.criteria
        plus definition.extras_schema (if present).
     c. Call LLM with structured-output mode, requesting JSON matching schema.
     d. Validate result. On parse failure: one retry with a "your last response
        was not valid JSON, here is the schema again" repair prompt.
     e. Safety check: neutrality classifier on the assessment text.
        On failure: one regeneration. On second failure: return generic neutral
        assessment and log the incident.
     f. Construct FeedbackPayload(user_response=verbatim, criteria=[...],
        suggestion=..., extras={...}).

5. Handler returns 200 with FeedbackPayload as JSON.

6. Frontend:
     a. Renders <FeedbackPanel> from the criteria list — same component
        regardless of which mini-app generated the response.
     b. Appends { user, feedback } to its in-memory turns[] array.
     c. Trims the array to the last 6 entries.

7. On the next round-trip the new turns[] is sent again. The backend
   never persisted anything between steps 4 and 7.
```

#### 8.2.10 Error Model

| Condition | HTTP | Code | Recovery |
|---|---|---|---|
| Required field missing or malformed body | 400 | `bad_request` | Frontend bug; should not reach users. Log with high severity. |
| Unknown `mini_app_id` | 404 | `mini_app_not_found` | Frontend returns user to hub. |
| `turns` array exceeds limit (defensive) | 400 | `turns_too_long` | Backend trims to 6 instead — this code is reserved for grossly malformed inputs (e.g. >100 turns). |
| LLM call timed out | 504 | `llm_timeout` | UI offers retry. |
| LLM returned malformed JSON twice | 502 | `llm_invalid_output` | UI offers retry. |
| Safety check failed twice | 200 | (returns generic neutral feedback) | None visible to user; logged. |
| User input violated policy | 200 | (returns canned redirect message) | None; user can try again. |
| Rate limit (LLM provider) | 429 | `rate_limited` | UI shows "try again in a moment." |
| Function execution timeout | 504 | `function_timeout` | UI offers retry; new scenario suggested if recurrent. |

#### 8.2.11 Netlify-Specific Constraints

- **Cold starts.** Python function cold-start latency is typically a few hundred ms to ~1s. The UI's loading states (§8.1) absorb this; no warm-up pings required for v1.
- **Execution time limit.** Netlify Functions have a hard execution timeout (10s standard; 26s on higher tiers). Scenario generation and evaluation must each complete inside this budget. A single LLM call with one structured-output retry plus a safety check must fit. If timeouts become common, the engine must be refactored to skip the safety regeneration on the second attempt.
- **Payload limits.** Functions cap request and response bodies at 6 MB. Practice Lab payloads (≤6 turns of feedback JSON) are well under this even in the worst case.
- **Secrets.** The LLM API key is a Netlify environment variable scoped to Functions. It is never bundled into the frontend.
- **No persistent infrastructure.** No Blobs, no scheduled cleanup functions, no per-environment data stores. Reduces ops surface area to: deploy, watch logs.
- **Local development.** Engineering uses `netlify dev` to run the React build and Functions together, mirroring production routing.

#### 8.2.12 Testing Strategy

Testing for this product splits into two distinct problems: deterministic tests of the system's plumbing, and behavioral evaluation of the bot's feedback quality. The full strategy is in **§9 Testing & Behavioral Evaluation** because it cuts across backend, prompts, and CPL subject-matter expertise.

### 8.3 LLM Integration

- All LLM calls are server-side. The frontend never receives or sends an API key.
- Prompts are versioned in the repo alongside their `MiniAppDefinition`. Prompt changes are reviewed like code.
- Each mini-app's system prompt is composed at request time from: `definition.scenario_system_prompt` or `definition.evaluation_system_prompt` + concatenated CPL IP resources declared in `definition.ip_resources` + a global neutrality preamble.
- Structured output is requested as JSON conforming to a schema generated dynamically from the definition's `criteria` and `extras_schema`. Malformed output triggers one repair retry; persistent failure surfaces as `llm_invalid_output` (see §8.2.10).
- User input is wrapped in delimited blocks in every prompt (`<user_response>...</user_response>`) and the system prompt instructs the model to ignore embedded instructions inside those blocks. This is the primary prompt-injection defense, in addition to the post-output safety check.

---

## 9. Testing & Behavioral Evaluation

Testing this product splits into two fundamentally different problems:

- **Deterministic tests** of the system's plumbing — the engine, the registry, the handlers, the schemas. These pass or fail unambiguously and run in CI on every commit.
- **Behavioral evaluation** of the bot's feedback — does the AI actually do what we want? This is the hard problem. LLM output is non-deterministic, and the ground truth ("is this feedback warm, honest, actionable, neutral?") is partly subjective. We need a layered approach.

Treating these as one problem ("we'll write tests") is a common failure mode and produces tests that catch neither bugs nor regressions. The strategy below treats them separately.

### 9.1 Layer 1 — Deterministic Tests (CI, every commit)

These run with a `FakeLLMClient` that returns canned JSON, so they are fast, hermetic, and free.

**Unit tests — engine.** Each public method on `Engine` is tested against a fake LLM. We assert:
- The composed system prompt contains the mini-app's `evaluation_system_prompt`, every declared `ip_resources` file, and the global neutrality preamble.
- The dynamically built JSON schema has exactly one slot per `CriterionSpec` plus the declared `extras_schema`.
- Malformed LLM output triggers exactly one repair retry; persistent failure raises `LLMInvalidOutputError`.
- Safety-check failures trigger exactly one regeneration; persistent failure returns the generic neutral fallback (not the original output).

**Definition-conformance tests.** A single test iterates `REGISTRY.list()` and asserts:
- `id` is unique across all definitions and is URL-safe.
- All `criteria[].name` values are unique within a definition.
- Every filename in `ip_resources` exists on disk under `_lib/ip_resources/`.
- `extras_schema` (if present) is itself valid JSON Schema.
- `scenario_system_prompt` and `evaluation_system_prompt` are non-empty.
- The orientation copy is non-empty and under a sane character cap (e.g., 1,500 chars).

This is the safety net that makes the "just add a definition file" promise reliable. A misconfigured 7th mini-app fails CI before it ships.

**Contract tests — function handlers.** Run via `netlify dev` against the local emulator with a `FakeLLMClient`. For each endpoint:
- Happy path: well-formed request returns 200 with the expected schema.
- Each failure mode in the §8.2.10 error model returns the documented HTTP code and error code.
- The defensive `turns[-6:]` trim works (send 100 turns, observe only 6 reach the engine via fake LLM call inspection).

**Frontend tests.** Standard React Testing Library suite:
- `<FeedbackPanel>` renders correctly given any number of criteria (1–6).
- The `turns[]` rolling window trims to 6 in client state.
- Refresh / back-to-hub clears the in-memory session.

### 9.2 Layer 2 — Prompt Behavioral Evaluation (pre-merge for prompt changes, weekly otherwise)

This is the layer that answers "does the bot behave the way we want?" It runs against the **real LLM**, so it costs money and is slower. We run it on a schedule and on any PR that changes a prompt or a definition.

**The eval set.** For each of the six mini-apps, CPL provides a fixed eval set of **20–30 (scenario, user_response) pairs** with expected behavior labels. Each pair is one of:
- **Strong response** — the user did the skill well. Expected: AI assesses it as strong on the relevant criteria.
- **Weak response** — the user did the skill poorly in a specific way (e.g., reflection that adds judgment, follow-up that's a disguised argument). Expected: AI flags the specific weakness with a concrete suggestion.
- **Edge case** — politically charged content, ambiguous prompts, near-misses. Expected: AI stays neutral, focuses on skill, doesn't moralize.

**Eval set construction is a CPL deliverable.** Engineering cannot write these alone — the eval set is the operational definition of "good feedback" for each skill. CPL subject-matter experts write the prompts, write 2–3 example responses per scenario at varying quality, and write a rubric describing what the AI must catch and what it must not say.

**The eval harness.** A Python script that:

1. Loads each (scenario, user_response) pair from the eval set.
2. Calls the real engine with the real LLM provider.
3. Captures the full `FeedbackPayload`.
4. Runs three classes of checks against the payload:

| Check | Type | Source |
|---|---|---|
| **Schema validity** | Hard / automated | Output validates against the dynamically built schema. |
| **Heuristic checks** | Hard / automated | See §9.2.1. Catches obvious failures cheaply. |
| **LLM-as-judge** | Soft / automated | A separate LLM call rates the feedback against a CPL-authored rubric. See §9.2.2. |
| **Human review** | Soft / manual | A sample of outputs is reviewed by a CPL SME each cycle. See §9.2.3. |

#### 9.2.1 Heuristic Checks

These are cheap, deterministic, and catch the failures that matter most:

- **`user_response` is byte-identical to the input.** The contract from §6.1 says the user's response is shown verbatim. Any modification — even fixing a typo — is a bug.
- **Length bounds.** Each `what_worked` / `what_to_improve` field is between 20 and 600 characters. Extremely short means the AI is dodging; extremely long means it's over-explaining.
- **`suggestion` is non-empty and contains an actionable verb.** A regex check for a leading imperative ("Try…", "Consider…", "Rephrase…", etc.). Catches the "great job!" failure mode.
- **No moral verdict on content.** A blocklist of phrases that indicate the AI is judging the user's view rather than their skill: "you're wrong about", "the correct view is", "actually,", "in reality,", etc. Curated by CPL.
- **No first-person AI commentary.** The AI should not say "I think your view is…" or "I disagree with…". Regex check for `\b(I think|I believe|I disagree|in my opinion)\b` in feedback fields.
- **No political-side language.** A blocklist of terms that signal a political lean (curated by CPL with care). Triggering one of these in feedback is a hard fail.

Heuristic checks are fast and run on 100% of eval outputs.

#### 9.2.2 LLM-as-Judge

For the things heuristics can't measure — was the feedback actually warm? Was it actionable? Did it correctly identify the user's mistake? — we use a second LLM call as a judge.

```
Judge prompt (sketch):
  You are evaluating whether AI feedback meets CPL's standards.
  Here is the user's task: [skill description].
  Here is the user's response: [user_response].
  Here is the AI's feedback: [criteria + suggestion + extras].
  Here is the expected behavior for this case: [eval set label + rubric].

  Rate each of the following on a 1–5 scale and explain:
  1. Accuracy — does the feedback correctly identify what the user did well/poorly?
  2. Warmth — is the tone warm and encouraging?
  3. Honesty — does it call out real weaknesses without flattering?
  4. Actionability — is the suggestion specific and usable?
  5. Neutrality — does it stay focused on skill, not content?

  Return JSON with scores and reasoning.
```

**Important caveats:**
- LLM-as-judge is a **directional signal, not ground truth**. It catches drift between releases reasonably well; it does not certify quality.
- The judge model should be different from (or at minimum a different prompt of) the model under test, to reduce shared-blindspot risk.
- Judge scores are tracked over time, not used as pass/fail gates. A drop in average warmth from 4.3 to 3.6 across releases is a signal to investigate.

**Pass criteria for a release:**
- 100% schema validity.
- ≥98% of eval cases pass all heuristic checks.
- LLM-judge mean score ≥ 4.0 across all five dimensions, with no individual dimension dropping more than 0.3 points from the previous release.
- Zero hard fails on the political-side and moral-verdict heuristics.

#### 9.2.3 Human Review (CPL)

LLM-judge cannot fully substitute for SME judgment, especially for the moral-foundations skill. Each release cycle:

- A random sample of 10 outputs per mini-app (60 total) is reviewed by a CPL SME.
- The SME labels each as Pass / Pass with concerns / Fail and writes a short note.
- Failures and "concerns" feed directly into eval set expansion and prompt revision for the next cycle.

This is the only loop that catches subtle problems like "the AI is being technically warm but condescending" or "the AI got the moral foundation right but missed the deeper one." It is also the loop that keeps CPL's voice in the product as the LLM evolves.

### 9.3 Layer 3 — Continuous Monitoring (production)

Once the product is live, two things must be tracked continuously:

**Production safety dashboard.**
- Rate of safety-check regenerations (per mini-app, per day). A spike means the model is drifting toward problematic output and the prompts need revision.
- Rate of `llm_invalid_output` errors (schema repair failures). A spike usually means the LLM provider has updated its model.
- Rate of canned-redirect responses (user input flagged as abusive/off-topic). High rates may indicate the input filter is too aggressive.

**User feedback channel.** Every feedback panel includes a small "Was this helpful?" thumbs-up/down with an optional one-line comment box. The thumbs-down rate per mini-app is tracked. Thumbs-down comments are reviewed weekly. **Comments are stored in aggregate analytics only**, never tied to a user, and the user's response itself is not stored alongside (we don't have it server-side anyway, per §10).

### 9.4 Regression Strategy

When a real production issue is discovered (via monitoring, user feedback, or human review), the workflow is:

1. Reproduce: capture the (mini_app, scenario, user_response) tuple.
2. Add it to the eval set with the correct expected behavior.
3. Fix: typically a prompt revision in the relevant `MiniAppDefinition`.
4. Verify: re-run the eval suite, confirm the new case passes and no existing cases regress.

This grows the eval set monotonically and means we never fix the same class of bug twice.

### 9.5 What's Out of Scope (v1)

- **Adversarial robustness testing** — systematic prompt-injection probing beyond the basic delimited-block defense. Worth doing in v2.
- **Cross-mini-app consistency** — checking that feedback tone is consistent across all six mini-apps. Hard to measure; deferred.
- **A/B testing of prompt variants** — would require server-side response logging, which we don't have. Deferred to whenever cross-session storage lands.

### 9.6 Required From CPL Before Engineering Can Build the Eval Layer

This is the gating dependency for §9.2 and worth flagging as a separate deliverable:

- For each of the six mini-apps: 20–30 (scenario, user_response, expected behavior) tuples.
- For each: a one-paragraph rubric describing what good and bad feedback look like for that case.
- The blocklists referenced in §9.2.1 (moral-verdict phrases, political-side terms).
- Approval of the LLM-as-judge prompt structure.

Without this, Layer 1 ships and Layer 2 doesn't. The product would still work, but with no defense against prompt regressions.

---

## 10. Data, Storage, Privacy

- **No user accounts in v1.** No login. No PII collection.
- **No server-side storage of user responses.** The backend is fully stateless. User responses and feedback exist only in the browser's React state for the duration of the session. Closing the tab, refreshing, or returning to the hub clears everything.
- **No session IDs.** There is no server-side session concept.
- **In transit:** user responses travel over HTTPS to the LLM provider via the backend Function. They are not stored at rest by the Practice Lab. They may be subject to the LLM provider's retention policy, which CPL must review when finalizing the LLM provider choice (see §15).
- **Logging:** Netlify Function logs may include request timestamps, mini-app id, latency, and error codes. They must not include user-typed content or LLM output. Engineering is responsible for ensuring no `print` or `log` statement emits user content.
- **Telemetry (v1):** Anonymous counters only — scenarios generated, responses submitted, errors. No content captured. Netlify Analytics may be enabled at the site level for traffic-only metrics.

---

## 11. Guardrails and Safety

- Scenarios may involve sensitive political or social topics but must not contain hate speech, disinformation, or content that dehumanizes any group. This is enforced by the scenario-generation system prompt and a content-safety check on generated scenarios before they are returned to the user.
- The AI must not take political sides. A neutrality check runs on every feedback payload before it is returned. If the check fails, the backend regenerates once; on second failure, it returns a generic neutral assessment and logs the incident.
- Feedback must not render moral verdicts on the user's views — only on their conversational skill. This is enforced in the evaluation system prompt and verified by the same post-check.
- If the user's input contains abusive or off-topic content, the AI gently redirects without engaging with the content. A canned redirect message is used when the safety classifier flags the input.
- **Prompt injection defense:** user input is treated strictly as data, never as instructions. The backend wraps user content in delimited blocks in every prompt and instructs the model to ignore embedded instructions inside those blocks.

---

## 12. Required CPL Intellectual Property

The following CPL materials must be supplied to the engineering team and embedded in the appropriate mini-app prompts and resource files:

- Full training curriculum (used to ground all mini-app prompts).
- Intervention principles (used in feedback tone calibration).
- CPL norms for neutrality and restraint.
- Moral foundations framework (Mini-App 5).

These are loaded as static resources on the backend at startup. Updates to CPL IP can be deployed by replacing the resource files — no code change required.

---

## 13. Tool Integrations (Source Spec)

The source spec references Bubble for UI and AntiGravity for AI logic. The architecture in this PRD replaces both with React on Netlify (UI) and Python Netlify Functions calling Google AI Studio (AI logic). Google Docs remains the source of CPL training curriculum and IP and feeds the prompt resource files.

If CPL has a hard requirement to ship on Bubble + AntiGravity, this PRD will need a follow-up alignment session — Netlify is fundamentally incompatible with a Bubble-hosted UI.

---

## 14. Non-Functional Requirements

- **Performance:** Scenario generation p95 ≤ 6s, evaluation p95 ≤ 8s end-to-end, **measured from warm function invocations**. Cold-start invocations may add up to ~1s; the UI absorbs this with descriptive loading states. Both operations must complete inside Netlify's per-function execution timeout (see §8.2).
- **Availability:** Inherits Netlify's platform SLA. Target 99.5% during CPL business hours.
- **Browser support:** Latest two major versions of Chrome, Safari, Firefox, Edge.
- **Mobile:** Responsive layout. Functional on phones in portrait — full read/type/feedback flow must work.
- **Accessibility:** WCAG 2.1 AA.

---

## 15. Open Questions

1. ~~**Hosting and deployment.**~~ **Resolved:** Netlify (frontend + Python Functions + Blobs) per CPL direction.
2. **Netlify plan tier.** Confirm which Netlify plan CPL is on — this determines Function execution timeout (10s standard vs. 26s on higher tiers), Blobs quota, and bandwidth. If on the standard tier, evaluation prompts must be tuned to fit comfortably under 10s.
3. **LLM provider and model.** Confirm Google AI Studio (Gemini) as the model and confirm budget/quota assumptions.
4. **Topic library for scenarios.** Should scenario topics be drawn from a curated CPL list, or generated freely within neutrality guardrails?
5. **Bubble/AntiGravity alignment.** Is the React + Netlify direction acceptable, or is Bubble required (see §13)?
6. **User-supplied topics in Mini-App 4.** Source spec lists this as optional. Confirm in or out for v1.

---

## 16. Future Enhancements (Out of Scope for v1)

- Voice input and audio playback of scenarios.
- Cross-session skill tracking and progress dashboard.
- Difficulty levels (beginner / intermediate / advanced) per mini-app.
- Facilitator review mode.
- The 4 proposed mini-apps (Fact or Frame?, Common Ground, Turn It Down, Steel Man) once CPL confirms scope.
- Optional guided pathways that recommend a skill order.

---

## 17. Acceptance Criteria for v1

- A new CPL member can land on the hub, pick any of the 6 confirmed mini-apps, complete the full orientation → scenario → response → feedback → retry / new-scenario loop, and return to the hub, end-to-end, without errors.
- The feedback panel always shows the user's response verbatim alongside the assessment.
- All six mini-apps share the same React shell and the same backend evaluation engine. Adding a seventh mini-app requires only a new definition file on the backend and zero frontend changes.
- The neutrality and content-safety checks run on every LLM output. Logged failures are zero in a 50-session manual smoke test across all six mini-apps.
- The Lighthouse accessibility score for the hub and mini-app shell is ≥ 95.
- The full Layer 1 and Layer 2 test suites (see §9) pass at the release thresholds: 100% schema validity, ≥98% heuristic pass rate, LLM-judge mean ≥4.0 across all five dimensions, zero hard fails on political-side and moral-verdict heuristics.
