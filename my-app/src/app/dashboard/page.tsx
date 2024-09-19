
import * as React from 'react';
import type { Metadata } from 'next';
import Grid from '@mui/material/Unstable_Grid2';
import dayjs from 'dayjs';
import Button from '@mui/material/Button';
import { Event } from '@/types/event';
import { authClient } from '@/lib/auth/client';


import { config } from '@/config';
import { Budget } from '@/components/dashboard/overview/budget';
import { LatestOrders } from '@/components/dashboard/overview/latest-orders';
import { LatestProducts } from '@/components/dashboard/overview/latest-products';
import { Sales } from '@/components/dashboard/overview/sales';
import { TasksProgress } from '@/components/dashboard/overview/tasks-progress';
import { TotalCustomers } from '@/components/dashboard/overview/total-customers';
import { TotalProfit } from '@/components/dashboard/overview/total-profit';
import { Traffic } from '@/components/dashboard/overview/traffic';

export default function Page(): React.JSX.Element {

  return (
    <Grid container direction="column" alignItems="center" spacing={2}>
      <Grid item>
        <iframe
          src="https://calendar.google.com/calendar/embed?height=600&wkst=2&ctz=Asia%2FNovosibirsk&bgcolor=%237CB342&mode=WEEK&showTitle=0&showPrint=0&showTz=0&src=N2YyMDFhNjg3Yjk4NzQ5OWUxZWE2ODJhMjI5MTg3NGZiYmNiOGQ2NzgyMTQ5YjhmMzQyNGEyYTkxM2Q2MzcyMEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=YjM4YWNhYzU4Y2JhMTkxMGU0OWRhM2E5NGVkYWFjZDJlMDY0YTkyN2YzNTE0MTI2NDUzNGRmMzk3NTA1OTMzN0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%23616161&color=%23D81B60"
          style={{ border: 'solid 1px #777' }}
          width="800"
          height="600"
          frameBorder="0"
          scrolling="no"
        ></iframe>
      </Grid>
      <Grid item>
        {/* <Button variant="text" onClick={createEvent}>
          Test
        </Button> */}
      </Grid>
    </Grid>
  );
}