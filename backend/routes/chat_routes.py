from flask import Blueprint, request, jsonify

from services.gemini_service import generate_response
from security.input_filter import check_input
from security.guardrails import check_guardrails

chat_bp = Blueprint("chat", __name__)


@chat_bp.route("/chat", methods=["POST"])
def chat():

    try:

        data = request.get_json()

        if not data or "message" not in data:
            return jsonify({
                "success": False,
                "error": "Message is required."
            }), 400

        user_message = data["message"]

        # -------------------------
        # Security Layer 1
        # Input Filter
        # -------------------------

        if not check_input(user_message):
            return jsonify({
                "success": False,
                "error": "⚠️ Blocked by Input Filter."
            }), 403

        # -------------------------
        # Security Layer 2
        # Guardrails
        # -------------------------

        is_safe, reason = check_guardrails(user_message)

        if not is_safe:
            return jsonify({
                "success": False,
                "error": f"⚠️ Blocked by Guardrails ({reason})."
            }), 403

        # -------------------------
        # Gemini
        # -------------------------

        response = generate_response(user_message)

        return jsonify({
            "success": True,
            "response": response
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500