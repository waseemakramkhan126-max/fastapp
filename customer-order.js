const SB_URL = "https://hkabhikizdlbavfkualt.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrYWJoaWtpemRsYmF2Zmt1YWx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0ODgyMjUsImV4cCI6MjA5MjA2NDIyNX0.iMlS6-M1aylW8K915LPYDHOg7qUxwu5GelH_CPHLP2U";
const db = window.supabase.createClient(SB_URL, SB_KEY);
const form = document.getElementById('orderForm');
const btn = document.getElementById('submitBtn');
const msg = document.getElementById('formMessage');
const success = document.getElementById('successPanel');
function showMessage(text, type='error') { msg.textContent=text; msg.className='message '+type; }
form.addEventListener('submit', async (event) => {
  event.preventDefault(); msg.className='message';
  if (!form.reportValidity()) return;
  const fd = new FormData(form);
  const phone = String(fd.get('phone') || '').trim();
  const digits = phone.replace(/\\D/g, '');
  if (digits.length < 10 || digits.length > 15) { showMessage('Meherbani karke durust mobile number likhein.'); return; }
  const orderType = fd.get('order_type');
  const details = `[${orderType}]\\n` + String(fd.get('details') || '').trim();
  const payload = {
    p_name: String(fd.get('name')).trim(),
    p_phone: phone,
    p_city: String(fd.get('city')).trim(),
    p_area: String(fd.get('area')).trim(),
    p_block: String(fd.get('block') || '').trim(),
    p_address: String(fd.get('address')).trim(),
    p_details: details
  };
  btn.disabled=true; btn.textContent='Order submit ho raha hai...';
  try {
    const {data, error} = await db.rpc('public_place_order', payload);
    if (error) throw error;
    const orderId = (data && (data.order_id || data.id)) || data;
    if (!orderId) throw new Error('Order ID receive nahi hui. Support se rabta karein.');
    document.getElementById('createdOrderId').textContent='#'+orderId;
    document.getElementById('trackCreatedOrder').href='order-track.html?id='+encodeURIComponent(orderId);
    form.hidden=true; success.hidden=false;
    window.scrollTo({top:0,behavior:'smooth'});
  } catch (error) {
    console.error('Public order error:', error);
    showMessage(error.message || 'Order submit nahi ho saka. Dobara koshish karein.');
  } finally {
    btn.disabled=false; btn.innerHTML='Order Place Karein <span>→</span>';
  }
});
document.getElementById('newOrderBtn').addEventListener('click',()=>{form.reset();form.hidden=false;success.hidden=true;msg.className='message';window.scrollTo({top:0,behavior:'smooth'});});
