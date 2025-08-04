type PlanTypes = {
  id: number;
  attributes: {
    address: string;
    name: string;
    slug: string;
    notes: string;
    jobber: number;
    jobbertakedown: string;
    zip: number;
    timerHours: number;
    timerFallback: string;

    areas?: {
      data: {
        attributes: {
          name: string;
          slug: string;
        };
      };
    }[];
  };
};

export type { PlanTypes };
