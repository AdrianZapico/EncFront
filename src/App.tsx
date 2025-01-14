import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ContactProvider } from './context/ContactContext';
import AppRoutes from './routes.tsx';
import './styles/global.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ContactProvider>
          <AppRoutes />
        </ContactProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
