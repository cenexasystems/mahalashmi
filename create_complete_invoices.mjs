import { createClient } from '@supabase/supabase-js'

const PROJECT_URL = 'https://nnutsoivygctmkyzzvyw.supabase.co'
const ANON_KEY = 'sb_publishable_vt8T8KvuA1utwxnBnuqksw_RjgY2qLX'

const supabase = createClient(PROJECT_URL, ANON_KEY)

console.log('✅ CREATING COMPLETE TEST INVOICES WITH ALL DATA\n')

// Create test 1: POS Invoice with proper totals
const posItems = [
  { product_name: 'Cotton Shirt', qty: 2, unit: 'pc', rate: 500, lineTotal: 1000, base_price: 500, quantity: 2, unit_type: 'unit', line_total: 1000 }
]
const posSubtotal = 1000
const posShipping = 50
const posTotal = posSubtotal + posShipping

const { data: posInv } = await supabase
  .from('orders')
  .insert({
    invoice_no: 'INV' + Date.now(),
    customer_name: 'Rajesh Kumar',
    phone: '918122921906',
    address: 'Malar Complex, Pondy - Sellipet Main Road',
    items: posItems,
    subtotal: posSubtotal,
    shipping: posShipping,
    total: posTotal,
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

if (posInv) {
  console.log('✅ POS INVOICE')
  console.log(`   Invoice: ${posInv.invoice_no}`)
  console.log(`   Customer: ${posInv.customer_name}`)
  console.log(`   Total: ₹${posInv.total}`)
  console.log(`   Link: https://mahalashmi.vercel.app/invoice/${encodeURIComponent(posInv.invoice_no)}\n`)
}

// Create test 2: Credit Bill
const creditItems = [
  { product_name: 'Saree (Custom)', qty: 1, unit: 'pc', rate: 3000, lineTotal: 3000, base_price: 3000, quantity: 1, unit_type: 'unit', line_total: 3000 }
]
const creditSubtotal = 3000
const creditDiscount = 500
const creditTotal = creditSubtotal - creditDiscount

const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

const { data: creditInv } = await supabase
  .from('orders')
  .insert({
    invoice_no: 'INV' + (Date.now() + 1),
    customer_name: 'Priya Sharma',
    phone: '918122921906',
    address: 'Kandamangalam Junction',
    items: creditItems,
    subtotal: creditSubtotal,
    shipping: 0,
    total: creditTotal,
    status: 'completed',
    order_mode: 'offline',
    order_type: 'credit_sale',
    delivery_charge: 0,
    discount_amount: creditDiscount,
    manual_discount_amount: 0,
    payment_method: 'credit',
    payment_mode: 'credit',
    is_credit: true,
    credit_due_date: dueDate,
    credit_status: 'outstanding'
  })
  .select()
  .single()

if (creditInv) {
  console.log('✅ CREDIT BILL')
  console.log(`   Invoice: ${creditInv.invoice_no}`)
  console.log(`   Customer: ${creditInv.customer_name}`)
  console.log(`   Total: ₹${creditInv.total}`)
  console.log(`   Due Date: ${dueDate}`)
  console.log(`   Link: https://mahalashmi.vercel.app/invoice/${encodeURIComponent(creditInv.invoice_no)}\n`)
}

console.log('═══════════════════════════════════════════════════════════')
console.log('✅ INVOICES CREATED - Click links above to view!')
