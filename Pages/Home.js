import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the Shop page immediately on load
    navigate(createPageUrl('Shop'), { replace: true });
  }, [navigate]);

  // Display a loading indicator while redirecting
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-500">
      <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      <p className="mt-4 text-lg">Loading the merch store...</p>
    </div>
  );
}