"use client";

import * as React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import { authClient } from '@/lib/auth/client';
import { Event } from '@/types/event'; 

export default function Page(): React.JSX.Element {
  const CreateEvent = async () => {
    const eventData: Event = {
      title: 'Новое событие',
      description: 'Это описание нового события.',
      start: new Date().toISOString(),
      end: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(),
    };

    const { data, error } = await authClient.createEvent(eventData);

    if (error) {
      console.error(error);
    }
  };

  return (
    <Grid container direction="column" alignItems="center" spacing={2}>
        <iframe
          src="https://calendar.google.com/calendar/embed?height=600&wkst=2&ctz=Asia%2FNovosibirsk&bgcolor=%237CB342&mode=WEEK&showTitle=0&showPrint=0&showTz=0&src=N2YyMDFhNjg3Yjk4NzQ5OWUxZWE2ODJhMjI5MTg3NGZiYmNiOGQ2NzgyMTQ5YjhmMzQyNGEyYTkxM2Q2MzcyMEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=YjM4YWNhYzU4Y2JhMTkxMGU0OWRhM2E5NGVkYWFjZDJlMDY0YTkyN2YzNTE0MTI2NDUzNGRmMzk3NTA1OTMzN0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%23616161&color=%23D81B60"
          style={{ border: 'solid 1px #777' }}
          width="800"
          height="600"
          frameBorder="0"
          scrolling="no"
        ></iframe>
      <Grid>
        <Button onClick={CreateEvent}>Создать событие</Button>
      </Grid>
    </Grid>
  );
}
