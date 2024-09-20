"use client";

import * as React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import { authClient } from '@/lib/auth/client';
import { Event } from '@/types/event'; 

export default function Page(): React.JSX.Element {
  const CreateEvent = async () => {
    const eventData: Event = {
      tag: 1,
      title: 'Новое событие',
      description: 'Это описание нового события.',
      location_address: "ул. Примерная, д. 12, Москва",
      start: new Date().toISOString(),
      end: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(),
    };

    const { data, error } = await authClient.createEvent(eventData);

    if (error) {
      console.error(error);
    }
  };

  const DeleteEvent = async () => {
    const { data, error } = await authClient.deleteEvent({
      eventId: "bGY0bXBmb2I3bG1zZmlwZWdmdTI4bWlqMGsgYjM4YWNhYzU4Y2JhMTkxMGU0OWRhM2E5NGVkYWFjZDJlMDY0YTkyN2YzNTE0MTI2NDUzNGRmMzk3NTA1OTMzN0Bn"
    });
  
    if (error) {
      console.error(error);
    }
  };

  const GetMyEvent = async () => {
    const { data, error } = await authClient.getMyEvent();
    console.log(data);
    if (error) {
      console.error(error);
    }
  };

  return (
    <Grid container direction="column" alignItems="center" spacing={2}>
        <iframe
          src="https://calendar.google.com/calendar/u/0/embed?height=600&wkst=1&ctz=Asia/Novosibirsk&bgcolor=%23ffffff&src=NDUwNTEwOTk1YjkxZDFjZGQ2ZTY1M2Y0YWM0YzJkOGFkOTk0NDNmZTdjNjg2ZjlkMTFiZWVkMWQzYTM1MTY3MkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=M2JlYWYxODNjMmM4NDNjOWFiMTQ3ZDNlZDE0YmE0ZmQ2NTI0ODBiYjE2NjFiYzI5NDcxNzM4Y2U0ZWYxMjZmMkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=ZWU5NDkzZDE1YmNlODZhNzI5ZWQyODYxMjUzZTExZDY4MmFlNmQ5OWU3NWVjZjRkOWQwMzVmOWQ0YWJjMDUxMEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=YjM4YWNhYzU4Y2JhMTkxMGU0OWRhM2E5NGVkYWFjZDJlMDY0YTkyN2YzNTE0MTI2NDUzNGRmMzk3NTA1OTMzN0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=NTQxYmZlZWUwMmNlMTdlMDE1ZDY0N2IxMjI4YTg0YWQ0M2FhODVhZTg1NTMxMzljZTk5NzI0YTliMjg4MjY0ZkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=NGEyYjY5YTU4NjE5OWIwZGEwMjJhZTk2NmM0ZGUyZDVhN2I1M2VhMGM4NzkyNjlhYzIwOTZhZTRmNmExMTdhOUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=ZWQ1YjhhNDU0YWU1ZWJiYjIxYWQ3ODIwZTlhMTY0NTMyNjgwNzQyZWM4YjEyMTUzOTM3MDViNGJjMGZiZTg0MkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=OTcyZGU2Njg5M2JlYjRlYTZmYzUwZDY5YjZmODExMTdmMjFkNDg2OTJiMmE0MWZmYjQ2MzdlMDFlMjdiMDE4ZUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%23D50000&color=%23EF6C00&color=%23D81B60&color=%23D81B60&color=%233F51B5&color=%237986CB&color=%23D50000&color=%237986CB"
          style={{ border: 'solid 1px #777', width: '100%', maxWidth: '800px', height: '400px' }} //Установлена ширина iframe как 100% с максимальной шириной 800px для обеспечения адаптивности. Высота iframe уменьшена до 400px, чтобы она лучше вписывалась на мобильных устройствах.
          // style={{ border: 'solid 1px #777' }}
          // width="800"
          // height="600"
          frameBorder="0"
          scrolling="no"
        ></iframe>

        {/* <Grid> */}
        {/* <Button onClick={CreateEvent}>Создать событие</Button> */}
        {/* <Button onClick={DeleteEvent}>Удалить событие</Button> */}
        {/* <Button onClick={GetMyEvent}>Получить мои события</Button> */}
        {/* </Grid> */}
        
      <Grid alignItems="center" spacing={1}>
        <Button variant="contained" color="primary" onClick={CreateEvent} style={{ marginTop: '16px' }}>Создать событие</Button>
      </Grid>
      <Grid alignItems="center" spacing={1}>
          <Button variant="contained" color="primary" onClick={DeleteEvent} style={{ marginTop: '16px' }}>Удалить событие</Button>
      </Grid>
      <Grid alignItems="center" spacing={1}>
          <Button variant="contained" color="primary" onClick={GetMyEvent} style={{ marginTop: '16px' }}>Получить события</Button>
      </Grid>

    </Grid>
  );
}
