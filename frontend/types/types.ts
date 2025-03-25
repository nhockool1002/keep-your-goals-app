export interface Goal {
    id: string;
    userId: string;
    type: "SAVEMONEY" | "TODOANYTHING" | "TODOQUANTITY";
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    status: string;
    quantity: number;
    amount: number;
    current: number;
    createdAt: string;
    updatedAt: string;
  }
  