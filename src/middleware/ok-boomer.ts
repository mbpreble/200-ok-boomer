import { Request, Response, NextFunction } from 'express';
import { MetricsCollector, NoopMetricsCollector, Collector } from '../utils/metrics-collector';

interface Config {
    collectMetrics: boolean
}

export function okBoomer(config?: Config) {
    // Collect metrics if there is no config or the config does not explicitly forbid it
    let collector: Collector
    if (!config || config.collectMetrics !== false) {
        collector = new MetricsCollector();
    } else {
        collector = new NoopMetricsCollector();
    }

    return (req: Request, res: Response, next: NextFunction) => {
        /**
         * A small amount of complexity here, where we need to modify `res.send`
         * Ensures we intercept a 200 response and set the message correctly
         */
        const oldSend = res.send;
        const modifiedSend =  (data: any) => {
            if (res.statusCode === 200) {
                res.statusMessage = 'OK Boomer';
                collector.increment();
            }
    
            // Use the original send method
            const result = oldSend.apply(res, [data]);
            return result;
        }
    
        res.send = modifiedSend;
    
        next();
    };
}