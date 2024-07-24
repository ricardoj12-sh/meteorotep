// Importa extend-expect desde @testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';

// Importa render y screen desde testing-library/react
import { render, screen } from '@testing-library/react';
// Importa tu componente App
import App from './App';

// Describe tu prueba
test('renders App component', () => {
  // Renderiza el componente App
  render(<App />);
  
  // Busca un elemento específico que esperas encontrar en tu componente App
  const appElement = screen.getByText('Welcome to My Weather App');
  
  // Verifica que el elemento encontrado esté en el documento
  expect(appElement).toBeInTheDocument();
});
