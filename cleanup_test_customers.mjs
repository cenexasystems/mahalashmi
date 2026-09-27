import { createClient } from '@supabase/supabase-js'

const PROJECT_URL = 'https://nnutsoivygctmkyzzvyw.supabase.co'
const ANON_KEY = 'sb_publishable_vt8T8KvuA1utwxnBnuqksw_RjgY2qLX'

const supabase = createClient(PROJECT_URL, ANON_KEY)

console.log('🧹 CLEANING UP TEST CUSTOMER NAMES\n')

// Get all invoices with test customer names
const testNames = ['test', 'Test Customer', 'testte', 'twst', 'sri']
const { data: testInvoices } = await supabase
  .from('orders')
  .select('id, invoice_no, customer_name, total')

const toDelete = testInvoices.filter(inv => 
  testNames.some(name => inv.customer_name.toLowerCase().includes(name.toLowerCase()))
)

console.log(`Found ${toDelete.length} invoices with test customer names:\n`)

toDelete.forEach(inv => {
  console.log(`   ❌ ${inv.invoice_no} | ${inv.customer_name} | ₹${inv.total}`)
})

if (toDelete.length > 0) {
  const ids = toDelete.map(inv => inv.id)
  const { error } = await supabase
    .from('orders')
    .delete()
    .in('id', ids)

  if (error) {
    console.log(`\n❌ Error: ${error.message}`)
  } else {
    console.log(`\n✅ Deleted ${toDelete.length} test invoices`)
  }
}

console.log('\n═══════════════════════════════════════════════════════════')

// Show remaining clean invoices
const { data: remaining } = await supabase
  .from('orders')
  .select('invoice_no, customer_name, total, is_credit, created_at')
  .order('created_at', { ascending: false })

console.log(`\n✅ CLEAN DATABASE - ${remaining.length} invoices remaining:\n`)
remaining.forEach((inv, idx) => {
  const type = inv.is_credit ? '💳' : '🛍️'
  console.log(`${idx + 1}. ${type} ${inv.invoice_no} | ${inv.customer_name} | ₹${inv.total}`)
})

console.log('\n═══════════════════════════════════════════════════════════')
console.log('✅ CLEANUP COMPLETE - Database is now CLEAN')
