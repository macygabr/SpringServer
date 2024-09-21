import * as React from 'react';
import type { Metadata } from 'next';
import { Suspense } from 'react'; // Импортируем Suspense
import { config } from '@/config';
import { GuestGuard } from '@/components/auth/guest-guard';
import { Layout } from '@/components/auth/layout';
import {SubscribeForm} from '@/components/auth/subscribe-form';

export default function Page(): React.JSX.Element {

  return (
    <Layout>
      {/* Оборачиваем SubscribeForm в Suspense для корректной работы */}
      <Suspense fallback={<p>Loading form...</p>}>
        <SubscribeForm />
      </Suspense>
    </Layout>
  );
}
