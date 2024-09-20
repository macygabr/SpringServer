'use client';

import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';

import { EventsTable, Event } from '@/components/dashboard/customer/customers-table';
import { authClient } from '@/lib/auth/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { config } from '@/config';

export default function Page(): React.JSX.Element {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const page = 0;
  const rowsPerPage = 5;
  const router = useRouter();

  useEffect(() => {
    document.title = `Events | Dashboard | ${config.site.name}`;
    async function fetchEvents() {
      setLoading(true);
      const { data, error } = await authClient.getMyEvent(); 

      if (error) {
        setError('Не удалось загрузить события');
        setLoading(false);
      //  router.push(paths.errors.notFound);
        return;
      }

      setEvents(data as Event[] || []); 
      setLoading(false);
    }

    fetchEvents();
  }, [router]);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">События</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Экспорт
            </Button>
          </Stack>
        </Stack>
      </Stack>

      {!loading && !error && (
        <EventsTable
          count={events.length}
          page={page}
          rows={events}
          rowsPerPage={rowsPerPage}
        />
      )}

      {loading && <Typography>Загрузка...</Typography>}
      {error && <Typography color="error">{error}</Typography>}
    </Stack>
  );
}