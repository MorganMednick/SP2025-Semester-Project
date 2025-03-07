import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Shell from './components/layout/AppShell';
import NotFound from './pages/NotFound';
import Providers from './context/providers';
import SearchResults from './pages/SearchResults';
import EventDetails from './pages/EventDetails';
import Watchlist from './pages/Watchlist';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Shell />,
    children: [
      { path: '', element: <Home /> },
      { path: '*', element: <NotFound /> },
      { path: 'watchlist', element: <Watchlist /> },
      { path: 'search/:q', element: <SearchResults /> },
      { path: '/events/:name', element: <EventDetails /> },
      { path: '/events/:name/:id', element: <EventDetails /> },
    ],
  },
]);

function App() {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  );
}

export default App;
