'use client';

import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import { EventsTable, CustomEvent } from '@/components/dashboard/customer/customers-table';
import { useSelection } from '@/hooks/use-selection';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import CreateEventModal from '@/components/dashboard/customer/CreateEventModal';
import { authClient } from '@/lib/auth/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { config } from '@/config';

export default function Page(): React.JSX.Element {
  const [events, setEvents] = useState<CustomEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>(''); 
  const [userStatus, setUserStatus] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSelection, setCurrentSelection] = useState<Set<string>>(new Set());
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const page = 0;
  const rowsPerPage = 5;
  const router = useRouter();

  const rowIds = React.useMemo(() => events.map(event => event.id), [events]);
  const { selected } = useSelection(rowIds); 

  const staticTags = [
    { id: '8', name: 'Инвест-клуб' },
    { id: '3', name: 'Маркетплейсы' },
    { id: '7', name: 'Спорт-клуб' },
    { id: '1', name: 'Читай-клуб' },
    { id: '5', name: 'Благотворительность' },
    { id: '2', name: 'Английский разговорный клуб' },
    { id: '6', name: 'Производство' },
    { id: '4', name: 'Родительский совет' },
  ];

  useEffect(() => {
    document.title = `Events | Dashboard | ${config.site.name}`;
    async function fetchEvents() {
      setLoading(true);
      const { data, error } = await authClient.getMyEvent(); 
      if (error) {
        setError('Не удалось загрузить события');
        setLoading(false);
        return;
      }
      setEvents(data as CustomEvent[] || []); 
      setLoading(false);
    }

    async function fetchUser() {
      const { data, error } = await authClient.getUser();
      if (data) {
        setUserId(data.id);
        setUserStatus(data.status); 
      }
    }

    fetchEvents();
    fetchUser();
  }, []);

  const handleEventCreated = async () => {
    setLoading(true);
    const { data, error } = await authClient.getMyEvent();
    if (data) {
      setEvents(data);
    }
    setLoading(false);
  };

  const handleDeleteClick = async () => {
    const selectedIds = Array.from(currentSelection); 
  
    // Получаем соответствующие eventId
    const selectedEventIds: string[] = selectedIds
      .map(selectedId => {
        const event = events.find(e => e.id === selectedId);
        return event ? event.eventId : null; 
      })
      .filter((eventId): eventId is string => eventId !== null);
  
    if (selectedEventIds.length > 0) {
      const { data, error } = await authClient.deleteEvent(selectedEventIds); 
      if (error) {
        console.error('Ошибка при удалении событий:', error);
      } else {
        setEvents(prevEvents => prevEvents.filter(event => !selectedEventIds.includes(event.eventId))); 
        console.log('События успешно удалены:', data);
      }
    } else {
      console.log('Нет выбранных событий для удаления');
    }
  };
  
  
  
  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">События</Typography>
          {userStatus !== 'GUEST' && (
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Button 
                color="inherit" 
                startIcon={<TrashIcon fontSize="var(--icon-fontSize-md)" />} 
                onClick={() => {
                  setCurrentSelection(new Set(selected));
                  console.log('Кнопка удаления нажата. Выбранные события:', selected);
                  handleDeleteClick();
                }}
              >
                Удалить
              </Button>
            </Stack>
          )}
        </Stack>
        {userStatus !== 'GUEST' && (
          <div>
            <Button
              startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
              variant="contained"
              onClick={openModal}
              sx={{ backgroundColor: '#1b3a69', '&:hover': { backgroundColor: '#0f1e3c' } }}
            >
              Создать
            </Button>
          </div>
        )}
      </Stack>
      {!loading && !error && (
        <EventsTable
          count={events.length}
          page={page}
          rows={events}
          rowsPerPage={rowsPerPage}
          onSelectionChange={(selected) => {
            setCurrentSelection(selected);
            console.log('Изменение выбора в родительском компоненте:', selected);
          }}
        />
      )}
      {loading && <Typography>Загрузка...</Typography>}
      {error && <Typography color="error">{error}</Typography>}
      <CreateEventModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onEventCreated={handleEventCreated}
        userId={userId}
        tag={staticTags} 
      />
    </Stack>
  );
}
