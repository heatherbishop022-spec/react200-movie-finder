import React, { useContext, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MovieContext from '../context/MovieContext';
import Poster from './Poster';

const omdb_endpoint = '/api/movie';

const MovieDetails = () => {
  const { id } = useParams();
  const { state, dispatch } = useContext(MovieContext);
  const { movie, movieLoading, movieError } = state;

  useEffect(() => {
    const fetchMovie = async () => {
      dispatch({ type: 'MOVIE_START' });
      try {
        const response = await fetch(`${omdb_endpoint}/${encodeURIComponent(id)}`);
        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(data?.error || data?.Error || `Request failed (${response.status})`);
        }
        if (!data || data.Response === 'False') {
          throw new Error(data?.Error || 'Movie not found.');
        }

        dispatch({ type: 'MOVIE_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'MOVIE_ERROR', payload: err.message || 'Something went wrong.' });
      }
    };
    fetchMovie();
  }, [id, dispatch]);

  const backLink = (
    <Link to="/" className="inline-block mb-6 text-amber-400 hover:text-amber-300 font-semibold">
      ← Back to search
    </Link>
  );

  let content;
  if (movieLoading) {
    content = <p className="text-center text-lg text-slate-300 animate-pulse">Loading...</p>;
  } else if (movieError) {
    content = (
      <p className="text-center text-red-300 bg-red-950/60 border-2 border-red-700 rounded-lg p-4">
        {movieError}
      </p>
    );
  } else if (!movie) {
    content = null;
  } else {
    const show = (value) => value && value !== 'N/A';

    content = (
      <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl shadow-xl overflow-hidden md:flex">
            <Poster src={movie.Poster} title={movie.Title} className="w-full md:w-80" />
        <div className="p-6 sm:p-8 flex-1">
          <h1 className="text-3xl sm:text-4xl font-extrabold">{movie.Title}</h1>
          <p className="text-slate-400 mt-2">
            {[movie.Year, movie.Rated, movie.Runtime].filter(show).join(' · ')}
          </p>

          {show(movie.Genre) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {movie.Genre.split(', ').map((g) => (
                <span key={g} className="bg-amber-400/15 text-amber-300 border border-amber-400/40 rounded-full px-3 py-1 text-sm">
                  {g}
                </span>
              ))}
            </div>
          )}

          {show(movie.Plot) && <p className="mt-6 text-slate-200 leading-relaxed">{movie.Plot}</p>}

          <dl className="mt-6 grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm sm:text-base">
            {show(movie.Director) && (<><dt className="text-slate-400">Director</dt><dd>{movie.Director}</dd></>)}
            {show(movie.Writer) && (<><dt className="text-slate-400">Writer</dt><dd>{movie.Writer}</dd></>)}
            {show(movie.Actors) && (<><dt className="text-slate-400">Actors</dt><dd>{movie.Actors}</dd></>)}
            {show(movie.BoxOffice) && (<><dt className="text-slate-400">Box office</dt><dd>{movie.BoxOffice}</dd></>)}
            {show(movie.Awards) && (<><dt className="text-slate-400">Awards</dt><dd>{movie.Awards}</dd></>)}
          </dl>

          {movie.Ratings?.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
              {movie.Ratings.map((r) => (
                <div key={r.Source} className="bg-slate-800 rounded-lg p-3 text-center">
                  <p className="text-xs text-slate-400">{r.Source}</p>
                  <p className="text-xl font-bold text-amber-300">{r.Value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-slate-950 text-white px-4 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto">
        {backLink}
        {content}
      </div>
    </div>
  );
};

export default MovieDetails;