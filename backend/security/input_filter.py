# List of blocked phrases
BLOCKED_PHRASES = [
    "ignore previous instruction",
    "ignore previous instructions",
    "forget your instruction",
    "forget your instructions",
    "forget your rule",
    "forget your rules",
    "system prompt",
    "developer prompt",
    "developer message",
    "hidden instructions",
    "api key",
    "password",
    "token",
    "secret",
    "act as",
    "pretend to be",
    "jailbreak",
    "bypass",
    "disable safety",
    "ignore safety"
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