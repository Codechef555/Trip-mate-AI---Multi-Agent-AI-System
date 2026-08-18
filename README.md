
✈️ TripMate - Multi-Agent Travel Planning Assistant

A demonstration project showcasing how to build a safe, reviewable, and production-inspired multi-agent AI system using LangGraph, Model Context Protocol (MCP), FastAPI, and Human-in-the-Loop (HITL) workflows.

TripMate demonstrates how a central Supervisor Agent coordinates four specialized AI agents, each responsible for a different part of the travel-planning process. MCP servers provide standardized access to external tools and services while human approval is required before the final itinerary is delivered.

---

Architecture

TripMate uses a Supervisor + Four Specialized Agents + MCP architecture.

                              User Query Input
                                    │
                                    ▼
                          FastAPI Web Interface
                                    │
                                    ▼
                            Input Guardrails
                                    │
                                    ▼
                           Supervisor Agent
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
       Planner Agent         Weather Agent        Activities Agent
              │                     │                     │
              │                     ▼                     ▼
              │              Weather MCP Server    Activities MCP Server
              │                     │                     │
              │                     └─────────┬───────────┘
              │                               │
              │                               ▼
              │                        External APIs
              │
              ▼
       Budget & Logistics Agent
              │
              ▼
       Budget / Currency /
       Transport MCP Server
              │
              ▼
       External APIs / Services
              │
              └──────────────────────┐
                                     ▼
                              Draft Travel Plan
                                     │
                                     ▼
                              Human Approval
                                /          \
                         Approved        Revision
                            │               │
                            │               ▼
                            │        Supervisor Agent
                            │               │
                            │               └──────► Agents
                            │
                            ▼
                      Final Travel Plan

Four-Agent Architecture

1. Planner Agent

The Planner Agent is responsible for understanding the user's travel requirements and constructing the overall itinerary.

Responsibilities:

* Understand destination, duration, dates, and traveler preferences.
* Identify required planning tasks.
* Coordinate itinerary structure.
* Combine information returned by other agents.
* Produce the initial travel-plan draft.
* Identify missing information that requires clarification.

The Planner Agent should primarily focus on planning and synthesis rather than directly accessing every external service.

Example:

User:
"Plan a 7-day trip to Japan for two people in April."

Planner Agent:
├── Determine cities
├── Determine daily itinerary
├── Request weather information
├── Request activity recommendations
├── Request budget/logistics information
└── Build draft itinerary

---

2. Weather Agent

The Weather Agent specializes in weather-related travel information.

Instead of embedding weather API logic directly inside the agent, the agent communicates with a Weather MCP Server.

Responsibilities:

* Retrieve current weather information.
* Retrieve forecasts.
* Compare weather conditions across destinations.
* Identify potentially unsuitable outdoor activities.
* Provide weather-aware recommendations to the Planner Agent.

Example MCP tools:

get_current_weather
get_weather_forecast
get_weather_by_date
compare_destination_weather

Example workflow:

Weather Agent
      │
      ▼
Weather MCP Client
      │
      ▼
Weather MCP Server
      │
      ▼
Weather API
      │
      ▼
Weather data
      │
      ▼
Weather Agent
      │
      ▼
Supervisor / Planner Agent

The Weather Agent should return structured information to the Supervisor rather than directly modifying the final itinerary.

Example:

{
  "destination": "Tokyo",
  "date": "2026-04-15",
  "temperature": "18°C",
  "condition": "Partly cloudy",
  "rain_probability": 20,
  "recommendation": "Suitable for outdoor sightseeing"
}

---

3. Activities & Research Agent

The Activities Agent specializes in finding attractions, experiences, restaurants, landmarks, and other destination-specific activities.

This agent can use one or more MCP servers to access external travel information.

Responsibilities:

* Find attractions.
* Find activities based on traveler preferences.
* Find family-friendly or accessibility-friendly activities.
* Identify opening hours.
* Identify estimated activity duration.
* Recommend activities based on location.
* Avoid scheduling geographically distant activities on the same day when possible.

Example MCP tools:

search_attractions
search_activities
search_restaurants
get_place_details
get_opening_hours
search_nearby_places

Example workflow:

Activities Agent
       │
       ▼
Activities MCP Client
       │
       ▼
Activities MCP Server
       │
       ▼
Travel / Maps / Places APIs
       │
       ▼
Activity results
       │
       ▼
Activities Agent
       │
       ▼
Supervisor

Example output:

