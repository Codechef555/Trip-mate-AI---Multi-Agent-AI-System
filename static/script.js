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

}