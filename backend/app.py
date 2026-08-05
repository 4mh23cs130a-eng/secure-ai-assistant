from flask import Flask
from flask_cors import CORS

from config import Config
from database.db import db

# Import models so SQLAlchemy knows about them
from database.models import User

# Import routes
from routes.chat_routes import chat_bp

app = Flask(__name__)

# Load configuration
app.config.from_object(Config)

# Enable CORS
CORS(app)

# Initialize database
db.init_app(app)

# Register routes
app.register_blueprint(chat_bp)


@app.route("/")
def home():
    return "✅ Secure AI Assistant Backend Running"

if __name__ == "__main__":
    print("Step 1: Starting app...")

    with app.app_context():
        print("Step 2: Creating tables...")
        db.create_all()
        print("Step 3: Tables created successfully!")

    print("Step 4: Starting Flask server...")

    app.run(
    host="127.0.0.1",
    port=5000,
    debug=True,
    use_reloader=False
)