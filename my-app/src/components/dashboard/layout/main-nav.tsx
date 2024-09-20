'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { Bell as BellIcon } from '@phosphor-icons/react/dist/ssr/Bell';
import { List as ListIcon } from '@phosphor-icons/react/dist/ssr/List';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth/client';
import { User } from '@/types/user';
import { useRouter } from 'next/navigation'; 
import { paths } from '@/paths';

import { usePopover } from '@/hooks/use-popover';

import { MobileNav } from './mobile-nav';
import { UserPopover } from './user-popover';

export function MainNav(): React.JSX.Element {
  const [openNav, setOpenNav] = React.useState<boolean>(false);

  const userPopover = usePopover<HTMLDivElement>();
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [user, setUser] = React.useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      const { data, error } = await authClient.getUser();
  
      if (error || !data) {
        setUploadError('Failed to fetch user data');
        router.push(paths.errors.notFound); 
        return;
      }
  
      setUser(data as User);
    }
  
    fetchUser();
  }, [router]);

  return (
    <React.Fragment>
      <Box
        component="header"
        sx={{
          borderBottom: '1px solid var(--mui-palette-divider)',
          backgroundColor: 'var(--mui-palette-background-paper)',
          position: 'sticky',
          top: 0,
          zIndex: 'var(--mui-zIndex-appBar)',
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: 'center', justifyContent: 'space-between', minHeight: '64px', px: 2 }}
        >
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            <IconButton
              onClick={(): void => {
                setOpenNav(true);
              }}
              sx={{ display: { lg: 'none' } }}
            >
              <ListIcon />
            </IconButton>
          </Stack>
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            <Tooltip title="Notifications">
              <Badge badgeContent={4} color="success" variant="dot">
                <IconButton>
                  <BellIcon />
                </IconButton>
              </Badge>
            </Tooltip>
            <Avatar
              onClick={userPopover.handleOpen}
              ref={userPopover.anchorRef}
              src={user?.avatar || ''}
              sx={{ cursor: 'pointer' }}
            />
          </Stack>
        </Stack>
      </Box>
      {uploadError && (
        <Typography color="error" variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
          {uploadError}
        </Typography>
      )}
      <UserPopover anchorEl={userPopover.anchorRef.current} onClose={userPopover.handleClose} open={userPopover.open} />
      <MobileNav
        onClose={() => {
          setOpenNav(false);
        }}
        open={openNav}
      />
    </React.Fragment>
  );
}
