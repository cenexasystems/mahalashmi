import { createClient } from '@supabase/supabase-js'

const PROJECT_URL = 'https://nnutsoivygctmkyzzvyw.supabase.co'
const ANON_KEY = 'sb_publishable_vt8T8KvuA1utwxnBnuqksw_RjgY2qLX'

const supabase = createClient(PROJECT_URL, ANON_KEY)

console.log('🔍 CHECKING BROKEN INVOICE\n')

// Check the specific invoice
const { data: invoice } = await supabase
  .from('orders')
  .select('*')
  .eq('invoice_no', 'INV76632572')
  .single()

if (invoice) {
  console.log('✅ Invoice found in database:')
  console.log(`   Invoice No: ${invoice.invoice_no}`)
  console.log(`   Customer: ${invoice.customer_name}`)
  console.log(`   Total: ₹${invoice.total}`)
  console.log(`   Items: ${invoice.items ? invoice.items.length : 0}\n`)
} else {
  console.log('❌ INV76632572 not found\n')
}

// Check all invoices with decimals
console.log('📊 Checking all invoices with decimal numbers:\n')

const { data: allInvoices } = await supabase
  .from('orders')
  .select('invoice_no, total, customer_name')
  .ilike('invoice_no', '%.%')
  .limit(10)

if (allInvoices && allInvoices.length > 0) {
  console.log(`Found ${allInvoices.length} invoices with decimals:\n`)
  allInvoices.forEach(inv => {
    console.log(`⚠️ ${inv.invoice_no} | ${inv.customer_name} | ₹${inv.total}`)
  })
} else {
  console.log('✅ No invoices with decimal numbers found')
}
