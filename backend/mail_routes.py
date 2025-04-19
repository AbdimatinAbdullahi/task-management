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


def sendInvitationEmail(email, code, projectName, user_id):
    from app import mail
    subject = f'Invitation to Workspace: {projectName}'
    recipient = email
    sender = "abdimatinhassan@gmail.com"

    link = f"http://127.0.0.1:5000/accept_invitation?user_id={user_id}&code={code}"
    body = f"Click this link to accept the invitation: {link}"

    msg = Message(
        subject=subject,
        recipients=[recipient],
        body=body,
        sender=sender
    )
    try:
        mail.send(msg)
        print("Email Sent successfully ✅")
    except Exception as e:
        current_app.logger.error(f"Failed to send invitation email: {e}")
        return False, f"Error sending email: {e}"

    return True, "Invitation email sent successfully"