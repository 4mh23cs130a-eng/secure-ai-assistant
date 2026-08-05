from flask import Flask
from flask_cors import CORS

from routes.chat_routes import chat_bp

app = Flask(__name__)

# Enable CORS so the frontend can call the backend
CORS(app)

# Register API routes
app.register_blueprint(chat_bp)


@app.route("/")
def home():
    return "✅ Secure AI Assistant Backend is Running!"


if __name__ == "__main__":
    app.run(debug=True)