interface User {
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