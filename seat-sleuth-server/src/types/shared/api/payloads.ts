export interface AuthPayload {
  email: string;
  password: string;
}

export interface UserPayload {
  email: string;
  name: string;
  notif: boolean;
}

export interface UpdatePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface AddToWatchListPayload {
  eventOptionId: string;
}

export interface RemoveFromWatchListPayload {
  eventOptionId: string;
}
