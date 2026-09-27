import { createClient } from '@supabase/supabase-js'

const PROJECT_URL = 'https://nnutsoivygctmkyzzvyw.supabase.co'
const ANON_KEY = 'sb_publishable_vt8T8KvuA1utwxnBnuqksw_RjgY2qLX'

const supabase = createClient(PROJECT_URL, ANON_KEY)

console.log('🗑️ CLEANING UP BROKEN INVOICES WITH DECIMALS\n')

// Get all invoices with decimal numbers
const { data: brokenInvoices } = await supabase
  .from('orders')
  .select('id, invoice_no')
  .ilike('invoice_no', '%.%')

if (brokenInvoices && brokenInvoices.length > 0) {
  console.log(`Found ${brokenInvoices.length} broken invoices to delete:\n`)
  
  brokenInvoices.forEach(inv => {
    console.log(`   ❌ ${inv.invoice_no}`)
  })
  
  // Delete them
  const ids = brokenInvoices.map(inv => inv.id)
  const { error } = await supabase
    .from('orders')
    .delete()
    .in('id', ids)
  
  if (error) {
    console.log(`\n❌ Error deleting: ${error.message}`)
  } else {
    console.log(`\n✅ Deleted ${brokenInvoices.length} broken invoices`)
  }
} else {
  console.log('✅ No broken invoices found')
}

console.log('\n═══════════════════════════════════════════════════════════')

// Check remaining invoices
const { data: remaining } = await supabase
  .from('orders')
  .select('invoice_no, total, customer_name')
  .order('created_at', { ascending: false })
  .limit(5)

console.log('\n✅ CLEAN INVOICES REMAINING:\n')
remaining.forEach((inv, idx) => {
  console.log(`${idx + 1}. ${inv.invoice_no} | ${inv.customer_name} | ₹${inv.total}`)
})

console.log('\n═══════════════════════════════════════════════════════════')
console.log('✅ DATABASE CLEANUP COMPLETE')
