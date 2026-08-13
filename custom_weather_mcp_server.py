from mcp.server.fastmcp import FastMCP
import requests
import os 
from dotenv import load_dotenv

load_dotenv()

mcp = FastMCP("Weather MCP Server")


OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")

