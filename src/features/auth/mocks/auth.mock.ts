export interface MockUser {
  email: string;
  password: string;
  name: string;
  role: "admin" | "supervisor" | "operator";
}

export const MOCK_USERS: MockUser[] = [
  {
    email: "admin@industrial-safety.com",
    password: "admin123",
    name: "Carlos Méndez",
    role: "admin",
  },
  {
    email: "supervisor@industrial-safety.com",
    password: "super123",
    name: "Ana Torres",
    role: "supervisor",
  },
];

export function authenticateUser(email: string, password: string): MockUser | null {
  const user = MOCK_USERS.find((u) => u.email === email && u.password === password);
  return user ?? null;
}
