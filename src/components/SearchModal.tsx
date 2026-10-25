import React, { useState, useEffect, useRef } from 'react';
import { useCivic } from '../context/CivicContext';
import { Search, X, MapPin, ArrowRight, CornerDownLeft, AlertCircle } from 'lucide-react';
import { filterIssues } from '../utils/civicLogic';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setSearchOpen, issues, openDetail, setActiveTab, selectIssue } = useCivic();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      } else if (e.key === 'Escape' && isSearchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setSearchOpen]);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const results = query.trim() ? filterIssues(issues, { query: query.trim() }).slice(0, 6) : [];

  const handleSelectIssue = (id: string) => {
    setSearchOpen(false);
    openDetail(id);
  };

  const handleLocateOnMap = (id: string) => {
    setSearchOpen(false);
    selectIssue(id);
    setActiveTab('map');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Search reports and neighborhoods"
      onClick={() => setSearchOpen(false)}
    >
      <div 
        className="w-full max-w-2xl bg-[#0C1320] border border-[rgba(160,190,220,0.18)] rounded-xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[rgba(160,190,220,0.14)] gap-3 bg-[#080D16]">
          <Search className="w-5 h-5 text-[#42E8F5] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by ID (e.g. CVL-2026-1049), category, street, or defect..."
            className="w-full bg-transparent text-[#F4F7FC] placeholder-[#A6B4C8] text-sm focus:outline-none"
            aria-label="Search query"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#A6B4C8] hover:text-[#F4F7FC] p-1"
              aria-label="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setSearchOpen(false)}
            className="text-xs font-mono text-[#A6B4C8] hover:text-[#F4F7FC] px-2 py-1 rounded bg-[#121C2B] border border-[rgba(160,190,220,0.14)]"
            aria-label="Close search modal"
          >
            ESC
          </button>
        </div>

        {/* Results / Suggestions */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-2">
          {query.trim().length === 0 ? (
            <div className="py-6 px-4 text-center">
              <p className="text-xs font-mono text-[#A6B4C8] uppercase tracking-wider mb-3">
                Suggested Search Queries
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {['Pothole', 'Market St', 'Streetlight', 'Water leak', 'Downtown Core', 'Wheelchair ramp'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-2.5 py-1 text-xs rounded bg-[#121C2B] text-[#F4F7FC] hover:text-[#42E8F5] hover:border-[#42E8F5]/40 border border-[rgba(160,190,220,0.14)] transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center text-[#A6B4C8]">
              <AlertCircle className="w-8 h-8 text-[#A6B4C8]/60 mx-auto mb-2" />
              <p className="text-sm font-medium text-[#F4F7FC]">No reports matched “{query}”</p>
              <p className="text-xs text-[#A6B4C8] mt-1">Try searching by category, street name, or report identifier.</p>
            </div>
          ) : (
            results.map((issue) => (
              <div
                key={issue.id}
                className="group p-3 rounded-lg bg-[#121C2B] hover:bg-[#192638] border border-[rgba(160,190,220,0.14)] hover:border-[#42E8F5]/40 transition-all flex items-start justify-between gap-3"
              >
                <button
                  onClick={() => handleSelectIssue(issue.id)}
                  className="text-left flex-1 focus:outline-none"
                >
                  <div className="flex items-center gap-2 text-xs text-[#A6B4C8] font-mono mb-1">
                    <span className="text-[#42E8F5] font-semibold">{issue.id}</span>
                    <span>·</span>
                    <span className="capitalize">{issue.category}</span>
                    <span>·</span>
                    <span>{issue.neighborhood}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-[#F4F7FC] group-hover:text-[#42E8F5] transition-colors">
                    {issue.title}
                  </h4>
                  <p className="text-xs text-[#A6B4C8] line-clamp-1 mt-0.5">
                    {issue.locationName} — {issue.description}
                  </p>
                </button>

                <div className="flex items-center gap-1.5 shrink-0 pt-1">
                  <button
                    onClick={() => handleLocateOnMap(issue.id)}
                    className="p-1.5 rounded text-xs text-[#A6B4C8] hover:text-[#42E8F5] hover:bg-[#080D16] border border-transparent hover:border-[rgba(160,190,220,0.14)]"
                    title="View on Map"
                    aria-label={`Locate ${issue.id} on map`}
                  >
                    <MapPin className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleSelectIssue(issue.id)}
                    className="p-1.5 rounded text-xs text-[#A6B4C8] hover:text-[#42E8F5] hover:bg-[#080D16] border border-transparent hover:border-[rgba(160,190,220,0.14)]"
                    title="View Details"
                    aria-label={`View details for ${issue.id}`}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-[#080D16] border-t border-[rgba(160,190,220,0.14)] text-[11px] font-mono text-[#A6B4C8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1 py-0.5 rounded bg-[#121C2B] text-[#F4F7FC] border border-[rgba(160,190,220,0.14)]">↑↓</kbd> Navigate</span>
            <span><kbd className="px-1 py-0.5 rounded bg-[#121C2B] text-[#F4F7FC] border border-[rgba(160,190,220,0.14)]">↵</kbd> Select</span>
            <span><kbd className="px-1 py-0.5 rounded bg-[#121C2B] text-[#F4F7FC] border border-[rgba(160,190,220,0.14)]">ESC</kbd> Close</span>
          </div>
          <span className="text-[#A6B4C8]/70">CIVICLENS Fast Indexer</span>
        </div>
      </div>
    </div>
  );
};
