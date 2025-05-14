from confluent_kafka import Consumer, KafkaException
from models import Project, WorkSpaceMember
import json
import time
from app import app  # Import your Flask app here

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
                sendEmail(projectname=project.name, recipients=users_to_send_email)
        
    except Exception as e:
        print(f"Failed to process message: {str(e)}")




def sendEmail(projectname, recipients=[]):
    emails = []
    with app.app_context():
        try:
            rec = WorkSpaceMember.query.filter(WorkSpaceMember.id.in_(recipients)).all()
            for member in rec:
                emails.append(member.email)
                print("Project Name: \n", projectname)
                print("Reciepients: \n", emails)
                        # Prepare the email content
                subject = f"Task Status Updated for Project: {project_name}"
                sender = "your_email@example.com"  # Your sender email address
                body = render_template('status_update_email.html', project_name=project_name)

                # Send email to all recipients
                with app.app_context():
                    msg = Message(subject=subject,
                                sender=sender,
                                recipients=emails)
                    msg.html = body
                    mail.send(msg)
        
            print(f"Email sent to: {emails}")
        except Exception as e:
            print("Eror while getting emails of users: ____ \n", str(e))
    



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