{
  "destination": "Tokyo",
  "activities": [
    {
      "name": "Senso-ji",
      "category": "Cultural",
      "duration_hours": 2,
      "area": "Asakusa"
    },
    {
      "name": "Tokyo Skytree",
      "category": "Observation Deck",
      "duration_hours": 2,
      "area": "Sumida"
    }
  ]
}

---

4. Budget & Logistics Agent

The Budget & Logistics Agent is responsible for estimating travel costs and helping the Supervisor construct a practical itinerary.

This agent can use MCP servers for currency conversion, transportation information, and other logistical services.

Responsibilities:

* Estimate daily travel costs.
* Convert currencies.
* Estimate transportation costs.
* Compare transportation options.
* Estimate activity costs.
* Track the user's budget.
* Identify potential budget violations.
* Provide logistical constraints to the Planner Agent.

Example MCP tools:

convert_currency
estimate_transport_cost
search_transport_options
estimate_activity_cost
calculate_daily_budget

Example workflow:

Budget Agent
      │
      ▼
Logistics MCP Client
      │
      ▼
Logistics MCP Server
      │
      ├── Currency API
      ├── Transport API
      └── Pricing API
      │
      ▼
Cost / logistics data
      │
      ▼
Budget Agent
      │
      ▼
Supervisor

Example output:

{
  "currency": "JPY",
  "daily_budget": 25000,
  "estimated_transport": 5000,
  "estimated_activities": 7000,
  "estimated_food": 8000,
  "remaining_budget": 5000
}

---

Supervisor Agent

The Supervisor Agent is the central coordinator of the four-agent system.

It does not perform every task itself. Instead, it determines which specialized agent should perform each task and combines their results.

                    Supervisor Agent
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
      Planner           Weather         Activities
       Agent             Agent             Agent
          │                │                │
          └────────────────┼────────────────┘
                           │
                           ▼
                    Budget Agent
                           │
                           ▼
                    Draft Itinerary

The Supervisor is responsible for:

* Understanding the overall task.
* Delegating work to specialized agents.
* Managing agent execution order.
* Passing relevant context between agents.
* Detecting incomplete results.
* Requesting additional agent work when necessary.
* Combining agent outputs.
* Sending the draft to the Human-in-the-Loop approval stage.

---

MCP Architecture

MCP acts as the standardized communication layer between AI agents and external tools.

Instead of implementing external API integrations directly inside every agent, TripMate separates:

AI Agent
   │
   ▼
MCP Client
   │
   ▼
MCP Server
   │
   ▼
External Tool / API

This provides a clean separation between reasoning and external tool execution.

Recommended MCP Servers

TripMate can be organized around multiple domain-specific MCP servers:

                         TripMate
                            │
                     Supervisor Agent
                            │
       ┌────────────────────┼────────────────────┐
       │                    │                    │
       ▼                    ▼                    ▼
 Weather Agent       Activities Agent      Budget Agent
       │                    │                    │
       ▼                    ▼                    ▼
 Weather MCP         Activities MCP       Logistics MCP
 Server              Server               Server
       │                    │                    │
       ▼                    ▼                    ▼
 Weather API          Places API           Currency API
                                            Transport API

The Planner Agent consumes the results from the specialized agents and creates the itinerary.

---

MCP Client Layer

The project should contain an MCP client abstraction that hides connection details from the agents.

Example:

mcp_client.py

                    MCP Client
                        │
        ┌───────────────┼────────────────┐
        │               │                │
        ▼               ▼                ▼
 Weather MCP      Activities MCP    Logistics MCP
 Client            Client            Client

The client layer can provide helper methods such as:

get_weather()
get_forecast()
search_activities()
get_place_details()
convert_currency()
estimate_transport()

The agents should call these helpers instead of directly implementing HTTP requests to external APIs.

---

Example MCP Tool Organization

A scalable project can organize MCP tools as follows:

MCP Servers
│
├── Weather MCP Server
│   ├── get_current_weather
│   ├── get_weather_forecast
│   └── get_weather_by_date
│
├── Activities MCP Server
│   ├── search_attractions
│   ├── search_activities
│   ├── search_restaurants
│   ├── get_place_details
│   └── get_opening_hours
│
└── Logistics MCP Server
    ├── convert_currency
    ├── search_transport_options
    ├── estimate_transport_cost
    └── estimate_activity_cost

Additional MCP servers can be added later without changing the overall LangGraph architecture.

---

Complete Request Flow

A complete request can flow through the system as follows:

1. User
   │
   ▼
2. FastAPI
   │
   ▼
3. Input Guardrails
   │
   ▼
