"use client";

import * as React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import { authClient } from '@/lib/auth/client';
import { Event } from '@/types/event'; 
import { config } from '@/config';

export default function Page(): React.JSX.Element {
  const [calendarSrcList, setCalendarSrcList] = React.useState<string[] | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  React.useEffect(() => {
    document.title = `Events | Dashboard | ${config.site.name}`;
  }, []);

  React.useEffect(() => {
    const fetchCalendarSrc = async () => {
      try {
        const { data, error } = await authClient.getCalendar();
        if (error) {
          console.error(error);
          return;
        }
        console.log(data);
        // data to сalendar
        // const сalendar = [
        //   "NDUwNTEwOTk1YjkxZDFjZGQ2ZTY1M2Y0YWM0YzJkOGFkOTk0NDNmZTdjNjg2ZjlkMTFiZWVkMWQzYTM1MTY3MkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t",
        //   "M2JlYWYxODNjMmM4NDNjOWFiMTQ3ZDNlZDE0YmE0ZmQ2NTI0ODBiYjE2NjFiYzI5NDcxNzM4Y2U0ZWYxMjZmMkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t",
        //   "ZWU5NDkzZDE1YmNlODZhNzI5ZWQyODYxMjUzZTExZDY4MmFlNmQ5OWU3NWVjZjRkOWQwMzVmOWQ0YWJjMDUxMEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t",
        //   "YjM4YWNhYzU4Y2JhMTkxMGU0OWRhM2E5NGVkYWFjZDJlMDY0YTkyN2YzNTE0MTI2NDUzNGRmMzk3NTA1OTMzN0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t",
        //   "NTQxYmZlZWUwMmNlMTdlMDE1ZDY0N2IxMjI4YTg0YWQ0M2FhODVhZTg1NTMxMzljZTk5NzI0YTliMjg4MjY0ZkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t",
        //   "NGEyYjY5YTU4NjE5OWIwZGEwMjJhZTk2NmM0ZGUyZDVhN2I1M2VhMGM4NzkyNjlhYzIwOTZhZTRmNmExMTdhOUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t",
        //   "ZWQ1YjhhNDU0YWU1ZWJiYjIxYWQ3ODIwZTlhMTY0NTMyNjgwNzQyZWM4YjEyMTUzOTM3MDViNGJjMGZiZTg0MkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t",
        //   "OTcyZGU2Njg5M2JlYjRlYTZmYzUwZDY5YjZmODExMTdmMjFkNDg2OTJiMmE0MWZmYjQ2MzdlMDFlMjdiMDE4ZUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t"
        // ];
        setCalendarSrcList(data);
      } catch (err) {
        console.error('Ошибка получения календарей:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarSrc();
  }, []);

  const CreateEvent = async () => {
    const eventData: Event = {
      tag: '1',
      title: 'Новое событие',
      description: 'Это описание нового события.',
      location_address: "ул. Примерная, д. 12, Москва",
      start: new Date().toISOString(),
      end: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(),
      userId: '1'
    };

    const { data, error } = await authClient.createEvent(eventData);

    if (error) {
      console.error(error);
    }
  };

  const DeleteEvent = async () => {
    // const { data, error } = await authClient.deleteEvent({
    //   eventId: "bGY0bXBmb2I3bG1zZmlwZWdmdTI4bWlqMGsgYjM4YWNhYzU4Y2JhMTkxMGU0OWRhM2E5NGVkYWFjZDJlMDY0YTkyN2YzNTE0MTI2NDUzNGRmMzk3NTA1OTMzN0Bn"
    // });
  
    // if (error) {
    //   console.error(error);
    // }
  };

  const GetMyEvent = async () => {
    const { data, error } = await authClient.getMyEvent();
    console.log(data);
    if (error) {
      console.error(error);
    }
  };

  const buildCalendarIframeSrc = (): string => {
    const baseSrc = "https://calendar.google.com/calendar/u/0/embed?"+
    "wkst=1&ctz=Asia/Novosibirsk&"+
    "mode=WEEK&"+
    "showTitle=0&"+
    "showPrint=0&"+
    "showTz=0&"+
    "bgcolor=%233F51B5";
    if (calendarSrcList) {
      const srcParams = calendarSrcList.map(src => `&src=${src}`).join('');
      return `${baseSrc}${srcParams}`;
    }
    return baseSrc; // По умолчанию пустой iframe.
  };

  return (
    <Grid container direction="column" alignItems="center" spacing={2}>
        <iframe
          src={buildCalendarIframeSrc()}
          style={{
            width: '100%',
            maxWidth: '100%',
            height: '600pt',
            maxHeight: '100%'
          }} //Установлена ширина iframe как 100% с максимальной шириной 800px для обеспечения адаптивности. Высота iframe уменьшена до 400px, чтобы она лучше вписывалась на мобильных устройствах.
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
        
    </Grid>
  );
}
