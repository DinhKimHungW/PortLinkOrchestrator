import React from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6 text-center">
      <h1 className="text-5xl font-bold text-sky-600">404</h1>
      <p className="mt-3 text-lg text-gray-600">Trang bạn tìm không tồn tại hoặc đã được di chuyển.</p>
      <Link to={routes.root} className="mt-5 text-sky-600 hover:underline">
        Quay về trang chủ
      </Link>
    </div>
  );
}
