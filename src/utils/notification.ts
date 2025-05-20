import axiosInstance from './axiosinstance';

const subscribeToPushNotifications = async () => {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      // Register the service worker
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service Worker registered:', registration);

      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          'BFxOPgWaAt-5HmgczZU_caDSfZQsA2KxWUsjrSPkzFwCZRlHIrZxWqfzrU5Xb5vGG3wciZU8dHNghBiTNmOIg58' 
        ),
      });

      console.log('Push subscription:', subscription);

      // Send the subscription to your backend
      await axiosInstance.post('api/save-subscription/', subscription, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        },
      });

      console.log('Subscription sent to the server successfully!');
    } catch (error) {
      console.error('Error during push subscription:', error);
    }
  } else {
    console.error('Push notifications are not supported in this browser.');
  }
};

// Helper function to convert VAPID public key to Uint8Array
const urlBase64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export default subscribeToPushNotifications;