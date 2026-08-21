let currentThreadId = localStorage.getItem("travel_thread_id") || null;
let latestAnswerMarkdown = "";
let waitingForApproval = false;

const AGENT_LABELS = {
    flight_agent: "✈️ Flight Agent",
    hotel_agent: "🏨 Hotel Agent",
    weather_agent: "🌦️ Weather Agent",
    budget_agent: "💰 Budget Agent",
    itinerary_agent: "🗓️ Itinerary Agent"
};

function setPrompt(text) {
    document.getElementById("userInput").value = text;
}

function setLoading(isLoading, mode = "draft") {
    const sendBtn = document.getElementById("sendBtn");
    const btnText = document.getElementById("btnText");
    const btnLoader = document.getElementById("btnLoader");
    const approveBtn = document.getElementById("approveBtn");
    const reviseBtn = document.getElementById("reviseBtn");

    sendBtn.disabled = isLoading;
    approveBtn.disabled = isLoading;
    reviseBtn.disabled = isLoading;

    if (isLoading && mode === "draft") {
        btnText.classList.add("hidden");
        btnLoader.classList.remove("hidden");
    } else {
        btnText.classList.remove("hidden");
        btnLoader.classList.add("hidden");
    }
}

function hideerror() {
    const errorBox = document.getElementById("errorBox");
    errorBox.classList.add("hidden");
    errorBox.textContent = "";
}

function renderMarkdown(element, markdown) {
    if (typeof marked != "undefinded") {
        element.innerHTML = marked.parse(markdown || "");
    } else {
        element.innerText = markdown || "";
    }
}

function showWorkflow(data) {
    const section = document.getElementById("workflowSection");
    const reasoning = document.getElementById("supervisorReasoning");
    const chips = document.getElementById("agentChips");
    const guardrailBadge = document.getElementById("guardrailBadge");

    reasoning.textContent = data.supervisior_reasoning || "supervisor routing completed.";
    chips.innerHTML = "";

    (data.selected_agents || []).forEach((agent) => {
        const chip = document.createElement("span");
        chip.className = "agent-chip";
        chip.textContent = AGENT_LABELS[agent] || agent;
        chips.appendChild(chip);
    });

    if (data.guardrail_allowed === false) {
        guardrailBadge.textContent = "Guardrail blocked";
        guardrailBadge.classList.add("blocked");
    } else {
        guardrailBadge.textContent = "Guardrail passed";
        guardrailBadge.classList.remove("blocked");
    }

    section.classList.remove("hidden");
}

function showResult(answer, threadId, isDraft = false) {
    latestAnswerMarkdown = answer || "";

    const resultSection = document.getElementById("resultSection");
    const resultBox = document.getElementById("resultBox");
    const threadInfo = document.getElementById("threadInfo");
    const resultTitle = document.getElementById("resultTitle");

    renderMarkdown(resultBox, latestAnswerMarkdown);
    threadInfo.textContent = `Thread ID: ${threadId}`;
    resultTitle.textContent = isDraft ? "Draft Travel Plan" : "Your Final AI Travel Plan";
    resultSection.classList.remove("hidden");

    resultSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function showApproval(data) {
    waitingForApproval = true;
    const section = document.getElementById("approvalSection");
    const approvalRequest = document.getElementById("approvalRequest");
    approvalRequest.textContent = data.approval_request ||
        "Approve the draft or provide feedback before the final plan is generated.";
    section.classList.remove("hidden");
}