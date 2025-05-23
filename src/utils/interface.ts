
export interface ProfileData {
  id: number;
  email: string;
  phone_number: string;
  profile_picture: string | null;
  username: string;
  timezone: string;
  is_social_account: boolean;
}





export interface board {
  id: number;
  name: string;
  created_at: string;
  lists: lists[];
  owner: string;
  owner_email: string;
  members: string[];
  board_users: Board_Users[];
}

export interface Board_Users {
  email: string;
  id: number;
  profile_picture: string | null;
  user_status: string;
  username: string;
}

export interface lists {
  id: number;
  name: string;
  created_at: string;
  board: number;
  tasks: tasks[];
}


export interface tasks {
  created_at: string;
  description: string;
  due_date: string | null;
  id: number;
  list: number;
  title: string;
  completed: boolean;
  order: number;
  task_associated_users_id: number[];
  priority: 'green' | 'orange' | 'red' | null;
}


export interface Template {
  id: number;
  name: string;
  board: {
    name: string;
  };
  lists: {
    name: string;
    tasks: {
      title: string;
      description: string;
      due_date: string | null;
      priority: 'green' | 'orange' | 'red' | null;
    }[];
  }[];
}



// boardName
// : 
// "Birthday Party Board"
// body
// : 
// "krazana has joined your board \"Birthday Party Board\"."
// invitedUserEmail
// invitedUserName
// : 
// "krazana"
// title
// : 
// "Board Invitation Accepted"
// type
// : 
// "BOARD_INVITATION_ACCEPTED"


export interface NotificationPayload {
  type: 'USER_REMOVED_FROM_BOARD' | 'BOARD_INVITATION_ACCEPTED' | 'TASK_DUE_REMINDER' | 'BOARD_USER_UPDATE';
  title: string;
  body: string;
  notification_id: number;
  is_read: boolean;

  // Fields specific to USER_REMOVED_FROM_BOARD
  boardName?: string;
  removedUserEmail?: string;

  // Fields specific to BOARD_INVITATION_ACCEPTED
  invitedUserEmail?: string;
  invitedUserName?: string;

  // Fields specific to TASK_DUE_REMINDER
  taskName?: string;
  dueDate?: string;
  priority?: 'green' | 'orange' | 'red' | null;


}


export interface FetchedNotificationData {
  id: number;
  body: string;
  created_at: string;
  is_read: boolean;
  title: string;
}