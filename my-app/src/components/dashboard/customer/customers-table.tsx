'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { authClient } from '@/lib/auth/client';
import { paths } from '@/paths';
import { useSelection } from '@/hooks/use-selection';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

function noop(): void {
  // do nothing
}

export interface Tag {
  id: string;
  name: string;
}

export interface CustomEvent { 
  id: string;
  eventId: string;
  title: string;
  description: string;
  start: string;
  end: string;
  organizer: {
      id: string;
      firstName: string;
      lastName: string;
      avatar: string;
  };
  tag: Tag;
  createdAt: Date;
}

interface EventsTableProps {
  count?: number;
  page?: number;
  rows?: CustomEvent[];
  rowsPerPage?: number;
  onSelectionChange?: (selected: Set<string>) => void; 
}

export function EventsTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 0,
  onSelectionChange, 
}: EventsTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => rows.map(event => event.id), [rows]);
  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const router = useRouter();

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selected);
    }
  }, [selected, onSelectionChange]);

  useEffect(() => {
    async function fetchEvent() {
      setLoading(true);
      const { data, error } = await authClient.getMyEvent();

      if (error) {
        setUploadError('Failed to fetch events');
        setLoading(false);
        router.push(paths.errors.notFound);
        return;
      }

      if (data) {
        // Обработка данных
      } else {
        setUploadError('Events data is invalid');
        router.push(paths.errors.notFound);
      }

      setLoading(false);
    }

    fetchEvent();
  }, [router]);

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={(event) => {
                    if (event.target.checked) {
                      selectAll();
                    } else {
                      deselectAll();
                    }
                  }}
                />
              </TableCell>
              <TableCell>Организатор</TableCell>
              <TableCell>Название</TableCell>
              <TableCell>Описание</TableCell>
              <TableCell>Количество подписавшихся</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const isSelected = selected?.has(row.id);

              return (
                <TableRow hover key={row.id} selected={isSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={(event) => {
                        if (event.target.checked) {
                          selectOne(row.id);
                        } else {
                          deselectOne(row.id);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                      <Avatar src={row.organizer.avatar} />
                      <Typography variant="subtitle2">{row.organizer.firstName} {row.organizer.lastName}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{row.title}</TableCell>
                  <TableCell>{row.description}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={count}
        onPageChange={noop}
        onRowsPerPageChange={noop}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
}
