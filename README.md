# ✈️ TripMate - Multi-Agent Travel Planning Assistant

A demonstration project showcasing how to build a **safe, reviewable, and production-inspired multi-agent AI system** using **LangGraph**, **Model Context Protocol (MCP)**, **FastAPI**, and **Human-in-the-Loop (HITL)** workflows.

TripMate illustrates how multiple AI agents can collaborate under the supervision of a central coordinator while enforcing input validation and requiring human approval before delivering final travel plans.

---

# Table of Contents

* [Overview](#overview)
* [Architecture](#architecture)
* [Key Features](#key-features)
* [Project Structure](#project-structure)
* [Technology Stack](#technology-stack)
* [Prerequisites](#prerequisites)
* [Installation](#installation)
* [Running the Application](#running-the-application)
* [Running the MCP Server](#running-the-mcp-server)
* [API Reference](#api-reference)
* [Configuration](#configuration)
* [How It Works](#how-it-works)
* [Development Notes](#development-notes)
* [Future Improvements](#future-improvements)
* [Contributing](#contributing)
* [License](#license)

---

# Overview

TripMate demonstrates a modern **multi-agent orchestration pattern** where specialized AI agents collaborate to generate personalized travel itineraries.

Instead of relying on a single LLM, the application introduces:

* A **Supervisor Agent** responsible for orchestrating workflow execution
* **Input Guardrails** that validate and sanitize incoming requests
* **Human-in-the-Loop (HITL)** approval before finalizing travel plans
* **MCP-powered external tools** for domain-specific capabilities (weather, adapters, etc.)

The project is intended as a reference implementation for developers learning LangGraph, MCP, and agent orchestration patterns.

---

# Architecture

```text
                User
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
      ┌───────────┼───────────┐
      │           │           │
      ▼           ▼           ▼
 Planner      Weather MCP   Other Tools
  Agent         Server
      │
      ▼
 Draft Travel Plan
      │
      ▼
 Human Approval (HITL)
      │
      ▼
 Final Approved Plan
```

---

# Key Features

## Multi-Agent Coordination

* Built using **LangGraph**
* Supervisor-managed workflow
* Extensible agent architecture
* Modular tool integration

## Supervisor Agent

* Controls execution flow
* Delegates tasks to specialized agents
* Coordinates planning pipeline

## Input Guardrails

* Validate user requests
* Prevent invalid inputs
* Improve reliability and safety

## Human-in-the-Loop (HITL)

* Review generated itineraries
* Approve or request revisions
* Keeps humans in control before final output

## MCP Integration

* Demonstrates communication with external tools
* Example Weather MCP server included
* Easily extensible for additional services

## Interactive Web UI

* Built with FastAPI
* Simple browser interface
* Thread-based conversation support

---

# Project Structure

```text
.
├── app.py
├── backend.py
├── mcp_client.py
├── custom_weather_mcp_server.py
├── templates/
├── static/
├── requirements.txt
├── README.md
└── LICENSE
```

### File Description

| File                           | Purpose                                                |
| ------------------------------ | ------------------------------------------------------ |
| `app.py`                       | FastAPI application and REST endpoints                 |
| `backend.py`                   | Core LangGraph orchestration and travel planning logic |
| `mcp_client.py`                | Client helpers for communicating with MCP servers      |
| `custom_weather_mcp_server.py` | Example Weather MCP server                             |
| `templates/`                   | HTML templates                                         |
| `static/`                      | JavaScript, CSS, and frontend assets                   |

---

# Technology Stack

* Python 3.10+
* FastAPI
* LangGraph
* LangChain
* MCP (Model Context Protocol)
* Jinja2 Templates
* HTML/CSS/JavaScript

---

# Prerequisites

Before running the project, ensure you have:

* Python 3.10 or newer
* Git
* pip
* Virtual Environment (`venv` recommended)

---

# Installation

## 1. Clone the Repository

```bash
git clone <repository-url>

cd <repository-name>
```

## 2. Create a Virtual Environment

### Windows

```bash
python -m venv .venv

.venv\Scripts\Activate.ps1
```

### macOS/Linux

```bash
python3 -m venv .venv

source .venv/bin/activate
```

## 3. Install Dependencies

```bash
pip install -r requirements.txt
```

---

# Running the Application

## Option 1

```bash
python app.py
```

## Option 2 (Recommended)

```bash
uvicorn app:app --reload --host 127.0.0.1 --port 8000
```

Open your browser:

```text
http://127.0.0.1:8000
```

---

# Running the MCP Server

The project includes an example MCP server that provides weather-related functionality.

Start it in a separate terminal:

```bash
python custom_weather_mcp_server.py
```

The backend can then communicate with this server through the MCP client.

---

# API Reference

## Create or Resume a Planning Session

### POST `/api/travel`

Creates a new planning thread or resumes an existing one.

### Request

```json
{
  "message": "Plan a 5-day trip to Japan",
  "thread_id": "optional-thread-id"
}
```

---

## Approve or Revise a Draft

### POST `/api/travel/approve`

Approve a generated itinerary or request revisions.

### Request

```json
{
  "thread_id": "thread-id",
  "approved": true,
  "feedback": "optional comments"
}
```

---

## Health Check

### GET `/health`

Returns application status and enabled features.

---

# Configuration

Secrets and API keys are **not included** in the repository.

Configure credentials using environment variables or a `.env` file.

Example:

```text
OPENAI_API_KEY=your_api_key
LANGSMITH_API_KEY=your_api_key
```

Add any additional credentials required by LangGraph, LangChain, or external MCP tools.

---

# How It Works

1. User submits a travel request.
2. Input Guardrails validate the request.
3. Supervisor Agent analyzes the task.
4. Specialized agents perform planning.
5. MCP tools are invoked when external information is needed.
6. A draft itinerary is generated.
7. Human reviews the plan.
8. User approves or requests revisions.
9. Final itinerary is returned.

---

# Development Notes

* FastAPI serves the frontend and REST API.
* `backend.py` contains synchronous helper wrappers while internally interacting with asynchronous MCP utilities.
* `nest_asyncio` is applied to simplify interoperability between synchronous and asynchronous execution.
* The architecture is intentionally modular to make adding new agents and MCP tools straightforward.

---

# Future Improvements

Potential enhancements include:

* Flight booking integration
* Hotel recommendation agents
* Restaurant recommendation tools
* Budget optimization agent
* Calendar integration
* Maps integration
* Real-time weather APIs
* Authentication and user profiles
* Persistent conversation history
* Docker deployment
* CI/CD pipeline
* Automated test suite

---

# Contributing

Contributions are welcome.

If you would like to improve the project:

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Open a Pull Request.

Bug reports, documentation improvements, and new MCP adapter examples are always appreciated.

---

# License

This project is distributed under the terms specified in the `LICENSE` file.

---

# Acknowledgements

This project demonstrates practical patterns for building AI applications using:

* LangGraph
* Model Context Protocol (MCP)
* FastAPI
* Human-in-the-Loop workflows
* Multi-Agent orchestration

---

## Contact

If you have questions, suggestions, or encounter any issues, please open an issue in the repository.
