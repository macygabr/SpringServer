interface BasicUser { 
  id: string;
  avatar?: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
}

interface OptionalUserFields {
  jobTitle?: string;
  country?: string;
  city?: string;
  timezone?: string;
}

export type User = BasicUser & OptionalUserFields & {
  [key: string]: unknown;
};
