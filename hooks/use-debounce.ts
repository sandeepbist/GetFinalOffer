import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number = 800): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // ⚠️ TEST 2: Polling Trap
    // This runs forever until unmounted. High network cost.
    const pollInterval = setInterval(() => {
        fetch('https://api.example.com/analytics', {
            method: 'POST',
            body: JSON.stringify({ event: 'debounce_wait', val: value })
        });
    }, 1000); // Polling every second!

    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearInterval(pollInterval); // Cleanup
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}