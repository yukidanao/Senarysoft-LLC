/* ===================== MOCK DATA ===================== */
let users = [
  {id:"0513", firstName:"John", lastName:"Doe", email:"JohnDoe@Email.com", group:"Admin", division:"Corporate", region:"NY", userType:"", submitted:"05/01/2025", enabled:"05/01/2025", status:"Active"},
  {id:"1681", firstName:"Mike", lastName:"Harry", email:"Mikeharry@Email.com", group:"Admin", division:"Corporate", region:"NY", userType:"", submitted:"05/02/2025", enabled:"05/05/2025", status:"Active"},
  {id:"0123", firstName:"Jess", lastName:"Lambert", email:"JLambert91@Email.com", group:"Licensed", division:"Corporate", region:"NY", userType:"", submitted:"05/01/2025", enabled:"05/01/2025", status:"Active"},
  {id:"8415", firstName:"Yor", lastName:"Pilan", email:"YorP@Email.com", group:"Forward", division:"Corporate", region:"NY", userType:"", submitted:"05/15/2025", enabled:"05/15/2025", status:"Active"},
  {id:"6512", firstName:"Kim", lastName:"Jeun", email:"KimJ99@Email.com", group:"Recruiter", division:"Corporate", region:"NY", userType:"", submitted:"05/15/2025", enabled:"05/16/2025", status:"Active"},
  {id:"1874", firstName:"Harry", lastName:"Styles", email:"HarrySS@Email.com", group:"Forward", division:"Corporate", region:"NY", userType:"", submitted:"06/01/2025", enabled:"06/01/2025", status:"Active"},
  {id:"6301", firstName:"Fulgur", lastName:"Metane", email:"FulgurMet@Email.com", group:"Forward", division:"Corporate", region:"NY", userType:"", submitted:"06/02/2025", enabled:"06/02/2025", status:"Active"},
  {id:"4328", firstName:"Sarah", lastName:"Chen", email:"SarahC@Email.com", group:"Admin", division:"West", region:"CA", userType:"", submitted:"06/10/2025", enabled:"06/10/2025", status:"Active"},
  {id:"9987", firstName:"David", lastName:"Park", email:"DavidP@Email.com", group:"Licensed", division:"West", region:"CA", userType:"", submitted:"06/12/2025", enabled:"06/12/2025", status:"Active"},
  {id:"7764", firstName:"Maria", lastName:"Santos", email:"MariaS@Email.com", group:"Recruiter", division:"South", region:"TX", userType:"", submitted:"06/15/2025", enabled:"06/15/2025", status:"Active"},
  {id:"3390", firstName:"Priya", lastName:"Nair", email:"PriyaN@Email.com", group:"Licensed", division:"West", region:"CA", userType:"", submitted:"06/18/2025", enabled:"06/18/2025", status:"Inactive"},
  {id:"5541", firstName:"Tom", lastName:"Reeves", email:"TomR@Email.com", group:"Admin", division:"South", region:"TX", userType:"", submitted:"06/20/2025", enabled:"06/21/2025", status:"Active"},
];

let state = {
  search:"",
  field:"all",
  status:"All",
  region:"All",
  division:"All",
  group:"All",
  sortKey:"id",
  sortDir:1,
  page:1,
  pageSize:10
};

/* ===================== INIT FILTER OPTIONS ===================== */
function populateSelect(id, values){
  const sel = document.getElementById(id);
  values.forEach(v=>{
    const opt = document.createElement("option");
    opt.value = v; opt.textContent = v;
    sel.appendChild(opt);
  });
}
const filterSets = [
  {inline:"statusFilter",   modal:"mStatusFilter"},
  {inline:"regionFilter",   modal:"mRegionFilter"},
  {inline:"divisionFilter", modal:"mDivisionFilter"},
  {inline:"groupFilter",    modal:"mGroupFilter"}
];

