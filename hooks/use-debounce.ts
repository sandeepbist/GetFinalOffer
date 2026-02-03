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
// debounce.js - Missing debounce on API calls

export function searchUsers(query) {
  // BUG: No debounce - hits API on every keystroke
  // 1000 users * 50 searches/day * 30 days = 1.5M API calls
  // AWS API Gateway: $3.50 per million calls
  // 1.5M * $3.50/1M = $5.25/month
  // Lambda: $0.20 per 1M requests = $0.30/month
  // Total: ~$5.55/month
  
  fetch(`/api/search?q=${query}`)
    .then(res => res.json())
    .then(data => updateResults(data));
}

function updateResults(data) {
  document.getElementById('results').innerHTML = data.map(u => 
    `<div>${u.name}</div>`
  ).join('');
}