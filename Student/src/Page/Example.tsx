// Install necessary dependencies before starting:
// npm install react-hook-form zod supabase @supabase/supabase-js tailwindcss postcss autoprefixer
// Set up TailwindCSS according to the documentation.
import { supabase } from '../supabaseClient';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const LoginExample: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    const { email } = data;

    if (email.endsWith('@InuCls.com')) {
      // Redirect to Change Email and Password page
      window.location.href = '/change-credentials';
    } else {
      // Send verification email via Supabase
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) {
        alert('Error sending verification email: ' + error.message);
      } else {
        // Redirect to Verify Email page
        window.location.href = '/verify-email';
      }
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'dark bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-900 shadow-md rounded-md">
        <button
          className="absolute top-4 right-4 text-sm text-blue-500"
          onClick={() => setDarkMode(!darkMode)}
        >
          Toggle {darkMode ? 'Light' : 'Dark'} Mode
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <input
              id="email"
              type="email"
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              {...register('email')}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
            <input
              id="password"
              type="password"
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              {...register('password')}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Don't have an account? <a href="/register" className="text-blue-500">Register</a>
        </p>
      </div>
    </div>
  );
};

export default LoginExample;

// Additional Components (Change Email, Verify Email, etc.)
// Create separate pages/components for '/change-credentials', '/verify-email', and '/dashboard' with similar structure and styles.
