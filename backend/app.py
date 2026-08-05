from flask import Flask
from flask_cors import CORS
from flask_bcrypt import Bcrypt

from config import Config
from database.db import db

# Import models so SQLAlchemy creates the tables
from database.models import User

# Import routes
from routes.chat_routes import chat_bp
from routes.auth_routes import auth_bp

app = Flask(__name__)

# Load configuration
app.config.from_object(Config)

# Enable CORS
CORS(app)

# Initialize Extensions
db.init_app(app)

bcrypt = Bcrypt(app)

# Register Blueprints
app.register_blueprint(chat_bp)
app.register_blueprint(auth_bp)


@app.route("/")
def home():
    return "✅ Secure AI Assistant Backend Running"


if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )