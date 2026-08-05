from google import genai
from config import Config

# Create Gemini client
client = genai.Client(api_key=Config.GEMINI_API_KEY)


def load_system_prompt():
    """Read the system prompt from the text file."""
    try:
        with open("prompts/system_prompt.txt", "r", encoding="utf-8") as file:
            return file.read()
    except FileNotFoundError:
        return "You are a secure AI assistant."


def generate_response(user_message):
    """
    Send the system prompt and user message to Gemini.
    """
    try:
        system_prompt = load_system_prompt()

        full_prompt = f"""
{system_prompt}

User:
{user_message}
"""

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=full_prompt
        )

        return response.text

    except Exception as e:
        return f"Error: {str(e)}"