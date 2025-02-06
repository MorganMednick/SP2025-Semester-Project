import '@mantine/core/styles.css';
import { MantineProvider, createTheme } from '@mantine/core';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Shell from './components/layout/AppShell';
import NotFound from './pages/NotFound';
import TicketPage from './pages/TicketPage';


const router = createBrowserRouter([
  {
    path: '/',
    element: <Shell />,
    children: [
      { path: '', element: <Home /> },
      { path: '*', element: <NotFound /> },
      { path: 'tickets', element: <TicketPage /> },

    ],
  },
]);

const theme = createTheme({
  primaryColor: 'green',
  primaryShade: 7,
  colors: {
    'green': [
      "#ebfaf0",
      "#ddf0e3",
      "#bddec7",
      "#9acba9",
      "#7cbb8f",
      "#68b17e",
      "#5dac75",
      "#4c9763",
      "#418657",
      "#327448"
    ]
  },
  fontFamily: "'Source Sans 3'",
  fontSizes: {
    xs: '16',
    sm: '20',
    md: '24',
    lg: '28',
    xl: '32'
  },
  headings: {
    sizes: {
      h1: {
        fontWeight: '700',
        fontSize: '48',
      },
      h2: { 
        fontSize: '32', 
        fontWeight: '700',
       },
      h3: { 
        fontSize: '32',
       },
    },
  }
  
});

function App() {
  return <MantineProvider theme={theme}><RouterProvider router={router} /></MantineProvider>;
}

export default App;
