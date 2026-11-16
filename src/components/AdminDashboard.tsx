import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Package,
  ShoppingBag,
  TrendingUp,
  AlertCircle,
  Plus,
  Edit2,
  Trash2,
  X,
  Lock,
  LogOut,
  Search,
  Printer,
  ChevronRight,
  ArrowLeft,
  MessageCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Product } from '../types';
import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  fetchOrders,
  updateOrderStatus,
  deleteOrder,
} from '../firebase/db';

interface AdminDashboardProps {
  onClose: () => void;
}

// ---- Order helpers (purane/naye dono tarah ke orders safe tareeqe se dikhane ke liye) ----
const orderNo = (o: any) => o.orderNumber || `#${String(o.id || '').slice(-6).toUpperCase()}`;
const orderStatusOf = (o: any): string => o.orderStatus || o.status || 'pending';
const paymentOf = (o: any): string => o.paymentMethod || 'Cash on Delivery';
const paymentStatusOf = (o: any): string => o.paymentStatus || 'unpaid';
const waPhone = (raw: string): string => {
  let d = String(raw || '').replace(/[^0-9]/g, '');
  if (d.startsWith('00')) d = d.slice(2);
  if (d.startsWith('0')) d = '92' + d.slice(1);
  else if (d.length === 10 && d.startsWith('3')) d = '92' + d;
  return d;
};
const confirmLink = (o: any): string => {
  const items = (o.items || []).map((i: any) => `- ${i.name} x${i.quantity}`).join('\n');
  const msg =
    `Assalam o Alaikum ${o.customerName || ''},\n\n` +
    `Thank you for ordering from Raees Luxury Fragrance House. We received your order ${orderNo(o)}:\n\n` +
    `${items}\n\n` +
    `Total: Rs. ${(Number(o.totalAmount) || 0).toLocaleString()} (${paymentOf(o)})\n` +
    `Address: ${o.address || ''}\n\n` +
    `Please reply YES to confirm your order.`;
  return `https://wa.me/${waPhone(o.phone)}?text=${encodeURIComponent(msg)}`;
};
const orderDate = (o: any): string => {
  const c = o?.createdAt;
  const d = c && typeof c.toDate === 'function' ? c.toDate() : new Date(c);
  return isNaN(d.getTime()) ? '' : d.toLocaleDateString();
};
const orderTime = (o: any): number => {
  const c = o?.createdAt;
  const d = c && typeof c.toDate === 'function' ? c.toDate() : new Date(c);
  return isNaN(d.getTime()) ? 0 : d.getTime();
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const { user, isAdmin, error, loginWithEmail, logout } = useAuth();

  // Login form
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview');

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const [productSearch, setProductSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Product form
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState<'men' | 'women' | 'unisex'>('unisex');
  const [prodPrice, setProdPrice] = useState<number>(1500);
  const [prodDescription, setProdDescription] = useState('');
  const [prodImageUrl, setProdImageUrl] = useState('');
  const [prodStock, setProdStock] = useState<number>(25);

  const loadAdminData = async () => {
    try {
      const [fetchedProds, fetchedOrds] = await Promise.all([fetchProducts(), fetchOrders()]);
      setProducts(fetchedProds);
      setOrders([...fetchedOrds].sort((a: any, b: any) => orderTime(b) - orderTime(a)));
    } catch (e) {
      console.error('Error loading admin data:', e);
    }
  };

  useEffect(() => {
    if (isAdmin) loadAdminData();
  }, [isAdmin]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    await loginWithEmail(emailInput, passwordInput);
    setAuthLoading(false);
  };

  // ---- Product CRUD ----
  const openNewProductModal = () => {
    setEditingProduct(null);
    setProdName('');
    setProdCategory('unisex');
    setProdPrice(1500);
    setProdDescription('');
    setProdImageUrl('');
    setProdStock(25);
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (prod: Product) => {
    setEditingProduct(prod);
    setProdName(prod.name || '');
    setProdCategory((prod.category as any) || 'unisex');
    setProdPrice(prod.price || 0);
    setProdDescription(prod.description || '');
    setProdImageUrl(prod.images?.[0] || '');
    setProdStock(prod.stock ?? 0);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;

    const payload: any = {
      name: prodName.trim(),
      tagline: (editingProduct as any)?.tagline || 'Luxury fragrance',
      category: prodCategory,
      price: Number(prodPrice),
      description: prodDescription.trim(),
      images: [prodImageUrl.trim()],
      sizes: [{ size: '50ml', price: Number(prodPrice), inStock: true }],
      topNotes: (editingProduct as any)?.topNotes || ['Bergamot'],
      heartNotes: (editingProduct as any)?.heartNotes || ['Rose'],
      baseNotes: (editingProduct as any)?.baseNotes || ['Amber'],
      longevity: (editingProduct as any)?.longevity || '12+ Hours',
      sillage: (editingProduct as any)?.sillage || 'Strong',
      stock: Number(prodStock),
      rating: (editingProduct as any)?.rating || 5,
      reviewsCount: (editingProduct as any)?.reviewsCount || 0,
      isFeatured: (editingProduct as any)?.isFeatured ?? false,
      isBestSeller: (editingProduct as any)?.isBestSeller ?? false,
    };

    if (editingProduct) {
      await updateProduct(editingProduct.id, payload);
    } else {
      await addProduct(payload);
    }

    setIsProductModalOpen(false);
    loadAdminData();
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (window.confirm(`Remove "${name}" from the collection?`)) {
      await deleteProduct(id);
      loadAdminData();
    }
  };

  // ---- Orders ----
  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    await updateOrderStatus(orderId, status as any);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, orderStatus: status });
    }
    loadAdminData();
  };

  const handleUpdatePayment = async (order: any, payStatus: string) => {
    await updateOrderStatus(order.id, orderStatusOf(order) as any, payStatus as any);
    if (selectedOrder && selectedOrder.id === order.id) {
      setSelectedOrder({ ...selectedOrder, paymentStatus: payStatus });
    }
    loadAdminData();
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (window.confirm('Delete this order permanently?')) {
      await deleteOrder(orderId);
      if (selectedOrder?.id === orderId) setSelectedOrder(null);
      loadAdminData();
    }
  };

  // ---- Metrics ----
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  const pendingOrdersCount = orders.filter((o) => orderStatusOf(o) === 'pending').length;
  const lowStockCount = products.filter((p) => (p.stock ?? 0) <= 20).length;

  const filteredProducts = products.filter(
    (p) =>
      (p.name || '').toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.category || '').toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredOrders = orders.filter(
    (o) => orderStatusFilter === 'all' || orderStatusOf(o) === orderStatusFilter
  );

  // ================= LOGIN SCREEN =================
  if (!isAdmin) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-[#0e1017] border border-[#d4af37]/40 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full bg-gray-900 border border-gray-800"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#181a26] border border-[#d4af37]/50 flex items-center justify-center text-[#d4af37] mx-auto shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-white tracking-wide">Raees Admin</h2>
            <p className="text-xs text-gray-400">Authorized administrators only</p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Email</label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-[#141622] border border-gray-700 focus:border-[#d4af37] rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Password</label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-[#141622] border border-gray-700 focus:border-[#d4af37] rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 rounded-lg gold-gradient-bg text-black font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:brightness-110 disabled:opacity-50"
            >
              {authLoading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ================= DASHBOARD =================
  const tabBtn = (id: 'overview' | 'products' | 'orders', label: string) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
        activeTab === id ? 'gold-gradient-bg text-black font-bold' : 'text-gray-400 hover:text-white'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#090a0f] text-gray-100 flex flex-col">
      <header className="bg-[#11131c] border-b border-[#d4af37]/25 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[#181a26] border border-gray-800 hover:border-[#d4af37] text-gray-300 hover:text-white"
            title="Back to store"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="font-serif font-bold text-base sm:text-lg text-white">RAEES Admin</span>
            <p className="text-[10px] text-gray-400">{user?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <nav className="flex items-center gap-1 bg-[#161824] p-1 rounded-xl border border-gray-800 text-xs">
            {tabBtn('overview', 'Overview')}
            {tabBtn('products', `Products (${products.length})`)}
            {tabBtn('orders', `Orders (${orders.length})`)}
          </nav>
          <button
            onClick={() => logout()}
            className="p-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-1.5"
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8">
        {/* ===== OVERVIEW ===== */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="luxury-card p-5 rounded-xl border border-[#d4af37]/30 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400 uppercase tracking-wider block">Total Sales</span>
                  <span className="font-serif text-2xl font-bold text-[#eed78a] block mt-1">
                    Rs. {totalRevenue.toLocaleString()}
                  </span>
                </div>
                <TrendingUp className="w-6 h-6 text-[#d4af37]" />
              </div>
              <div className="luxury-card p-5 rounded-xl border border-gray-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400 uppercase tracking-wider block">Orders</span>
                  <span className="font-serif text-2xl font-bold text-white block mt-1">{orders.length}</span>
                  <span className="text-[10px] text-gray-400">{pendingOrdersCount} pending</span>
                </div>
                <ShoppingBag className="w-6 h-6 text-blue-400" />
              </div>
              <div className="luxury-card p-5 rounded-xl border border-gray-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400 uppercase tracking-wider block">Fragrances</span>
                  <span className="font-serif text-2xl font-bold text-white block mt-1">{products.length}</span>
                </div>
                <Package className="w-6 h-6 text-purple-400" />
              </div>
              <div className="luxury-card p-5 rounded-xl border border-gray-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400 uppercase tracking-wider block">Low Stock</span>
                  <span className="font-serif text-2xl font-bold text-amber-400 block mt-1">{lowStockCount}</span>
                  <span className="text-[10px] text-amber-400/80">Below 20 units</span>
                </div>
                <AlertCircle className="w-6 h-6 text-amber-400" />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 luxury-card p-5 sm:p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                  <h3 className="font-serif font-bold text-base text-white">Recent Orders</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-[#eed78a] hover:underline flex items-center gap-1"
                  >
                    <span>View all</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                {orders.length === 0 ? (
                  <p className="text-xs text-gray-500 py-6 text-center">No orders received yet.</p>
                ) : (
                  <div className="space-y-2.5">
                    {orders.slice(0, 5).map((o) => (
                      <div
                        key={o.id}
                        onClick={() => setSelectedOrder(o)}
                        className="p-3 rounded-xl bg-[#131520] hover:bg-[#191b28] border border-gray-800/80 flex items-center justify-between text-xs cursor-pointer"
                      >
                        <div className="space-y-0.5">
                          <p className="font-bold text-white font-mono">{orderNo(o)}</p>
                          <p className="text-gray-400">{o.customerName}</p>
                        </div>
                        <div className="text-right space-y-0.5">
                          <p className="font-bold text-[#eed78a] font-serif">
                            Rs. {(Number(o.totalAmount) || 0).toLocaleString()}
                          </p>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-amber-950 text-amber-400">
                            {orderStatusOf(o)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="lg:col-span-4 luxury-card p-5 sm:p-6 rounded-2xl space-y-5">
                <h3 className="font-serif font-bold text-base text-white border-b border-gray-800 pb-3">
                  Quick Actions
                </h3>
                <button
                  onClick={openNewProductModal}
                  className="w-full py-3 rounded-xl gold-gradient-bg text-black font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Fragrance</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===== PRODUCTS ===== */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="font-serif text-2xl font-bold text-white">Products</h2>
              <button
                onClick={openNewProductModal}
                className="px-4 py-2.5 rounded-xl gold-gradient-bg text-black font-semibold text-xs uppercase tracking-wider flex items-center gap-2 hover:brightness-110"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Fragrance</span>
              </button>
            </div>

            <div className="flex items-center bg-[#131520] border border-gray-800 rounded-xl px-3.5 py-2.5 max-w-md">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search by name or category..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none w-full"
              />
            </div>

            <div className="luxury-card rounded-2xl overflow-hidden border border-gray-800">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-[#141624] text-gray-400 uppercase text-[10px] tracking-wider border-b border-gray-800">
                    <tr>
                      <th className="p-4">Fragrance</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-[#151824]">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {p.images?.[0] && (
                              <img
                                src={p.images[0]}
                                alt=""
                                className="w-10 h-12 rounded object-cover border border-gray-800 shrink-0"
                              />
                            )}
                            <p className="font-bold text-white font-serif">{p.name}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded text-[10px] uppercase font-semibold bg-[#181a28] border border-gray-700">
                            {p.category}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-[#eed78a] font-serif">
                          Rs. {(p.price || 0).toLocaleString()}
                        </td>
                        <td className="p-4">
                          <span className={`font-semibold ${(p.stock ?? 0) < 20 ? 'text-amber-400' : 'text-emerald-400'}`}>
                            {p.stock ?? 0}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditProductModal(p)}
                              className="p-1.5 rounded-lg bg-[#181a28] hover:bg-[#202334] text-blue-300 hover:text-white"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 hover:text-white"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===== ORDERS ===== */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="font-serif text-2xl font-bold text-white">Orders</h2>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="bg-[#161824] border border-gray-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none"
              >
                <option value="all">All Orders ({orders.length})</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="luxury-card rounded-2xl overflow-hidden border border-gray-800">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-[#141624] text-gray-400 uppercase text-[10px] tracking-wider border-b border-gray-800">
                    <tr>
                      <th className="p-4">Order</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Items</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Payment</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-gray-500">
                          No orders found.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((o) => (
                        <tr key={o.id} className="hover:bg-[#151824]">
                          <td className="p-4 font-mono font-bold text-[#eed78a]">{orderNo(o)}</td>
                          <td className="p-4">
                            <p className="font-semibold text-white">{o.customerName}</p>
                            <p className="text-[10px] text-gray-500">{o.phone}</p>
                            <a
                              href={confirmLink(o)}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 mt-1 text-[10px] text-emerald-400 hover:text-emerald-300"
                            >
                              <MessageCircle className="w-3 h-3" />
                              <span>Ask to confirm</span>
                            </a>
                          </td>
                          <td className="p-4 text-gray-400">
                            {(o.items || []).map((i: any) => `${i.name} x${i.quantity}`).join(', ')}
                          </td>
                          <td className="p-4 font-bold text-white font-serif">
                            Rs. {(Number(o.totalAmount) || 0).toLocaleString()}
                          </td>
                          <td className="p-4 space-y-1">
                            <p>{paymentOf(o)}</p>
                            <select
                              value={paymentStatusOf(o)}
                              onChange={(e) => handleUpdatePayment(o, e.target.value)}
                              className={`border text-[11px] font-semibold uppercase rounded px-2 py-1 focus:outline-none ${
                                paymentStatusOf(o) === 'paid'
                                  ? 'bg-emerald-950 border-emerald-700 text-emerald-400'
                                  : 'bg-amber-950 border-amber-700 text-amber-400'
                              }`}
                            >
                              <option value="unpaid">Unpaid</option>
                              <option value="paid">Paid</option>
                            </select>
                          </td>
                          <td className="p-4">
                            <select
                              value={orderStatusOf(o)}
                              onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                              className="bg-[#181a28] border border-gray-700 text-xs text-white rounded px-2 py-1 focus:outline-none"
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => setSelectedOrder(o)}
                              className="px-3 py-1.5 rounded bg-[#181a28] hover:bg-[#222536] text-[#eed78a] border border-[#d4af37]/30 text-xs"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ===== ADD / EDIT PRODUCT MODAL ===== */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-[#0f111a] border border-[#d4af37]/40 rounded-2xl p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsProductModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full bg-gray-900 border border-gray-800"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-serif text-xl font-bold text-white border-b border-gray-800 pb-3">
              {editingProduct ? `Edit: ${editingProduct.name}` : 'New Fragrance'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-medium mb-1">Fragrance Name *</label>
                  <input
                    type="text"
                    required
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    className="w-full bg-[#141622] border border-gray-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-medium mb-1">Category *</label>
                  <select
                    value={prodCategory}
                    onChange={(e: any) => setProdCategory(e.target.value)}
                    className="w-full bg-[#141622] border border-gray-700 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="unisex">Unisex</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 font-medium mb-1">Price (PKR) *</label>
                  <input
                    type="number"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full bg-[#141622] border border-gray-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-medium mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={prodStock}
                    onChange={(e) => setProdStock(Number(e.target.value))}
                    className="w-full bg-[#141622] border border-gray-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-gray-300 font-medium mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={prodDescription}
                    onChange={(e) => setProdDescription(e.target.value)}
                    className="w-full bg-[#141622] border border-gray-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-gray-300 font-medium mb-1">Image URL</label>
                  <input
                    type="text"
                    placeholder="Paste the image link here"
                    value={prodImageUrl}
                    onChange={(e) => setProdImageUrl(e.target.value)}
                    className="w-full bg-[#141622] border border-gray-700 rounded-lg px-3 py-2 text-white font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg gold-gradient-bg text-black font-semibold uppercase tracking-wider hover:brightness-110"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== ORDER DETAILS MODAL ===== */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-[#0f111a] border border-[#d4af37]/40 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full bg-gray-900 border border-gray-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="border-b border-gray-800 pb-4 flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-serif text-xl font-bold text-white font-mono">{orderNo(selectedOrder)}</h3>
              <span className="text-xs text-gray-400">{orderDate(selectedOrder)}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#131522] p-4 rounded-xl border border-gray-800">
              <div>
                <span className="text-gray-400 block font-semibold mb-1">Customer:</span>
                <p className="text-white font-bold text-sm">{selectedOrder.customerName}</p>
                <p className="text-gray-300 font-mono">{selectedOrder.phone}</p>
                <p className="text-gray-400">{selectedOrder.email}</p>
              </div>
              <div>
                <span className="text-gray-400 block font-semibold mb-1">Address:</span>
                <p className="text-white">{selectedOrder.address}</p>
                {selectedOrder.city && <p className="text-[#eed78a] font-bold">{selectedOrder.city}</p>}
              </div>
            </div>

            {selectedOrder.notes && (
              <div className="p-3 bg-[#161826] rounded-lg border border-gray-800 text-xs">
                <span className="text-gray-400 block font-semibold">Notes:</span>
                <p className="text-gray-200 mt-0.5">{selectedOrder.notes}</p>
              </div>
            )}

            <div className="divide-y divide-gray-800 text-xs">
              {(selectedOrder.items || []).map((it: any, idx: number) => (
                <div key={idx} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {(it.image || it.images?.[0]) && (
                      <img
                        src={it.image || it.images?.[0]}
                        alt=""
                        className="w-8 h-10 rounded object-cover border border-gray-800"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-white font-serif">{it.name}</p>
                      <p className="text-gray-500 text-[10px]">
                        {it.size} x {it.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-200">
                    Rs. {((Number(it.price) || 0) * (Number(it.quantity) || 1)).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-800 pt-3 flex justify-between items-baseline">
              <span className="text-xs text-gray-400 font-semibold uppercase">
                Total ({paymentOf(selectedOrder)} - {paymentStatusOf(selectedOrder)})
              </span>
              <span className="text-lg font-serif font-bold text-[#eed78a]">
                Rs. {(Number(selectedOrder.totalAmount) || 0).toLocaleString()}
              </span>
            </div>

            <div className="border-t border-gray-800 pt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Payment:</span>
                <select
                  value={paymentStatusOf(selectedOrder)}
                  onChange={(e) => handleUpdatePayment(selectedOrder, e.target.value)}
                  className="bg-[#161824] border border-gray-700 text-xs text-white rounded px-2.5 py-1.5"
                >
                  <option value="unpaid">Unpaid</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Status:</span>
                <select
                  value={orderStatusOf(selectedOrder)}
                  onChange={(e) => handleUpdateOrderStatus(selectedOrder.id, e.target.value)}
                  className="bg-[#161824] border border-gray-700 text-xs text-white rounded px-2.5 py-1.5"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={confirmLink(selectedOrder)}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded bg-emerald-950/60 hover:bg-emerald-900/70 text-emerald-300 text-xs flex items-center gap-1.5 border border-emerald-800"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Confirm on WhatsApp</span>
                </a>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded bg-[#161824] hover:bg-[#1e2030] text-gray-300 text-xs flex items-center gap-1.5 border border-gray-700"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip</span>
                </button>
                <button
                  onClick={() => handleDeleteOrder(selectedOrder.id)}
                  className="px-3 py-1.5 rounded bg-rose-950/50 hover:bg-rose-900/70 text-rose-300 text-xs flex items-center gap-1.5 border border-rose-800"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};