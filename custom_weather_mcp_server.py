from mcp.server.fastmcp import FastMCP
import requests
import os 
from dotenv import load_dotenv

load_dotenv()

mcp = FastMCP("Weather MCP Server")


OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")

def get_current_weather(city: str):

    response = requests.get(
        "https://api.openweathermap.org/data/2.5/weather",
        params={
            "q": city,
            "appid": OPENWEATHER_API_KEY,
            "units": "metric"
        }
    )

    data = response.json()

    if response.status_code != 200:
        return data

    return {
        "city": data["name"],
        "temperature_c": data["main"]["temp"],
        "feels_like_c": data["main"]["feels_like"],
        "humidity": data["main"]["humidity"],
        "condition": data["weather"][0]["description"],
        "wind_speed": data["wind"]["speed"]
    }