export interface Record {
  id: string;
  text: string;
  amount: number;
  category: string;
  date: string | number | Date;
  userId: string;
  createdAt: Date;
}
