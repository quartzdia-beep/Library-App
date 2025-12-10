import Link from 'next/link';

export default function Navbar() {
    return (
        <nav style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4rem' }}>
                <Link href="/" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                    📚 LibrarySystem
                </Link>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link href="/books" className="btn btn-outline" style={{ border: 'none' }}>Books</Link>
                    <Link href="/members" className="btn btn-outline" style={{ border: 'none' }}>Members</Link>
                </div>
            </div>
        </nav>
    );
}
