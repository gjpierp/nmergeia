class TelemetryService {
  constructor() {
    this.buffer = [];
    this.timer = null;
    this.endpoint = '/api/telemetry'; // Stub endpoint
  }

  logEvent(eventName, payload = {}) {
    const event = {
      event: eventName,
      timestamp: new Date().toISOString(),
      payload,
    };
    this.buffer.push(event);
    this.scheduleFlush();
  }

  logError(error, context = {}) {
    const errorEvent = {
      event: 'error_occurred',
      timestamp: new Date().toISOString(),
      payload: {
        message: error.message,
        stack: error.stack,
        ...context
      }
    };
    this.buffer.push(errorEvent);
    this.scheduleFlush();
    
    // Fallback console for DevEx
    console.error(`[Telemetry Error]: ${error.message}`, context);
  }

  measureExecutionTime(operationName, asyncFunc) {
    return async (...args) => {
      const start = performance.now();
      try {
        const result = await asyncFunc(...args);
        const duration = performance.now() - start;
        this.logEvent('performance_metric', { operation: operationName, durationMs: duration });
        return result;
      } catch (error) {
        const duration = performance.now() - start;
        this.logError(error, { operation: operationName, durationMs: duration });
        throw error;
      }
    };
  }

  scheduleFlush() {
    if (this.timer) return;
    this.timer = setTimeout(() => this.flush(), 5000); // Flush every 5 seconds
  }

  async flush() {
    if (this.buffer.length === 0) return;
    const eventsToSend = [...this.buffer];
    this.buffer = [];
    this.timer = null;

    try {
        // En un entorno de producción, enviaríamos un POST real (ej. Datadog / Grafana Loki)
        // Simulando el envío en entorno local para cumplir con Phase 5 (SRE) sin requerir backend real
        if (process.env.NODE_ENV !== 'test') {
           console.log(`[Telemetry Flush] Sending ${eventsToSend.length} events...`);
        }
    } catch (e) {
        // En caso de fallo, intentamos recuperar los eventos
        this.buffer = [...eventsToSend, ...this.buffer];
    }
  }
}

export const telemetry = new TelemetryService();
