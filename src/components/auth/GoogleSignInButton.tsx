
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

// Assuming you have a Google G icon SVG or component
// If not, we can use a placeholder or find one
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.6402 9.18164C17.6402 8.54523 17.5818 7.94508 17.483 7.3634H9V10.8179H13.8438C13.6364 11.9725 13.0002 12.9225 12.0456 13.564V15.8199H14.9562C16.6589 14.2525 17.6402 11.9453 17.6402 9.18164Z" fill="#4285F4"/>
      <path d="M9.00009 18C11.4301 18 13.4676 17.1941 14.9563 15.8199L12.0457 13.564C11.2426 14.1014 10.211 14.4203 9.00009 14.4203C6.65598 14.4203 4.67168 12.837 3.96418 10.71H0.957153V13.0418C2.43826 15.9832 5.48168 18 9.00009 18Z" fill="#34A853"/>
      <path d="M3.96413 10.71H0.957103C0.690853 10.1153 0.532903 9.464 0.532903 8.79C0.532903 8.11604 0.690853 7.46477 0.957103 6.87H3.96413C4.14788 7.36477 4.24995 7.89418 4.24995 8.445C4.24995 8.99576 4.14788 9.52523 3.96413 10.71Z" fill="#FBBC05"/>
      <path d="M9.00009 3.57984C10.321 3.57984 11.5078 4.03391 12.4794 4.95805L15.0219 2.48195C13.4633 0.999844 11.4258 0 9.00009 0C5.48168 0 2.43826 2.0168 0.957153 4.95816L3.96418 7.29C4.67168 5.163 6.65598 3.57984 9.00009 3.57984Z" fill="#EA4335"/>
  </svg>
);

interface GoogleSignInButtonProps {
  onClick: () => void;
  loading?: boolean;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ onClick, loading = false }) => {
  return (
    <Button
      variant="outline"
      className="w-full bg-white border border-[#E0E0E0] rounded-full py-6 text-gray-700 hover:bg-gray-50 shadow-sm"
      onClick={onClick}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <GoogleIcon />
      )}
      <span className="ml-2">Continue with Google</span>
    </Button>
  );
};

export default GoogleSignInButton; 
