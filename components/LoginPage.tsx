"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthInput, AuthButton } from './AuthComponents';
import { ArrowLeftIcon } from './Icons';
import { account } from '../services/appwrite';

export const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
        await account.createEmailPasswordSession(email, password);
        const user = await account.get();
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userId', user.$id);
        router.push('/dashboard');
    } catch (err: any) {
        console.error(err);
        setError(err.message || 'Login failed');
    } finally {
        setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    try {
        account.createOAuth2Session(
            'google',
            `${window.location.origin}/dashboard`,
            `${window.location.origin}/login`
        );
    } catch (err: any) {
        console.error(err);
        setError(err.message || 'Google login failed');
    }
  };

  return (
    <div className="min-h-screen w-full bg-white dark:bg-[#2a2a2a] relative flex flex-col items-center justify-center font-sans overflow-hidden transition-colors duration-500">
      <div className="fixed top-0 left-0 right-0 h-64 bg-linear-to-b from-white via-white to-transparent dark:from-[#2a2a2a] dark:via-[#2a2a2a] pointer-events-none z-10"></div>

      <button
        onClick={() => router.push('/')}
        className="fixed top-8 left-8 z-50 p-3 rounded-full bg-white/80 dark:bg-[#3a3a3a]/80 border border-gray-200/50 dark:border-[#454545] hover:bg-gray-50 dark:hover:bg-[#4a4a4a] transition-colors shadow-sm backdrop-blur-sm"
      >
        <ArrowLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </button>

      <div className="w-full max-w-md px-6 z-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-semibold tracking-tighter text-gray-900 dark:text-white mb-2">
            Welcome back
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Sign in to continue your session
          </p>
        </div>

        {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm text-center">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-2">
          <AuthInput
            type="email"
            placeholder="Email address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <AuthInput
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="pt-6 space-y-4">
            <AuthButton isLoading={isLoading}>
              Sign In
            </AuthButton>
            
            <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                <div className="relative bg-white dark:bg-[#2a2a2a] px-4 text-sm text-gray-500">Or continue with</div>
            </div>

            <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full h-16 rounded-full bg-white dark:bg-[#333] text-gray-700 dark:text-white font-medium text-lg flex items-center justify-center border border-gray-200 dark:border-[#454545] transition-all duration-300 hover:bg-gray-50 dark:hover:bg-[#3a3a3a] active:scale-[0.99] shadow-sm"
            >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                    />
                    <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                    />
                    <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                    />
                    <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                    />
                </svg>
                Google
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Don't have an account?{' '}
            <button
              onClick={() => router.push('/register')}
              className="text-gray-900 dark:text-white font-medium hover:underline focus:outline-none"
            >
              Join now
            </button>
          </p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 h-32 bg-linear-to-t from-white to-transparent dark:from-[#2a2a2a] pointer-events-none z-10"></div>
    </div>
  );
};