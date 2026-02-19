import { Link } from 'react-router-dom';

const TopBar = () => (
  <div className="flex justify-between items-center">
    <h1 className="text-2xl font-semibold">Analytics Dashboard</h1>
    <button className="px-4 py-2 bg-gray-900 text-white rounded">
      Export
    </button>
  </div>
);
const StatsCards = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    <Stat title="Total Revenue" value="$21,830" />
    <Stat title="Total Products" value="124" />
    <Stat title="Total Orders" value="512" />
    <Stat title="Active Users" value="48" />
  </div>
);

const Stat = ({ title, value }) => (
  <div className="bg-white rounded-lg p-4 shadow">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);
const SidebarItem = ({ to, text }) => (
  <Link
    to={to}
    className="px-3 py-2 rounded hover:bg-gray-800 cursor-pointer block"
  >
    {text}
  </Link>
);

const sidebarList = [
  { to: "/Admin", text: "Manage Products" },
  { to: "/Analytics/", text: "Analitika" },]

function AdminDashboard() {
  

  return (
    <div className="fixed inset-y-0 left-0 flex bg-gray-100 mt-[100px] shadow-xl">
      
      {/* SIDEBAR */}
      <aside className="w-60 bg-gray-900 text-white flex flex-col">
        <div className="p-4 font-bold text-lg border-b border-gray-700">
          Admin Menu
        </div>

        <nav className="flex-1 p-4 space-y-2 text-sm">
          {/* <SidebarItem text="Dashboard" />
          <SidebarItem text="Manage Products" />
          <SidebarItem text="Manage Categories" />
          <SidebarItem text="Messages" />
          <SidebarItem text="Users" />
          <SidebarItem text="Settings" /> */}
          {sidebarList.map((item) => (
            <SidebarItem key={item.text} to={item.to} text={item.text} />
          ))}
        </nav>
      </aside>
    </div>
  );
}

export default AdminDashboard;