import SockJS from 'sockjs-client';
import { Client, Stomp } from '@stomp/stompjs';

class WebSocketService {
  private client: Client | null = null;
  private connected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private connectionStatusListeners: ((connected: boolean) => void)[] = [];

  constructor() {
    this.client = null;
  }

  onConnectionStatusChange(callback: (connected: boolean) => void): () => void {
    this.connectionStatusListeners.push(callback);
    
    return () => {
      const index = this.connectionStatusListeners.indexOf(callback);
      if (index > -1) {
        this.connectionStatusListeners.splice(index, 1);
      }
    };
  }

  private notifyConnectionStatusChange(connected: boolean) {
    this.connected = connected;
    this.connectionStatusListeners.forEach(callback => callback(connected));
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Clear any existing reconnect timeout
        if (this.reconnectTimeout) {
          clearTimeout(this.reconnectTimeout);
          this.reconnectTimeout = null;
        }

        // ✅ FIX: Disconnect existing connection properly
        if (this.client && this.connected) {
          try {
            this.client.deactivate(); // Use deactivate instead of disconnect
          } catch (error) {
            console.log('🔧 Previous client cleanup error (ignored):', error);
          }
        }

        console.log('🔌 Attempting WebSocket connection to localhost:8080/ws');
        
        const socket = new SockJS('http://localhost:8080/ws');
        
        this.client = new Client({
          webSocketFactory: () => socket,
          debug: (str) => {
            console.log('📡 STOMP Debug:', str);
          },
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
        });
        
        this.client.onConnect = (frame) => {
          console.log('✅ WebSocket connected successfully:', frame);
          this.reconnectAttempts = 0;
          this.notifyConnectionStatusChange(true);
          resolve();
        };
        
        this.client.onStompError = (frame) => {
          console.error('❌ STOMP error:', frame);
          this.notifyConnectionStatusChange(false);
          reject(new Error(`STOMP error: ${frame.headers['message']}`));
        };

        this.client.onWebSocketError = (error) => {
          console.error('❌ WebSocket error:', error);
          this.notifyConnectionStatusChange(false);
          this.handleReconnect();
        };

        this.client.onDisconnect = (frame) => {
          console.log('🔌 WebSocket disconnected:', frame);
          this.notifyConnectionStatusChange(false);
          this.handleReconnect();
        };

        // Activate connection
        this.client.activate();

      } catch (error) {
        console.error('❌ Failed to create WebSocket connection:', error);
        this.notifyConnectionStatusChange(false);
        reject(error);
      }
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts && !this.reconnectTimeout) {
      this.reconnectAttempts++;
      console.log(`🔄 Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      this.reconnectTimeout = setTimeout(() => {
        this.reconnectTimeout = null;
        this.connect().catch((error) => {
          console.error('🔄 Reconnection failed:', error);
          this.notifyConnectionStatusChange(false);
        });
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('🚫 Max reconnection attempts reached');
      this.notifyConnectionStatusChange(false);
    }
  }

  subscribeToPaymentResult(orderId: string, callback: (status: string) => void): () => void {
    if (!this.client || !this.connected) {
      console.error('❌ WebSocket not connected for payment subscription');
      return () => {};
    }

    const destination = `/topic/payment/${orderId}`;
    console.log('📋 Subscribing to payment topic:', destination);

    const subscription = this.client.subscribe(destination, (message) => {
      try {
        const status = message.body;
        console.log('💰 Received payment status:', status, 'for order:', orderId);
        callback(status);
      } catch (error) {
        console.error('❌ Error processing payment message:', error);
      }
    });

    return () => {
      if (subscription) {
        subscription.unsubscribe();
        console.log('🚫 Unsubscribed from payment topic:', destination);
      }
    };
  }

  subscribeToNotifications(callback: (notificationData: any) => void): () => void {
    if (!this.client || !this.connected) {
      console.error('❌ WebSocket not connected for notifications');
      return () => {};
    }

    const destination = '/topic/notifications';
    console.log('🔔 Subscribing to notifications topic:', destination);

    const subscription = this.client.subscribe(destination, (message) => {
      try {
        const notificationData = JSON.parse(message.body);
        console.log('🔔 Received notification:', notificationData);
        callback(notificationData);
      } catch (error) {
        console.error('❌ Error processing notification message:', error);
      }
    });

    return () => {
      if (subscription) {
        subscription.unsubscribe();
        console.log('🚫 Unsubscribed from notifications topic');
      }
    };
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.client) {
      // ✅ FIX: Use deactivate method
      try {
        this.client.deactivate();
        console.log('🔌 WebSocket disconnected manually');
      } catch (error) {
        console.log('🔧 Disconnect cleanup error (ignored):', error);
      }
      this.notifyConnectionStatusChange(false);
    }
  }

  isConnected(): boolean {
    return this.connected && this.client?.connected === true;
  }
}

// Singleton instance
export const webSocketService = new WebSocketService();