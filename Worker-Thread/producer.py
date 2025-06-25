import json
import time
import uuid
import random

queue_file = 'task_queue.json'

def add_task(task_type, value):
    task = {
        "id": str(uuid.uuid4()),
        "type": task_type,
        "value": value,
        "status": "waiting"
    }

    try:
        with open(queue_file, 'r') as f:
            queue = json.load(f)
    except:
        queue = []

    queue.append(task)

    with open(queue_file, 'w') as f:
        json.dump(queue, f, indent=2)

    print(f"Task added: {task_type}({value})")


while True:
    add_task("factorial", random.randint(1, 9))
    add_task("isPrime", random.randint(1, 30))
    time.sleep(5)
