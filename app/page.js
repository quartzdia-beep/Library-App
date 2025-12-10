import Image from "next/image";
import { getBooks, getMembers } from '@/lib/actions';
import Card from '@/components/ui/Card';
import Link from 'next/link';

export default async function Home() {
  const books = await getBooks();
  const members = await getMembers();

  const availableBooks = books.filter(b => b.status === 'Available').length;
  const borrowedBooks = books.filter(b => b.status === 'Borrowed').length;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Dashboard</h1>
        <p style={{ color: 'var(--text-muted)' }}>Welcome to the Library Management System</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <Card>
          <h3 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Total Books</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{books.length}</p>
        </Card>
        <Card>
          <h3 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Available</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--secondary)' }}>{availableBooks}</p>
        </Card>
        <Card>
          <h3 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Borrowed</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent)' }}>{borrowedBooks}</p>
        </Card>
        <Card>
          <h3 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Members</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{members.length}</p>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2>Recent Books</h2>
            <Link href="/books" style={{ color: 'var(--primary)', fontWeight: '500' }}>View All &rarr;</Link>
          </div>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {books.slice(0, 3).map(book => (
              <Card key={book.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontWeight: '600' }}>{book.title}</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>by {book.author}</p>
                </div>
                <span style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  backgroundColor: book.status === 'Available' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  color: book.status === 'Available' ? 'var(--secondary)' : 'var(--accent)'
                }}>
                  {book.status}
                </span>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
