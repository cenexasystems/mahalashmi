import { createClient } from '@supabase/supabase-js'

const PROJECT_URL = 'https://nnutsoivygctmkyzzvyw.supabase.co'
const ANON_KEY = 'sb_publishable_vt8T8KvuA1utwxnBnuqksw_RjgY2qLX'

const supabase = createClient(PROJECT_URL, ANON_KEY)

console.log('🔍 CHECKING DATABASE FOR INVOICES\n')

const invoices = ['INV001790497209464', 'INV001790497209681']

for (const inv of invoices) {
  const { data, error } = await supabase
    .from('orders')
    .select('id, invoice_no, customer_name, total, created_at')
    .eq('invoice_no', inv)
    .single()

  if (data) {
    console.log(`✅ ${inv}`)
    console.log(`   Customer: ${data.customer_name}`)
    console.log(`   Total: ₹${data.total}`)
    console.log(`   Created: ${data.created_at}\n`)
  } else {
    console.log(`❌ ${inv} - NOT FOUND in database\n`)
  }
}
