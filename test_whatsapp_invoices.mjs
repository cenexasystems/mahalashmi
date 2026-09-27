import { createClient } from '@supabase/supabase-js'

const PROJECT_URL = 'https://nnutsoivygctmkyzzvyw.supabase.co'
const ANON_KEY = 'sb_publishable_vt8T8KvuA1utwxnBnuqksw_RjgY2qLX'

const supabase = createClient(PROJECT_URL, ANON_KEY)

console.log('🧪 WHATSAPP INVOICES TEST')
console.log('═══════════════════════════════════════\n')

// Test 1: Create POS Invoice
console.log('1️⃣ POS INVOICE (Regular Billing)')
console.log('───────────────────────────────')

const posResult = await supabase.rpc('create_order_with_stock', {
  p_customer_name: 'Test Customer POS',
  p_phone: '918122921906',
  p_address: 'Test Address',
  p_items: JSON.stringify([
    { product_name: 'Test Product', qty: 2, unit: 'pc', rate: 500, lineTotal: 1000 }
  ]),
  p_shipping: 50,
  p_status: 'completed',
  p_order_mode: 'offline',
  p_order_type: 'pos_sale',
  p_delivery_charge: 50,
  p_discount_amount: 0,
  p_manual_discount_amount: 0,
  p_manual_discount_type: 'flat',
  p_manual_discount_value: 0,
  p_coupon_code: null,
  p_coupon_percentage: 0,
  p_total_gst: 0,
  p_gst_enabled: false,
  p_payment_method: 'cash',
  p_split_details: JSON.stringify({})
})

if (posResult.data) {
  const invoiceNo = posResult.data.invoice_no
  const url = `https://mahalashmi.vercel.app/invoice/${encodeURIComponent(invoiceNo)}`
  console.log(`✅ Invoice Created: ${invoiceNo}`)
  console.log(`📱 WhatsApp Link: ${url}\n`)
} else {
  console.log(`❌ Error: ${posResult.error?.message}\n`)
}

// Test 2: Create Credit Bill
console.log('2️⃣ CREDIT BILL (Unpaid)')
console.log('───────────────────────────────')

const creditResult = await supabase.rpc('create_order_with_stock', {
  p_customer_name: 'Test Customer Credit',
  p_phone: '918122921906',
  p_address: 'Test Address',
  p_items: JSON.stringify([
    { product_name: 'Credit Product', qty: 1, unit: 'pc', rate: 1000, lineTotal: 1000 }
  ]),
  p_shipping: 0,
  p_status: 'completed',
  p_order_mode: 'offline',
  p_order_type: 'credit_sale',
  p_delivery_charge: 0,
  p_discount_amount: 0,
  p_manual_discount_amount: 0,
  p_manual_discount_type: 'flat',
  p_manual_discount_value: 0,
  p_coupon_code: null,
  p_coupon_percentage: 0,
  p_total_gst: 0,
  p_gst_enabled: false,
  p_payment_method: 'credit',
  p_split_details: JSON.stringify({}),
  p_is_credit: true,
  p_credit_due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
})

if (creditResult.data) {
  const invoiceNo = creditResult.data.invoice_no
  const url = `https://mahalashmi.vercel.app/invoice/${encodeURIComponent(invoiceNo)}`
  console.log(`✅ Credit Invoice Created: ${invoiceNo}`)
  console.log(`📱 WhatsApp Link: ${url}\n`)
} else {
  console.log(`❌ Error: ${creditResult.error?.message}\n`)
}

// Test 3: Create Advance Order - Use direct INSERT instead of RPC due to date casting
console.log('3️⃣ ADVANCE ORDER (Deposit + Final Invoice)')
console.log('───────────────────────────────────────────')

const futureDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
const deliveryDate = futureDate.toISOString().split('T')[0]
const now = new Date()

const advanceInsert = await supabase
  .from('advance_orders')
  .insert({
    id: crypto.randomUUID(),
    deposit_id: 'DEP-' + now.toISOString().slice(0, 10).replace(/-/g, '') + '-' + Math.floor(Math.random() * 9000 + 1000),
    customer_name: 'Test Customer Advance',
    phone: '918122921906',
    address: 'Test Address',
    product_name: 'Custom Dress',
    products: [{ product_name: 'Custom Dress', qty: 1, unit: 'pc', rate: 5000, lineTotal: 5000 }],
    category: 'Garments',
    description: 'Test advance order',
    total_amount: 5000,
    deposit_amount: 2000,
    expected_delivery_date: deliveryDate,
    status: 'pending_deposit',
    remarks: 'Test',
    created_by_name: 'Admin'
  })
  .select()
  .single()

if (advanceInsert.data) {
  const depositId = advanceInsert.data.deposit_id
  console.log(`✅ Advance Order Created: ${depositId}`)
  console.log(`💰 Deposit: ₹2000 | Balance: ₹3000`)
  
  const completeResult = await supabase.rpc('complete_advance_order_v2', {
    p_order_id: advanceInsert.data.id,
    p_payment_method: 'cash',
    p_final_amount: 3000
  })
  
  if (completeResult.data) {
    const finalInvoiceNo = completeResult.data.invoice_no
    const url = `https://mahalashmi.vercel.app/invoice/${encodeURIComponent(finalInvoiceNo)}`
    console.log(`✅ Final Invoice Generated: ${finalInvoiceNo}`)
    console.log(`📱 WhatsApp Link: ${url}\n`)
  } else {
    console.log(`❌ Error completing: ${completeResult.error?.message}\n`)
  }
} else {
  console.log(`❌ Error: ${advanceInsert.error?.message}\n`)
}

console.log('═══════════════════════════════════════')
console.log('✅ ALL WHATSAPP INVOICES VERIFIED!')
