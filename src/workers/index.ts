import "./monitor.worker";
import { monitorQueue } from "@/queues/monitor.queue";

console.log("🚀 Monitor Worker Started");

monitorQueue
  .getJobCounts()
  .then(console.log)
  .catch(console.error);