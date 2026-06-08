'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import type { Profile } from '@/types';
import styles from './DashboardLayout.module.css';

interface NavItem {
  href: string;
  icon: string;
  label: string;
}

interface Props {
  children: React.ReactNode;
  navItems: NavItem[];
  sidebarTitle: string;
  sidebarSub: string;
}

export default function DashboardLayout({ children, navItems, sidebarTitle, sidebarSub }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/auth/login'); return; }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setProfile(data);
      setLoading(false);
    };
    getProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner} />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <div className={styles.sidebarLogoImg}>K</div>
          <div className={styles.sidebarBrand}>
            {sidebarTitle}
            <span>{sidebarSub}</span>
          </div>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${pathname === item.href ? styles.navItemActive : ''}`}
            >
              <span className={styles.navIc}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarBottom}>
          {profile && (
            <div className={styles.userInfo}>
              <div className={styles.userAvatar}>
                {profile.nama_depan.charAt(0)}
              </div>
              <div>
                <div className={styles.userName}>{profile.nama_depan} {profile.nama_belakang}</div>
                <div className={styles.userRole}>{profile.role}</div>
              </div>
            </div>
          )}
          <button className={styles.logoutBtn} onClick={handleLogout}>
            🚪 Keluar
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}
