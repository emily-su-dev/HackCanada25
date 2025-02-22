'use client';

import { FC } from 'react';
import { signIn } from 'next-auth/react';

export const AuthenticateButton: FC = () => {
  const handleGoogleSignIn = async () => {
    await signIn('google');
  };

  return (
    <div className="relative overflow-hidden ">
      <button
        className="w-full flex items-center justify-center gap-2"
        onClick={handleGoogleSignIn}
      >
        <span>Login with Google</span>
      </button>
    </div>
  );
};
