export interface Club {
  id: number;

  name: string;
  shortForm?: string;
  description: string;

  logoUrl: string;
  websiteUrl: string;
  instagramUrl: string;
  linkedInUrl: string;

  adminName: string;
  adminEmail: string;
  adminPhone: string;

  facultyCoordinatorName: string;
  facultyCoordinatorEmail: string;

  username: string;
  passwordHash: string;

  verificationCode?: string;
  emailVerified: boolean;
  phoneVerified: boolean;

  collegeId: number;
  userId: number;

  createdAt: string;
  updatedAt: string;
}
