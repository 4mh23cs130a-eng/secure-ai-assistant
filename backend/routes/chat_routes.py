from flask import Blueprint, request, jsonify
from services.gemini_service import generate_response

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