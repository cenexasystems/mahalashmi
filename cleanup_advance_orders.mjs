import { createClient } from '@supabase/supabase-js'

const PROJECT_URL = 'https://nnutsoivygctmkyzzvyw.supabase.co'
const ANON_KEY = 'sb_publishable_vt8T8KvuA1utwxnBnuqksw_RjgY2qLX'

const supabase = createClient(PROJECT_URL, ANON_KEY)

console.log('🗑️ CLEANING UP TEST ADVANCE ORDERS\n')

// Get all advance orders
const { data: allOrders } = await supabase
  .from('advance_orders')
  .select('id, deposit_id, customer_name, total_amount, status')

console.log(`Found ${allOrders.length} advance orders to delete:\n`)

allOrders.forEach(order => {
  console.log(`❌ ${order.deposit_id} | ${order.customer_name} | ₹${order.total_amount} | ${order.status}`)
})

if (allOrders.length > 0) {
  const ids = allOrders.map(order => order.id)
  
  // Delete advance_order_timeline entries first
  await supabase
    .from('advance_order_timeline')
    .delete()
    .in('advance_order_id', ids)
  
  // Delete advance_order_payments entries
  await supabase
    .from('advance_order_payments')
    .delete()
    .in('advance_order_id', ids)
  
  // Delete advance orders
  const { error } = await supabase
    .from('advance_orders')
    .delete()
    .in('id', ids)

  if (error) {
    console.log(`\n❌ Error: ${error.message}`)
  } else {
    console.log(`\n✅ Deleted ${allOrders.length} advance orders`)
  }
} else {
  console.log('✅ No advance orders to delete')
}

console.log('\n═══════════════════════════════════════════════════════════')
console.log('✅ CLEANUP COMPLETE - Database is now CLEAN')
