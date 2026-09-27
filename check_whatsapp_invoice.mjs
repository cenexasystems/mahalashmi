import { createClient } from '@supabase/supabase-js'

const PROJECT_URL = 'https://nnutsoivygctmkyzzvyw.supabase.co'
const ANON_KEY = 'sb_publishable_vt8T8KvuA1utwxnBnuqksw_RjgY2qLX'

const supabase = createClient(PROJECT_URL, ANON_KEY)

console.log('📱 WHATSAPP INVOICE CHECK\n')
console.log('═══════════════════════════════════════════════════════════\n')

// Create test invoice
console.log('1️⃣ Creating test invoice...')
const { data: invoice } = await supabase.rpc('create_order_with_stock', {
  p_customer_name: 'Rajesh Kumar',
  p_phone: '918122921906',
  p_address: 'Test Address',
  p_items: JSON.stringify([
    { product_name: 'Cotton Shirt', qty: 2, unit: 'pc', rate: 500, lineTotal: 1000 }
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

if (!invoice) {
  console.log('❌ Failed to create invoice\n')
  process.exit(1)
}

const invoiceNo = invoice.invoice_no
console.log(`✅ Created: ${invoiceNo}\n`)

// Check database
console.log('2️⃣ Checking database...')
const { data: dbInvoice } = await supabase
  .from('orders')
  .select('id, invoice_no, customer_name, total, phone')
  .eq('invoice_no', invoiceNo)
  .single()

if (dbInvoice) {
  console.log(`✅ Found in database`)
  console.log(`   Name: ${dbInvoice.customer_name}`)
  console.log(`   Phone: ${dbInvoice.phone}`)
  console.log(`   Total: ₹${dbInvoice.total}\n`)
} else {
  console.log(`❌ NOT found in database\n`)
}

// Generate WhatsApp link
console.log('3️⃣ WhatsApp Invoice Link:')
const url = `https://mahalashmi.vercel.app/invoice/${encodeURIComponent(invoiceNo)}`
console.log(`📱 ${url}\n`)

// Check if invoice format is correct
console.log('4️⃣ Invoice Format Check:')
console.log(`   Format: ${invoiceNo}`)
console.log(`   Length: ${invoiceNo.length} characters`)
console.log(`   Has INV prefix: ${invoiceNo.startsWith('INV') ? '✅ YES' : '❌ NO'}`)
console.log(`   Sequential: ${invoiceNo.match(/INV0+[1-9]/) ? '✅ YES (0-padded)' : '⚠️ TIMESTAMP FORMAT'}\n`)

// Test lookup variations
console.log('5️⃣ Testing lookup variations:')

const variations = [
  { name: 'Full invoice number', value: invoiceNo },
  { name: 'Without INV prefix', value: invoiceNo.replace(/^INV/i, '') },
  { name: 'Stripped zeros', value: invoiceNo.replace(/^INV0+/, '') }
]

for (const variant of variations) {
  const { data: result } = await supabase
    .from('orders')
    .select('invoice_no')
    .eq('invoice_no', variant.value)
    .single()
  
  const status = result ? '✅' : '❌'
  console.log(`${status} ${variant.name}: "${variant.value}"`)
}

console.log('\n═══════════════════════════════════════════════════════════')
console.log('✅ WHATSAPP INVOICE CHECK COMPLETE')
console.log('\n🔗 Click link to verify invoice loads:')
console.log(`${url}`)
