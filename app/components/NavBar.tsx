'use client';

import Link from 'next/link';

export default function NavBar() {
  return (
    <>
      <div className="nav-bar">
        <h1 className="title">Khans' Finances</h1>
        <Link href={'/'}>Timeline</Link>
        <Link href={'/reports'}>Reports</Link>
        <Link href={'/settings'}>Settings</Link>
      </div>
    </>
  );
}
