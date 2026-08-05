# List of blocked phrases
BLOCKED_PHRASES = [
    "ignore previous instructions",
    "forget your instructions",
    "forget your rules",
    "system prompt",
    "reveal your prompt",
    "developer message",
    "developer instructions",
    "api key",
    "token",
    "jailbreak",
    "bypass",
    "act as",
    "disable safety",
    "ignore safety",
]


def check_input(user_message):
    """
    Returns False if the input contains a blocked phrase.
    Otherwise returns True.
    """
    message = user_message.lower()

    for phrase in BLOCKED_PHRASES:
        if phrase in message:
            return False

    return True