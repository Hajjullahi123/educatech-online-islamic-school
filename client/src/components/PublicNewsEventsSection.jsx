import React, { useState } from 'react';
import { FiCalendar, FiFileText, FiTag, FiClock, FiX, FiArrowRight, FiCheckCircle } from 'react-icons/fi';

const PublicNewsEventsSection = ({ school, getLogoUrl, primaryColor = '#1e40af', isDarkMode = false }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [activeModalItem, setActiveModalItem] = useState(null);

  const newsEvents = school?.newsEvents || [];

  if (!newsEvents || newsEvents.length === 0) {
    return (
      <section className={`py-16 px-4 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-sm" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
            <FiCalendar className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black mb-2 tracking-tight">News & Upcoming Events</h2>
          <p className="text-gray-500 max-w-lg mx-auto text-sm leading-relaxed mb-6">
            Stay tuned! Upcoming school events, announcements, and news updates will appear here soon.
          </p>
        </div>
      </section>
    );
  }

  const filteredItems = selectedFilter === 'all'
    ? newsEvents
    : newsEvents.filter(item => item.type === selectedFilter);

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <section className={`py-20 px-4 transition-colors duration-300 relative ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-gradient-to-b from-slate-50 to-blue-50/30 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-3 shadow-xs"
                 style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
              <FiCalendar className="w-3.5 h-3.5" />
              <span>Campus Updates</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
              Latest News & Events
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base mt-2 max-w-xl">
              Stay informed with the latest updates, achievements, activities, and upcoming events at {school?.name || 'our school'}.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white dark:bg-slate-800 shadow-md border border-gray-200/60 dark:border-slate-700/60 shrink-0">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedFilter === 'all'
                  ? 'text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
              style={selectedFilter === 'all' ? { backgroundColor: primaryColor } : {}}
            >
              All ({newsEvents.length})
            </button>
            <button
              onClick={() => setSelectedFilter('news')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedFilter === 'news'
                  ? 'text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
              style={selectedFilter === 'news' ? { backgroundColor: primaryColor } : {}}
            >
              📰 News ({newsEvents.filter(i => i.type === 'news').length})
            </button>
            <button
              onClick={() => setSelectedFilter('event')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedFilter === 'event'
                  ? 'text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
              style={selectedFilter === 'event' ? { backgroundColor: primaryColor } : {}}
            >
              📅 Events ({newsEvents.filter(i => i.type === 'event').length})
            </button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => {
            const isEvent = item.type === 'event';
            const displayDate = formatDate(item.eventDate || item.createdAt);
            const imageSrc = getLogoUrl ? getLogoUrl(item.imageUrl) : item.imageUrl;

            return (
              <div
                key={item.id}
                onClick={() => setActiveModalItem(item)}
                className="group relative bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-gray-200/70 dark:border-slate-700/70 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col"
              >
                {/* Image / Header Graphic */}
                <div className="relative h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-900 shrink-0">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center"
                         style={{ background: `linear-gradient(135deg, ${primaryColor}20 0%, ${primaryColor}05 100%)` }}>
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-2 shadow-xs"
                           style={{ backgroundColor: `${primaryColor}30`, color: primaryColor }}>
                        {isEvent ? <FiCalendar className="w-6 h-6" /> : <FiFileText className="w-6 h-6" />}
                      </div>
                      <span className="text-xs font-black uppercase tracking-wider text-gray-400">
                        {isEvent ? 'School Event' : 'School Announcement'}
                      </span>
                    </div>
                  )}

                  {/* Badge */}
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md backdrop-blur-md ${
                      isEvent
                        ? 'bg-amber-500/90 text-white'
                        : 'bg-indigo-600/90 text-white'
                    }`}>
                      {isEvent ? '📅 Event' : '📰 News'}
                    </span>
                  </div>

                  {/* Date Badge */}
                  {displayDate && (
                    <div className="absolute bottom-4 right-4 z-10 px-3 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 shadow-md">
                      <FiClock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{displayDate}</span>
                    </div>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 leading-relaxed">
                      {item.content}
                    </p>
                  </div>

                  <div className="pt-6 mt-4 border-t border-gray-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-bold"
                       style={{ color: primaryColor }}>
                    <span>Read Full Details</span>
                    <FiArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Popup for Full Story */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-gray-200 dark:border-slate-700 animate-scaleUp">
            {/* Modal Header */}
            <div className="relative p-6 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  activeModalItem.type === 'event' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300'
                }`}>
                  {activeModalItem.type === 'event' ? '📅 Upcoming Event' : '📰 School News'}
                </span>
                {(activeModalItem.eventDate || activeModalItem.createdAt) && (
                  <span className="text-xs text-gray-500 font-medium">
                    • {formatDate(activeModalItem.eventDate || activeModalItem.createdAt)}
                  </span>
                )}
              </div>
              <button
                onClick={() => setActiveModalItem(null)}
                className="w-9 h-9 rounded-full bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 flex items-center justify-center text-gray-500 dark:text-gray-300 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Scrollable */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {(getLogoUrl ? getLogoUrl(activeModalItem.imageUrl) : activeModalItem.imageUrl) && (
                <div className="rounded-2xl overflow-hidden max-h-72 w-full bg-slate-100 dark:bg-slate-900">
                  <img
                    src={getLogoUrl ? getLogoUrl(activeModalItem.imageUrl) : activeModalItem.imageUrl}
                    alt={activeModalItem.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <h2 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">
                {activeModalItem.title}
              </h2>

              <div className="text-gray-700 dark:text-gray-200 text-sm md:text-base leading-relaxed whitespace-pre-line pt-2">
                {activeModalItem.content}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/80 flex justify-end">
              <button
                onClick={() => setActiveModalItem(null)}
                className="px-6 py-2.5 rounded-xl font-bold text-sm text-white shadow-md hover:brightness-95 transition-all"
                style={{ backgroundColor: primaryColor }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PublicNewsEventsSection;
