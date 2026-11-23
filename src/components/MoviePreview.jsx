import React from 'react';
import { useNavigate } from 'react-router-dom';
import Poster from './Poster';

const MoviePreview = ({ movie }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-900 border-2 border-slate-700 rounded-xl overflow-hidden shadow-lg flex flex-col hover:border-amber-400 transition-colors">
        <Poster src={movie.Poster} title={movie.Title} className="w-full" />
      <div className="p-4 flex flex-col flex-1">
        <h2 className="text-lg font-bold leading-tight">{movie.Title}</h2>
        <p className="text-slate-400 text-sm mt-1 capitalize">
          {movie.Year} · {movie.Type}
        </p>
        <button
          onClick={() => navigate(`/movie/${movie.imdbID}`)}
          className="mt-auto pt-0 w-full bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 font-semibold py-2 rounded-lg mt-4"
        >
          More Information
        </button>
      </div>
    </div>
  );
};

export default MoviePreview;