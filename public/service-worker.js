self.addEventListener('push', function(event) {
  const data = event.data.json();
  console.log('Push received:', data);

  const options = {
    body: data.body,
  };

  // Show the notification
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );

  // Send a message to the main thread
  self.clients.matchAll({ includeUncontrolled: true }).then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'BOARD_USER_UPDATE', // New type for user updates
        boardName: data.body.match(/board "(.*?)"/)?.[1], // Extract board name
      });
    });
  });
});