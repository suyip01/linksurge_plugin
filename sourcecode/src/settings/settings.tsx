import { createRoot } from 'react-dom/client';
import SettingsApp from './SettingsApp';
import '../index.css';

const container = document.getElementById('settings-root');
if (container) {
  const root = createRoot(container);
  root.render(<SettingsApp />);
} else {
  console.error('Settings root element not found');
}