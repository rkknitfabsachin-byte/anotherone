const WORKER_URL = "https://newnewnew.rkknitfabsachin.workers.dev/";

const token = localStorage.getItem("token");
const email = localStorage.getItem("email");

if (!token || !email) {
  document.getElementById("notAdmin").classList.remove("hidden");
  throw new Error("Not logged in");
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

/* ---------- LOAD DOERS ---------- */

async function loadDoers() {
  const data = await api("adminListDoers", { email });

  if (data.error === "UNAUTHORIZED") {
    document.getElementById("notAdmin").classList.remove("hidden");
    return;
  }

  document.getElementById("panel").classList.remove("hidden");

  const tbody = document.getElementById("doerTable");
  tbody.innerHTML = "";

  data.doers.forEach(d => {
    const tr = document.createElement("tr");
    tr.className = "border-b";

    tr.innerHTML = `
      <td class="px-4 py-2">${d.name || "-"}</td>
      <td class="px-4 py-2">${d.email}</td>
      <td class="px-4 py-2 text-center">
        ${d.token_active
          ? "<span class='text-green-600 font-semibold'>Active</span>"
          : "<span class='text-slate-400'>Inactive</span>"}
      </td>
      <td class="px-4 py-2 text-center space-x-2">
        <button class="px-3 py-1 bg-blue-600 text-white rounded"
          onclick="generate('${d.email}')">
          Generate
        </button>
        <button class="px-3 py-1 bg-red-600 text-white rounded"
          onclick="revoke('${d.email}')">
          Revoke
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

/* ---------- ACTIONS ---------- */

async function generate(userEmail) {
  const res = await api("adminGenerateLink", {
    admin: email,
    target: userEmail
  });

  if (res.link) {
    navigator.clipboard.writeText(res.link);
    alert("Login link copied to clipboard");
  }
}

async function revoke(userEmail) {
  if (!confirm("Revoke access for this user?")) return;

  await api("adminRevokeToken", {
    admin: email,
    target: userEmail
  });

  loadDoers();
}

/* ---------- INIT ---------- */

loadDoers();
