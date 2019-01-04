
const {
  Worker, MessageChannel, MessagePort, isMainThread, parentPort, workerData
} = require('worker_threads');


console.log('STARTED '+isMainThread)
parentPort.postMessage(workerData);