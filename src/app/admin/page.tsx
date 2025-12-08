import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import AdminDashboard from './AdminDashboard';

export default async function AdminPage() {
  // Server-side authentication check
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect('/admin/login');
  }

  return <AdminDashboard />;
}

