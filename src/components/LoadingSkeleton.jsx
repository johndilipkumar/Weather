import React from 'react';

export default function LoadingSkeleton() {
  return (
    <div className="w-full min-h-screen px-4 md:px-8 py-6 flex flex-col gap-6 animate-pulse max-w-7xl mx-auto">
      {/* Top Bar Skeleton */}
      <div className="flex items-center justify-between gap-4 w-full">
        {/* Logo placeholder */}
        <div className="h-8 w-28 bg-white/10 rounded-xl" />
        {/* Search bar placeholder */}
        <div className="flex-1 max-w-xl h-12 bg-white/10 rounded-2xl" />
        {/* Settings button placeholder */}
        <div className="w-12 h-12 bg-white/10 rounded-xl" />
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
        {/* Left Column: Current Weather Skeleton */}
        <div className="lg:col-span-4 h-[350px] md:h-[400px] bg-white/5 border border-white/5 rounded-3xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <div className="h-6 w-32 bg-white/10 rounded-lg" />
            <div className="h-8 w-16 bg-white/10 rounded-full" />
          </div>
          <div className="flex justify-between items-center my-6">
            <div className="space-y-3">
              <div className="h-16 w-36 bg-white/10 rounded-2xl" />
              <div className="h-6 w-24 bg-white/10 rounded-lg" />
            </div>
            <div className="w-24 h-24 bg-white/10 rounded-full" />
          </div>
          <div className="space-y-2 mt-4">
            <div className="h-8 w-44 bg-white/10 rounded-xl" />
            <div className="h-4 w-28 bg-white/10 rounded-lg" />
          </div>
        </div>

        {/* Right Column: Metrics Grid Skeleton */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="h-28 bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col justify-between"
              >
                <div className="flex justify-between items-center">
                  <div className="h-4 w-16 bg-white/10 rounded" />
                  <div className="w-6 h-6 bg-white/10 rounded-lg" />
                </div>
                <div className="space-y-2">
                  <div className="h-6 w-20 bg-white/10 rounded-lg" />
                  <div className="h-3 w-24 bg-white/10 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7-Day Forecast Skeleton */}
      <div className="w-full space-y-4">
        <div className="h-5 w-32 bg-white/10 rounded-lg" />
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-4">
          {Array.from({ length: 7 }).map((_, idx) => (
            <div
              key={idx}
              className="h-36 bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-between"
            >
              <div className="h-4 w-12 bg-white/10 rounded" />
              <div className="w-12 h-12 bg-white/10 rounded-full my-2" />
              <div className="space-y-1 w-full flex flex-col items-center">
                <div className="h-4 w-10 bg-white/10 rounded" />
                <div className="h-3 w-8 bg-white/10 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lower Grid Skeleton: Charts & Hourly */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        {/* Hourly Forecast placeholder */}
        <div className="h-[320px] bg-white/5 border border-white/5 rounded-3xl p-6 flex flex-col justify-between">
          <div className="h-5 w-32 bg-white/10 rounded-lg mb-4" />
          <div className="flex gap-3 overflow-x-auto no-scrollbar">
            {Array.from({ length: 12 }).map((_, idx) => (
              <div
                key={idx}
                className="w-16 h-28 bg-white/10 rounded-xl flex-shrink-0"
              />
            ))}
          </div>
        </div>

        {/* Charts placeholder */}
        <div className="h-[320px] bg-white/5 border border-white/5 rounded-3xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div className="h-5 w-32 bg-white/10 rounded-lg" />
            <div className="h-8 w-44 bg-white/10 rounded-xl" />
          </div>
          <div className="flex-1 w-full bg-white/10 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
