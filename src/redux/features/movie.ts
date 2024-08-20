import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../api/axios";

export interface MovieFormValues {
  title: string;
  image: string;
  rating: number;
  releaseDate: string;
  description: string;
  actors: string[];
  director: string;
  genre: string;
}

export interface IMovie {
  _id: string;
  title: string;
  image: string;
  rating: number;
  releaseDate: Date;
  description: string;
  actors: string[];
  director: string;
  genre: string;
  isFavorite: boolean;
}

interface IMovieResponse {
  page: number;
  pages: number;
  total: number;
  movies: IMovie[];
}

export interface MovieQueryParams {
  search?: string;
  page?: number;
  limit?: number;
}

export const movieApi = createApi({
  reducerPath: "movieAPI",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getMovies: builder.query<IMovieResponse, MovieQueryParams>({
      query: ({ search, page, limit }) => {
        const params = new URLSearchParams();

        if (search) params.append("search", search);
        if (page) params.append("page", page.toString());
        if (limit) params.append("limit", limit.toString());

        const queryString = params.toString();
        const url = `/movie${queryString ? `?${queryString}` : ""}`;

        return { url };
      },
    }),
    getMovieById: builder.query<IMovie, string>({
      query: (id) => ({ url: `/movie/${id}` }),
    }),
    getFavoritesMovie: builder.query<IMovie[], unknown>({
      query: () => ({ url: "/movie/favorite" }),
    }),
    toggleFavoriteStatus: builder.mutation<IMovie, { id: string }>({
      query: ({ id }) => ({
        url: `/movie/favorite/${id}`,
        method: "PATCH",
      }),
    }),
    createMovie: builder.mutation<IMovie, Partial<IMovie>>({
      query: (newMovie) => ({
        url: `/movie`,
        method: "POST",
        data: newMovie,
      }),
    }),
    updateMovie: builder.mutation<IMovie, Partial<IMovie>>({
      query: (newMovie) => ({
        url: `/movie/${newMovie._id}`,
        method: "PATCH",
        data: newMovie,
      }),
    }),
    deleteMovie: builder.mutation({
      query: (id: string) => ({
        url: `/movie/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetMoviesQuery,
  useLazyGetMoviesQuery,
  useGetFavoritesMovieQuery,
  useLazyGetFavoritesMovieQuery,
  useToggleFavoriteStatusMutation,
  useLazyGetMovieByIdQuery,
  useCreateMovieMutation,
  useUpdateMovieMutation,
  useDeleteMovieMutation,
} = movieApi;
