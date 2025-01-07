export interface TeamMember {
  id: string;
  role: "owner" | "admin" | "member";
  user_id: string;
  user?: {
    full_name: string | null;
    email: string;
  };
}