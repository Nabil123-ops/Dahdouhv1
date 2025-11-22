"use client";

import { signIn } from "next-auth/react";
// 💡 Assuming you use a library like react-icons for the Google icon
import { FcGoogle } from "react-icons/fc"; 

export default function SignInPage() {
  return (
    // 1. Full screen container with background color
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--dahdouh-light)] dark:bg-[#0b0c10] transition-colors duration-300">
      
      {/* 2. Professional Sign-In Card */}
      <div className="w-full max-w-sm p-8 space-y-8 bg-white dark:bg-gray-800 shadow-2xl rounded-2xl border border-gray-100 dark:border-gray-700">
        
        {/* 3. Header and Branding */}
        <div className="text-center">
          {/* Use your logo/icon here */}
          <h1 className="text-4xl font-extrabold text-[var(--dahdouh-dark)] dark:text-white">
            Dahdouh AI
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Sign in to access your chat history and models.
          </p>
        </div>

        {/* 4. Google Sign-In Button (Primary Action) */}
        <button
          onClick={() => signIn("google")}
          className="w-full flex items-center justify-center gap-3 
                     px-6 py-3 font-semibold text-lg border-2 border-gray-200 
                     rounded-xl shadow-md transition duration-200 ease-in-out
                     bg-white text-gray-700 
                     hover:shadow-lg hover:bg-gray-50 
                     focus:outline-none focus:ring-2 focus:ring-[var(--dahdouh-primary)] focus:ring-offset-2
                     dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
        >
          <FcGoogle className="text-2xl" />
          Continue with Google
        </button>
        
        {/* 5. Footer/Contextual Link (Optional) */}
        <p className="text-center text-sm text-gray-400 dark:text-gray-500">
          By signing in, you agree to our <a href="/terms" className="underline hover:text-[var(--dahdouh-primary)]">Terms of Service</a>.
        </p>
      </div>
    </div>
  );
        }
        
