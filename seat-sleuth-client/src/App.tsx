import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Shell from './components/layout/AppShell';
import NotFound from './pages/NotFound';
import Providers from './context/providers';
import SearchResults from './pages/SearchResults';
import EventDetails from './pages/EventDetails';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Shell />,
    children: [
      { path: '', element: <Home /> },
      { path: '*', element: <NotFound /> },
      { path: 'watchlist', element: <></> },
      { path: 'search/:q', element: <SearchResults /> },
      { path: '/events/:id', element: <EventDetails /> },
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
