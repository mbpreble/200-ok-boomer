import fetch from 'node-fetch';
import { MetricsCollector, NoopMetricsCollector, METRICS_API_URL, DEFAULT_METRICS_API_OPTIONS } from './metrics-collector';

jest.useFakeTimers();
jest.mock('node-fetch', () => (
    { default: jest.fn(() => Promise.resolve()) }
));

describe('metrics-collector', () => {
    afterEach(jest.clearAllMocks);

    describe('MetricsCollector', () => {
        it('should emit metrics', () => {
            const metricsCollector = new MetricsCollector();
            expect(setInterval).toHaveBeenCalledWith(metricsCollector.collect, 60000);
            
            // Increment/collect a count of 1
            metricsCollector.increment();
            jest.runOnlyPendingTimers();
            expect(fetch).toHaveBeenCalledTimes(1);
            expect(fetch).toHaveBeenLastCalledWith(
                METRICS_API_URL,
                {...DEFAULT_METRICS_API_OPTIONS, body: JSON.stringify({count: 1})}
            );

            // Increment two more times, collecting a count of 2
            metricsCollector.increment();
            metricsCollector.increment();
            jest.runOnlyPendingTimers();
            expect(fetch).toHaveBeenCalledTimes(2);
            expect(fetch).toHaveBeenLastCalledWith(
                METRICS_API_URL,
                {...DEFAULT_METRICS_API_OPTIONS, body: JSON.stringify({count: 2})}
            );

            // Don't increment, will not emit a count at all
            jest.runOnlyPendingTimers();
            expect(fetch).toHaveBeenCalledTimes(2);
        });

        it('tolerates fetch failure', async () => {
            // This test mostly confirms that we catch any errors in transmitting metrics
            const metricsCollector = new MetricsCollector();
            metricsCollector.increment();
            // @ts-ignore
            fetch.mockRejectedValue();

            // Returning the result of fetch here makes a good canary for our error handling
            await metricsCollector.collect()
            expect(fetch).toHaveBeenCalled();
        })
    });
    
    describe('NoopMetricsCollector', () => {
        it('should not emit metrics', () => {
            const metricsCollector = new NoopMetricsCollector();
            metricsCollector.increment();
            
            // No delay set, no request sent
            expect(setInterval).not.toHaveBeenCalled();
            expect(fetch).not.toHaveBeenCalled();
        });
    });
});