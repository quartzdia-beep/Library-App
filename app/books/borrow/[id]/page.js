import { getBookById, getMembers, borrowBook } from '@/lib/actions';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { redirect } from 'next/navigation';

export default async function BorrowPage({ params }) {
    const { id } = await params;
    const book = await getBookById(id);
    const members = await getMembers();

    async function handleSubmit(formData) {
        'use server';
        await borrowBook(formData);
        redirect('/books');
    }

    if (!book) return <div>Book not found</div>;

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Borrow Book</h1>
            <Card>
                <div style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{book.title}</h2>
                    <p style={{ color: 'var(--text-muted)' }}>{book.author}</p>
                </div>

                <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <input type="hidden" name="bookId" value={book.id} />

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Select Member</label>
                        <select
                            name="memberId"
                            required
                            style={{
                                width: '100%',
                                padding: '0.5rem 0.75rem',
                                borderRadius: 'var(--radius)',
                                border: '1px solid var(--border)',
                                backgroundColor: 'var(--surface)',
                                color: 'var(--text)'
                            }}
                        >
                            <option value="">Select a member...</option>
                            {members.map(m => (
                                <option key={m.id} value={m.id}>{m.name} ({m.email})</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Due Date</label>
                        <Input name="dueDate" type="date" required />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <Button type="submit" variant="secondary">Confirm Borrow</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
