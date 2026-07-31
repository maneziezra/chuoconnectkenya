import type { Metadata } from 'next';
import PortalLoginGate from '@/components/portal/PortalLoginGate';

export const metadata: Metadata = {
  title: 'University Partner Portal',
  description: 'Manage your institution\'s presence on Chuo Connect Kenya. Access analytics, leads, profile management, and student reviews.',
};

export default function PortalPage() {
  return <PortalLoginGate />;
}
