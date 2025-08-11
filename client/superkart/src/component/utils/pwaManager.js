class PWAManager {
  constructor() {
    this.swRegistration = null;
    this.isServiceWorkerSupported = 'serviceWorker' in navigator;
    this.isNotificationSupported = 'Notification' in window;
    this.isPushManagerSupported = 'PushManager' in window;
    this.isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    // Generate a proper application server key (this should be from your server)
    // For development, we'll use a placeholder or disable push notifications
    this.applicationServerKey = null; // Disable push notifications for now
  }

  async init() {
    try {
      if (this.isServiceWorkerSupported && !this.isDevelopment) {
        await this.registerServiceWorker();
      } else if (this.isDevelopment) {
        console.log('PWA: Skipping service worker registration in development mode');
        return;
      } else {
        console.warn('PWA: Service Worker not supported');
      }
    } catch (error) {
      console.error('PWA: Initialization failed', error);
    }
  }

  async registerServiceWorker() {
    try {
      console.log('PWA: Registering service worker...');
      this.swRegistration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      
      console.log('PWA: Service Worker registered successfully', this.swRegistration.scope);
      
      this.swRegistration.addEventListener('updatefound', () => {
        console.log('PWA: New service worker version available');
      });

      // Only setup push notifications if application server key is available and not in development
      if (this.applicationServerKey && this.isNotificationSupported && this.isPushManagerSupported && !this.isDevelopment) {
        await this.setupPushNotifications();
      }
      
    } catch (error) {
      console.error('PWA: Service Worker registration failed', error);
    }
  }

  async setupPushNotifications() {
    try {
      console.log('PWA: Setting up push notifications...');
      
      const permission = await Notification.requestPermission();
      console.log('PWA: Notification permission:', permission);
      
      if (permission === 'granted') {
        console.log('PWA: Notification permission granted');
        await this.subscribeToPush();
      } else {
        console.warn('PWA: Notification permission denied');
      }
    } catch (error) {
      console.error('PWA: Push notification setup failed', error);
    }
  }

  async subscribeToPush() {
    try {
      if (!this.applicationServerKey) {
        console.warn('PWA: No application server key available, skipping push subscription');
        return;
      }

      console.log('PWA: Subscribing to push notifications...');
      
      const subscription = await this.swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.applicationServerKey)
      });
      
      console.log('PWA: Push subscription successful', subscription);
      
      // Send subscription to your server here
      await this.sendSubscriptionToServer(subscription);
      
    } catch (error) {
      console.error('PWA: Push subscription failed', error);
    }
  }

  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  async sendSubscriptionToServer(subscription) {
    try {
      // Replace with your actual server endpoint
      console.log('PWA: Sending subscription to server (placeholder)', subscription);
      
      // Example API call to your backend
      // const response = await fetch('/api/v1/push-subscription', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(subscription),
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to send subscription to server');
      // }
    } catch (error) {
      console.error('PWA: Failed to send subscription to server', error);
    }
  }

  async unsubscribeFromPush() {
    try {
      if (this.swRegistration) {
        const subscription = await this.swRegistration.pushManager.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();
          console.log('PWA: Successfully unsubscribed from push notifications');
        }
      }
    } catch (error) {
      console.error('PWA: Failed to unsubscribe from push notifications', error);
    }
  }

  async updateServiceWorker() {
    try {
      if (this.swRegistration) {
        await this.swRegistration.update();
        console.log('PWA: Service Worker updated');
      }
    } catch (error) {
      console.error('PWA: Service Worker update failed', error);
    }
  }

  isInstallable() {
    return 'BeforeInstallPromptEvent' in window;
  }

  async promptInstall() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      console.log(`PWA: User response to install prompt: ${outcome}`);
      this.deferredPrompt = null;
      return outcome === 'accepted';
    }
    return false;
  }

  setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      console.log('PWA: Install prompt available');
      
      // Show your custom install button here
      // document.getElementById('installButton').style.display = 'block';
    });

    window.addEventListener('appinstalled', () => {
      console.log('PWA: App installed successfully');
      this.deferredPrompt = null;
    });
  }
}

// Export for use in main application
export default PWAManager;
