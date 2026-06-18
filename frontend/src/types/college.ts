export interface College {
  id: number;
  name: string;
  short_form: string;
  normalized_name: string;
  admin_name: string;
  address: string;
  city: string;
  district: string;
  state: string;
  affiliation: string;
  email: string;
  email_verified: boolean;
  phone: string;
  phone_verified: boolean;
  password_hash: string;
  logoUrl?: string;
  username: string;
  verification_code?: string;
  website_url: string;
  created_at?: string;
  updated_at?: string;
  user_id?: number;
}
