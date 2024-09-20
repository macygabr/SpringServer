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

export function Notifications(): React.JSX.Element {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
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
                <FormControlLabel control={<Checkbox defaultChecked />} label="Инвест-клуб" />
                <FormControlLabel control={<Checkbox />} label="Маркетплейсы" />
                <FormControlLabel control={<Checkbox />} label="Спорт-клуб" />
                <FormControlLabel control={<Checkbox />} label="Читай-клуб" />
              </FormGroup>
            </Stack>
          </Grid>
          
          {/* Вторая колонка */}
          <Grid md={4} sm={6} xs={12}>
            <Stack spacing={1} sx={{ marginTop: { xs: '0', md: '2.5rem' } }}> {/* Настройка отступа сверху для выравнивания */}
              <FormGroup>
                <FormControlLabel control={<Checkbox />} label="Благотворительность" />
                <FormControlLabel control={<Checkbox />} label="Английский разговорный клуб" />
                <FormControlLabel control={<Checkbox />} label="Производство" />
                <FormControlLabel control={<Checkbox />} label="Родительский совет" />
              </FormGroup>
            </Stack>
          </Grid>
        </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained">Сохранить</Button>
        </CardActions>
      </Card>
    </form>
  );
}
