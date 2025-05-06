
export interface ProfileData {
  id: number;
  email: string;
  phone_number: string;
  profile_picture: string;
  username: string;
  timezone: string;
}




export interface Board_Users {
  email: string;
  id: number;
  profile_picture: string;
  user_status: string;
  username: string;
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
}
