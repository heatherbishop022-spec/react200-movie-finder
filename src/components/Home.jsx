import React, { useContext, useState } from 'react';
import MovieContext from '../context/MovieContext';
import MoviePreview from './MoviePreview';

const omdb_endpoint = '/api/search';

const Home = () => {
  const { state, dispatch } = useContext(MovieContext);
  const [searchTerm, setSearchTerm] = useState(state.query);

    // Ask the backend for one search term; returns OMDb's data
  const searchOmdb = async (term) => {
    const response = await fetch(`${omdb_endpoint}?query=${encodeURIComponent(term)}`);
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(data?.error || data?.Error || `Request failed (${response.status})`);
    }
    return data;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const term = searchTerm.trim();
    if (!term) return;

    dispatch({ type: 'SEARCH_START', payload: term });

    try {
      // OMDb matches titles word for word, so also try "and" <-> "&" if nothing is found
      const variants = [term];
      if (/\band\b/i.test(term)) variants.push(term.replace(/\band\b/gi, '&'));
      if (term.includes('&')) variants.push(term.replace(/&/g, 'and'));

      let data = null;
      for (const variant of variants) {
        data = await searchOmdb(variant);
        if (data?.Response !== 'False') break;
      }

      if (!data || data.Response === 'False') {
        throw new Error(data?.Error === 'Movie not found!' ? `No movies found for "${term}".` : (data?.Error || 'Something went wrong.'));
      }

      dispatch({ type: 'SEARCH_SUCCESS', payload: data.Search || [] });
    } catch (err) {
      dispatch({ type: 'SEARCH_ERROR', payload: err.message || 'Something went wrong.' });
    }
  };

  return (
    <div className="min-h-dvh bg-slate-950 text-white px-4 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-8">
          Movie <span className="text-amber-400">Finder</span>
        </h1>

        <form onSubmit={handleSearch} className="max-w-xl mx-auto flex flex-col sm:flex-row gap-2 mb-10">
          <input
            type="text"
            placeholder="Search for a movie..."
            enterKeyHint="search"
            className="flex-1 text-base bg-slate-800 border-2 border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 font-bold px-6 py-3 rounded-lg"
          >
            Search
          </button>
        </form>

        {state.searchLoading && (
          <p className="text-center text-lg text-slate-300 animate-pulse">Loading...</p>
        )}

        {!state.searchLoading && state.searchError && (
          <p className="max-w-xl mx-auto text-center text-red-300 bg-red-950/60 border-2 border-red-700 rounded-lg p-4">
            {state.searchError}
          </p>
        )}

        {!state.searchLoading && !state.searchError && state.movies.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {state.movies.map((movie) => (
              <MoviePreview key={movie.imdbID} movie={movie} />
            ))}
          </div>
        )}

        {!state.searchLoading && !state.searchError && state.movies.length === 0 && (
          <p className="text-center text-slate-400">Search for a movie to get started.</p>
        )}
      </div>
    </div>
  );
};

export default Home;