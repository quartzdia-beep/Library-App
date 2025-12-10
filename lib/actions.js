'use server';

import { supabase } from './supabase';
import { revalidatePath } from 'next/cache';

export async function getBooks() {
    const { data, error } = await supabase.from('books').select('*').order('title');
    if (error) console.error('Error fetching books:', error);
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
    if (error) console.error('Error fetching members:', error);
    return data || [];
}

export async function registerMember(formData) {
    const member = {
        name: formData.get('name'),
        email: formData.get('email'),
        apartmentNumber: formData.get('apartmentNumber'),
        role: 'Member',
        joined: new Date().toISOString().split('T')[0]
    };

    const { error } = await supabase.from('members').insert([member]);

    if (error) {
        console.error('Error registering member:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/members');
    return { success: true };
}

export async function borrowBook(formData) {
    const bookId = formData.get('bookId');
    const memberId = formData.get('memberId');
    const dueDate = formData.get('dueDate');

    // Update book status
    const { error: bookError } = await supabase
        .from('books')
        .update({ status: 'Borrowed', borrowerId: memberId, dueDate: dueDate })
        .eq('id', bookId);

    if (bookError) {
        console.error('Error borrowing book:', bookError);
        return { success: false };
    }

    // Record transaction
    const { error: transError } = await supabase
        .from('transactions')
        .insert([{ bookId, memberId, type: 'Borrow', date: new Date().toISOString() }]);

    if (transError) console.error('Error recording transaction:', transError);

    revalidatePath('/books');
    revalidatePath('/');
    return { success: true };
}

export async function returnBook(formData) {
    const bookId = formData.get('bookId');

    const { error: bookError } = await supabase
        .from('books')
        .update({ status: 'Available', borrowerId: null, dueDate: null })
        .eq('id', bookId);

    if (bookError) {
        console.error('Error returning book:', bookError);
        return { success: false };
    }

    const { error: transError } = await supabase
        .from('transactions')
        .insert([{ bookId, type: 'Return', date: new Date().toISOString() }]);

    if (transError) console.error('Error recording transaction:', transError);

    revalidatePath('/books');
    revalidatePath('/');
    return { success: true };
}
