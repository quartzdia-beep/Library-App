const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local
const envPath = path.resolve(__dirname, '.env.local');
let envConfig = {};

try {
    const content = fs.readFileSync(envPath, 'utf8');
    console.log("Read .env.local, size:", content.length);

    envConfig = content.split('\n').reduce((acc, line) => {
        // Logic to handle KEY="VALUE" or KEY=VALUE
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            let key = match[1].trim();
            let value = match[2].trim();
            // Remove wrapping quotes if present
            if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            acc[key] = value;
        }
        return acc;
    }, {});
} catch (e) {
    console.error("Could not read .env.local:", e);
}

const supabaseUrl = envConfig.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars. Loaded keys:', Object.keys(envConfig));
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    console.log('Checking Books Table...');
    const { data: books, error: bookError } = await supabase.from('books').select('*').limit(1);
    if (bookError) console.error('Book Error:', bookError);
    else console.log('Books Columns:', books && books.length > 0 ? Object.keys(books[0]) : 'No books found to infer columns');

    console.log('\nChecking Transactions Table...');
    const { data: trans, error: transError } = await supabase.from('transactions').select('*').limit(1);
    if (transError) console.error('Trans Error:', transError);
    else console.log('Transaction Columns:', trans && trans.length > 0 ? Object.keys(trans[0]) : 'No transactions found to infer columns');

    if (books && books.length > 0) {
        const bookId = books[0].id;
        console.log(`\nTesting Update on Book ID: ${bookId}`);
        // First try snake_case (most likely correct)
        const { error: updateError } = await supabase
            .from('books')
            .update({ status: 'Borrowed', borrower_id: '00000000-0000-0000-0000-000000000000', due_date: '2025-01-01' })
            .eq('id', bookId);

        if (updateError) {
            console.error('Update Failed with borrower_id/due_date:', updateError);
            // Try camelCase
            const { error: updateError2 } = await supabase
                .from('books')
                .update({ status: 'Borrowed', borrowerId: '00000000-0000-0000-0000-000000000000', dueDate: '2025-01-01' })
                .eq('id', bookId);
            if (updateError2) console.error('Update Failed with borrowerId/dueDate:', updateError2);
            else console.log('Update SUCCEEDED with borrowerId/dueDate');
        } else {
            console.log('Update SUCCEEDED with borrower_id/due_date');
            // Revert
            await supabase.from('books').update({ status: 'Available', borrower_id: null, due_date: null }).eq('id', bookId);
        }
    } else {
        console.log('No books available to test update.');
    }
}

checkSchema();
