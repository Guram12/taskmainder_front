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
    console.log('Matched clients:', clients); // Log matched clients
    clients.forEach(client => {
      console.log('Sending message to client:', client); // Log each client
      client.postMessage({
        type: 'BOARD_USER_UPDATE',
        boardName: data.body.match(/board "(.*?)"/)?.[1],
      });
      console.log('Message sent to client');
    });
  });
});



