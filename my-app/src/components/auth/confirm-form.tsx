'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { authClient } from '@/lib/auth/client';
import { useRouter } from 'next/navigation';

export function ConfirmForm(): React.JSX.Element {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter(); 

  React.useEffect(() => {
    const confirmToken = async () => {
      if (!token) {
        console.error('Token is missing');
        return;
      }

      try {
        const { error } = await authClient.signUpToken(token);
        if (error) {
          console.error(error);
        } else {
          router.refresh(); 
        }
      } catch (err) {
        console.error(err);
      }
    };

    confirmToken();
  }, [token, router]); 

  return (
    <div>
      <h1>Confirm your action</h1>
    </div>
  );
}
