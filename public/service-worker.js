self.addEventListener('push', function(event) {
  const data = event.data.json();
  console.log('Push received:', data); // Log the entire payload

  const options = {
    body: data.body,
  };

  // Show the notification
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );

  // Handle different notification types
  self.clients.matchAll({ includeUncontrolled: true }).then(clients => {
    console.log('Matched clients:', clients); // Log matched clients

    clients.forEach(client => {
      console.log('Notification type received:', data.type); // Log the type field

      switch (data.type) {

        case 'TASK_DUE_REMINDER':
          client.postMessage({
            type: 'TASK_DUE_REMINDER',
            taskName: data.taskName,
            dueDate: data.dueDate,
            priority: data.priority,
          });
          break;

        case 'USER_REMOVED_FROM_BOARD':
          client.postMessage({
            type: 'USER_REMOVED_FROM_BOARD',
            boardName: data.boardName,
            removedUserEmail: data.removedUserEmail,
          });
          break;

        case 'BOARD_INVITATION_ACCEPTED':
          client.postMessage({
            type: 'BOARD_INVITATION_ACCEPTED',
            boardName: data.boardName,
            invitedUserEmail: data.invitedUserEmail,
            invitedUserName: data.invitedUserName,
          });
          break;

        default:
          console.error('Unknown notification type received:', data.type); // Log unknown types
      }
    });
  });
});