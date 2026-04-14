import { useSettings } from '../context/SettingsContext';

export default function WhatsAppFloat() {
  const { settings } = useSettings();
  
  return (
    <a
      href={`https://wa.me/${settings.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-secondary text-white px-5 py-3 rounded-full shadow-2xl hover:bg-green-600 transition-all duration-300 hover:scale-105 animate-bounce-subtle"
      aria-label="Chat on WhatsApp"
    >
      <img 
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
        alt="WhatsApp" 
        className="w-6 h-6"
      />
      <span className="font-semibold text-sm hidden sm:inline">Chat WhatsApp</span>
    </a>
  );
}
