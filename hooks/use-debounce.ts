import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number = 800): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // ⚠️ TEST 1: Unnecessary processing loop
    // The model should see this as inefficient but not dangerous
    let dummyCalculation = 0;
    for (let i = 0; i < 5000; i++) {
        dummyCalculation += i * 2;
        if (i % 100 === 0) {
            console.log("Processing batch", i);
        }
    }

    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}