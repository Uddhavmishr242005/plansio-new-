import React, { useState } from 'react';
import { Play, Video, X, Clock, Eye, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { VideoItem } from '../types/database';

export const VideoShowcaseSection: React.FC = () => {
  const { settings } = useSiteSettings();
  const videos = settings.sampleVideos || [];

  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(videos.map(v => v.category)))];

  const filteredVideos = selectedCategory === 'All'
    ? videos
    : videos.filter(v => v.category === selectedCategory);

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-[#0b140d] border-t border-b border-gray-100 dark:border-[#1c2e20] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Lined Header for Video Section */}
        <div className="relative flex items-center justify-center my-4 mb-8">
          <div className="w-full border-t border-gray-200 dark:border-gray-800 absolute" />
          <div className="relative bg-white dark:bg-[#0b140d] px-6 py-2 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
            <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-emerald-800 dark:text-emerald-300">
              SAMPLE VIDEOS & REELS
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
          </div>
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-[#eaf2eb]">
              Watch Real Farm & Plant Care Videos
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
              Authentic walkthroughs demonstrating our earthworm vermiculture screening process, repotting techniques, and natural pest protection recipes.
            </p>
          </div>

          {/* Category Filter Pills */}
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-emerald-800 text-white shadow-sm dark:bg-[#40916c]'
                      : 'bg-white dark:bg-[#142217] text-gray-700 dark:text-[#eaf2eb] border border-gray-200 dark:border-[#243828] hover:bg-gray-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Video Cards Grid */}
        {filteredVideos.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-[#142217] rounded-3xl border border-gray-200 dark:border-[#243828] p-8">
            <Video className="w-12 h-12 text-emerald-700 mx-auto mb-3 opacity-60" />
            <p className="text-sm font-semibold text-gray-900 dark:text-[#eaf2eb]">No videos published in this category.</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Upload and manage sample videos directly in the Admin Panel.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((vid) => (
              <div
                key={vid.id}
                onClick={() => setActiveVideo(vid)}
                className="group cursor-pointer bg-white dark:bg-[#142217] rounded-2xl overflow-hidden border border-gray-200 dark:border-[#243828] shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                {/* Thumbnail with Play Overlay */}
                <div className="relative aspect-video w-full overflow-hidden bg-black/10">
                  <img
                    src={vid.thumbnailUrl || 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80'}
                    alt={vid.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="w-13 h-13 rounded-full bg-white/90 group-hover:bg-white text-[#1b4332] flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-200">
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-1 rounded bg-black/80 text-white text-[11px] font-semibold flex items-center gap-1 backdrop-blur-xs">
                    <Clock className="w-3 h-3" />
                    <span>{vid.duration}</span>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#1b4332]/90 text-[#d8f3dc] text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs">
                    {vid.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-[#1b4332] dark:text-[#eaf2eb] group-hover:text-[#2d6a4f] dark:group-hover:text-[#74c69d] transition-colors line-clamp-2">
                      {vid.title}
                    </h3>
                    <p className="text-xs text-[#526352] dark:text-[#a3b8a6] mt-2 line-clamp-2 leading-relaxed">
                      {vid.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#e2ede0] dark:border-[#243828] flex items-center justify-between text-[11px] text-[#526352] dark:text-[#a3b8a6]">
                    <div className="flex items-center gap-1.5 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2d6a4f] dark:text-[#74c69d]" />
                      <span>{vid.author || 'PLANSIO Master Grower'}</span>
                    </div>
                    {vid.views && <span>{vid.views}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Video Playback Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div className="relative w-full max-w-4xl bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10 my-4">
            
            {/* Close Button */}
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 text-white hover:bg-white hover:text-black transition-colors"
              aria-label="Close video player"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Video Player */}
            <div className="relative aspect-video w-full bg-black">
              {activeVideo.videoUrl.includes('youtube.com') || activeVideo.videoUrl.includes('youtu.be') ? (
                <iframe
                  src={activeVideo.videoUrl.replace('watch?v=', 'embed/')}
                  title={activeVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={activeVideo.videoUrl}
                  controls
                  autoPlay
                  poster={activeVideo.thumbnailUrl}
                  className="w-full h-full object-contain"
                >
                  Your browser does not support HTML5 video tags.
                </video>
              )}
            </div>

            {/* Video Details Bar */}
            <div className="p-6 bg-[#101c13] text-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-800 text-emerald-200 text-[10px] font-bold uppercase tracking-wider">
                  {activeVideo.category}
                </span>
                <span className="text-xs text-gray-400">• {activeVideo.duration}</span>
                {activeVideo.uploadedAt && <span className="text-xs text-gray-400">• Published {activeVideo.uploadedAt}</span>}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                {activeVideo.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-3xl">
                {activeVideo.description}
              </p>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
