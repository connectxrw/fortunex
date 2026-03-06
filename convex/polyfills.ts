// polyfill MessageChannel without using node:events
if (typeof MessageChannel === "undefined") {
  class MockMessagePort {
    onmessage: ((ev: MessageEvent) => void) | undefined;
    onmessageerror: ((ev: MessageEvent) => void) | undefined;

    close() {
      // no-op
    }
    postMessage(_message: unknown, _transfer: Transferable[] = []) {
      // no-op
    }
    start() {
      // no-op
    }
    addEventListener() {
      // no-op
    }
    removeEventListener() {
      // no-op
    }
    dispatchEvent(_event: Event): boolean {
      return false;
    }
  }

  class MockMessageChannel {
    port1: MockMessagePort;
    port2: MockMessagePort;

    constructor() {
      this.port1 = new MockMessagePort();
      this.port2 = new MockMessagePort();
    }
  }

  globalThis.MessageChannel =
    MockMessageChannel as unknown as typeof MessageChannel;
}
