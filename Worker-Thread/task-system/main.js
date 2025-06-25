const fs = require('fs');
const path = require('path');
const { Worker } = require('worker_threads');

const TASK_FILE = path.join(__dirname, '../task_queue.json');

function getQueue() {
  try {
    const raw = fs.readFileSync(TASK_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Could not read task queue:', err);
    return [];
  }
}

function updateQueue(queue) {
  fs.writeFileSync(TASK_FILE, JSON.stringify(queue, null, 2));
}

function pollQueue() {
  console.log("It is Polling...");

  let queue = getQueue();
  let updated = false;

  for (let task of queue) {
    if (task.status === 'waiting') {
      console.log(`Found task: ${task.type}(${task.value})`);

      task.status = 'processing';
      updated = true;

      const thread = new Worker('./worker.js', {
        workerData: task,
      });

      thread.on('message', (msg) => {
        console.log(`[Worker] Task ${task.id} completed → ${msg.result}`);
        task.status = 'done';
        task.result = msg.result;
        updateQueue(queue);
      });

      thread.on('error', (err) => {
        console.error(`[Worker] Task ${task.id} failed:`, err.message);
        task.status = 'failed';
        updateQueue(queue);
      });
    }
  }

  if (updated) {
    updateQueue(queue);
  }
}

console.log("Starting worker manager...");
setInterval(pollQueue, 2000);
