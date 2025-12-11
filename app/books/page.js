
import { getBooks, returnBook, renewBook } from '@/lib/actions';
import Card from '@/components/ui/Card';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default async function BooksPage({ searchParams }) {
    const params = await searchParams; // Next.js 15+ needs await for searchParams
    const query = params?.query || '';
    const view = params?.view || 'grid';

    const books = await getBooks(query);

    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 style={{ fontSize: '2rem' }}>Books</h1>
                    <Link href="/books/add">
                        <Button>+ Add Book</Button>
                    </Link>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <form style={{ flex: 1, display: 'flex', gap: '0.5rem' }}>
                        {view === 'list' && <input type="hidden" name="view" value="list" />}
                        <Input
                            name="query"
                            defaultValue={query}
                            placeholder="Search by title, author, or ISBN..."
                            style={{ maxWidth: '400px' }}
                        />
                        {query && (
                            <Link href={`/books?view=${view}`}>
                                <Button type="button" variant="outline" style={{ padding: '0 1rem' }}>X</Button>
                            </Link>
                        )}
                        <Button type="submit" variant="secondary">Search</Button>
                    </form>

                    <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'var(--surface)', padding: '0.25rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                        <Link href={`/books?query=${query}&view=grid`}>
                            <button style={{
                                padding: '0.5rem',
                                borderRadius: 'var(--radius)',
                                border: 'none',
                                background: view === 'grid' ? 'var(--primary)' : 'transparent',
                                color: view === 'grid' ? 'white' : 'var(--text-muted)',
                                cursor: 'pointer'
                            }} title="Grid View">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                            </button>
                        </Link>
                        <Link href={`/books?query=${query}&view=list`}>
                            <button style={{
                                padding: '0.5rem',
                                borderRadius: 'var(--radius)',
                                border: 'none',
                                background: view === 'list' ? 'var(--primary)' : 'transparent',
                                color: view === 'list' ? 'white' : 'var(--text-muted)',
                                cursor: 'pointer'
                            }} title="List View">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {view === 'grid' ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {books.map(book => (
                        <Card key={book.id} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <div style={{ marginBottom: 'auto' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', fontWeight: '600' }}>{book.title}</h3>
                                        <p style={{ color: 'var(--text-muted)' }}>{book.author}</p>
                                    </div>
                                </div>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>ISBN: {book.isbn || 'N/A'}</p>

                                {book.status === 'Borrowed' && (
                                    <div style={{ fontSize: '0.875rem', padding: '0.5rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: 'var(--radius)', marginBottom: '1rem' }}>
                                        <p style={{ color: 'var(--accent)', fontWeight: '500' }}>Due: {book.due_date}</p>
                                    </div>
                                )}
                            </div>

                            <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '999px',
                                    fontSize: '0.75rem',
                                    fontWeight: '500',
                                    backgroundColor: (book.status?.toLowerCase() === 'available') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                    color: (book.status?.toLowerCase() === 'available') ? 'var(--secondary)' : 'var(--accent)'
                                }}>
                                    {(book.status?.toLowerCase() === 'available') ? 'Available' : book.status}
                                </span>

                                {book.status === 'Borrowed' ? (
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <form action={renewBook}>
                                            <input type="hidden" name="bookId" value={book.id} />
                                            <Button
                                                type="submit"
                                                variant="secondary"
                                                style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem' }}
                                                disabled={(book.renewal_count || 0) >= 3}
                                                title={(book.renewal_count || 0) >= 3 ? "Maximum renewals reached" : "Renew for 14 days"}
                                            >
                                                Renew ({(book.renewal_count || 0)}/3)
                                            </Button>
                                        </form>
                                        <form action={returnBook}>
                                            <input type="hidden" name="bookId" value={book.id} />
                                            <Button type="submit" variant="outline" style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem' }}>Return</Button>
                                        </form>
                                    </div>
                                ) : (
                                    <Link href={`/books/borrow/${book.id}`}>
                                        <Button variant="outline" style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem' }}>Borrow</Button>
                                    </Link>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                                <th style={{ padding: '1rem', fontWeight: '600' }}>Title</th>
                                <th style={{ padding: '1rem', fontWeight: '600' }}>Author</th>
                                <th style={{ padding: '1rem', fontWeight: '600' }}>ISBN</th>
                                <th style={{ padding: '1rem', fontWeight: '600' }}>Status</th>
                                <th style={{ padding: '1rem', fontWeight: '600' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map(book => (
                                <tr key={book.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem' }}>{book.title}</td>
                                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{book.author}</td>
                                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{book.isbn || 'N/A'}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '999px',
                                            fontSize: '0.75rem',
                                            fontWeight: '500',
                                            backgroundColor: (book.status?.toLowerCase() === 'available') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                            color: (book.status?.toLowerCase() === 'available') ? 'var(--secondary)' : 'var(--accent)'
                                        }}>
                                            {(book.status?.toLowerCase() === 'available') ? 'Available' : book.status}
                                        </span>
                                        {book.status === 'Borrowed' && (
                                            <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', color: 'var(--text-muted)' }}>Due: {book.due_date}</div>
                                        )}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {book.status === 'Borrowed' ? (
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <form action={renewBook}>
                                                    <input type="hidden" name="bookId" value={book.id} />
                                                    <Button
                                                        type="submit"
                                                        variant="secondary"
                                                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                                                        disabled={(book.renewal_count || 0) >= 3}
                                                    >
                                                        Renew ({(book.renewal_count || 0)}/3)
                                                    </Button>
                                                </form>
                                                <form action={returnBook}>
                                                    <input type="hidden" name="bookId" value={book.id} />
                                                    <Button type="submit" variant="outline" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>Return</Button>
                                                </form>
                                            </div>
                                        ) : (
                                            <Link href={`/books/borrow/${book.id}`}>
                                                <Button variant="outline" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>Borrow</Button>
                                            </Link>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            )}
        </div>
    );
}
