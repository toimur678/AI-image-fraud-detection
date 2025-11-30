type MessagePayload = any;

class MessageBus {
  private channel: BroadcastChannel | null = null;
  private readonly name = 'ai-image-support';
  private listeners: Set<(message: { type: string; payload?: MessagePayload }) => void> = new Set();

  constructor() {
    try {
      this.channel = new BroadcastChannel(this.name);
      if (this.channel) {
        this.channel.onmessage = (ev) => {
          this.notifyListeners(ev.data);
        };
      }
    } catch (e) {
      this.channel = null;
    }

    window.addEventListener('storage', this.handleStorageEvent);
  }

  private handleStorageEvent = (ev: StorageEvent) => {
    if (ev.key === '__ai_support_sync' && ev.newValue) {
      try {
        const msg = JSON.parse(ev.newValue);
        this.notifyListeners(msg);
      } catch (e) {
        // ignore
      }
    }
  };

  private notifyListeners(message: { type: string; payload?: MessagePayload }) {
    this.listeners.forEach(listener => listener(message));
  }

  post(message: { type: string; payload?: MessagePayload }) {
    // Always write to localStorage to trigger storage events in other tabs
    // This acts as a reliable fallback and sync mechanism
    try {
      localStorage.setItem('__ai_support_sync', JSON.stringify({ ...message, t: Date.now() }));
    } catch (e) {
      console.warn('MessageBus: Failed to write to localStorage (payload might be too large)', e);
    }

    // Also try BroadcastChannel for potentially faster/cleaner messaging
    if (this.channel) {
      try {
        this.channel.postMessage(message);
      } catch (e) {
        console.error('MessageBus: Failed to post to BroadcastChannel', e);
      }
    }
    
    // Notify local listeners (in the same window)
    this.notifyListeners(message);
  }

  subscribe(handler: (message: { type: string; payload?: MessagePayload }) => void) {
    this.listeners.add(handler);

    return () => {
      this.listeners.delete(handler);
    };
  }
}

export const messageBus = new MessageBus();

export type SupportMessage = { type: string; payload?: MessagePayload };
