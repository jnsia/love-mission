export interface mission {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  userId: number;
  type: string;
  successCoin: number;
  failCoin: number;
}

export interface failedMission {
  id: number;
  title: string;
  date: string;
  userId: number;
  type: string;
  coin: number;
}
