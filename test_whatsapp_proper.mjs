import { createClient } from '@supabase/supabase-js'

const PROJECT_URL = 'https://nnutsoivygctmkyzzvyw.supabase.co'
const ANON_KEY = 'sb_publishable_vt8T8KvuA1utwxnBnuqksw_RjgY2qLX'

const supabase = createClient(PROJECT_URL, ANON_KEY)

console.log('🧪 CREATING PROPER TEST INVOICES\n')

// Create POS Invoice with proper totals
const items1 = [
  { product_name: 'Test Product', qty: 2, unit: 'pc', rate: 500, lineTotal: 1000, base_price: 500, quantity: 2, unit_type: 'unit', line_total: 1000 }
]
const subtotal1 = 1000
const shipping1 = 50
const total1 = subtotal1 + shipping1

const { data: pos } = await supabase
  .from('orders')
  .insert({
    invoice_no: 'INV' + Date.now(),
    customer_name: 'Test Customer POS',
    phone: '918122921906',
    address: 'Test Address',
    items: items1,
    subtotal: subtotal1,
    shipping: shipping1,
    total: total1,
    status: 'completed',
    order_mode: 'offline',
    order_type: 'pos_sale',
    delivery_charge: 50,
    discount_amount: 0,
    manual_discount_amount: 0,
    payment_method: 'cash',
    payment_mode: 'cash'
  })
  .select()
  .single()

if (pos) {
  console.log(`✅ POS Invoice: ${pos.invoice_no}`)
  console.log(`   Total: ₹${pos.total}`)
  console.log(`   Link: https://mahalashmi.vercel.app/invoice/${encodeURIComponent(pos.invoice_no)}\n`)
}

// Create Credit Bill
const items2 = [
  { product_name: 'Credit Product', qty: 1, unit: 'pc', rate: 1000, lineTotal: 1000, base_price: 1000, quantity: 1, unit_type: 'unit', line_total: 1000 }
]
const subtotal2 = 1000
const total2 = subtotal2

const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

const { data: credit } = await supabase
  .from('orders')
  .insert({
    invoice_no: 'INV' + (Date.now() + 1),
    customer_name: 'Test Customer Credit',
    phone: '918122921906',
    address: 'Test Address',
    items: items2,
    subtotal: subtotal2,
    shipping: 0,
    total: total2,
    status: 'completed',
    order_mode: 'offline',
    order_type: 'credit_sale',
    delivery_charge: 0,
    discount_amount: 0,
    manual_discount_amount: 0,
    payment_method: 'credit',
    payment_mode: 'credit',
    is_credit: true,
    credit_due_date: dueDate,
    credit_status: 'outstanding'
  })
  .select()
  .single()

if (credit) {
  console.log(`✅ Credit Bill: ${credit.invoice_no}`)
  console.log(`   Total: ₹${credit.total}`)
  console.log(`   Due: ${dueDate}`)
  console.log(`   Link: https://mahalashmi.vercel.app/invoice/${encodeURIComponent(credit.invoice_no)}\n`)
}

console.log('═══════════════════════════════════════')
console.log('✅ Test invoices created with proper data!')
console.log('\nNow click the links above to verify they load correctly.')
