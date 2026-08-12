from flask import Blueprint, request, jsonify

from services.gemini_service import generate_response
from security.input_filter import check_input
from security.guardrails import check_guardrails
from security.logger import log_request

from database.db import db
from database.models import Conversation


chat_bp = Blueprint("chat", __name__)


@chat_bp.route("/chat", methods=["POST"])
def chat():

    try:

        # ==========================================
        # GET USER MESSAGE
        # ==========================================

        data = request.get_json()

        if not data or "message" not in data:

            return jsonify({
                "success": False,
                "error": "Please enter a message."
            }), 400

        user_message = data["message"].strip()

        if not user_message:

            return jsonify({
                "success": False,
                "error": "Please enter a message."
            }), 400

        client_ip = request.remote_addr


        # ==========================================
        # INPUT FILTER
        # ==========================================

        if not check_input(user_message):

            log_request(
                client_ip,
                user_message,
                "Blocked - Input Filter"
            )

            return jsonify({
                "success": False,
                "error": "Your message could not be processed."
            }), 403


        # ==========================================
        # GUARDRAILS
        # ==========================================

        safe, reason = check_guardrails(user_message)

        if not safe:

            log_request(
                client_ip,
                user_message,
                f"Blocked - {reason}"
            )

            return jsonify({
                "success": False,
                "error": "Your message could not be processed."
            }), 403


        # ==========================================
        # GENERATE AI RESPONSE
        # ==========================================

        ai_response = generate_response(user_message)


        # ==========================================
        # SAVE CONVERSATION
        # ==========================================

        try:

            conversation = Conversation(
                user_id=None,
                user_message=user_message,
                ai_response=ai_response,
                is_saved=False,
                is_favorite=False
            )

            db.session.add(conversation)
            db.session.commit()

            conversation_id = conversation.id

        except Exception as db_error:

            # Do not allow database failure
            # to destroy the AI response.

            db.session.rollback()

            print("Conversation save error:", db_error)

            conversation_id = None


        # ==========================================
        # LOG REQUEST
        # ==========================================

        log_request(
            client_ip,
            user_message,
            "Allowed"
        )


        # ==========================================
        # RETURN CLEAN AI RESPONSE
        # ==========================================

        return jsonify({

            "success": True,

            "response": ai_response,

            "conversation_id": conversation_id

        })


    except Exception as e:

        print("Chat error:", e)

        return jsonify({

            "success": False,

            "error": "Sorry, something went wrong. Please try again."

        }), 500