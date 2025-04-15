
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

// Import CSS after React imports to ensure proper loading order
import './index.css'

// Improve error handling and logging
try {
  console.log("Initializing application...");
  
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    console.error("Failed to find the root element");
  } else {
    console.log("Root element found, creating React root");
    const root = createRoot(rootElement);
    
    console.log("Rendering application");
    root.render(<App />);
    console.log("Application rendered successfully");
  }
} catch (error) {
  console.error("Critical error rendering application:", error);
}
