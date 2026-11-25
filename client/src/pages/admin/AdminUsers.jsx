import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api';
import PageHeader from '../../components/common/PageHeader';
import SearchBar from '../../components/common/SearchBar';
import FilterDropdown from '../../components/common/FilterDropdown';
import Modal from '../../components/common/Modal';
import UserAvatar from '../../components/common/UserAvatar';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { Users, User, ShieldCheck, Factory, Truck, Ban, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getUsers();
      setUsers(res.users || []);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleStatus = async (user) => {
    const id = user._id || user.id;
    const currentActive = user.isActive !== undefined ? user.isActive : user.status === 'Active';
    try {
      await adminApi.updateUserStatus(id, !currentActive);
      toast.success(`User status updated to ${!currentActive ? 'Active' : 'Suspended'}`);
      await loadUsers();
    } catch (err) {
      toast.error(err.message || 'Failed to update user status');
    }
  };

  const filtered = users.filter((u) => {
    const matchesSearch =
      (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
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

      {loading ? (
        <div className="card p-6 bg-white border border-sand-300">
          <LoadingSkeleton type="table" count={6} />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No users match your criteria"
          description="Adjust your search filters or role parameter to view accounts."
        />
      ) : (
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
                {filtered.map((u) => {
                  const uId = u._id || u.id;
                  const isActive = u.isActive !== undefined ? u.isActive : u.status === 'Active';
                  const joinedDate = u.createdAt ? new Date(u.createdAt).toISOString().split('T')[0] : (u.joinedDate || '2024-01-01');

                  return (
                    <tr key={uId} className="hover:bg-sand-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <UserAvatar
                            name={u.name}
                            className="w-8 h-8 border border-sand-300"
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
                        <div className="font-medium text-earth-900">{u.organization || u.companyName || 'Individual Citizen'}</div>
                        <div className="text-[11px] text-earth-400">{u.city || 'Bengaluru'}</div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                            isActive
                              ? 'bg-forest-50 text-forest-700 border border-forest-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-forest-600' : 'bg-red-600'}`} />
                          {isActive ? 'Active' : 'Suspended'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-earth-500 whitespace-nowrap">
                        {joinedDate}
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
                              onClick={() => handleToggleStatus(u)}
                              className={`text-[11px] py-1 px-2.5 rounded-xl border font-medium transition-colors ${
                                isActive
                                  ? 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200'
                                  : 'bg-forest-50 hover:bg-forest-100 text-forest-700 border-forest-200'
                              }`}
                            >
                              {isActive ? 'Suspend' : 'Activate'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inspect User Modal */}
      {selectedUser && (
        <Modal
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          title={`User Profile: ${selectedUser.name}`}
          subtitle={`Account role: ${(selectedUser.role || '').toUpperCase()}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-sand-100/70 border border-sand-200">
              <UserAvatar
                name={selectedUser.name}
                className="w-12 h-12 border border-sand-300"
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
                <span className="font-semibold text-earth-900">{selectedUser.organization || selectedUser.companyName || 'None (Private Individual)'}</span>
              </div>
              <div>
                <span className="text-earth-400 block text-[10px] uppercase font-bold">Address & City</span>
                <span className="font-semibold text-earth-900">{selectedUser.address || 'Address on file'} — {selectedUser.city || 'Bengaluru'}</span>
              </div>
              <div>
                <span className="text-earth-400 block text-[10px] uppercase font-bold">Account Status</span>
                <span className="font-semibold text-earth-900">{selectedUser.isActive !== false ? 'Active' : 'Suspended'}</span>
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
