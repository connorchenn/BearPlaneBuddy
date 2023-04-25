import { Providers } from 'Providers';
import Create from 'pages/Create/Create';
import Groups from 'pages/Groups/Groups';
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
  {
    path: '/groups/:id',
    element: <Groups />,
  },
]);

export const App = () => (
  <Providers>
    <RouterProvider router={router} />
  </Providers>
);
