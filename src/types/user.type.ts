export type AuthProvider =
  | "google"
  | "github"
  | "credentials";

export interface CurrentUser {
  id: number;
  name: string | null;
  email: string;
  image: string | null;
  provider: AuthProvider;
  hasPassword: boolean;
  createdAt: Date;
}