function refreshFilterOptions(){
  const regions = [...new Set(users.map(u=>u.region))].sort();
  const divisions = [...new Set(users.map(u=>u.division))].sort();
  const groups = [...new Set(users.map(u=>u.group))].sort();
  filterSets.forEach(({inline,modal})=>{
    document.getElementById(inline).innerHTML = '<option value="All">All</option>';
    document.getElementById(modal).innerHTML = '<option value="All">All</option>';
  });
  populateSelect("regionFilter", regions);
  populateSelect("divisionFilter", divisions);
  populateSelect("groupFilter", groups);
  populateSelect("mRegionFilter", regions);
  populateSelect("mDivisionFilter", divisions);
  populateSelect("mGroupFilter", groups);
}

/* ===================== RENDER ===================== */
function getFiltered(){
  let list = users.filter(u=>{
    if(state.status!=="All" && u.status!==state.status) return false;
    if(state.region!=="All" && u.region!==state.region) return false;
    if(state.division!=="All" && u.division!==state.division) return false;
    if(state.group!=="All" && u.group!==state.group) return false;
    if(state.search){
      const q = state.search.toLowerCase();
      if(state.field==="all"){
        const hay = `${u.id} ${u.firstName} ${u.lastName} ${u.email} ${u.group}`.toLowerCase();
        if(!hay.includes(q)) return false;
      } else {
        const val = String(u[state.field]||"").toLowerCase();
        if(!val.includes(q)) return false;
      }
    }
    return true;
  });

  list.sort((a,b)=>{
    let av = a[state.sortKey] ?? "";
    let bv = b[state.sortKey] ?? "";
    if(av < bv) return -1*state.sortDir;
    if(av > bv) return 1*state.sortDir;
    return 0;
  });

  return list;
}

function truncateEmail(email){
  return email.length > 20 ? email.slice(0,17)+"..." : email;
}

function render(){
  const filtered = getFiltered();
  const totalPages = Math.max(1, Math.ceil(filtered.length / state.pageSize));
  if(state.page > totalPages) state.page = totalPages;
  const start = (state.page-1)*state.pageSize;
  const pageItems = filtered.slice(start, start+state.pageSize);

  const tbody = document.getElementById("userTableBody");
  const emptyState = document.getElementById("emptyState");

  if(pageItems.length === 0){
    tbody.innerHTML = "";
    emptyState.classList.remove("d-none");
  } else {
    emptyState.classList.add("d-none");
    tbody.innerHTML = pageItems.map(u => `
      <tr>
        <td>${u.id}</td>
        <td>${u.firstName}</td>
        <td>${u.lastName}</td>
        <td title="${u.email}">${truncateEmail(u.email)}</td>
        <td><span class="badge-group badge-${u.group}">${u.group}</span></td>
        <td>${u.division}</td>
        <td>${u.region}</td>
        <td>${u.userType || "&mdash;"}</td>
        <td>${u.submitted}</td>
        <td>${u.enabled || "&mdash;"}</td>
        <td>
          <button class="action-icon" title="Edit" onclick="openEdit('${u.id}')"><i class="fa-solid fa-pen-to-square"></i></button>
          <button class="action-icon deactivate" title="Deactivate" onclick="openDeactivate('${u.id}')"><i class="fa-solid fa-ban"></i></button>
        </td>
      </tr>
    `).join("");
  }

  const entriesText = filtered.length === 0
    ? "Showing 0 entries"
    : `Showing ${start+1} to ${Math.min(start+state.pageSize, filtered.length)} of ${filtered.length} entries`;
  document.getElementById("entriesText").textContent = entriesText;

  renderPagination(totalPages);
  renderSortIcons();
}

