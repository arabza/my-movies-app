import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { IMovieDetail } from '@/types/movie';
import { isFutureDate } from '@/utils/dateUtils';
import Link from 'next/link';
import Config from '@/config';
import { formatDate } from '@/utils/dateUtils';

export interface MovieCarouselProps {
  title: string;
  movies: IMovieDetail[];
  icon: React.ReactNode;
  filterType?: string;
  onFilterChange?: (filter: string) => void;
  currentFilter?: string;
  showFutureIndicator?: boolean;
  type?: 'movie' | 'tv';
}

const MovieCarousel: React.FC<MovieCarouselProps> = ({
  title,
  movies,
  icon,
  filterType,
  onFilterChange,
  currentFilter,
  showFutureIndicator = false,
  type
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const routeType = type ?? 'movie';

  const scrollLeft = () => {
    carouselRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    carouselRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
  };

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        </div>

        {filterType === 'trending' && onFilterChange && (
          <div className="flex gap-2">
            {['day', 'week'].map((period) => (
              <button
                key={period}
                onClick={() => onFilterChange(period)}
                className={`px-4 py-1 rounded-full text-sm font-medium ${
                  currentFilter === period
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {period === 'day' ? 'Today' : 'This Week'}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="relative group">
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full shadow p-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="text-gray-600" size={20} />
        </button>

        <div className="overflow-x-auto hide-scrollbar" ref={carouselRef}>
          <div className="flex gap-6 pb-4" style={{ width: `${Math.max(100, movies.length * 15)}%` }}>
            {movies.map((item) => {
              const title = item.title || item.name;
              const releaseDate = item.release_date || item.first_air_date;
              const isFuture = showFutureIndicator && releaseDate && isFutureDate(releaseDate.toString());

              return (
                <div key={item.id} className="w-52 flex-shrink-0">
                  <Link href={`/${routeType}/${item.id}`} className="block group">
                    <div className="bg-white rounded-3xl overflow-hidden shadow-xl transition-transform hover:-translate-y-1 hover:shadow-2xl">
                      {/* Poster */}
                      <div className="aspect-[2/3] bg-gray-100">
                        {item.poster_path ? (
                          <img
                            src={`${Config.IMAGE_SOURCE}${item.poster_path}`}
                            alt={title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                            No image
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="px-3 py-3 text-center">
                        {/* Title */}
                        <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 mb-1">{title}</h3>

                        {/* Score + Coming Soon */}
                        <div className="flex justify-center items-center gap-2 text-yellow-500 text-xs font-medium mb-1">
                          <span>SCORE</span>
                          <span className="text-base text-gray-800 font-bold">{item.vote_average.toFixed(1)}</span>
                          <span>★</span>
                        </div>

                        {/* Release Date */}
                        {releaseDate && (
                          <p className="text-xs text-blue-600 font-medium">
                            {formatDate(releaseDate.toString())}
                            {isFuture && (
                              <span className="ml-1 font-semibold text-blue-400">(Coming soon)</span>
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full shadow p-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="text-gray-600" size={20} />
        </button>
      </div>
    </section>
  );
};

export default MovieCarousel;
