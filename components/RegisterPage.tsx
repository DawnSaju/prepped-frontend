"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthInput, AuthButton } from './AuthComponents';
import { ArrowLeftIcon } from './Icons';
import { account, ID } from '../services/appwrite';

export const RegisterPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
        await account.create(ID.unique(), email, password, name);
        await account.createEmailPasswordSession(email, password);
        const user = await account.get();
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userId', user.$id);
        router.push('/chat');
    } catch (err: any) {
        console.error(err);
        setError(err.message || 'Registration failed');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white dark:bg-[#2a2a2a] relative flex flex-col items-center justify-center font-sans overflow-hidden transition-colors duration-500">
      <div className="fixed top-0 left-0 right-0 h-64 bg-linear-to-b from-white via-white to-transparent dark:from-[#2a2a2a] dark:via-[#2a2a2a] pointer-events-none z-10"></div>

      <button
        onClick={() => router.push('/')}
        className="fixed top-4 left-4 md:top-8 md:left-8 z-50 p-2.5 md:p-3 rounded-full bg-white/80 dark:bg-[#3a3a3a]/80 border border-gray-200/50 dark:border-[#454545] hover:bg-gray-50 dark:hover:bg-[#4a4a4a] transition-colors shadow-sm backdrop-blur-sm"
      >
        <ArrowLeftIcon className="w-4 h-4 md:w-5 md:h-5 text-gray-600 dark:text-gray-300" />
      </button>

      <div className="w-full max-w-md px-4 md:px-6 z-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center mb-8 md:mb-10">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tighter text-gray-900 dark:text-white mb-2">
            Create account
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Design your intelligence today
          </p>
        </div>

        {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm text-center">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-2">
          <AuthInput
            type="text"
            placeholder="Full Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <AuthInput
            type="email"
            placeholder="Email address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <AuthInput
            type="password"
            placeholder="Create Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="pt-6">
            <AuthButton isLoading={isLoading}>
              Create Account
            </AuthButton>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <button
              onClick={() => router.push('/login')}
              className="text-gray-900 dark:text-white font-medium hover:underline focus:outline-none"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 h-32 bg-linear-to-t from-white to-transparent dark:from-[#2a2a2a] pointer-events-none z-10"></div>
    </div>
  );
};