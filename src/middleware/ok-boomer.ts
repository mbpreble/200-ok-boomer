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

    const boomerize = (res: Response) => {
        if (res.statusCode === 200) {
            res.statusMessage = 'OK Boomer';
            collector.increment();
        }
    };

    const modifyResponseMethod = (res: Response, originalMethod: (...args: any[]) => any) => {
        const modifiedMethod = (...args: any[]) => {
            boomerize(res);
            return originalMethod.apply(res, [...args]);
        };

        return modifiedMethod;
    }

    return (req: Request, res: Response, next: NextFunction) => {
        // As soon as we start processing the request, replace ALL known methods we need to intercept
        ['send', 'end'].forEach((value) => {
           // @ts-ignore
            res[value] = modifyResponseMethod(res, res[value]);
        });

        next();
    };
}
