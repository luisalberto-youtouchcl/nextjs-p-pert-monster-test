"use client";

import React, { useEffect, useState } from "react";

/**
 * [Unverified] This page helps verify if NEXT_PUBLIC_ variables
 * were correctly inlined at build time.
 */
export default function DebugEnvPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const publicVars = {
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  };

  if (!mounted) return <div className='p-8'>Loading diagnostic...</div>;

  return (
    <div className='p-8 font-sans bg-gray-50 min-h-screen'>
      <h1 className='text-2xl font-bold mb-6 text-gray-800'>
        Environment Variable Diagnostic
      </h1>

      <div className='bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6'>
        <h2 className='text-lg font-semibold mb-4 text-blue-600'>
          Client-Side (Inlined) Variables
        </h2>
        <p className='text-sm text-gray-600 mb-4'>
          [Inference] These values must be present in the browser. If they are
          undefined here, the build-args were likely missing during the Docker
          build phase.
        </p>
        <table className='w-full text-left border-collapse'>
          <thead>
            <tr className='border-b'>
              <th className='py-2'>Variable</th>
              <th className='py-2'>Value</th>
              <th className='py-2'>Status</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(publicVars).map(([key, value]) => (
              <tr key={key} className='border-b'>
                <td className='py-2 font-mono text-sm'>{key}</td>
                <td className='py-2 font-mono text-sm text-green-700'>
                  {value || <span className='text-red-500'>undefined</span>}
                </td>
                <td className='py-2 text-sm'>
                  {value ? "✅ Found" : "❌ Missing"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='bg-yellow-50 p-4 rounded-lg border border-yellow-200'>
        <h3 className='font-bold text-yellow-800 mb-2'>
          Troubleshooting Checklist:
        </h3>
        <ul className='list-disc ml-5 text-sm text-yellow-900 space-y-1'>
          <li>
            Check that{" "}
            <code>--build-arg NEXT_PUBLIC_TURNSTILE_SITE_KEY=...</code> was
            passed to <code>gcloud builds submit</code>.
          </li>
          <li>
            Ensure the variable is defined in the Dockerfile{" "}
            <code>builder</code> stage using both <code>ARG</code> and{" "}
            <code>ENV</code>.
          </li>
          <li>
            Verify that the domain{" "}
            <code>
              {typeof window !== "undefined"
                ? window.location.hostname
                : "your-domain"}
            </code>{" "}
            is added to the Cloudflare Turnstile dashboard.
          </li>
          <li>
            [Inference] If you are using the &quot;Always Pass&quot; test key
            (1x000...), the widget might be invisible or load very fast.
          </li>
        </ul>
      </div>
    </div>
  );
}
