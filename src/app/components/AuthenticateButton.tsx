'use client';

import { signIn } from 'next-auth/react';
import { FC } from 'react';
import styles from "../Home.module.css";

export const AuthenticateButton: FC = () => {
  const handleGoogleSignIn = async () => {
    await signIn('google');
  };

  return (
    <div className="relative overflow-hidden ">
      <button
        className={styles.google}
        onClick={handleGoogleSignIn}
      >
        <span>Login with Google</span>
      </button>
    </div>
  );
};
