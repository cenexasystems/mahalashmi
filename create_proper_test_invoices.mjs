import { createClient } from '@supabase/supabase-js'

const PROJECT_URL = 'https://nnutsoivygctmkyzzvyw.supabase.co'
const ANON_KEY = 'sb_publishable_vt8T8KvuA1utwxnBnuqksw_RjgY2qLX'

const supabase = createClient(PROJECT_URL, ANON_KEY)

console.log('🎯 CREATING COMPLETE TEST INVOICES WITH FULL DATA\n')

const now = new Date()

// ============================================
// TEST 1: POS INVOICE (Regular Billing)
// ============================================
const posItems = [
  {
    product_id: null,
    name: 'Cotton Shirt',
    qty: 2,
    quantity: 2,
    unit: 'pc',
    unit_type: 'unit',
    base_price: 500,
    price: 500,
    line_total: 1000
  },
  {
    product_id: null,
    name: 'Trouser',
    qty: 1,
    quantity: 1,
    unit: 'pc',
    unit_type: 'unit',
    base_price: 800,
    price: 800,
    line_total: 800
  }
]
const posSubtotal = 1800
const posShipping = 100
const posDiscount = 0
const posManualDiscount = 0
const posGst = 0
const posTotal = posSubtotal + posShipping - posDiscount - posManualDiscount + posGst

const { data: posInvoice } = await supabase
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
    delivery_charge: 100,
    discount_amount: 0,
    manual_discount_amount: 0,
    manual_discount_type: 'flat',
    manual_discount_value: 0,
    coupon_code: null,
    coupon_percentage: 0,
    total_gst: 0,
    gst_enabled: false,
    payment_method: 'cash',
    payment_mode: 'cash',
    split_details: {}
  })
  .select()
  .single()

if (posInvoice) {
  console.log('✅ POS INVOICE (Regular Billing)')
  console.log(`   Invoice: ${posInvoice.invoice_no}`)
  console.log(`   Customer: ${posInvoice.customer_name}`)
  console.log(`   Total: ₹${posInvoice.total}`)
  console.log(`   Link: https://mahalashmi.vercel.app/invoice/${encodeURIComponent(posInvoice.invoice_no)}`)
  console.log(`   WhatsApp: Click WhatsApp button on invoice page\n`)
} else {
  console.log('❌ Failed to create POS invoice\n')
}

// ============================================
// TEST 2: CREDIT BILL (Unpaid)
// ============================================
const creditItems = [
  {
    product_id: null,
    name: 'Saree (Custom Stitching)',
    qty: 1,
    quantity: 1,
    unit: 'pc',
    unit_type: 'unit',
    base_price: 3500,
    price: 3500,
    line_total: 3500
  }
]
const creditSubtotal = 3500
const creditShipping = 0
const creditDiscount = 500
const creditManualDiscount = 0
const creditGst = 0
const creditTotal = creditSubtotal + creditShipping - creditDiscount - creditManualDiscount + creditGst

const dueDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
  .toISOString()
  .split('T')[0]

const { data: creditInvoice } = await supabase
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
    manual_discount_type: 'flat',
    manual_discount_value: 0,
    coupon_code: null,
    coupon_percentage: 0,
    total_gst: 0,
    gst_enabled: false,
    payment_method: 'credit',
    payment_mode: 'credit',
    split_details: {},
    is_credit: true,
    credit_due_date: dueDate,
    credit_status: 'outstanding'
  })
  .select()
  .single()

if (creditInvoice) {
  console.log('✅ CREDIT BILL (Unpaid)')
  console.log(`   Invoice: ${creditInvoice.invoice_no}`)
  console.log(`   Customer: ${creditInvoice.customer_name}`)
  console.log(`   Total: ₹${creditInvoice.total}`)
  console.log(`   Due Date: ${dueDate}`)
  console.log(`   Status: OUTSTANDING`)
  console.log(`   Link: https://mahalashmi.vercel.app/invoice/${encodeURIComponent(creditInvoice.invoice_no)}`)
  console.log(`   WhatsApp: Click WhatsApp button on invoice page\n`)
} else {
  console.log('❌ Failed to create credit bill\n')
}

// ============================================
// TEST 3: ADVANCE ORDER (Deposit + Final Invoice)
// ============================================
const depositId = 'DEP-' + now.toISOString().slice(0, 10).replace(/-/g, '') + '-' + Math.floor(Math.random() * 9000 + 1000)
const deliveryDate = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000)
  .toISOString()
  .split('T')[0]

const { data: advanceOrder } = await supabase
  .from('advance_orders')
  .insert({
    id: crypto.randomUUID(),
    deposit_id: depositId,
    customer_name: 'Anjali Nair',
    phone: '918122921906',
    address: 'Kandamangalam Junction',
    product_name: 'Bridal Lehenga (Custom Design)',
    products: [
      {
        product_name: 'Bridal Lehenga (Custom Design)',
        qty: 1,
        unit: 'pc',
        rate: 8000,
        lineTotal: 8000
      }
    ],
    category: 'Garments',
    description: 'Custom bridal lehenga with gold embroidery',
    total_amount: 8000,
    deposit_amount: 4000,
    expected_delivery_date: deliveryDate,
    status: 'pending_deposit',
    remarks: 'Test advance order',
    created_by_name: 'Admin'
  })
  .select()
  .single()

if (advanceOrder) {
  console.log('✅ ADVANCE ORDER (Step 1: Deposit Received)')
  console.log(`   Deposit ID: ${advanceOrder.deposit_id}`)
  console.log(`   Customer: ${advanceOrder.customer_name}`)
  console.log(`   Total: ₹${advanceOrder.total_amount}`)
  console.log(`   Deposit Paid: ₹${advanceOrder.deposit_amount}`)
  console.log(`   Balance Due: ₹${advanceOrder.remaining_balance}`)
  console.log(`   Delivery: ${deliveryDate}\n`)

  // Complete the advance order
  const completeResult = await supabase.rpc('complete_advance_order_v2', {
    p_order_id: advanceOrder.id,
    p_payment_method: 'cash',
    p_final_amount: advanceOrder.remaining_balance
  })

  if (completeResult.data) {
    const finalInvoice = completeResult.data.invoice_no
    console.log('✅ ADVANCE ORDER (Step 2: Final Payment Received)')
    console.log(`   Final Invoice: ${finalInvoice}`)
    console.log(`   Final Amount: ₹${advanceOrder.remaining_balance}`)
    console.log(`   Link: https://mahalashmi.vercel.app/invoice/${encodeURIComponent(finalInvoice)}`)
    console.log(`   WhatsApp: Click WhatsApp button on invoice page\n`)
  } else {
    console.log(`❌ Error completing advance order: ${completeResult.error?.message}\n`)
  }
} else {
  console.log('❌ Failed to create advance order\n')
}

console.log('═══════════════════════════════════════════════════════════════')
console.log('✅ TEST INVOICES CREATED - Click links above to view!')
console.log('═══════════════════════════════════════════════════════════════')
