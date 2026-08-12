from database.db import db


# ==========================================
# USER MODEL
# ==========================================

class User(db.Model):

    __tablename__ = "users"
    __table_args__ = {"schema": "public"}

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    username = db.Column(
        db.String(100),
        nullable=False
    )

    email = db.Column(
        db.String(120),
        unique=True,
        nullable=False
    )

    password = db.Column(
        db.String(255),
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )

    # Relationship with conversations
    conversations = db.relationship(
        "Conversation",
        backref="user",
        lazy=True,
        cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<User {self.email}>"


# ==========================================
# CONVERSATION MODEL
# ==========================================

class Conversation(db.Model):

    __tablename__ = "conversations"
    __table_args__ = {"schema": "public"}

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    # User who owns this conversation
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("public.users.id"),
        nullable=False
    )

    # User's question
    user_message = db.Column(
        db.Text,
        nullable=False
    )

    # AI's response
    ai_response = db.Column(
        db.Text,
        nullable=False
    )

    # When conversation was created
    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )

    # Saved Chat
    is_saved = db.Column(
        db.Boolean,
        default=False,
        nullable=False
    )

    # Favorite Chat
    is_favorite = db.Column(
        db.Boolean,
        default=False,
        nullable=False
    )

    def __repr__(self):
        return f"<Conversation {self.id}>"