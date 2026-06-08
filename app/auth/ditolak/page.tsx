'use client';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import styles from '../menunggu/page.module.css';

export default function DitolakPage() {
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.icon}>❌</div>
        <h1 className={styles.title}>Pendaftaran Ditolak</h1>
        <p className={styles.desc}>
          Mohon maaf, pendaftaran Anda tidak dapat disetujui oleh Admin KEMANUSA Parepare.
        </p>
        <div className={styles.infoBox}>
          <div className={styles.infoItem}>
            <span className={styles.infoIc}>📱</span>
            <div>
              <strong>Hubungi Admin</strong>
              <span>Tanyakan alasan penolakan via WhatsApp atau email resmi KEMANUSA</span>
            </div>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoIc}>🔄</span>
            <div>
              <strong>Daftar Ulang</strong>
              <span>Anda bisa mendaftar ulang dengan email berbeda setelah klarifikasi</span>
            </div>
          </div>
        </div>
        <div className={styles.actions}>
          <button onClick={handleLogout} className={styles.btnRefresh}>
            Kembali ke Halaman Utama
          </button>
        </div>
      </div>
    </div>
  );
}
