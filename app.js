const WORKER_URL = "https://newnewnew.rkknitfabsachin.workers.dev/";

const email = localStorage.getItem("email");
const token = localStorage.getItem("token");

if (!email || !token) {
  alert("User not authenticated");
}

/* ---------- API ---------- */

async function api(action, payload = {}) {
  const res = await fetch(WORKER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({ action, payload })
  });
  return res.json();
}

/* ---------- REMINDERS ---------- */

async function loadReminders() {
  const data = await api("getTodayReminders", { email });

  if (data.count > 0) {
    document.getElementById("reminder").classList.remove("hidden");
    document.getElementById("reminderText").innerText =
      `You have ${data.count} pending task(s) today`;

    const list = document.getElementById("reminderList");
    list.innerHTML = "";
    data.items.forEach(i => {
      const li = document.createElement("li");
      li.textContent = i.title;
      list.appendChild(li);
    });
  }
}

/* ---------- TASKS ---------- */

async function loadTasks() {
  const data = await api("getTodayTasks", { email });
  const tasks = data.tasks || [];

  const wrap = document.getElementById("tasks");
  wrap.innerHTML = "";

  if (tasks.length === 0) {
    document.getElementById("empty").classList.remove("hidden");
    return;
  }

  tasks.forEach(task => {
    const card = document.createElement("div");
    card.className =
      "bg-white rounded-lg shadow hover:shadow-lg transition p-4 flex justify-between items-center";

    card.innerHTML = `
      <div>
        <p class="font-medium text-slate-800">${task.title}</p>
        <span class="inline-block mt-1 text-xs bg-slate-200 rounded px-2 py-0.5">
          ${task.type}
        </span>
      </div>
      <div class="flex gap-2">
        <button class="border rounded p-2 hover:bg-slate-100"
          onclick="uploadProof('${task.id}', '${task.type}')">
          📷
        </button>
        <button class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          onclick="markDone('${task.id}', '${task.type}', this)">
          Done
        </button>
      </div>
    `;

    wrap.appendChild(card);
  });
}

/* ---------- ACTIONS ---------- */

async function markDone(taskId, type, btn) {
  btn.disabled = true;
  btn.innerText = "✓";

  await api("markDone", {
    taskId,
    type,
    email
  });

  loadTasks();
  loadReminders();
}

function uploadProof(taskId, type) {
  alert("Proof upload UI coming next");
}

/* ---------- INIT ---------- */

loadReminders();
loadTasks();
