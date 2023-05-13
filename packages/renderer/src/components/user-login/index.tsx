import {
  Avatar,
  Menu,
  MantineTheme,
  ActionIcon,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';

import { IconLogout } from '@tabler/icons';
import { SignOut } from '/@/authentication';
import { useUser } from '/@/context/user';

const getInitials = (str: string, photoURL: string) => {
  if (photoURL) {
    return str
      .split(' ')
      .slice(0, 2)
      .map((word) => word[0])
      .join('');
  }
};

export function UserLogin() {
  const user = useUser();
  const navigate = useNavigate()

  const handleLogout = async () => {
    await SignOut();
    if (user.ResetUser) {
      user.ResetUser();
    }
    navigate('/login');
  };

  return (
    <>
      <Menu
        width={260}
        position="right-end"
        transition="pop-top-right"
      >
        <Menu.Target>
          <ActionIcon
            size="xl"
            sx={(theme: MantineTheme) => ({
              backgroundColor:
                theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
            })}
          >
            <Avatar src={user.photoURL} alt={user.displayName} radius="xl" size={32}>
              {getInitials(user.displayName || '', user.photoURL || '')}
            </Avatar>
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          {/* <Menu.Item onClick={() => navigate('/setting')} icon={<IconSettings size={14} stroke={1.5} />}>
            Setting
          </Menu.Item> */}
          <Menu.Item onClick={handleLogout} icon={<IconLogout size={14} stroke={1.5} />}>
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu >
    </>
  );
}
