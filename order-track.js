const SB_URL = "https://hkabhikizdlbavfkualt.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrYWJoaWtpemRsYmF2Zmt1YWx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0ODgyMjUsImV4cCI6MjA5MjA2NDIyNX0.iMlS6-M1aylW8K915LPYDHOg7qUxwu5GelH_CPHLP2U";
const db = window.supabase.createClient(SB_URL, SB_KEY);
const form=document.getElementById('trackForm'), msg=document.getElementById('trackMessage'), btn=document.getElementById('trackBtn');
const labels={pending:'Order receive ho gaya',scheduled:'Order schedule ho gaya',accepted:'Order accept ho gaya',confirmed:'Order confirm ho gaya',assigned:'Rider assign ho gaya',processing:'Order par kaam ho raha hai',on_the_way:'Rider raste mein hai',delivered:'Order deliver ho gaya',completed:'Order complete ho gaya',cancelled:'Order cancel ho gaya'};
function message(t,type='error'){msg.textContent=t;msg.className='message '+type;}
async function lookup(id,phone){
 const {data,error}=await db.rpc('public_track_order',{p_order_id:id,p_phone:phone});
 if(error) throw error;
 const row=Array.isArray(data)?data[0]:data;
 if(!row) throw new Error('Order nahi mila. Order ID aur mobile number check karein.');
 document.getElementById('resultId').textContent='Order #'+row.id;
 const status=String(row.status||'pending').toLowerCase();
 document.getElementById('statusText').textContent=labels[status]||status.replaceAll('_',' ');
 document.getElementById('updatedText').textContent=row.updated_at?'Last update: '+new Date(row.updated_at).toLocaleString('en-PK'): '';
 const extras=[];
 if(row.rider_status) extras.push('Rider update: '+row.rider_status);
 if(row.bill_amount && Number(row.bill_amount)>0) extras.push('Bill amount: Rs. '+row.bill_amount);
 document.getElementById('extraInfo').textContent=extras.join(' · ');
 document.getElementById('result').hidden=false;
}
form.addEventListener('submit',async e=>{e.preventDefault();msg.className='message';btn.disabled=true;btn.textContent='Checking...';document.getElementById('result').hidden=true;
 try{await lookup(document.getElementById('orderId').value.trim(),document.getElementById('phone').value.trim());message('Status mil gaya.','ok');}
 catch(err){console.error(err);message(err.message||'Status check nahi ho saka.');}
 finally{btn.disabled=false;btn.textContent='Status Check Karein →';}
});
const params=new URLSearchParams(location.search);if(params.get('id'))document.getElementById('orderId').value=params.get('id');
