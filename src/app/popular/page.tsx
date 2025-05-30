'use client';
import React, { useEffect, useState } from "react";
import { getPopularMovies } from "@/services/movies/getPopularMovies";
import MovieList from "@/components/MovieList/MovieList";

const PopularClientPage = () => {
    const [loading, setLoading] = useState(false);
    const [movies, setMovies] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchPopularMovies = async () => {
            setLoading(true);
            try {
                const data = await getPopularMovies(page);
                setMovies(data.results);
                setTotalPages(data.total_pages);
            } catch (err) {
                console.error("Error loading movies: ", err);
            }
            setLoading(false);
        };
        fetchPopularMovies();
    }, [page]);

    const handleNextPage = () => {
        if (page < totalPages) {
            setPage(page + 1);
            window.scrollTo(0, 0);
        }
    };

    const handlePrevPage = () => {
        if (page > 1) {
            setPage(page - 1);
            window.scrollTo(0, 0);
        }
    };

    return (
        <div>
            <MovieList
                movies={movies}
                loading={loading}
                pageType="popular"
                title="Popular Movies"
            />
            
            {/* Pagination Controls */}
            {!loading && movies.length > 0 && (
                <div className="flex justify-center items-center mb-10 space-x-4">
                    <button
                        onClick={handlePrevPage}
                        disabled={page === 1}
                        className={`px-4 py-2 rounded font-medium ${
                            page === 1 
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                    >
                        Previous
                    </button>
                    
                    <span className="text-gray-700">
                        Page {page} of {totalPages}
                    </span>
                    
                    <button
                        onClick={handleNextPage}
                        disabled={page === totalPages}
                        className={`px-4 py-2 rounded font-medium ${
                            page === totalPages 
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default PopularClientPage;