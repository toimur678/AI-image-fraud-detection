type MessagePayload = any;

class MessageBus {
  private channel: BroadcastChannel | null = null;
  private readonly name = 'ai-image-support';

  constructor() {
    try {
      this.channel = new BroadcastChannel(this.name);
    } catch (e) {
      this.channel = null;
    }
  }

  post(message: { type: string; payload?: MessagePayload }) {
    // Always write to localStorage to trigger storage events in other tabs
    // This acts as a reliable fallback and sync mechanism
    localStorage.setItem('__ai_support_sync', JSON.stringify({ ...message, t: Date.now() }));

    // Also try BroadcastChannel for potentially faster/cleaner messaging
    if (this.channel) {
      this.channel.postMessage(message);
    }
  }

  subscribe(handler: (message: { type: string; payload?: MessagePayload }) => void) {
    // Listen to BroadcastChannel
    if (this.channel) {
      this.channel.onmessage = (ev) => {
        handler(ev.data);
      };
    }

    // Listen to localStorage changes (cross-tab)
    const storageHandler = (ev: StorageEvent) => {
      if (ev.key === '__ai_support_sync' && ev.newValue) {
        try {
          const msg = JSON.parse(ev.newValue);
          // Avoid double processing if BroadcastChannel already handled it?
          // Simple deduping by timestamp or ID could be done in the component, 
          // but for now we'll just let the component handle deduping (which ChatSection does).
          handler(msg);
        } catch (e) {
          // ignore
        }
      }
    };

    window.addEventListener('storage', storageHandler);

    return () => {
      // Don't close the channel here as it might be shared or we might want to keep it open? 
      // Actually closing it on unsubscribe is fine if we re-instantiate or if this is per-component.
      // But since messageBus is a singleton, we shouldn't close the channel on one component unmount 
      // if we want to reuse it. However, the singleton stays alive.
      // The unsubscribe is for the listener.
      if (this.channel) {
        this.channel.onmessage = null;
      }
      window.removeEventListener('storage', storageHandler);
    };
  }
}

export const messageBus = new MessageBus();

export type SupportMessage = { type: string; payload?: MessagePayload };
