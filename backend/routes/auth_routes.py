from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt

from database.db import db
from database.models import User

auth_bp = Blueprint("auth", __name__)

from flask_bcrypt import generate_password_hash


@auth_bp.route("/signup", methods=["POST"])
def signup():

    try:
        data = request.get_json()

        username = data.get("username", "").strip()
        email = data.get("email", "").strip().lower()
        password = data.get("password", "").strip()

        # Validation
        if not username or not email or not password:
            return jsonify({
                "success": False,
                "message": "All fields are required."
            }), 400

        # Check if email already exists
        existing_user = User.query.filter_by(email=email).first()

        if existing_user:
            return jsonify({
                "success": False,
                "message": "Email already exists."
            }), 409

        # Hash password
        hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

        # Create new user
        new_user = User(
            username=username,
            email=email,
            password=hashed_password
        )

        db.session.add(new_user)
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Account created successfully."
        }), 201

    except Exception as e:

        db.session.rollback()

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500