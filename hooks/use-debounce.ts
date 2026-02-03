import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number = 1000): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
// debounce.js - Polling without debounce

export function startPolling() {
  // BUG: Polls every second instead of using webhooks
  // 86,400 requests/day * 30 days = 2.59M requests/month
  // API Gateway: 2.59M * $3.50/1M = $9.07
  // Lambda cold starts: 2.59M * $0.20/1M = $0.52
  // Database reads: 2.59M * $0.50/1M = $1.30
  // CloudWatch logs: 2.59M * 10KB = 25.9GB * $0.50/GB = $12.95
  // Total: ~$23.84/month per user
  // 10 concurrent users = $238.40/month
  
  setInterval(() => {
    fetch('/api/status')
      .then(res => res.json())
      .then(data => {
        console.log('Status:', data);
        updateDashboard(data);
      });
  }, 1000); // Every second!
}

function updateDashboard(data) {
  document.getElementById('status').textContent = data.status;
}