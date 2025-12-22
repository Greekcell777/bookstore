import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  BookOpen,
  Package,
  Star,
  MoreVertical,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$45,231',
      change: '+20.1%',
      trend: 'up',
      icon: <DollarSign size={24} />,
      color: 'bg-green-500',
      chartColor: 'text-green-500'
    },
    {
      title: 'Total Orders',
      value: '2,346',
      change: '+12.5%',
      trend: 'up',
      icon: <ShoppingCart size={24} />,
      color: 'bg-blue-500',
      chartColor: 'text-blue-500'
    },
    {
      title: 'Total Customers',
      value: '8,452',
      change: '+8.3%',
      trend: 'up',
      icon: <Users size={24} />,
      color: 'bg-purple-500',
      chartColor: 'text-purple-500'
    },
    {
      title: 'Total Books',
      value: '1,234',
      change: '-2.1%',
      trend: 'down',
      icon: <BookOpen size={24} />,
      color: 'bg-orange-500',
      chartColor: 'text-orange-500'
    }
  ];

  const recentOrders = [
    { id: 'ORD-789456', customer: 'John Doe', date: '2024-03-15', amount: 89.97, status: 'Delivered' },
    { id: 'ORD-789457', customer: 'Jane Smith', date: '2024-03-15', amount: 45.99, status: 'Processing' },
    { id: 'ORD-789458', customer: 'Robert Johnson', date: '2024-03-14', amount: 120.50, status: 'Shipped' },
    { id: 'ORD-789459', customer: 'Emily Davis', date: '2024-03-14', amount: 67.99, status: 'Delivered' },
    { id: 'ORD-789460', customer: 'Michael Brown', date: '2024-03-13', amount: 34.99, status: 'Cancelled' }
  ];

  const topProducts = [
    { name: 'The Silent Patient', sales: 234, revenue: 7016.66, rating: 4.5 },
    { name: 'Atomic Habits', sales: 189, revenue: 4724.11, rating: 4.7 },
    { name: 'Project Hail Mary', sales: 156, revenue: 4367.44, rating: 4.8 },
    { name: 'The Midnight Library', sales: 134, revenue: 2679.66, rating: 4.4 },
    { name: 'Dune', sales: 128, revenue: 3839.72, rating: 4.6 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, Admin! Here's what's happening with your store today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  {stat.trend === 'up' ? (
                    <ArrowUpRight size={16} className="text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight size={16} className="text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-600 ml-2">from last month</span>
                </div>
              </div>
              <div className={`p-3 rounded-full ${stat.color} text-white`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts & Data Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreVertical size={20} />
            </button>
          </div>
          <div className="h-64 flex items-end space-x-2">
            {[65, 40, 75, 50, 60, 45, 70, 55, 80, 65, 90, 75].map((height, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-blue-500 rounded-t-lg"
                  style={{ height: `${height}%` }}
                ></div>
                <span className="text-xs text-gray-500 mt-2">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Package size={20} className="text-gray-400 mr-3" />
                  <span>Pending Orders</span>
                </div>
                <span className="font-bold">12</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Star size={20} className="text-gray-400 mr-3" />
                  <span>New Reviews</span>
                </div>
                <span className="font-bold">8</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users size={20} className="text-gray-400 mr-3" />
                  <span>New Customers</span>
                </div>
                <span className="font-bold">23</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BookOpen size={20} className="text-gray-400 mr-3" />
                  <span>Low Stock Items</span>
                </div>
                <span className="font-bold">5</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px 6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="font-medium text-blue-600">{order.id}</span>
                    </td>
                    <td className="px-6 py-4">{order.customer}</td>
                    <td className="px-6 py-4">{order.date}</td>
                    <td className="px-6 py-4 font-medium">${order.amount.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Top Selling Books</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </button>
            </div>
          </div>
          <div className="divide-y">
            {topProducts.map((product, index) => (
              <div key={index} className="p-6 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                    <BookOpen size={20} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={`${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">{product.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">${product.revenue.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">{product.sales} sales</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              { action: 'New order #ORD-789461 placed', time: '10 minutes ago', user: 'Sarah Johnson' },
              { action: 'Book "The Hobbit" added to store', time: '1 hour ago', user: 'Admin' },
              { action: 'Customer review submitted', time: '2 hours ago', user: 'Mike Wilson' },
              { action: 'Stock updated for 5 products', time: '3 hours ago', user: 'Admin' },
              { action: 'New customer registered', time: '5 hours ago', user: 'Lisa Brown' }
            ].map((activity, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 w-2 h-2 mt-2 bg-blue-500 rounded-full"></div>
                <div className="ml-4 flex-1">
                  <p className="text-gray-900">{activity.action}</p>
                  <div className="flex items-center mt-1">
                    <Calendar size={14} className="text-gray-400 mr-1" />
                    <span className="text-sm text-gray-500">{activity.time}</span>
                    <span className="mx-2">•</span>
                    <span className="text-sm text-gray-500">by {activity.user}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;