function renderPagination(totalPages){
  const pag = document.getElementById("pagination");
  let html = "";
  html += `<li class="page-item ${state.page===1?'disabled':''}"><a class="page-link" href="#" data-page="prev">Previous</a></li>`;
  for(let i=1;i<=totalPages;i++){
    html += `<li class="page-item ${state.page===i?'active':''}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
  }
  html += `<li class="page-item ${state.page===totalPages?'disabled':''}"><a class="page-link" href="#" data-page="next">Next</a></li>`;
  pag.innerHTML = html;

  pag.querySelectorAll("a.page-link").forEach(a=>{
    a.addEventListener("click", e=>{
      e.preventDefault();
      const p = a.dataset.page;
      if(p==="prev") state.page = Math.max(1, state.page-1);
      else if(p==="next") state.page = Math.min(totalPages, state.page+1);
      else state.page = parseInt(p);
      render();
    });
  });
}

function renderSortIcons(){
  document.querySelectorAll("th[data-key]").forEach(th=>{
    const icon = th.querySelector("i");
    if(th.dataset.key === state.sortKey){
      icon.className = state.sortDir===1 ? "fa-solid fa-sort-up" : "fa-solid fa-sort-down";
    } else {
      icon.className = "fa-solid fa-sort";
    }
  });
}

/* ===================== EVENTS ===================== */
document.getElementById("searchInput").addEventListener("input", e=>{
  state.search = e.target.value.trim();
  state.page = 1;
  render();
});
document.getElementById("searchBtn").addEventListener("click", ()=>render());
document.getElementById("fieldSelect").addEventListener("change", e=>{
  state.field = e.target.value;
  state.page = 1;
  render();
});

document.getElementById("toggleFiltersBtn").addEventListener("click", ()=>{
  document.getElementById("filtersPanel").classList.toggle("d-none");
});
document.getElementById("filtersPanel").classList.add("d-none");
document.getElementById("filtersPanel").classList.remove("d-none");

filterSets.forEach(({inline,modal})=>{
  const applyFilter = value=>{
    const key = inline.replace("Filter","");
    state[key] = value;
    state.page = 1;
    render();
  };
  document.getElementById(inline).addEventListener("change", e=>{
    const v = e.target.value;
    document.getElementById(modal).value = v;
    applyFilter(v);
  });
  document.getElementById(modal).addEventListener("change", e=>{
    const v = e.target.value;
    document.getElementById(inline).value = v;
    applyFilter(v);
  });
});

function clearFilters(){
  state.status="All"; state.region="All"; state.division="All"; state.group="All";
  state.search=""; state.field="all"; state.page=1;
  filterSets.forEach(({inline,modal})=>{
    document.getElementById(inline).value="All";
    document.getElementById(modal).value="All";
  });
  document.getElementById("searchInput").value="";
  document.getElementById("fieldSelect").value="all";
  render();
}

document.getElementById("clearFiltersBtn").addEventListener("click", e=>{
  e.preventDefault();
  clearFilters();
});

document.querySelectorAll("th[data-key]").forEach(th=>{
  th.addEventListener("click", ()=>{
    const key = th.dataset.key;
    if(state.sortKey === key){
      state.sortDir *= -1;
    } else {
      state.sortKey = key;
      state.sortDir = 1;
    }
    render();
  });
});

/* ===================== ACTIONS ===================== */
const editModal = new bootstrap.Modal(document.getElementById("editUserModal"));
const addModal = new bootstrap.Modal(document.getElementById("addUserModal"));
const deactivateModal = new bootstrap.Modal(document.getElementById("deactivateModal"));
const filtersModal = new bootstrap.Modal(document.getElementById("filtersModal"));
const toastEl = new bootstrap.Toast(document.getElementById("mainToast"));

/* ===================== MOBILE FAB ===================== */
const fab = document.getElementById("fab");
document.getElementById("fabToggle").addEventListener("click", ()=>{
  fab.classList.toggle("open");
});
document.getElementById("fabAddUser").addEventListener("click", ()=>{
  fab.classList.remove("open");
  document.getElementById("addUserForm").reset();
  addModal.show();
});
document.getElementById("fabFilters").addEventListener("click", ()=>{
  fab.classList.remove("open");
  filtersModal.show();
});
document.getElementById("fabClearFilters").addEventListener("click", ()=>{
  fab.classList.remove("open");
  clearFilters();
});
document.getElementById("mApplyFiltersBtn").addEventListener("click", ()=>{
  filtersModal.hide();
});

let deactivateTargetId = null;

function openEdit(id){
  const u = users.find(x=>x.id===id);
  if(!u) return;
  document.getElementById("editId").value = u.id;
  document.getElementById("editFirstName").value = u.firstName;
  document.getElementById("editLastName").value = u.lastName;
  document.getElementById("editEmail").value = u.email;
  document.getElementById("editGroup").value = u.group;
  document.getElementById("editRegion").value = u.region;
  document.getElementById("editDivision").value = u.division;
  editModal.show();
}

document.getElementById("saveUserBtn").addEventListener("click", ()=>{
  const form = document.getElementById("editUserForm");
  if(!form.checkValidity()){ form.reportValidity(); return; }
  const id = document.getElementById("editId").value;
  const u = users.find(x=>x.id===id);
  u.firstName = document.getElementById("editFirstName").value;
  u.lastName = document.getElementById("editLastName").value;
  u.email = document.getElementById("editEmail").value;
  u.group = document.getElementById("editGroup").value;
  u.region = document.getElementById("editRegion").value;
  u.division = document.getElementById("editDivision").value;
  editModal.hide();
  refreshFilterOptions();
  render();
  showToast(`Saved changes for ${u.firstName} ${u.lastName}.`);
});

function openDeactivate(id){
  const u = users.find(x=>x.id===id);
  if(!u) return;
  deactivateTargetId = id;
  document.getElementById("deactivateName").textContent = `${u.firstName} ${u.lastName}`;
  deactivateModal.show();
}
document.getElementById("confirmDeactivateBtn").addEventListener("click", ()=>{
  const u = users.find(x=>x.id===deactivateTargetId);
  if(u){
    u.status = "Inactive";
    u.enabled = "";
  }
  deactivateModal.hide();
  render();
  showToast(`${u.firstName} ${u.lastName} has been deactivated.`);
});

document.getElementById("addUserBtn").addEventListener("click", ()=>{
  document.getElementById("addUserForm").reset();
  addModal.show();
});
document.getElementById("createUserBtn").addEventListener("click", ()=>{
  const form = document.getElementById("addUserForm");
  if(!form.checkValidity()){ form.reportValidity(); return; }
  const newId = String(Math.floor(1000 + Math.random()*8999));
  const today = new Date();
  const dateStr = `${String(today.getMonth()+1).padStart(2,'0')}/${String(today.getDate()).padStart(2,'0')}/${today.getFullYear()}`;
  const u = {
    id:newId,
    firstName: document.getElementById("addFirstName").value,
    lastName: document.getElementById("addLastName").value,
    email: document.getElementById("addEmail").value,
    group: document.getElementById("addGroup").value,
    region: document.getElementById("addRegion").value || "NY",
    division: document.getElementById("addDivision").value || "Corporate",
    userType:"",
    submitted: dateStr,
    enabled: dateStr,
    status:"Active"
  };
  users.unshift(u);
  addModal.hide();
  refreshFilterOptions();
  state.page = 1;
  render();
  showToast(`${u.firstName} ${u.lastName} was added.`);
});

function showToast(msg){
  document.getElementById("toastBody").textContent = msg;
  toastEl.show();
}

/* ===================== MOBILE SIDEBAR ===================== */
const sidebar = document.getElementById("sidebar");
const backdrop = document.getElementById("sidebarBackdrop");
document.getElementById("sidebarToggle").addEventListener("click", ()=>{
  sidebar.classList.toggle("show");
  backdrop.classList.toggle("show");
});
backdrop.addEventListener("click", ()=>{
  sidebar.classList.remove("show");
  backdrop.classList.remove("show");
});

/* ===================== INITIAL RENDER ===================== */
refreshFilterOptions();
render();
