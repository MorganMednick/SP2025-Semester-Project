import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Shell from './components/layout/AppShell';
import NotFound from './pages/NotFound';
import Providers from './context/providers';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Shell />,
    children: [
      { path: '', element: <Home /> },
      { path: '*', element: <NotFound /> },
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
