import React from 'react';

interface PageSkeletonProps {
  layout?: 'dashboard' | 'table' | 'grid';
}

export const PageSkeleton: React.FC<PageSkeletonProps> = ({ layout = 'table' }) => {
  if (layout === 'dashboard') {
    return (
      <div className="space-y-12 animate-pulse w-full">
        {/* 2-COLUMN PREMIUM DASHBOARD GRID LAYOUT SKELETON */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column Skeleton */}
          <div className="space-y-6">
            {/* Spotlight Card Skeleton */}
            <div className="bg-slate-900 rounded-[2rem] p-6 min-h-[270px] flex flex-col justify-between">
              <div>
                <div className="h-4 w-32 bg-slate-800 rounded-md" />
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 mt-6 items-center">
                  <div className="sm:col-span-5">
                    <div className="h-16 w-20 bg-slate-800 rounded-lg" />
                    <div className="h-3 w-36 bg-slate-800 rounded mt-3" />
                  </div>
                  <div className="sm:col-span-7 space-y-4">
                    {[...Array(3)].map((_, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between">
                          <div className="h-3 w-16 bg-slate-800 rounded" />
                          <div className="h-3 w-6 bg-slate-800 rounded" />
                        </div>
                        <div className="h-1.5 bg-slate-800 rounded-full w-full" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Active Chapters Card Skeleton */}
            <div className="bg-white rounded-[1.5rem] border border-slate-100 p-5 h-[125px] flex items-center justify-between shadow-sm">
              <div className="flex flex-col justify-between h-full py-0.5 w-2/3">
                <div className="h-3 w-16 bg-slate-150 rounded" />
                <div>
                  <div className="h-6 w-12 bg-slate-200 rounded-md" />
                  <div className="h-3.5 w-36 bg-slate-100 rounded mt-2" />
                </div>
              </div>
              <div className="w-7 h-7 bg-slate-100 rounded-xl" />
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="space-y-6">
            {/* Card H: Awaiting Approvals Skeleton */}
            <div className="bg-rose-50/10 rounded-[1.5rem] border border-rose-200/50 p-5 h-[125px] flex items-center justify-between shadow-sm">
              <div className="flex flex-col justify-between h-full py-0.5 w-2/3">
                <div className="h-3 w-24 bg-rose-200/50 rounded animate-pulse" />
                <div>
                  <div className="h-7 w-12 bg-rose-300/40 rounded-md animate-pulse" />
                  <div className="h-3.5 w-48 bg-rose-100/30 rounded mt-2" />
                </div>
              </div>
              <div className="w-9 h-9 bg-rose-300/40 rounded-xl" />
            </div>

            {/* 4 Square Bento Blocks Skeletons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-[1.5rem] border border-slate-100 p-5 h-[125px] flex flex-col justify-between shadow-sm">
                  <div className="flex justify-between items-center">
                    <div className="h-3 w-16 bg-slate-150 rounded" />
                    <div className="h-6 w-6 bg-slate-50 rounded-lg" />
                  </div>
                  <div>
                    <div className="h-7 w-20 bg-slate-150 rounded" />
                    <div className="h-2.5 w-12 bg-slate-50 rounded mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts Grid Skeleton */}
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 bg-white rounded-[2rem] border border-slate-100 p-8 h-[400px] flex flex-col justify-between shadow-sm">
            <div className="space-y-2">
              <div className="h-6 w-48 bg-slate-150 rounded-md" />
              <div className="h-4 w-72 bg-slate-50/50 rounded-sm" />
            </div>
            <div className="h-60 w-full bg-slate-50 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (layout === 'grid') {
    return (
      <div className="w-full animate-pulse">
        {/* Card Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-[2rem] border border-slate-100 p-3 space-y-4 shadow-sm h-[340px] flex flex-col">
              <div className="w-full h-44 bg-slate-100 rounded-[1.5rem] shrink-0" />
              <div className="flex-1 space-y-3 px-2 pt-2">
                <div className="h-5 w-3/4 bg-slate-200 rounded-md" />
                <div className="h-4 w-1/2 bg-slate-100 rounded-md" />
                <div className="h-3 w-1/3 bg-slate-50 rounded mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // TABLE / LIST SKELETON
  return (
    <div className="w-full space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200/60 hidden md:flex">
        <div className="space-y-3">
          <div className="h-8 w-48 bg-slate-200 rounded-lg" />
          <div className="h-3 w-72 bg-slate-100 rounded-md" />
        </div>
        <div className="h-10 w-32 bg-slate-100 rounded-full" />
      </div>

      {/* Toolbar Skeleton */}
      <div className="flex flex-row gap-3 items-center justify-between">
        <div className="flex-1 h-12 bg-slate-50 rounded-2xl border border-slate-100" />
        <div className="h-12 w-28 bg-slate-50 rounded-full border border-slate-100 shrink-0 hidden sm:block" />
      </div>

      {/* Content Area Skeleton (Table/List) */}
      <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-xl shadow-slate-200/50">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex gap-4 hidden sm:flex">
           <div className="h-4 w-1/4 bg-slate-200 rounded" />
           <div className="h-4 w-1/4 bg-slate-200 rounded" />
           <div className="h-4 w-1/4 bg-slate-200 rounded" />
           <div className="h-4 w-1/4 bg-slate-200 rounded" />
        </div>
        <div className="divide-y divide-slate-100">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-6 flex items-center gap-6">
              <div className="h-10 w-10 bg-slate-100 rounded-xl shrink-0 hidden sm:block" />
              <div className="flex-1 space-y-3">
                <div className="h-4 w-1/3 bg-slate-100 rounded" />
                <div className="h-3 w-1/4 bg-slate-50 rounded" />
              </div>
              <div className="h-8 w-24 bg-slate-100 rounded-full shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
