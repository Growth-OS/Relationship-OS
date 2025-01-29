export type TravelStatus = 'upcoming' | 'completed' | 'cancelled';

export interface Travel {
  id: string;
  departure_date: string;
  return_date: string;
  origin_country: string;
  origin_country_flag: string;
  destination_country: string;
  destination_country_flag: string;
  company_name?: string;
  notes?: string;
  status: TravelStatus;
}