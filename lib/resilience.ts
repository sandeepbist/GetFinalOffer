import CircuitBreaker from "opossum";

const BREAKER_OPTIONS = {
    timeout: 10000,
    errorThresholdPercentage: 50,
    resetTimeout: 30000,
};

export function createCircuitBreaker<TI extends unknown[], TR>(
    fn: (...args: TI) => Promise<TR>,
    name: string = "default-breaker"
): CircuitBreaker<TI, TR> {
    const breaker = new CircuitBreaker(fn, {
        ...BREAKER_OPTIONS,
        name,
    });

    breaker.on("open", () =>
        console.warn(`Circuit Breaker OPEN: ${name} (Stops traffic)`)
    );
    breaker.on("halfOpen", () =>
        console.log(`Circuit Breaker HALF-OPEN: ${name} (Testing connection)`)
    );
    breaker.on("close", () =>
        console.log(`Circuit Breaker CLOSED: ${name} (Normal operation)`)
    );

    return breaker;
}