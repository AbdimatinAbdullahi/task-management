from confluent_kafka import Consumer, KafkaException
from models import Project, WorkSpaceMember
from flask import current_app
from flask_mail import Message
import json
import time
from app import app

conf = {
    "bootstrap.servers": "localhost:9092",
    "group.id": "task-status-consumer-group",
    "auto.offset.reset": "earliest"
}

consumer = Consumer(conf)
consumer.subscribe(["task-status-updated-to-done"])

def handle_task_done_event(msg):
    try:
        key = msg.key().decode("utf-8") if msg.key() else None
        value_raw = msg.value().decode("utf-8")
        value = json.loads(value_raw)
        # print(f"Task Done event received:\nID: Key (Task Id): {key}\nTask Details:\n{json.dumps(value, indent=2)}")
        assigned_users = value.get("assigned_users", [])
        if assigned_users:
            project_id = value.get("project_id")
            print("Project_id:", project_id)
            
            # Wrap the database query in the app context
            with app.app_context():  # Ensure the app context is active
                project = Project.query.filter_by(id=project_id).first()
                if project:
                    print("Project name: ", project.name)
            users_to_send_email = []
            print("Assigned_users")
            for user_id in assigned_users:
                users_to_send_email.append(user_id)
            if len(users_to_send_email) > 0:
                task_name = value.get("task_name")
                sendEmail(projectname=project.name, recipients=users_to_send_email, taskname=task_name, status=value.get("status"))
        
    except Exception as e:
        print(f"Failed to process message: {str(e)}")


def sendEmail(projectname, taskname, status, recipients=[]):
    from app import mail
    emails = []
    with app.app_context():
        try:
            rec = WorkSpaceMember.query.filter(WorkSpaceMember.id.in_(recipients)).all()
            for member in rec:
                emails.append(member.email)
                print("Project Name: \n", projectname)
                print("Recipients: \n", emails)

                # Prepare the email content (professional HTML)
                subject = f"{taskname} updated to status: {status} for Project: {projectname}"
                sender = "your_email@example.com"  # Your sender email address
                body = f"""
                <html>
                    <head>
                        <style>
                            body {{
                                font-family: Arial, sans-serif;
                                color: #333;
                                line-height: 1.6;
                            }}
                            .container {{
                                width: 100%;
                                max-width: 600px;
                                margin: 0 auto;
                                padding: 20px;
                                background-color: #f9f9f9;
                                border: 1px solid #ddd;
                                border-radius: 8px;
                            }}
                            .header {{
                                background-color: #c849c3;
                                color: white;
                                text-align: center;
                                padding: 20px;
                                border-radius: 8px 8px 0 0;
                            }}
                            .header h1 {{
                                margin: 0;
                                font-size: 24px;
                            }}
                            .content {{
                                padding: 20px;
                                background-color: white;
                                border-radius: 0 0 8px 8px;
                            }}
                            .content p {{
                                font-size: 16px;
                            }}
                            .footer {{
                                text-align: center;
                                padding: 10px;
                                font-size: 14px;
                                background-color: #f1f1f1;
                                border-top: 1px solid #ddd;
                            }}
                            .footer p {{
                                margin: 0;
                                color: #777;
                            }}
                            .btn {{
                                display: inline-block;
                                background-color: #0044cc;
                                color: white;
                                padding: 10px 20px;
                                text-decoration: none;
                                border-radius: 5px;
                                font-size: 16px;
                                margin-top: 20px;
                            }}
                            .btn:hover {{
                                background-color: #0033aa;
                            }}
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1>Project Status Update</h1>
                            </div>
                            <div class="content">
                                <p>Dear <strong>Team Member,</strong></p>
                                <p>The status of a task in <strong>{projectname}</strong> has been updated.</p>
                                <p><strong>Task:</strong> {taskname}</p>
                                <p><strong>Status:</strong> {status}</p>
                                <p>Please check the project dashboard for further details.</p>
                            </div>
                            <div class="footer">
                                <p>Best regards, <br /> Your Team</p>
                            </div>
                        </div>
                    </body>
                </html>
                """
                
                # Send email to all recipients
                with app.app_context():
                    msg = Message(subject=subject,
                                  sender=sender,
                                  recipients=emails)
                    msg.html = body
                    mail.send(msg)
        
            print(f"Email sent to: {emails}")
        except Exception as e:
            print("Error while getting emails of users: ____ \n", str(e))



def kafka_consumer():
    print("🔄 Kafka Consumer started...")
    try:
        while True:
            msg = consumer.poll(1.0)
            if msg is None:
                continue
            if msg.error():
                raise KafkaException(msg.error())

            handle_task_done_event(msg)
    except KeyboardInterrupt:
        print("🛑 Consumer stopped!")
    finally:
        consumer.close()

if __name__ == '__main__':
    kafka_consumer()
