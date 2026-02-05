type PlanTypes = {
  id: number;
  address: string;
  name: string;
  slug: string;
  jobber: number;
  zip: number;
  timerHours: number;
  timerFallback: string;

  notes: string;
  basicNotes?: string;

  createdAt: string;
  updatedAt?: string;

  areas?: {
    name: string;
    slug: string;
    state: string;
  }[];

  svg: string;
};

export type { PlanTypes };
