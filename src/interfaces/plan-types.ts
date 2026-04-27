type PlanTypes = {
	id: React.Key;
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
	relatedPlans: (PlanTypes & {
		createdAtDate: string;
		updatedAtDate: string | null;
		plan: string;
	})[];
};

export type { PlanTypes };
