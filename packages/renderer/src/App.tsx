import { useState } from 'react'

import { RouterProvider } from 'react-router-dom'
import { MantineProvider, ColorScheme, ColorSchemeProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';

import ROUTER from './routes';

export default function AppContainer() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('dark');

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
  };

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
        <ModalsProvider>
          <RouterProvider router={ROUTER} />
        </ModalsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  )
}
