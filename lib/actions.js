'use server';

import { supabase } from './supabase';
import { revalidatePath } from 'next/cache';

export async function getBooks() {
    const { data, error } = await supabase.from('books').select('*').order('title');
    if (error) {
        console.error('Error fetching books:', error);
        return [];
    }
    return data || [];
}

export async function getBookById(id) {
    const { data, error } = await supabase.from('books').select('*').eq('id', id).single();
    if (error) console.error('Error fetching book:', error);
    return data;
}

export async function addBook(formData) {
    const book = {
        title: formData.get('title'),
        author: formData.get('author'),
        isbn: formData.get('isbn'),
        status: 'Available'
    };

    const { error } = await supabase.from('books').insert([book]);

    if (error) {
        console.error('Error adding book:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/books');
    revalidatePath('/');
    return { success: true };
}

export async function getMembers() {
    const { data, error } = await supabase.from('members').select('*').order('name');
    if (error) {
        console.error('Error fetching members:', error);
        return [];
    }
    // Debug: Log the first member to see structure
    if (data && data.length > 0) {
        console.log('Sample Member Data:', data[0]);
    }
    return data || [];
}

export async function registerMember(formData) {
    // Try to ensure we match the DB column. If the user created "apartmentNumber", this works.
    // If they created "apartmentnumber" (default postgres), we might need to adjust.
    // We send consistent camelCase, hoping the DB matches.
    const member = {
        name: formData.get('name'),
        email: formData.get('email'),
        apartment_number: formData.get('apartmentNumber'), // Match Supabase column name directly
        role: 'Member',
        joined: new Date().toISOString().split('T')[0]
    };

    const { error } = await supabase.from('members').insert([member]);

    if (error) {
        console.error('Error registering member:', error);
        // Fallback: Try snake_case if camelCase failed
        // Check for various column mismatch errors
        if (error.message.includes('apartmentNumber')) {
            console.log("Column 'apartmentNumber' not found, retrying with 'apartment_number'...");

            // Attempt 1: snake_case
            const { error: retryError } = await supabase.from('members').insert([{
                ...member,
                apartmentNumber: undefined,
                apartment_number: formData.get('apartmentNumber')
            }]);

            if (retryError) {
                console.log("Column 'apartment_number' failed, retrying with 'apartmentnumber'...");

                // Attempt 2: lowercase
                const { error: retryError2 } = await supabase.from('members').insert([{
                    ...member,
                    apartmentNumber: undefined,
                    apartmentnumber: formData.get('apartmentNumber')
                }]);

                if (retryError2) {
                    console.error('All text retries failed:', retryError2);
                    return { success: false, error: "Database column missing. Please ensure 'members' table has 'apartment_number' column." };
                }
            }
        } else {
            return { success: false, error: error.message };
        }
    }

    revalidatePath('/members');
    return { success: true };
}

export async function borrowBook(formData) {
    const bookId = formData.get('bookId');
    const memberId = formData.get('memberId');
    const dueDate = formData.get('dueDate');

    console.log(`Borrowing Book: ${bookId} for Member: ${memberId} Due: ${dueDate}`);

    // Update book status
    const { error: bookError } = await supabase
        .from('books')
        .update({ status: 'Borrowed', borrower_id: memberId, due_date: dueDate })
        .eq('id', bookId);

    if (bookError) {
        console.error('Error borrowing book:', bookError);
        return { success: false };
    }

    // Record transaction
    const { error: transError } = await supabase
        .from('transactions')
        .insert([{ book_id: bookId, member_id: memberId, type: 'Borrow', date: new Date().toISOString() }]);

    if (transError) console.error('Error recording transaction:', transError);

    revalidatePath('/books');
    revalidatePath('/');
    return { success: true };
}

export async function returnBook(formData) {
    const bookId = formData.get('bookId');

    console.log(`Returning Book: ${bookId}`);

    const { error: bookError } = await supabase
        .from('books')
        .update({ status: 'Available', borrower_id: null, due_date: null, renewal_count: 0 })
        .eq('id', bookId);

    if (bookError) {
        console.error('Error returning book:', bookError);
        return { success: false };
    }

    const { error: transError } = await supabase
        .from('transactions')
        .insert([{ book_id: bookId, type: 'Return', date: new Date().toISOString() }]);

    if (transError) console.error('Error recording transaction:', transError);

    revalidatePath('/books');
    revalidatePath('/');
    return { success: true };
}

export async function renewBook(formData) {
    const bookId = formData.get('bookId');
    console.log(`Renewing Book: ${bookId}`);

    // 1. Get current due date and renewal count
    const { data: book, error: fetchError } = await supabase
        .from('books')
        .select('due_date, renewal_count')
        .eq('id', bookId)
        .single();

    if (fetchError || !book) {
        console.error('Error fetching book for renewal:', fetchError);
        return { success: false };
    }

    // Check limit
    const currentCount = book.renewal_count || 0;
    if (currentCount >= 3) {
        return { success: false, error: 'Maximum renewals reached' };
    }

    // 2. Calculate new due date (current due date + 14 days)
    // If no due date exists (shouldn't happen for borrowed books), default to today + 14
    const currentDue = book.due_date ? new Date(book.due_date) : new Date();
    currentDue.setDate(currentDue.getDate() + 14);
    const newDueDate = currentDue.toISOString().split('T')[0];

    // 3. Update book
    const { error: updateError } = await supabase
        .from('books')
        .update({ due_date: newDueDate, renewal_count: currentCount + 1 })
        .eq('id', bookId);

    if (updateError) {
        console.error('Error renewing book:', updateError);
        return { success: false };
    }

    // 4. Log transaction
    const { error: transError } = await supabase
        .from('transactions')
        .insert([{ book_id: bookId, type: 'Renew', date: new Date().toISOString() }]);

    if (transError) console.error('Error recording transaction:', transError);

    revalidatePath('/books');
    revalidatePath('/');
    return { success: true };
}
