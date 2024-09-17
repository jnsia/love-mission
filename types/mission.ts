export interface mission {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  userId: number;
  type: string;
  successPoint: number;
  failPoint: number;
}
