import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


const cryptoNewsHeaders = {
  'x-rapidapi-key': import.meta.env.VITE_RAPID_API_CRYPTO_NEWS,
  'x-rapidapi-host': 'cryptocurrency-news2.p.rapidapi.com'
};

const baseUrl = 'https://cryptocurrency-news2.p.rapidapi.com/v1/coindesk';

const createRequest = (url) => ({ url, headers: cryptoNewsHeaders });

export const cryptoNewsApi = createApi({
  reducerPath: 'cryptoNewsApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getCryptoNews: builder.query({
      query: ({ count }) => createRequest(`?count=${count}`), // Adjust endpoint as necessary
    }),
  }),
});

export const { useGetCryptoNewsQuery } = cryptoNewsApi;
