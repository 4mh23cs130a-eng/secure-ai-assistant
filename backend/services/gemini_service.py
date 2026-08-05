from google import genai
from config import Config

# Create Gemini client
client = genai.Client(api_key=Config.GEMINI_API_KEY)


def generate_response(user_message):
    """
    Sends the user's message to Gemini and returns the response.
    """
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=user_message
        )

        return response.text

    except Exception as e:
        return f"Error: {str(e)}"