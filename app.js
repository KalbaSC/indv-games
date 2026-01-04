const API_URL = "https://script.google.com/macros/s/AKfycbzWaxcDVya82WAfX0zUKGLTcy58pDEFwV52ukV2AFwcoTVEZ16mFOsO0HoYPgZBmeOPYQ/exec";

function jsonp(action, data) {
  return new Promise((resolve, reject) => {
    const cb = "cb_" + Math.random().toString(36).slice(2);
    window[cb] = (resp) => {
      delete window[cb];
      script.remove();
      if (resp && resp.ok) resolve(resp.data);
      else reject(resp?.error || "Request failed");
    };

    const script = document.createElement("script");
    const url = new URL(API_URL);
    url.searchParams.set("action", action);
    url.searchParams.set("callback", cb);
    url.searchParams.set("data", JSON.stringify(data || {}));
    script.src = url.toString();
    script.onerror = () => reject("Network error");
    document.body.appendChild(script);
  });
}

function saveAuth(email, password, role, sportId, parentPlayerId) {
  localStorage.setItem("auth", JSON.stringify({ email, password, role, sportId, parentPlayerId }));
}

function getAuth() {
  try { return JSON.parse(localStorage.getItem("auth") || "null"); }
  catch { return null; }
}

function requireRole(roles) {
  const a = getAuth();
  if (!a || !roles.includes(a.role)) location.href = "index.html";
  return a;
}
