'use client';

import { registerMember } from '@/lib/actions';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useRouter } from 'next/navigation';

export default function RegisterMemberPage() {
    const router = useRouter();

    async function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);

        console.log("Submitting registration form...");
        try {
            const result = await registerMember(formData);
            console.log("Registration result:", result);

            if (result.success) {
                alert("Member registered successfully!");
                router.push('/members');
            } else {
                alert(`Registration failed: ${result.error || 'Unknown error'}`);
            }
        } catch (e) {
            console.error("Form submission error:", e);
            alert(`System error: ${e.message}`);
        }
    }

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Register Member</h1>
            <Card>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Full Name</label>
                        <Input name="name" required placeholder="e.g. John Doe" />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email Address</label>
                        <Input name="email" type="email" required placeholder="e.g. john@example.com" />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Apartment Number</label>
                        <Input name="apartmentNumber" required placeholder="e.g. 4B" />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <Button type="submit">Register</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
