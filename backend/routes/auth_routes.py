from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt

from database.db import db
from database.models import User

auth_bp = Blueprint("auth", __name__)

bcrypt = Bcrypt()


# ==========================================
# SIGNUP
# ==========================================

@auth_bp.route("/signup", methods=["POST"])
def signup():

    try:

        data = request.get_json()

        username = data.get("username", "").strip()
        email = data.get("email", "").strip().lower()
        password = data.get("password", "").strip()

        if not username or not email or not password:

            return jsonify({
                "success": False,
                "message": "All fields are required."
            }), 400

        existing_user = User.query.filter_by(email=email).first()

        if existing_user:

            return jsonify({
                "success": False,
                "message": "Email already exists."
            }), 409

        hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

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


# ==========================================
# LOGIN
# ==========================================

@auth_bp.route("/login", methods=["POST"])
def login():

    try:

        data = request.get_json()

        email = data.get("email", "").strip().lower()
        password = data.get("password", "").strip()

        if not email or not password:

            return jsonify({
                "success": False,
                "message": "Email and Password are required."
            }), 400

        user = User.query.filter_by(email=email).first()

        if user is None:

            return jsonify({
                "success": False,
                "message": "Invalid Email or Password."
            }), 401

        if not bcrypt.check_password_hash(user.password, password):

            return jsonify({
                "success": False,
                "message": "Invalid Email or Password."
            }), 401

        return jsonify({

            "success": True,

            "message": "Login Successful",

            "user": {

                "id": user.id,
                "username": user.username,
                "email": user.email

            }

        })

    except Exception as e:

        return jsonify({

            "success": False,

            "message": str(e)

        }), 500