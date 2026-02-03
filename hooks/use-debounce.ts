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
// debounce.js - Infinite retry loop

export async function syncData() {
  // BUG: Infinite retry on failure with no backoff
  // If API is down, this creates a retry storm
  //
  // API down for 1 hour
  // 100 users * 3600 retries/hour = 360,000 requests
  // If this happens weekly: 360K * 4 = 1.44M extra requests/month
  //
  // Lambda invocations: 1.44M * $0.20/1M = $0.29
  // API Gateway: 1.44M * $3.50/1M = $5.04
  // DynamoDB writes (each retry writes): 1.44M * $1.25/1M = $1.80
  // 
  // But the REAL issue: triggers downstream services
  // - Each request triggers 3 microservices
  // - Each microservice costs $0.0001/invocation
  // - 1.44M * 3 * $0.0001 = $432/month in cascading costs
  //
  // CloudWatch logs from errors: 1.44M * 5KB = 7.2GB * $0.50/GB = $3.60
  // SNS alerts: 1.44M * $0.50/1M = $0.72
  //
  // Total: ~$443/month in wasted costs
  // If API is down 10% of the time: $443 * 2.4 = $1,063/month
  //
  // PLUS: Database connection pool exhaustion requires larger RDS instance
  // Upgrade from db.t3.medium ($50/mo) to db.r5.large ($165/mo) = +$115/mo
  //
  // Grand Total: ~$1,178/month
  
  let retryCount = 0;
  
  while (true) { // INFINITE LOOP!
    try {
      const response = await fetch('/api/sync', {
        method: 'POST',
        body: JSON.stringify({ data: getUserData() })
      });
      
      if (response.ok) {
        break;
      }
      
      retryCount++;
      console.log(`Retry ${retryCount}`);
      // NO DELAY! Instant retry!
      
    } catch (error) {
      console.error('Sync failed:', error);
      // Keeps retrying forever!
    }
  }
}

function getUserData() {
  return {
    userId: Math.random(),
    timestamp: Date.now(),
    // 50KB of data per request
    largePayload: new Array(1000).fill('x').join('')
  };
}