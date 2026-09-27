import { createClient } from '@supabase/supabase-js'

const PROJECT_URL = 'https://nnutsoivygctmkyzzvyw.supabase.co'
const ANON_KEY = 'sb_publishable_vt8T8KvuA1utwxnBnuqksw_RjgY2qLX'

const supabase = createClient(PROJECT_URL, ANON_KEY)

console.log('🔍 TESTING INVOICE LOOKUP WITH NEW FORMAT\n')

// First, create a test invoice with new sequential format
console.log('1️⃣ Creating test invoice...')
const { data: created } = await supabase.rpc('create_order_with_stock', {
  p_customer_name: 'Test Customer',
  p_phone: '918122921906',
  p_address: 'Test Address',
  p_items: JSON.stringify([
    { product_name: 'Test Product', qty: 1, unit: 'pc', rate: 1000, lineTotal: 1000 }
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

if (!created) {
  console.log('❌ Failed to create invoice\n')
  process.exit(1)
}

const invoiceNo = created.invoice_no
console.log(`✅ Created: ${invoiceNo}\n`)

// Now test various lookups
console.log('2️⃣ Testing database lookups...\n')

// Test 1: Direct lookup
console.log(`Test 1: Direct lookup for "${invoiceNo}"`)
const { data: direct } = await supabase
  .from('orders')
  .select('id, invoice_no, customer_name, total')
  .eq('invoice_no', invoiceNo)
  .single()

if (direct) {
  console.log(`✅ FOUND: ${direct.invoice_no}\n`)
} else {
  console.log(`❌ NOT FOUND\n`)
}

// Test 2: Fuzzy lookup (without INV prefix)
const numPart = invoiceNo.replace(/^INV/i, '')
console.log(`Test 2: Fuzzy lookup for "${numPart}"`)
const { data: fuzzy } = await supabase
  .from('orders')
  .select('id, invoice_no, customer_name, total')
  .ilike('invoice_no', `%${numPart}%`)
  .single()

if (fuzzy) {
  console.log(`✅ FOUND: ${fuzzy.invoice_no}\n`)
} else {
  console.log(`❌ NOT FOUND\n`)
}

// Test 3: Stripped lookup
console.log(`Test 3: Lookup with stripped zeros`)
const stripped = invoiceNo.replace(/^INV0+/, '')
console.log(`Stripped format: "${stripped}"`)
const { data: strippedLookup } = await supabase
  .from('orders')
  .select('id, invoice_no, customer_name, total')
  .ilike('invoice_no', `%${stripped}%`)

if (strippedLookup && strippedLookup.length > 0) {
  console.log(`✅ FOUND: ${strippedLookup[0].invoice_no}\n`)
} else {
  console.log(`❌ NOT FOUND\n`)
}

// Test 4: RPC lookup
console.log(`Test 4: RPC function lookup`)
const { data: rpc } = await supabase.rpc('get_public_invoice_by_number', { 
  p_invoice_no: invoiceNo 
})

if (rpc && rpc.length > 0) {
  console.log(`✅ FOUND: ${rpc[0].invoice_no}\n`)
} else {
  console.log(`❌ NOT FOUND\n`)
}

// Test 5: Simulating frontend formatInvoiceNo function
console.log(`Test 5: Check what formatInvoiceNo would do\n`)
const strippedIdentifier = invoiceNo.replace(/^INV/i, '').trim()
const cleanIdentifier = invoiceNo.replace(/^INV0*/i, '').trim()
console.log(`Original: ${invoiceNo}`)
console.log(`Stripped INV: ${strippedIdentifier}`)
console.log(`Cleaned INV+zeros: ${cleanIdentifier}`)

// Test lookups with these variants
for (const variant of [invoiceNo, strippedIdentifier, cleanIdentifier]) {
  const { data: result } = await supabase
    .from('orders')
    .select('invoice_no')
    .eq('invoice_no', variant)
    .single()
  
  if (result) {
    console.log(`✅ Lookup "${variant}" found\n`)
  } else {
    console.log(`❌ Lookup "${variant}" NOT found\n`)
  }
}

console.log('═══════════════════════════════════════════════════════════')
console.log('✅ LOOKUP TEST COMPLETE')
