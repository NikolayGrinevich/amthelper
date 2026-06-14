'use client';

import { useEffect, useState } from 'react';

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/subscriptions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'status' }) });
        const data = await res.json();
        setSubscription(data);
      } catch (e) {
        // keep as null
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Subscription</h1>

        {loading ? (
          <div className="bg-white rounded-xl shadow p-12 text-center text-gray-500">Loading…</div>
        ) : subscription?.active ? (
          <div className="bg-white rounded-xl shadow p-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Current plan</p>
                <p className="text-2xl font-bold text-gray-900">{subscription.plan ?? 'Pro'}</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">Active</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="text-gray-900">{subscription.status ?? 'active'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Next billing</p>
              <p className="text-gray-900">{subscription.current_period_end ?? '—'}</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow p-12 text-center text-gray-600">
            <p className="text-lg mb-4">No active subscription</p>
            <a href="/pricing" className="text-blue-600 hover:underline">View plans</a>
          </div>
        )}
      </div>
    </div>
  );
}
