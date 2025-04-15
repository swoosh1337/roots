
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface GoogleSignInButtonProps {
  onClick: () => void;
  loading?: boolean;
}

const GoogleSignInButton = ({ onClick, loading = false }: GoogleSignInButtonProps) => {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      disabled={loading}
      className="w-full py-6 bg-white border border-[#E0E0E0] text-foreground hover:bg-gray-50 rounded-full flex items-center justify-center gap-2"
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 20 20" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M18.1711 8.36788H17.5V8.33329H10V11.6666H14.6906C14.0006 13.6916 12.1623 15.0666 10 15.0666C7.23875 15.0666 5 12.8279 5 10.0666C5 7.30538 7.23875 5.06663 10 5.06663C11.2746 5.06663 12.4342 5.56288 13.3171 6.37788L15.6742 4.02079C14.1844 2.61788 12.2167 1.73329 10 1.73329C5.39792 1.73329 1.66667 5.46454 1.66667 10.0666C1.66667 14.6688 5.39792 18.4 10 18.4C14.6021 18.4 18.3333 14.6688 18.3333 10.0666C18.3333 9.47913 18.2771 8.91163 18.1711 8.36788Z" fill="#FFC107"/>
          <path d="M2.62917 6.15414L5.36583 8.17081C6.10583 6.36665 7.90167 5.06665 10 5.06665C11.2746 5.06665 12.4342 5.5629 13.3171 6.3779L15.6742 4.02081C14.1844 2.6179 12.2167 1.73331 10 1.73331C6.79833 1.73331 4.02667 3.55831 2.62917 6.15414Z" fill="#FF3D00"/>
          <path d="M10 18.4C12.1658 18.4 14.0917 17.5504 15.5683 16.2008L13.0067 13.9875C12.1591 14.6358 11.1025 15.0667 10 15.0667C7.8525 15.0667 6.0275 13.7108 5.32917 11.7058L2.6375 13.8383C4.0175 16.505 6.82083 18.4 10 18.4Z" fill="#4CAF50"/>
          <path d="M18.1713 8.36794H17.5V8.33335H10V11.6667H14.6906C14.3688 12.6217 13.7406 13.448 12.9087 14.0259L12.91 14.025L15.5713 16.238C15.4105 16.3855 18.3333 14.1667 18.3333 10.0667C18.3333 9.47919 18.2773 8.91169 18.1713 8.36794Z" fill="#1976D2"/>
        </svg>
      )}
      <span className="ml-2">Continue with Google</span>
    </Button>
  );
};

export default GoogleSignInButton;
