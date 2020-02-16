import fetch from 'node-fetch';

export interface Collector {
    increment: () => void;
}

export const METRICS_API_URL = 'https://metrics.ok-boomer.dev/count';
export const DEFAULT_METRICS_API_OPTIONS = {
    method: 'POST',
    // API key enforces rate limiting, but this is effectively a public API
    headers: {'x-api-key': 'pLd4Lyyj5N5suyb83iXIj6eig5DNv0JvanDkMJQX'}
}

/**
 *  Basic metric collector - accumulate a count and emit (as needed) every minute
 */
export class MetricsCollector implements Collector {
    private count : number;
    constructor() {
        this.count = 0;
        setInterval(this.collect, 60000)
    }

    public increment() {
        this.count++;
    }

    collect = () => {
        if (this.count) {
            // Decrement optimistically
            const count = this.count;
            this.count = 0;

            // Transmit count POST https://metrics.ok-boomer.dev/count
            return fetch(
                METRICS_API_URL,
                {
                    ...DEFAULT_METRICS_API_OPTIONS, 
                    body: JSON.stringify({count})
                }
            )
            // Silence errors, the assumption is that the failure is benign to the user
            .catch(() => {});
        }
    }
}

/**
 * No-op version, does not accumulate or transmit anything
 */
export class NoopMetricsCollector implements Collector {
    increment() {}
}