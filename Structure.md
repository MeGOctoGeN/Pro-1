<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MedCore SuperApp | SaaS Prototype v5.0</title>
    
    <!-- 1. React & Babel (The Engine) -->
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    
    <!-- 2. Tailwind CSS (The Styling) -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- 3. Icons -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">

    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        body { font-family: 'Inter', sans-serif; background-color: #0f172a; }
        
        /* Animations */
        .slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        
        .pulse-ring { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7); animation: pulse-ring 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite; }
        @keyframes pulse-ring { 0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7); } 70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(99, 102, 241, 0); } 100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); } }
    </style>
</head>
<body>
    <div id="root"></div>

    <script type="text/babel">
        const { useState, useEffect, useMemo } = React;

        // ==================== 1. MOCK SQL DATABASE (Shared State) ====================
        const INITIAL_DB = {
            inventory: [
                { id: 101, name: "Panadol Extra", cat: "Analgesic", price: 12.50, stock: 150, image: "💊" },
                { id: 102, name: "Augmentin 1g", cat: "Antibiotic", price: 45.00, stock: 5, image: "🧪" }, // Low Stock!
                { id: 103, name: "Metformin 500mg", cat: "Diabetes", price: 18.00, stock: 12, image: "🩸" }, // Low Stock!
                { id: 104, name: "Vitamin C", cat: "Supplement", price: 25.00, stock: 200, image: "🍊" },
                { id: 105, name: "Lisinopril", cat: "Cardio", price: 30.00, stock: 40, image: "❤️" }
            ],
            orders: [],
            agentLogs: [] // Stores LangGraph steps
        };

        // ==================== 2. MAIN APP COMPONENT ====================
        function App() {
            const [view, setView] = useState('landing'); // landing, staff, customer
            const [db, setDb] = useState(INITIAL_DB);
            const [cart, setCart] = useState([]);

            // --- SHARED ACTIONS ---
            
            // Customer buys items -> Updates SQL DB
            const processOrder = (customerName, items, total) => {
                const newOrder = { id: Date.now(), customer: customerName, items, total, status: 'New', date: new Date().toLocaleTimeString() };
                
                // Update Inventory (SQL Logic)
                const updatedInventory = db.inventory.map(item => {
                    const purchased = items.find(i => i.id === item.id);
                    if (purchased) return { ...item, stock: item.stock - purchased.qty };
                    return item;
                });

                // Check for Low Stock Trigger (Simulating LangGraph Trigger)
                updatedInventory.forEach(item => {
                    if (item.stock < 15) triggerAgent(item.name);
                });

                setDb(prev => ({
                    ...prev,
                    inventory: updatedInventory,
                    orders: [newOrder, ...prev.orders]
                }));
                setCart([]);
            };

            // "LangGraph" Agent Simulation
            const triggerAgent = (itemName) => {
                addAgentLog(`System Alert: Low stock detected for ${itemName}.`);
                
                setTimeout(() => addAgentLog(`Vertex AI: Analyzing purchase history for ${itemName}...`), 1000);
                setTimeout(() => addAgentLog(`SQL Query: SELECT * FROM suppliers WHERE item = '${itemName}' ORDER BY price ASC`), 2500);
                setTimeout(() => addAgentLog(`Decision Node: Found 'Julphar' offers best price (AED 12.00).`), 4000);
                setTimeout(() => addAgentLog(`Action: Purchase Order Drafted. Waiting for Manager Approval.`), 5500);
            };

            const addAgentLog = (msg) => {
                setDb(prev => ({ ...prev, agentLogs: [{ time: new Date().toLocaleTimeString(), msg }, ...prev.agentLogs] }));
            };

            // --- VIEW ROUTING ---
            if (view === 'landing') return <LandingPage setView={setView} />;
            if (view === 'staff') return <StaffPortal db={db} setView={setView} />;
            if (view === 'customer') return <CustomerApp db={db} cart={cart} setCart={setCart} processOrder={processOrder} setView={setView} />;
        }

        // ==================== 3. LANDING PAGE (The Portal) ====================
        function LandingPage({ setView }) {
            return (
                <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
                    <div className="text-center space-y-8 slide-up">
                        <div className="mb-6">
                            <div className="w-24 h-24 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center text-5xl shadow-2xl shadow-blue-500/30 mb-4">
                                <i className="fas fa-cube"></i>
                            </div>
                            <h1 className="text-5xl font-extrabold tracking-tight">MedCore <span className="text-blue-400">SuperApp</span></h1>
                            <p className="text-slate-400 mt-2 text-lg">Unified Healthcare SaaS Platform</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                            {/* Staff Door */}
                            <button onClick={() => setView('staff')} className="group relative bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-blue-500 p-8 rounded-2xl transition-all duration-300 text-left">
                                <div className="absolute top-4 right-4 text-slate-600 group-hover:text-blue-500"><i className="fas fa-arrow-right text-xl"></i></div>
                                <div className="text-3xl mb-3 text-blue-500"><i className="fas fa-user-shield"></i></div>
                                <h3 className="text-xl font-bold">Staff Portal</h3>
                                <p className="text-sm text-slate-400 mt-2">Access ERP, SQL Commander, and AI Agents.</p>
                            </button>

                            {/* Customer Door */}
                            <button onClick={() => setView('customer')} className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-green-400 p-8 rounded-2xl transition-all duration-300 text-left">
                                <div className="absolute top-4 right-4 text-slate-600 group-hover:text-green-400"><i className="fas fa-arrow-right text-xl"></i></div>
                                <div className="text-3xl mb-3 text-green-400"><i className="fas fa-shopping-bag"></i></div>
                                <h3 className="text-xl font-bold">Patient Store</h3>
                                <p className="text-sm text-slate-400 mt-2">Order meds, track refills, and chat with AI.</p>
                            </button>
                        </div>
                        <p className="text-xs text-slate-600 font-mono">v5.0.1 | Powered by Vertex AI & React</p>
                    </div>
                </div>
            );
        }

        // ==================== 4. SIDE A: STAFF PORTAL (The Command Center) ====================
        function StaffPortal({ db, setView }) {
            const [tab, setTab] = useState('dashboard');

            // Calculate Stats
            const lowStock = db.inventory.filter(i => i.stock < 15).length;
            const totalSales = db.orders.reduce((acc, o) => acc + o.total, 0);

            return (
                <div className="h-screen flex bg-slate-900 text-slate-200 font-sans">
                    {/* Sidebar */}
                    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col">
                        <div className="p-6 flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center"><i className="fas fa-user-md text-white text-xs"></i></div>
                            <span className="font-bold tracking-wide">MedCore <span className="text-xs bg-slate-800 px-1 rounded text-slate-400">ERP</span></span>
                        </div>
                        <nav className="flex-1 px-4 space-y-2">
                            <SidebarBtn icon="chart-pie" label="Dashboard" active={tab==='dashboard'} onClick={() => setTab('dashboard')} />
                            <SidebarBtn icon="boxes" label="Inventory (SQL)" active={tab==='inventory'} onClick={() => setTab('inventory')} />
                            <SidebarBtn icon="robot" label="Agent Monitor" active={tab==='agent'} onClick={() => setTab('agent')} isNew={true} />
                        </nav>
                        <div className="p-4 border-t border-slate-800">
                            <button onClick={() => setView('landing')} className="w-full text-left text-slate-500 hover:text-white text-sm"><i className="fas fa-sign-out-alt mr-2"></i> Logout</button>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 overflow-y-auto p-8">
                        {tab === 'dashboard' && (
                            <div className="space-y-6 slide-up">
                                <h2 className="text-2xl font-bold text-white">Enterprise Overview</h2>
                                <div className="grid grid-cols-3 gap-6">
                                    <StatCard title="Total Revenue" value={`AED ${totalSales.toFixed(2)}`} icon="wallet" color="text-emerald-400" />
                                    <StatCard title="Pending Orders" value={db.orders.length} icon="clipboard-list" color="text-blue-400" />
                                    <StatCard title="Critical Stock" value={lowStock} icon="exclamation-triangle" color="text-red-500" alert={lowStock > 0} />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                                        <h3 className="font-bold text-white mb-4">Live Sales Feed</h3>
                                        <div className="space-y-3">
                                            {db.orders.length === 0 ? <p className="text-slate-500 text-sm">No orders yet.</p> : 
                                             db.orders.slice(0,5).map(o => (
                                                <div key={o.id} className="flex justify-between text-sm border-b border-slate-700 pb-2">
                                                    <span><span className="text-blue-400 font-bold">{o.customer}</span> bought {o.items.length} items</span>
                                                    <span className="text-emerald-400 font-mono">AED {o.total}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 flex flex-col">
                                        <h3 className="font-bold text-white mb-4">LangGraph Agent Status</h3>
                                        <div className="flex-1 bg-slate-950 rounded-lg p-4 font-mono text-xs text-green-400 overflow-y-auto h-48">
                                            {db.agentLogs.length === 0 ? "> Agent is idle. Waiting for triggers..." : 
                                             db.agentLogs.map((l, i) => <div key={i} className="mb-1"><span className="text-slate-500">[{l.time}]</span> {l.msg}</div>)
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {tab === 'inventory' && (
                            <div className="slide-up">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-white">SQL Inventory Database</h2>
                                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold">Run SQL Query</button>
                                </div>
                                <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
                                    <table className="w-full text-left text-sm text-slate-300">
                                        <thead className="bg-slate-950 text-xs uppercase font-bold text-slate-500">
                                            <tr><th className="p-4">ID</th><th className="p-4">Product</th><th className="p-4">Category</th><th className="p-4">Stock</th><th className="p-4 text-right">Price</th></tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-700">
                                            {db.inventory.map(item => (
                                                <tr key={item.id} className="hover:bg-slate-700/50">
                                                    <td className="p-4 font-mono text-slate-500">#{item.id}</td>
                                                    <td className="p-4 font-bold text-white">{item.image} {item.name}</td>
                                                    <td className="p-4"><span className="bg-slate-700 px-2 py-1 rounded text-xs">{item.cat}</span></td>
                                                    <td className={`p-4 font-mono font-bold ${item.stock < 15 ? 'text-red-500' : 'text-green-400'}`}>{item.stock}</td>
                                                    <td className="p-4 text-right font-mono">AED {item.price.toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {tab === 'agent' && (
                            <div className="slide-up text-center py-20">
                                <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6 pulse-ring">
                                    <i className="fas fa-brain text-4xl text-indigo-400"></i>
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">Vertex AI Agent Manager</h2>
                                <p className="text-slate-400 max-w-md mx-auto mb-8">Visualizing the LangGraph workflow nodes. The agent monitors the SQL database 24/7 for shortages and price changes.</p>
                                <div className="flex justify-center gap-4 text-xs font-mono text-slate-500">
                                    <div className="bg-slate-800 p-3 rounded border border-indigo-500/30 text-indigo-300">1. MONITOR STOCK</div>
                                    <div className="self-center text-slate-600">→</div>
                                    <div className="bg-slate-800 p-3 rounded border border-slate-700">2. CHECK SUPPLIERS</div>
                                    <div className="self-center text-slate-600">→</div>
                                    <div className="bg-slate-800 p-3 rounded border border-slate-700">3. DRAFT ORDER</div>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            );
        }

        // ==================== 5. SIDE B: CUSTOMER APP (The E-Commerce Store) ====================
        function CustomerApp({ db, cart, setCart, processOrder, setView }) {
            const [page, setPage] = useState('store');
            const [showChat, setShowChat] = useState(false);

            const addToCart = (item) => {
                const existing = cart.find(i => i.id === item.id);
                if (existing) {
                    setCart(cart.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
                } else {
                    setCart([...cart, { ...item, qty: 1 }]);
                }
            };

            const total = cart.reduce((acc, i) => acc + (i.price * i.qty), 0);

            return (
                <div className="h-screen bg-slate-50 text-slate-800 flex flex-col font-sans overflow-hidden">
                    {/* Mobile App Header */}
                    <header className="bg-white border-b border-slate-200 p-4 flex justify-between items-center shadow-sm z-10">
                        <button onClick={() => setView('landing')} className="text-slate-400"><i className="fas fa-chevron-left"></i> Back</button>
                        <h1 className="font-bold text-lg text-slate-800">MedCore Health</h1>
                        <button onClick={() => setPage('cart')} className="relative text-slate-600">
                            <i className="fas fa-shopping-cart text-xl"></i>
                            {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{cart.length}</span>}
                        </button>
                    </header>

                    {/* Store Content */}
                    <main className="flex-1 overflow-y-auto p-4 pb-24">
                        {page === 'store' && (
                            <>
                                {/* Promo Banner */}
                                <div className="bg-gradient-to-r from-green-400 to-emerald-600 rounded-xl p-6 text-white mb-6 shadow-lg">
                                    <h2 className="font-bold text-xl mb-1">Refill & Save</h2>
                                    <p className="text-green-100 text-sm mb-3">Get 10% off your chronic medication refills today.</p>
                                    <button className="bg-white text-green-600 px-4 py-1.5 rounded-full text-xs font-bold shadow">Order Refill</button>
                                </div>

                                {/* Categories */}
                                <div className="flex gap-3 overflow-x-auto pb-4 mb-2 no-scrollbar">
                                    {['All', 'Pain', 'Antibiotics', 'Supplements', 'Diabetes'].map(c => (
                                        <button key={c} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold whitespace-nowrap hover:border-green-500 hover:text-green-600">{c}</button>
                                    ))}
                                </div>

                                {/* Products Gr
this build and creat with 🤍,By DR-Ai/Mostafa_Elmourabea(https://mostaelmourabeacom.link)
