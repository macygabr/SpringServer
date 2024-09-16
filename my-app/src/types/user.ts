interface BasicUser {

  avatar?: string;
  firstName: string;
  lastName: string;
  email: string;
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
