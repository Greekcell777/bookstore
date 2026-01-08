import { useEffect, useState } from 'react';
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
import { useBookStore } from './BookstoreContext';


const AdminDashboard = () => {
  const { 
    adminStats, 
    user,
    isLoading 
  } = useBookStore();
  
  const [stats, setStats] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  
  
  useEffect(() => {
    if (adminStats) {
      // Transform API data to match your component's format
      const transformedStats = [
        {
          title: 'Total Revenue',
          value: `KES ${adminStats.stats?.monthly_revenue?.toFixed(2) * 130 || '0.00'}`,
          change: '+20.1%', // You'll need to calculate this from API
          trend: 'up',
          icon: <DollarSign size={24} />,
          color: 'bg-green-500',
          chartColor: 'text-green-500'
        },
        {
          title: 'Total Orders',
          value: adminStats.stats?.total_orders || '0',
          change: '+12.5%',
          trend: 'up',
          icon: <ShoppingCart size={24} />,
          color: 'bg-blue-500',
          chartColor: 'text-blue-500'
        },
        {
          title: 'Total Customers',
          value: adminStats.stats?.total_users || '0',
          change: '+8.3%',
          trend: 'up',
          icon: <Users size={24} />,
          color: 'bg-purple-500',
          chartColor: 'text-purple-500'
        },
        {
          title: 'Total Books',
          value: adminStats.stats?.total_books || '0',
          change: '-2.1%',
          trend: 'down',
          icon: <BookOpen size={24} />,
          color: 'bg-orange-500',
          chartColor: 'text-orange-500'
        }
      ];
      
      setStats(transformedStats);
      
      // Transform revenue chart data
      if (adminStats.revenue_chart) {
        setRevenueData(adminStats.revenue_chart.map(item => item.revenue));
      }
    }
  }, [adminStats]);
  
  // Use adminStats.top_books for your top products
  const topProducts = adminStats?.top_books?.map(book => ({
    name: book.title,
    sales: book.total_sold,
    revenue: book.total_revenue,
    rating: 4.5 // You might want to get this from reviews
  })) || [];
  
  // Use adminStats.recent_orders for your recent orders
  const recentOrders = adminStats?.recent_orders?.map(order => ({
    id: order.order_number,
    customer: `User ${order.user_id}`, // You might want to fetch user details
    date: order.created_at.split('T')[0],
    amount: order.total_amount,
    status: order.status.charAt(0).toUpperCase() + order.status.slice(1)
  })) || [];
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!user || user.role !== 'admin') {
    return <div>Access denied. Admin privileges required.</div>;
  }
  
  return (
    // Your existing JSX, but using the data from context
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.first_name || 'Admin'}! Here's what's happening with your store today.</p>
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
      
      {/* ... rest of your component */}
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
                     <td className="px-6 py-4 font-medium">KES {(order.amount * 130).toFixed(2)}</td>
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
                   <p className="font-bold text-gray-900">KES {(product.revenue * 130).toFixed(2)}</p>
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