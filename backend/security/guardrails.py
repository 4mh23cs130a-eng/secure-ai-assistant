"""
Guardrails Module
Checks for prompt injection and other malicious inputs.
"""

# Attack categories
PROMPT_INJECTION = [
    "ignore previous instructions",
    "forget your instructions",
    "forget your rules",
    "override",
    "ignore all previous",
]

SYSTEM_DISCLOSURE = [
    "system prompt",
    "developer prompt",
    "developer message",
    "hidden instructions",
    "internal instructions",
]

ROLE_OVERRIDE = [
    "act as",
    "pretend to be",
    "you are now",
    "become",
]

SECRET_EXTRACTION = [
    "api key",
    "password",
    "token",
    "secret",
    "credentials",
]


def check_guardrails(user_message):
    """
    Returns:
        (True, None)  -> Safe input
        (False, reason) -> Unsafe input
    """

    message = user_message.lower()

    categories = {
        "Prompt Injection": PROMPT_INJECTION,
        "System Prompt Disclosure": SYSTEM_DISCLOSURE,
        "Role Override": ROLE_OVERRIDE,
        "Secret Extraction": SECRET_EXTRACTION,
    }

    for category, phrases in categories.items():
        for phrase in phrases:
            if phrase in message:
                return False, category

    return True, None