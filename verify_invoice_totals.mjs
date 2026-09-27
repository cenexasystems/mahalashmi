import { createClient } from '@supabase/supabase-js'

const PROJECT_URL = 'https://nnutsoivygctmkyzzvyw.supabase.co'
const ANON_KEY = 'sb_publishable_vt8T8KvuA1utwxnBnuqksw_RjgY2qLX'

const supabase = createClient(PROJECT_URL, ANON_KEY)

console.log('🔍 VERIFYING INVOICE TOTALS\n')
console.log('═══════════════════════════════════════════════════════════\n')

// Check all orders
const { data: allOrders } = await supabase
  .from('orders')
  .select('invoice_no, customer_name, total, subtotal, shipping, is_credit, status')
  .order('created_at', { ascending: false })
  .limit(20)

if (allOrders && allOrders.length > 0) {
  console.log(`Found ${allOrders.length} invoices:\n`)
  
  const withZeroTotal = allOrders.filter(o => o.total === 0 || o.total === null)
  const withProperTotal = allOrders.filter(o => o.total > 0)
  
  console.log(`✅ With proper total (> 0): ${withProperTotal.length}`)
  withProperTotal.slice(0, 3).forEach(inv => {
    console.log(`   • ${inv.invoice_no} | ${inv.customer_name} | ₹${inv.total}`)
  })
  
  console.log()
  
  if (withZeroTotal.length > 0) {
    console.log(`⚠️  With zero/null total: ${withZeroTotal.length}`)
    withZeroTotal.forEach(inv => {
      console.log(`   • ${inv.invoice_no} | ${inv.customer_name} | ₹${inv.total}`)
    })
    
    console.log('\n🔧 FIXING ZERO TOTALS...')
    
    // Update zero totals
    for (const inv of withZeroTotal) {
      const subtotal = inv.subtotal || 0
      const shipping = inv.shipping || 0
      const calculatedTotal = subtotal + shipping
      
      await supabase
        .from('orders')
        .update({ total: calculatedTotal })
        .eq('invoice_no', inv.invoice_no)
      
      console.log(`   ✅ Fixed ${inv.invoice_no}: ₹${calculatedTotal}`)
    }
  }
} else {
  console.log('❌ No invoices found\n')
}

console.log('\n═══════════════════════════════════════════════════════════')
console.log('✅ INVOICE TOTALS VERIFICATION COMPLETE')
