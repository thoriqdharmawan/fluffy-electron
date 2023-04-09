import 'react-loading-skeleton/dist/skeleton.css'
import { useState } from 'react'
import { SkeletonTheme } from 'react-loading-skeleton';
import { RouterProvider } from 'react-router-dom'
import { MantineProvider, ColorScheme, ColorSchemeProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { CartProvider } from 'react-use-cart';
import { UserProvider } from './context/user'
import ROUTER from './routes';
import AuthStateChangeProvider from '/@/context/Auth';
import { NotificationsProvider } from '@mantine/notifications';

export default function AppContainer() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('dark');

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
  };

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <SkeletonTheme baseColor={colorScheme === 'dark' ? "#25262b" : '#ebebeb'} highlightColor={colorScheme === 'dark' ? "#1A1B1E" : '#f5f5f5'}>
        <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
          <NotificationsProvider>
            <ModalsProvider>
              <UserProvider>
                <AuthStateChangeProvider>
                  <CartProvider>
                    <RouterProvider router={ROUTER} />
                  </CartProvider>
                </AuthStateChangeProvider>
              </UserProvider>
            </ModalsProvider>
          </NotificationsProvider>
        </MantineProvider>
      </SkeletonTheme>
    </ColorSchemeProvider>
  )
}
