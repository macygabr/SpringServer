import React, { useState } from 'react';
import { authClient } from '@/lib/auth/client';
import { Modal, Box, Typography, TextField, Button, Stack, Select, MenuItem } from '@mui/material';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: () => void; 
  userId: string | null;
  tag: { id: string; name: string }[];
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({ isOpen, onClose, onEventCreated, userId, tag }) => {
  const [title, setTitle] = useState('');
  const [location_address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [timeStart, setTimeStart] = useState('');
  const [timeEnd, setTimeEnd] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const handleCreateEvent = async () => {
    if (!userId || selectedEventId === null) return;
    
    setLoading(true);
    setError(null);

    try {
      const { error } = await authClient.createEvent({
        title,
        description,
        start: timeStart, 
        end: timeEnd, 
        userId,
        location_address,
        tag: selectedEventId 
      });

      if (error) {
        setError('Не удалось создать событие');
      } else {
        onClose();
        onEventCreated();
      }
    } catch (err) {
      setError('Произошла ошибка при создании события');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: 1,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Stack spacing={2}>
          <Typography variant="h6">Создать мероприятие</Typography>
          {error && <Typography color="error">{error}</Typography>}
          <TextField
            label="Заголовок"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />
          <TextField
            label="Описание"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
          />
          <TextField
            label="Локация"
            value={location_address}
            onChange={(e) => setAddress(e.target.value)}
            fullWidth
          />
          <TextField
            label="Время начала"
            type="datetime-local"
            value={timeStart}
            onChange={(e) => setTimeStart(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Время окончания"
            type="datetime-local"
            value={timeEnd}
            onChange={(e) => setTimeEnd(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <Select
            label="Выберите событие"
            value={selectedEventId || ''}
            onChange={(e) => setSelectedEventId(e.target.value)} 
            fullWidth
          >
            {tag.map((tag) => (
              <MenuItem key={tag.id} value={tag.id}>
                {tag.name}
              </MenuItem>
            ))}
          </Select>
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button variant="contained" onClick={handleCreateEvent} disabled={loading}>
              Создать
            </Button>
            <Button variant="outlined" onClick={onClose}>
              Отмена
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

export default CreateEventModal;