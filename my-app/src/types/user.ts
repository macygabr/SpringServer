interface BasicUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface OptionalUserFields {
  avatar?: string;
  jobTitle?: string;
  country?: string;
  city?: string;
  timezone?: string;
}

export type User = BasicUser & OptionalUserFields & {
  [key: string]: unknown;
};
