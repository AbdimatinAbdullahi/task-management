from flask_mail import Message, Mail
from flask import current_app

def send_verification_email(recipient, code):
    from app import mail
    subject = 'Verification Code'
    recipient = recipient
    sender = 'abdimatinhassan@gmail.com'

    msg = Message(
        subject=subject,
        recipients=[recipient],
        body=f"Your verification code: {code}. Will expire in 10 minutes",
        sender=sender
    )

    try:
        mail.send(msg)
    except Exception as e:
        current_app.logger.error(f"Failed to send verification email: {e}")
    
    return True, "Email sent successfully"