import { createClient } from '@supabase/supabase-js'

const PROJECT_URL = 'https://nnutsoivygctmkyzzvyw.supabase.co'
const ANON_KEY = 'sb_publishable_vt8T8KvuA1utwxnBnuqksw_RjgY2qLX'

const supabase = createClient(PROJECT_URL, ANON_KEY)

console.log('🧪 TESTING SEQUENTIAL INVOICE NUMBERING\n')

// Test creating new invoices with the updated RPC
const testCustomers = [
  { name: 'Rajesh Kumar', phone: '918122921906' },
  { name: 'Priya Sharma', phone: '918122921906' },
  { name: 'Anjali Nair', phone: '918122921906' }
]

for (const customer of testCustomers) {
  const { data, error } = await supabase.rpc('create_order_with_stock', {
    p_customer_name: customer.name,
    p_phone: customer.phone,
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

  if (data) {
    const invoiceNo = data.invoice_no
    console.log(`✅ ${customer.name}`)
    console.log(`   Invoice: ${invoiceNo}`)
    console.log(`   Format: ${invoiceNo.length} digits (should be 16)`)
    console.log(`   Link: https://mahalashmi.vercel.app/invoice/${encodeURIComponent(invoiceNo)}\n`)
  } else {
    console.log(`❌ ${customer.name}: ${error?.message}\n`)
  }
}
