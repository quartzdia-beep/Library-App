import { addBook } from '@/lib/actions';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { redirect } from 'next/navigation';

export default function AddBookPage() {
    async function handleSubmit(formData) {
        'use server';
        await addBook(formData);
        redirect('/books');
    }

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Add New Book</h1>
            <Card>
                <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Title</label>
                        <Input name="title" required placeholder="e.g. The Great Gatsby" />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Author</label>
                        <Input name="author" required placeholder="e.g. F. Scott Fitzgerald" />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>ISBN (Optional)</label>
                        <Input name="isbn" placeholder="e.g. 9780743273565" />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <Button type="submit">Add Book</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
