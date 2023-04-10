import React from 'react'
import 'react-loading-skeleton/dist/skeleton.css'
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { useState } from 'react'
import { SkeletonTheme } from 'react-loading-skeleton';
import { RouterProvider } from 'react-router-dom'
import { MantineProvider, ColorScheme, ColorSchemeProvider, Loader, Center } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { CartProvider } from 'react-use-cart';
import { UserProvider } from './context/user'
import ROUTER from './routes';
import AuthStateChangeProvider from '/@/context/Auth';
import { NotificationsProvider } from '@mantine/notifications';
import dayjs from 'dayjs';
import 'dayjs/locale/id'

const SuspenseWrapper = () => {
  return (
    <React.Suspense
      fallback={
        <Center h="100vh">
          <Loader />
        </Center>
      }
    >
      <RouterProvider router={ROUTER} />
    </React.Suspense>
  )
}

const MemoizedAppRouter = React.memo(SuspenseWrapper)

export default function AppContainer() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('dark');

  dayjs.extend(localizedFormat).locale('id');
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
                    <MemoizedAppRouter />
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
