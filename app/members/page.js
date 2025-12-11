import { getMembers } from '@/lib/actions';
import Card from '@/components/ui/Card';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default async function MembersPage() {
    const members = await getMembers();

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem' }}>Members</h1>
                <Link href="/members/register">
                    <Button>+ Register Member</Button>
                </Link>
            </div>

            <Card>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                            <th style={{ padding: '1rem', fontWeight: '600' }}>Name</th>
                            <th style={{ padding: '1rem', fontWeight: '600' }}>Email</th>
                            <th style={{ padding: '1rem', fontWeight: '600' }}>Apt No.</th>
                            <th style={{ padding: '1rem', fontWeight: '600' }}>Role</th>
                            <th style={{ padding: '1rem', fontWeight: '600' }}>Joined</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map(member => (
                            <tr key={member.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1rem' }}>{member.name}</td>
                                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{member.email}</td>
                                <td style={{ padding: '1rem' }}>{member.apartmentNumber || member.apartment_number || member.apartmentnumber}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '999px',
                                        fontSize: '0.75rem',
                                        fontWeight: '500',
                                        backgroundColor: member.role === 'Admin' ? 'rgba(15, 23, 42, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                                        color: member.role === 'Admin' ? 'var(--primary)' : 'var(--text-muted)'
                                    }}>
                                        {member.role}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{member.joined}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
}
