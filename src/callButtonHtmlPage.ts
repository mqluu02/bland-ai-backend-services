export const callButtonHtmlPage = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="format-detection" content="telephone=no"><!-- stop iOS from hijacking numbers -->
  <title>Phone Call</title>
  <style>
    *,*::before,*::after{box-sizing:border-box}
    body{
      margin:0;font-family:Arial,Helvetica,sans-serif;
      background:#f7f8fa;display:flex;justify-content:center;align-items:center;
      min-height:100vh;padding:1rem
    }
    .card{
      width:100%;max-width:420px;background:#fff;padding:1.5rem;border-radius:12px;
      box-shadow:0 4px 12px rgba(0,0,0,.1)
    }
    h2{margin:0 0 1rem;text-align:center}
    input[type=tel]{
      width:100%;padding:.85rem;font-size:1rem;border:1px solid #ccc;border-radius:6px
    }
    input[type=tel]:focus{outline:2px solid #4caf50}
    button{
      width:100%;margin-top:1.25rem;padding:.85rem;font-size:1rem;color:#fff;
      background:#4caf50;border:none;border-radius:6px;transition:.15s opacity
    }
    button:disabled{opacity:.55}
    .msg{margin-top:1rem;text-align:center;font-weight:bold}
    .msg.error{color:#c62828}
    .msg.ok{color:#2e7d32}
  </style>
</head>
<body>

<div class="card" id="callForm" novalidate>
  <h2>Start a Call</h2>
  <input id="phone" type="tel" inputmode="tel" placeholder="Enter phone number" required>
  <button id="submitBtn">Start Call</button>
  <p id="msg" class="msg"></p>
</div>

<script>
(() => {
  const form  = document.getElementById('callForm');
  const phone = document.getElementById('phone');
  const btn   = document.getElementById('submitBtn');
  const msgEl = document.getElementById('msg');

  const setMsg = (text, ok=false) => {
    msgEl.textContent = text;
    msgEl.className = 'msg ' + (ok ? 'ok' : 'error');
  };
  btn.addEventListener("click", async () => {
    const number = phone.value.trim();
    setMsg('Dialing…');         // show something immediately
    btn.disabled = true;        // prevent double‑tap
    postCall(number).finally(() => (btn.disabled = false));  // re‑enable afterward
  })
  const postCall = async number => {
    const url = 'https://bland-ai-backend-services.cool-bird-2af9.workers.dev/call?phone=' +
                encodeURIComponent(number);

    try {
      const res = await fetch(url, {
        method : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer Your Bland Ai Auth_Token_Here'
        },
        body   : '{}'         // some servers require a body even if unused
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setMsg('✅ Call successfully made!', true);
      } else {
        setMsg(data.error || 'Failed: ' + res.status, false);
      }
    } catch (err) {
      setMsg('Network error – check connection.', false);
    }
  };
})();
</script>
</body>
</html>
`