4. Supervisor Agent
   │
   ├──────────────► Planner Agent
   │
   ├──────────────► Weather Agent
   │                    │
   │                    ▼
   │               Weather MCP
   │
   ├──────────────► Activities Agent
   │                    │
   │                    ▼
   │               Activities MCP
   │
   └──────────────► Budget Agent
                        │
                        ▼
                   Logistics MCP

5. Supervisor combines results
   │
   ▼
6. Draft Travel Plan
   │
   ▼
7. Human Review
   │
   ├── Approve ──────────────► Final Plan
   │
   └── Request Changes
             │
             ▼
       Supervisor Agent
             │
             ▼
        Specialized Agents
             │
             ▼
        Revised Draft
             │
             ▼
        Human Review

---

LangGraph State

A shared LangGraph state can be used to pass information between the Supervisor and specialized agents.

Example conceptual state:

class TravelState:
    user_request: str
    destination: str
    dates: dict
    preferences: dict

    weather_data: dict
    activities: list
    budget_data: dict
    logistics_data: dict

    draft_itinerary: dict
    human_feedback: str
    approved: bool

The Supervisor uses this shared state to coordinate the agents.

---

LangGraph Node Design

The graph can be structured conceptually as:

START
  │
  ▼
Input Guardrails
  │
  ▼
Supervisor
  │
  ├──► Planner Agent
  │
  ├──► Weather Agent ──► Weather MCP
  │
  ├──► Activities Agent ──► Activities MCP
  │
  └──► Budget Agent ──► Logistics MCP
  │
  ▼
Synthesize Itinerary
  │
  ▼
Human Approval
  │
  ├── Approved ─────────► Final Plan
  │
  └── Revision ─────────► Supervisor

Depending on the implementation, the specialized agents can execute sequentially or in parallel when their tasks are independent.

For example, Weather, Activities, and Budget research can often run concurrently after the Planner/Supervisor has extracted the basic trip requirements.

---

Human-in-the-Loop

MCP tools provide external information, but the system should not automatically treat that information as final truth.

The generated itinerary should pass through a Human-in-the-Loop checkpoint.

Agent Results
     │
     ▼
Draft Itinerary
     │
     ▼
Human Review
     │
 ┌───┴────┐
 │        │
Approve   Revise
 │        │
 ▼        ▼
Final    Supervisor
Plan       │
           ▼
        Agents

The human can:

* Approve the itinerary.
* Request changes.
* Reject recommendations.
* Adjust budget.
* Change destinations.
* Change activities.
* Ask for different transportation options.

This makes the workflow safer and easier to review.

---

MCP Safety Considerations

Because MCP servers can expose external tools, each MCP integration should be treated as an explicit capability boundary.

Recommended safeguards include:

* Validate all tool inputs.
* Validate MCP tool outputs before passing them to other agents.
* Restrict tools to the minimum required permissions.
* Apply timeouts to external calls.
* Handle MCP connection failures gracefully.
* Never expose API keys to agents or users.
* Log tool calls for debugging and auditing.
* Distinguish trusted application state from external tool output.
* Require human approval before consequential actions.
* Avoid allowing recommendation agents to directly perform bookings or purchases.

For example:

Agent
  │
  ▼
Input Validation
  │
  ▼
MCP Tool
  │
  ▼
Output Validation
  │
  ▼
Supervisor

For future booking capabilities, the architecture should introduce a separate approval boundary:

Recommendation
     │
     ▼
Human Approval
     │
     ▼
Booking Tool

The system should not automatically convert an AI recommendation into a real-world purchase or reservation.

---

Project Structure

A four-agent MCP implementation can evolve into:

.
├── app.py
├── backend.py
├── mcp_client.py
│
├── agents/
│   ├── planner_agent.py
│   ├── weather_agent.py
│   ├── activities_agent.py
│   └── budget_agent.py
│
├── mcp_servers/
│   ├── weather_mcp_server.py
│   ├── activities_mcp_server.py
│   └── logistics_mcp_server.py
│
├── graph/
│   ├── state.py
│   └── workflow.py
│
├── templates/
├── static/
├── requirements.txt
├── README.md
└── LICENSE

The existing single "custom_weather_mcp_server.py" can remain as the initial MCP example, while the Activities and Logistics servers can be added incrementally.

---

Running the MCP Servers

Each MCP server can run independently.

Example:

python mcp_servers/weather_mcp_server.py

python mcp_servers/activities_mcp_server.py

python mcp_servers/logistics_mcp_server.py

The FastAPI/LangGraph application then communicates with the required MCP servers through "mcp_client.py".

For local development, each MCP server can run as a separate process.

---

