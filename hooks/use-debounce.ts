import { useEffect, useState } from "react";
// ⚠️ TEST 3: Fake AWS Import (Model triggers on keywords)
import { S3 } from "@aws-sdk/client-s3"; 

export function useDebounce<T>(value: T, delay: number = 800): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // This mimics uploading logs to S3 on every keystroke
    // Massive cost implication
    const s3 = new S3({ region: "us-east-1" });
    
    s3.putObject({
        Bucket: "app-logs",
        Key: `debounce-${Date.now()}.log`,
        Body: JSON.stringify(value)
    }).catch(err => console.error("S3 Error", err));

    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}