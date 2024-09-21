'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { authClient } from '@/lib/auth/client';
import { userTag } from '@/types/tags';
import { useEffect, useState } from 'react';

export function Notifications(): React.JSX.Element {
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const tags = [
    { id: '8', label: 'Инвест-клуб' },
    { id: '3', label: 'Маркетплейсы' },
    { id: '7', label: 'Спорт-клуб' },
    { id: '1', label: 'Читай-клуб' },
    { id: '5', label: 'Благотворительность' },
    { id: '2', label: 'Английский разговорный клуб' },
    { id: '6', label: 'Производство' },
    { id: '4', label: 'Родительский совет' },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await authClient.getUser();
      if (data) {
        setUserId(data.id);
        if (data.tags && Array.isArray(data.tags)) {
          const userTagIds = data.tags.map((tag: { id: string | number }) => String(tag.id));
          setSelectedTags(userTagIds);
        }
      }
    };

    fetchUser();
  }, []);

  const handleCheckboxChange = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const eventData: userTag = {
      tagId: selectedTags.map(id => parseInt(id, 10)),
    };

    const { data, error } = await authClient.saveTags(eventData);
    if (error) {
      console.error('Ошибка при сохранении тегов:', error);
      setMessage('Ошибка при сохранении тегов.'); 
    } else {
      console.log('Теги успешно сохранены:', data);
      setMessage('Теги успешно сохранены!'); 
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader title="Выбор мероприятий" />
        <Divider />
        <CardContent>
          <Grid container spacing={6} wrap="wrap">
            {/* Первая колонка */}
            <Grid md={4} sm={6} xs={12}>
              <Stack spacing={1}>
                <Typography variant="h6">Направления развития</Typography>
                <FormGroup>
                  {tags.slice(0, 4).map(tag => (
                    <FormControlLabel
                      key={tag.id}
                      control={
                        <Checkbox
                          checked={selectedTags.includes(tag.id)}
                          onChange={() => handleCheckboxChange(tag.id)}
                        />
                      }
                      label={tag.label}
                    />
                  ))}
                </FormGroup>
              </Stack>
            </Grid>

            {/* Вторая колонка */}
            <Grid md={4} sm={6} xs={12}>
              <Stack spacing={1} sx={{ marginTop: { xs: '0', md: '2.5rem' } }}>
                <FormGroup>
                  {tags.slice(4).map(tag => (
                    <FormControlLabel
                      key={tag.id}
                      control={
                        <Checkbox
                          checked={selectedTags.includes(tag.id)}
                          onChange={() => handleCheckboxChange(tag.id)}
                        />
                      }
                      label={tag.label}
                    />
                  ))}
                </FormGroup>
              </Stack>
            </Grid>
          </Grid>
          {message && (
            <Typography variant="body1" sx={{ marginTop: 2, color: 'green' }}>
              {message}
            </Typography>
          )}
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" type="submit" sx={{ backgroundColor: '#1b3a69', '&:hover': { backgroundColor: '#0f1e3c' } }}>Сохранить</Button>
        </CardActions>
      </Card>
    </form>
  );
}
