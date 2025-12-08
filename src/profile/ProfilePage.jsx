// src/profile/ProfilePage.jsx
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function ProfilePage(){
  const nav = useNavigate();
  const { user, setUser } = useUser(); // Access user and setUser from UserContext

  function logout(){
    setUser(null); // Clear global user state
    nav("/");
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white px-4 py-24">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <img src="/avatar.png" alt="Avatar" className="w-16 h-16 rounded-2xl bg-gray-200 object-cover" />
          <div>
            <div className="text-xl font-semibold">{user?.name || "Guest"}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{user?.email || "Not set"}</div>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <input placeholder="Full name" defaultValue={user?.name || ""} className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-white/10" />
          <input placeholder="Phone" className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-white/10" />
          <input placeholder="Email" defaultValue={user?.email || ""} className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-white/10" />
          <input placeholder="Alt email" className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-white/10" />
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-xl bg-emerald-600 text-white">Save</button>
          <button onClick={logout} className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/10">Logout</button>
        </div>
        <div>
          <div className="text-lg font-semibold mb-2">Orders</div>
          <div className="space-y-3">
            {[1,2,3].map(i=>(
              <div key={i} className="p-3 rounded-2xl ring-1 ring-black/10 flex items-center justify-between">
                <div>
                  <div className="font-semibold">Order #{10230+i}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">Delivered • ${399 + i*15}</div>
                </div>
                <button className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-white/10">Reorder</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
