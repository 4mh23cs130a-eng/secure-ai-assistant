from flask import Blueprint, request, jsonify
from services.gemini_service import generate_response
from security.input_filter import check_input

chat_bp = Blueprint("chat", __name__)


@chat_bp.route("/chat", methods=["POST"])
def chat():
    try:
        # Get JSON data from frontend
        data = request.get_json()

        # Check if request contains a message
        if not data or "message" not in data:
            return jsonify({
                "success": False,
                "error": "Message is required."
            }), 400

        # Extract user message
        user_message = data["message"]

        # Input Filtering (Security Layer 1)
        if not check_input(user_message):
            return jsonify({
                "success": False,
                "error": "⚠️ Request blocked by security policy."
            }), 403

        # Generate AI response
        ai_response = generate_response(user_message)

        return jsonify({
            "success": True,
            "response": ai_response
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500