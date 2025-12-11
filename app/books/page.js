import { getBooks, returnBook } from '@/lib/actions';
import Card from '@/components/ui/Card';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default async function BooksPage() {
    const books = await getBooks();

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem' }}>Books</h1>
                <Link href="/books/add">
                    <Button>+ Add Book</Button>
                </Link>
            </div>

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
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>ISBN: {book.isbn}</p>

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
                                backgroundColor: book.status === 'Available' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                color: book.status === 'Available' ? 'var(--secondary)' : 'var(--accent)'
                            }}>
                                {book.status}
                            </span>

                            {book.status === 'Borrowed' ? (
                                <form action={returnBook}>
                                    <input type="hidden" name="bookId" value={book.id} />
                                    <Button type="submit" variant="outline" style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem' }}>Return</Button>
                                </form>
                            ) : (
                                <Link href={`/books/borrow/${book.id}`}>
                                    <Button variant="outline" style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem' }}>Borrow</Button>
                                </Link>
                            )}
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
