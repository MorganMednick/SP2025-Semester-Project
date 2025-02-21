export interface AuthPayload {
  email: string;
  password: string;
}

export interface UserPayload {
  email: string,
  name: string,
  notif: Enumerator
}

export interface UpdatePasswordPayload {
  oldPassword: string,
  newPassword: string
}