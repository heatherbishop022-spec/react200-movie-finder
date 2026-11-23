import { createContext, useReducer } from 'react';

const initialState = {
  query: '',
  movies: [],
  searchLoading: false,
  searchError: null,
  movie: null,
  movieLoading: false,
  movieError: null
};

const MovieContext = createContext({ state: initialState, dispatch: () => {} });

const movieReducer = (state, action) => {
  switch (action.type) {
    case 'SEARCH_START':
      return { ...state, query: action.payload, searchLoading: true, searchError: null };
    case 'SEARCH_SUCCESS':
      return { ...state, searchLoading: false, movies: action.payload };
    case 'SEARCH_ERROR':
      return { ...state, searchLoading: false, searchError: action.payload, movies: [] };
    case 'MOVIE_START':
      return { ...state, movieLoading: true, movieError: null, movie: null };
    case 'MOVIE_SUCCESS':
      return { ...state, movieLoading: false, movie: action.payload };
    case 'MOVIE_ERROR':
      return { ...state, movieLoading: false, movieError: action.payload };
    default:
      return state;
  }
};

export const MovieProvider = ({ children }) => {
  const [state, dispatch] = useReducer(movieReducer, initialState);

  return (
    <MovieContext.Provider value={{ state, dispatch }}>
      {children}
    </MovieContext.Provider>
  );
};

export default MovieContext;