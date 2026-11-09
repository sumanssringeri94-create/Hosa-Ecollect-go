import React, { useState } from 'react';
import { storageService } from '../../services/storageService';
import PageHeader from '../../components/common/PageHeader';
import SearchBar from '../../components/common/SearchBar';
import FilterDropdown from '../../components/common/FilterDropdown';
import Modal from '../../components/common/Modal';
import { Users, User, ShieldCheck, Factory, Truck, Ban, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState(storageService.getUsers());
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);

  const handleToggleStatus = (id) => {
    const updated = storageService.toggleUserStatus(id);
    setUsers(storageService.getUsers());
    toast.success(`User status updated to ${updated?.status}`);
  };

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.city && u.city.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="User & Partner Directory"
        subtitle="Manage registered citizen accounts, recyclers, fleet drivers, and administrative staff."
        badge={`${users.length} Registered`}
      />

      <div className="card p-4 bg-white border border-sand-300 flex flex-col sm:flex-row items-center justify-between gap-3">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by name, email, or city..."
          className="w-full sm:w-80"
        />

        <FilterDropdown
          value={roleFilter}
          onChange={setRoleFilter}
          allLabel="All Roles"
          options={[
            { value: 'user', label: 'Citizens & Enterprises' },
            { value: 'recycler', label: 'Recycler Partners' },
            { value: 'logistics', label: 'Logistics Couriers' },
            { value: 'admin', label: 'Platform Admins' },
          ]}
          className="w-full sm:w-52"
        />
      </div>

      <div className="card overflow-hidden bg-white border border-sand-300 shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-earth-800">
            <thead className="bg-sand-50 border-b border-sand-200 text-earth-900 uppercase font-semibold text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Organization / City</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-200/80">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-sand-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                        alt={u.name}
                        className="w-8 h-8 rounded-full object-cover border border-sand-300"
                      />
                      <div>
                        <div className="font-bold text-earth-950">{u.name}</div>
                        <div className="text-[11px] text-earth-400 font-mono">{u.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                        u.role === 'admin'
                          ? 'bg-forest-100 text-forest-900 border border-forest-300'
                          : u.role === 'recycler'
                          ? 'bg-terracotta-100 text-terracotta-800 border border-terracotta-200'
                          : u.role === 'logistics'
                          ? 'bg-olive-100 text-olive-800 border border-olive-200'
                          : 'bg-sand-100 text-earth-800 border border-sand-200'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-medium text-earth-900">{u.organization || 'Individual Citizen'}</div>
                    <div className="text-[11px] text-earth-400">{u.city || 'Bengaluru'}</div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                        u.status === 'Active'
                          ? 'bg-forest-50 text-forest-700 border border-forest-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'Active' ? 'bg-forest-600' : 'bg-red-600'}`} />
                      {u.status || 'Active'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-earth-500 whitespace-nowrap">
                    {u.joinedDate || '2024-01-01'}
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedUser(u)}
                        className="btn-secondary text-[11px] py-1 px-2.5"
                      >
                        Inspect
                      </button>

                      {u.role !== 'admin' && (
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(u.id)}
                          className={`text-[11px] py-1 px-2.5 rounded-xl border font-medium transition-colors ${
                            u.status === 'Active'
                              ? 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200'
                              : 'bg-forest-50 hover:bg-forest-100 text-forest-700 border-forest-200'
                          }`}
                        >
                          {u.status === 'Active' ? 'Suspend' : 'Activate'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect User Modal */}
      {selectedUser && (
        <Modal
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          title={`User Profile: ${selectedUser.name}`}
          subtitle={`Account role: ${selectedUser.role.toUpperCase()}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-sand-100/70 border border-sand-200">
              <img
                src={selectedUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt={selectedUser.name}
                className="w-12 h-12 rounded-full object-cover border border-sand-300"
              />
              <div>
                <h4 className="font-bold text-earth-950 text-sm">{selectedUser.name}</h4>
                <div className="text-earth-500 font-mono text-[11px]">{selectedUser.email}</div>
                <div className="text-earth-500 mt-0.5">{selectedUser.phone || 'Phone not set'}</div>
              </div>
            </div>

            <div className="space-y-2 p-3 bg-white rounded-xl border border-sand-200">
              <div>
                <span className="text-earth-400 block text-[10px] uppercase font-bold">Organization</span>
                <span className="font-semibold text-earth-900">{selectedUser.organization || 'None (Private Individual)'}</span>
              </div>
              <div>
                <span className="text-earth-400 block text-[10px] uppercase font-bold">Address & City</span>
                <span className="font-semibold text-earth-900">{selectedUser.address || 'Address on file'} — {selectedUser.city}</span>
              </div>
              <div>
                <span className="text-earth-400 block text-[10px] uppercase font-bold">Account Status</span>
                <span className="font-semibold text-earth-900">{selectedUser.status || 'Active'}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="btn-secondary text-xs py-2 px-4"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
