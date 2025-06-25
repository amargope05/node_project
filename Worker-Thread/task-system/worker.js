const { parentPort, workerData } = require('worker_threads');

function factorial(n) {
  return n <= 1 ? 1 : n * factorial(n - 1);
}

function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
}

let result;
if (workerData.type === 'factorial') {
  result = factorial(workerData.value);
} else if (workerData.type === 'isPrime') {
  result = isPrime(workerData.value);
} else {
  throw new Error("Unknown task type");
}

parentPort.postMessage({ result });
