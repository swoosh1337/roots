
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

// Import CSS after React imports to ensure proper loading order
import './index.css'

try {
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    console.error("Failed to find the root element");
  } else {
    const root = createRoot(rootElement);
    root.render(<App />);
  }
} catch (error) {
  console.error("Error rendering application:", error);
}
