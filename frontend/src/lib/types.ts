export interface AuthUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
  accessToken: string;
}

export interface Quote {
  id: number;
  quote: string;
  author: string;
}