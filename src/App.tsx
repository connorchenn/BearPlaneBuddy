import { Providers } from 'Providers';
import Create from 'pages/Create/Create';
import Home from 'pages/Home/Home';
import Login from 'pages/Login/Login';
import Test from 'pages/Test/Test';
import {
  BrowserRouter,
  Route,
  RouterProvider,
  Routes,
  createBrowserRouter,
} from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/create',
    element: <Create />,
  },
  {
    path: '/test',
    element: <Test />,
  },
]);

export const App = () => (
  <Providers>
    <RouterProvider router={router} />
  </Providers>
);

/* 

<Box textAlign='center' fontSize='xl'>
      <Grid minH='100vh' p={3}>
        <ColorModeSwitcher justifySelf='flex-end' />
        <VStack spacing={8}>
          <Logo h='40vmin' pointerEvents='none' />
          <Text>
            Edit <Code fontSize='xl'>src/App.tsx</Code> and save to reload.
          </Text>
          <Link
            color='teal.500'
            href='https://chakra-ui.com'
            fontSize='2xl'
            target='_blank'
            rel='noopener noreferrer'
          >
            Learn Chakra
          </Link>
        </VStack>
      </Grid>
    </Box>

*/
