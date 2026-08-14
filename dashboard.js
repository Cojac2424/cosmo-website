const container = document.getElementById('inquiries');
const statsEl = document.getElementById('stats');
const searchEl = document.getElementById('search');
const filterEl = document.getElementById('statusFilter');

function getInquiries(){return JSON.parse(localStorage.getItem('cosmo_inquiries')||'[]')}
function save(items){localStorage.setItem('cosmo_inquiries',JSON.stringify(items))}
function escapeHtml(s=''){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function render(){
  const all=getInquiries();
  const q=searchEl.value.toLowerCase().trim();
  const f=filterEl.value;
  const items=all.filter(i=>(!f||i.status===f)&&(!q||[i.name,i.organization,i.email,i.message,i.interest].join(' ').toLowerCase().includes(q)));
  const counts={total:all.length,new:all.filter(i=>i.status==='New').length,follow:all.filter(i=>i.status==='Follow-Up').length,booked:all.filter(i=>i.status==='Booked').length};
  statsEl.innerHTML=`<div class="stat"><strong>${counts.total}</strong><span>Total inquiries</span></div><div class="stat"><strong>${counts.new}</strong><span>New</span></div><div class="stat"><strong>${counts.follow}</strong><span>Follow-up</span></div><div class="stat"><strong>${counts.booked}</strong><span>Booked</span></div>`;
  if(!items.length){container.innerHTML='<div class="empty"><strong>No inquiries yet.</strong><br>Submit the website form and the inquiry will appear here in this prototype.</div>';return}
  container.innerHTML=items.map(i=>`<article class="card" data-id="${i.id}"><div><h3>${escapeHtml(i.name)}</h3><div class="meta">${escapeHtml(i.organization)} • ${new Date(i.created_at).toLocaleString()}</div><span class="interest">${escapeHtml(i.interest)}</span><p class="message">${escapeHtml(i.message)}</p></div><div class="contact"><strong>Email</strong><br><a href="mailto:${escapeHtml(i.email)}">${escapeHtml(i.email)}</a><br><br><strong>Phone</strong><br>${escapeHtml(i.phone||'—')}</div><select class="status-select"><option ${i.status==='New'?'selected':''}>New</option><option ${i.status==='Contacted'?'selected':''}>Contacted</option><option ${i.status==='Follow-Up'?'selected':''}>Follow-Up</option><option ${i.status==='Booked'?'selected':''}>Booked</option><option ${i.status==='Closed'?'selected':''}>Closed</option></select></article>`).join('');
  document.querySelectorAll('.status-select').forEach(sel=>sel.addEventListener('change',e=>{const id=e.target.closest('.card').dataset.id;const arr=getInquiries();const x=arr.find(v=>v.id===id);if(x){x.status=e.target.value;save(arr);render()}}));
}
searchEl.addEventListener('input',render); filterEl.addEventListener('change',render);
document.getElementById('clearDemo').addEventListener('click',()=>{if(confirm('Clear all locally stored prototype inquiries?')){localStorage.removeItem('cosmo_inquiries');render()}});
render();
