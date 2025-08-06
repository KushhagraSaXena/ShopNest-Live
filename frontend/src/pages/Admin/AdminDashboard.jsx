// src/pages/admin/AdminDashboard.jsx

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useGetUsersQuery } from '../../redux/api/usersApiSlice';
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from '../../redux/api/orderApiSlice';
import { useState } from 'react';
import AdminMenu from './AdminMenu';
import OrderList from './OrderList';
import Loader from '../../components/Loader';

const COLORS = ['#ec4899', '#6366f1', '#f97316', '#22c55e', '#0ea5e9'];

const AdminDashboard = () => {
  const { data: sales, isLoading } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loadingUsers } = useGetUsersQuery();
  const { data: orders, isLoading: loadingOrders } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  const [chartType, setChartType] = useState('bar');
  const [showPie, setShowPie] = useState(false);

  const formattedData = Array.isArray(salesDetail)
    ? salesDetail.map((item) => ({
        date: item._id || 'Prev Year',
        total: item.totalSales || 0,
      }))
    : [];

  const toggleChartType = () => setChartType((prev) => (prev === 'bar' ? 'line' : 'bar'));
  const togglePie = () => setShowPie((prev) => !prev);

  return (
    <>
      <AdminMenu />
      <section className="xl:ml-[4rem] md:ml-[0rem]">
        {/* Summary Cards */}
        <div className="w-[80%] flex justify-around flex-wrap">
          <div className="rounded-lg dark:bg-pink-600 bg-blue-300 p-5 w-[20rem] mt-5 dark:text-white text-gray-900">
            <div className="font-bold rounded-full w-[3rem] bg-blue-200 dark:bg-pink-500 text-center p-3">$</div>
            <p className="mt-5">Sales</p>
            <h1 className="text-xl font-bold">
              {isLoading ? <Loader /> : `$${sales?.totalSales?.toFixed(2)}`}
            </h1>
          </div>
          <div className="rounded-lg dark:bg-pink-600 bg-blue-300 p-5 w-[20rem] mt-5 dark:text-white text-gray-900">
            <div className="font-bold rounded-full w-[3rem] bg-blue-200 dark:bg-pink-500 text-center p-3">👤</div>
            <p className="mt-5">Customers</p>
            <h1 className="text-xl font-bold">
              {loadingUsers ? <Loader /> : customers?.length || 0}
            </h1>
          </div>
          <div className="rounded-lg dark:bg-pink-600 bg-blue-300 p-5 w-[20rem] mt-5 dark:text-white text-gray-900">
            <div className="font-bold rounded-full w-[3rem] bg-blue-200 dark:bg-pink-500 text-center p-3 text-xl">📦</div>
            <p className="mt-5">All Orders</p>
            <h1 className="text-xl font-bold">
              {loadingOrders ? <Loader /> : orders?.totalOrders || 0}
            </h1>
          </div>
        </div>

        {/* Chart Controls */}
        <div className="ml-[10rem] mt-[4rem] dark:text-white text-gray-900">
          <div className="space-x-4 mb-6">
            <button
              onClick={toggleChartType}
              className="px-4 py-2 rounded dark:bg-pink-600 dark:hover:bg-pink-700 bg-blue-600 hover:bg-blue-700 transition text-white"
            >
              Toggle to {chartType === 'bar' ? 'Line' : 'Bar'} Chart
            </button>
            <button
              onClick={togglePie}
              className="px-4 py-2 rounded dark:bg-blue-700 dark:hover:bg-blue-800 bg-red-500 hover:bg-red-600 transition text-white"
            >
              {showPie ? 'Hide' : 'Show'} Pie Chart
            </button>
          </div>

          {showPie ? (
            <ResponsiveContainer width="80%" height={300}>
              <PieChart>
                <Pie
                  data={formattedData}
                  dataKey="total"
                  nameKey="date"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {formattedData?.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : formattedData?.length > 0 ? (
            <ResponsiveContainer width="80%" height={300}>
              {chartType === 'bar' ? (
                <BarChart data={formattedData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" fill="#1e40af" />
                </BarChart>
              ) : (
                <LineChart data={formattedData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="total" stroke="#1e40af" strokeWidth={2} />
                </LineChart>
              )}
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400">No chart data available yet.</p>
          )}
        </div>

        {/* Orders List */}
        <div className="mt-[4rem]">
          <OrderList />
        </div>
      </section>
    </>
  );
};

export default AdminDashboard;
