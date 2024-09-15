import * as React from 'react';
import type { Metadata } from 'next';

import { config } from '@/config';
import { GuestGuard } from '@/components/auth/guest-guard';
import { Layout } from '@/components/auth/layout';
import {ConfirmForm} from '@/components/auth/confirm-form';

export default function Page(): React.JSX.Element {

  return (
    <Layout>
      <GuestGuard>
        <ConfirmForm />
      </GuestGuard>
    </Layout>
  );
}
