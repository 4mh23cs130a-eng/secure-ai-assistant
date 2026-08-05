import logging
import os

# Create logs directory if it doesn't exist
os.makedirs("logs", exist_ok=True)

logging.basicConfig(
    filename="logs/chatbot.log",
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s"
)


def log_request(ip, message, status):
    """
    Log every request.

    Parameters:
        ip (str): Client IP address
        message (str): User message
        status (str): Allowed / Blocked
    """
    logging.info(
        f"IP={ip} | STATUS={status} | MESSAGE={message}"
    )