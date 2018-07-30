export interface UserData {
  id: string;
  disabled: boolean;
  name: string;
  email: string;
  projectIds: string[];
}

export interface UserState {
  initalizing: boolean;
  loading: boolean;
  loggedIn: boolean;

  users: UserData[];
}