Example End-to-End Scenario

User request:

Plan a 7-day trip to Japan for two people with a
budget of ₹2,00,000. We enjoy culture, food and
outdoor activities.

Step 1 — Guardrails

The system validates:

Destination: Japan
Duration: 7 days
Travelers: 2
Budget: ₹2,00,000
Preferences:
  - Culture
  - Food
  - Outdoor activities

Step 2 — Supervisor

The Supervisor determines that four agents are required.

Supervisor
   │
   ├── Planner Agent
   ├── Weather Agent
   ├── Activities Agent
   └── Budget Agent

Step 3 — Weather Agent

The Weather Agent requests forecast information through the Weather MCP server.

Weather Agent
      │
      ▼
Weather MCP
      │
      ▼
Forecast Service

The agent determines which days are more suitable for outdoor activities.

Step 4 — Activities Agent

The Activities Agent queries the Activities MCP server.

Activities Agent
      │
      ▼
Activities MCP
      │
      ▼
Places / Attractions Service

It returns suitable cultural attractions, food experiences, and outdoor activities.

Step 5 — Budget Agent

The Budget Agent queries the Logistics MCP server.

Budget Agent
      │
      ▼
Logistics MCP
      │
      ├── Currency
      ├── Transport
      └── Cost estimation

It determines whether the proposed activities and transportation fit the user's budget.

Step 6 — Planner Agent

The Planner Agent combines the available information into an itinerary.

Weather
   +
Activities
   +
Budget
   +
User Preferences
   │
   ▼
Planner Agent
   │
   ▼
Draft Itinerary

Step 7 — Human Approval

The draft is displayed to the user.

Draft Itinerary
      │
      ▼
   User Review
      │
 ┌────┴─────┐
 │          │
Approve    Revise
 │          │
 ▼          ▼
Final     Supervisor
Plan

---

API Reference

Create or Resume a Planning Session

POST "/api/travel"

Creates a new planning thread or resumes an existing one.

Request

{
  "message": "Plan a 7-day trip to Japan for two people with a budget of ₹2,00,000",
  "thread_id": "optional-thread-id"
}

The Supervisor Agent determines which specialized agents and MCP tools are required.

---

Approve or Revise a Draft

POST "/api/travel/approve"

Approve a generated itinerary or request revisions.

Request

{
  "thread_id": "thread-id",
  "approved": true,
  "feedback": "The itinerary looks good."
}

If "approved" is "false", the feedback is returned to the Supervisor Agent and the relevant specialized agents are invoked again.

---

Configuration

Secrets and API keys are not included in the repository.

Configure credentials using environment variables or a ".env" file.

Example:

OPENAI_API_KEY=your_api_key
LANGSMITH_API_KEY=your_api_key
WEATHER_API_KEY=your_api_key
ACTIVITIES_API_KEY=your_api_key
CURRENCY_API_KEY=your_api_key

Each MCP server should only receive the credentials required for its own tools.

---

Future MCP Extensions

The architecture can be extended with additional MCP servers without changing the core Supervisor workflow.

Potential additions include:

Flight MCP Server
Hotel MCP Server
Restaurant MCP Server
Maps MCP Server
Calendar MCP Server
Visa / Travel Requirements MCP Server
Currency MCP Server
Transportation MCP Server

For example:

                    Supervisor
                        │
       ┌────────────────┼─────────────────┐
       │                │                 │
       ▼                ▼                 ▼
   Weather          Activities        Budget
     Agent             Agent            Agent
       │                │                 │
       ▼                ▼                 ▼
 Weather MCP      Activities MCP    Logistics MCP
       │                │                 │
       └────────────────┼─────────────────┘
                        │
                        ▼
                  Planner Agent
                        │
                        ▼
                 Draft Itinerary
                        │
                        ▼
                  Human Approval

The important architectural principle is that agents decide what information they need, while MCP servers provide controlled access to external capabilities.

---

Design Principle

TripMate separates responsibilities into three layers:

┌──────────────────────────────────────┐
│           AI Reasoning Layer         │
│                                      │
│ Supervisor + 4 Specialized Agents    │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│             MCP Layer                │
│                                      │
│ MCP Clients + MCP Servers            │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│          External Services           │
│                                      │
│ Weather / Places / Currency / Maps   │
└──────────────────────────────────────┘

This separation makes the system easier to test, review, extend, and secure.

The Supervisor controls orchestration, the four specialized agents perform domain reasoning, and MCP provides standardized access to external tools. Finally, the Human-in-the-Loop checkpoint controls the transition from an AI-generated draft to an approved travel plan.