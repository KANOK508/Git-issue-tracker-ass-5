let allIssues = [];

function handleLogin() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    if (user === 'admin' && pass === 'admin123') {
        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('main-page').classList.remove('hidden');
        fetchIssues();
    } else {
        alert('Invalid credentials!');
    }
}

function handleLogout() {
    location.reload();
}


// for use --await -- we have to use -- async keyword before the function declare... 
// (Instead of if else ---we use -->>> And for more secure -- not Crash -- i use here, try --catch--finally ..... (for BETTER UX EXPERIENCE ALSO... )

//async --the function will run -- in a fixed order...........
async function fetchIssues() {
    showLoader(true);
    try {
        const res = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues');
        const data = await res.json();
        allIssues = data.data;
        displayIssues(allIssues);
    } catch (err) { console.error(err); }
    // if --the server failed to fetch--- the server ---give something like (syntexterror)--that receive the err parameter ... 
    finally { showLoader(false); }        
    // try or catch whatever run-- Finally run for sure.........
}

// ---------------main part start.............

// /- Each card shows:
//   - Title
//   - Description
//   - Status 
//   - Author
//   - Priority
//   - Label
//   - CreatedAt
function displayIssues(issues) {
    const container = document.getElementById('issues-container');  // get the parent 
    document.getElementById('issue-count').innerText = issues.length;
    container.innerHTML = "";

    issues.forEach(issue => {
        const isClosed = issue.status.toLowerCase() === 'closed';
        const card = document.createElement('div');
        // using --using className event handler and -- and CSS style == give the top border color... (challenge part)  with --template string.. 
        card.className = `card bg-white shadow-sm border border-slate-100 ${isClosed ? 'border-top-closed' : 'border-top-open'} issue-card cursor-pointer`;
        // set EVery card inner html...........
        card.innerHTML = `
            <div class="p-6" onclick="loadSingleIssue('${issue.id}')">
                <div class="flex justify-between items-center mb-4">
                
                    <img src="${isClosed ? './assets/Closed- Status .png' : './assets/Open-Status.png'}" class="w-6 h-6">
                    <span class="badge badge-ghost text-[10px] uppercase font-black text-slate-400 bg-slate-50 border-none">${issue.priority}</span>
                </div>
                <h3 class="font-extrabold text-lg text-slate-800 mb-2 truncate">${issue.title}</h3>
                <p class="text-sm text-slate-500 mb-6 line-clamp-2">${issue.description}</p>
                
                <div class="flex gap-2 mb-6">
                    <span class="label-pill label-bug"><i class="fa-solid fa-bug text-[10px]"></i> BUG</span>
                    <span class="label-pill label-help"><i class="fa-solid fa-circle-question text-[10px]"></i> HELP WANTED</span>
                </div>

                <div class="border-t pt-4 flex justify-between text-[11px] font-bold text-slate-400">
                    <span>#${issue.id} by ${issue.author}</span>
                    <span>${new Date(issue.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
        `;

        // finish add all the information... 
        container.appendChild(card);
    });
}

// --------------------single  issue--- loader... 
async function loadSingleIssue(id) {
    try {
        const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
        const data = await res.json();
        const issue = data.data;            // issue variable now --store a (unique set of data--per ID )

        const modalBox = document.getElementById('modal-content');
        modalBox.innerHTML = `
            <div class="p-8">
                <div class="flex justify-between items-start mb-6">
                    <h2 class="text-3xl font-black text-slate-800">${issue.title}</h2>
                    <button onclick="issue_modal.close()" class="btn btn-sm btn-circle btn-ghost">✕</button>
                </div>
                
                <div class="flex items-center gap-3 mb-8">
                    <span class="badge ${issue.status === 'open' ? 'badge-success' : 'badge-secondary'} px-4 py-3 text-white font-bold uppercase">
                        ${issue.status}
                    </span>
                    <span class="text-sm font-medium text-slate-500">• Opened by <strong>${issue.author}</strong> • ${new Date(issue.createdAt).toLocaleDateString()}</span>
                </div>

                <div class="flex gap-2 mb-8">
                    <span class="label-pill label-bug p-3 text-sm"><i class="fa-solid fa-bug"></i> BUG</span>
                    <span class="label-pill label-help p-3 text-sm"><i class="fa-solid fa-circle-question"></i> HELP WANTED</span>
                </div>

                <div class="bg-slate-50 p-8 rounded-2xl border border-slate-100 mb-8">
                    <p class="text-slate-700 leading-loose text-lg">${issue.description}</p>
                </div>

                <div class="grid grid-cols-2 gap-6 mb-8">
                    <div class="p-5 bg-white border rounded-xl">
                        <p class="text-xs text-slate-400 font-black uppercase mb-2">Assignee:</p>
                        <p class="font-extrabold text-slate-800">${issue.author}</p>
                    </div>
                    <div class="p-5 bg-white border rounded-xl">
                        <p class="text-xs text-slate-400 font-black uppercase mb-2">Priority:</p>
                        <span class="badge badge-error text-white font-black uppercase">${issue.priority}</span>
                    </div>
                </div>

                <div class="flex justify-end">
                    <button onclick="issue_modal.close()" class="btn btn-lg bg-[#4F46E5] border-none text-white px-12 rounded-xl">Close</button>
                </div>
            </div>
        `;
        // -- get the modal container id --- from html file 
        const modal = document.getElementById('issue_modal');
        modal.showModal();
    } catch (err) { console.error(err); }
}
// -- the simple loader function --- set when to -- see and when to hide.......status== true show-- else hide.. 
function showLoader(status) {
    const loader = document.getElementById('loader');
    const container = document.getElementById('issues-container');
    if (status) {
        loader.classList.remove('hidden');
        container.classList.add('hidden');
    } else {
        loader.classList.add('hidden');
        container.classList.remove('hidden');
    }
}
// ---- now filter the issues and -- display the issues.. 
function filterIssues(type) {
    const tabs = ['tab-all', 'tab-open', 'tab-closed'];  // create the tab array.. 
    tabs.forEach(id => {
        const btn = document.getElementById(id);
        btn.classList.remove('active-tab');
        btn.classList.add('btn-outline');
    });

    document.getElementById(`tab-${type}`).classList.add('active-tab');
    document.getElementById(`tab-${type}`).classList.remove('btn-outline');

    if (type === 'all') displayIssues(allIssues);
    else displayIssues(allIssues.filter(i => i.status.toLowerCase() === type));
}


// search part------
async function handleSearch() {
    const query = document.getElementById('search-input').value;
    if (!query) return displayIssues(allIssues);
    showLoader(true);
    try {
        const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${query}`);
        const data = await res.json();
        displayIssues(data.data);
    } catch (err) { console.error(err); }
    finally { showLoader(false); }
}