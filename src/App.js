import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import { getColumns } from './columns';

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
} from '@tanstack/react-table';
import DebouncedInput from './filterSearch';
import { Navigate, Route, Routes, useNavigate } from 'react-router';
import DetailsPage from './DetailsPage';
import ListingPage from './ListingPage';

// function fetchData({ queryKey }) {
//   return axios.get('https://63ac20c634c46cd7ae78342e.mockapi.io/articles', {
//     params: {
//       limit: queryKey[2],
//       page: queryKey[1] + 1,
//       sortBy: queryKey[3],
//       order: queryKey[4] ? 'desc' : 'asc',
//       search: queryKey[5] || '',
//     },
//   });
// }

function App() {
  return (
    <div>
      <Routes>
        <Route path="/listing" element={<ListingPage />} />
        <Route path="/details/:id" element={<DetailsPage />} />
        <Route
        path="*"
        element={
          <Navigate to={`/listing`} replace />
        }/>
      </Routes>
    </div>
  );
}

export default App;
