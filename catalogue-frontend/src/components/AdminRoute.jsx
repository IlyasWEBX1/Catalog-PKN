import React, { useEffect, useState } from "react";
import axios from "axios";
import {jwtDecode} from 'jwt-decode';
import { Navigate } from 'react-router-dom';

export const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');

  if (!token) return <Navigate to="/Login" />;

  const decoded = jwtDecode(token);

  if (decoded.peran !== 'admin') return <Navigate to="/" />;

  return children;
};