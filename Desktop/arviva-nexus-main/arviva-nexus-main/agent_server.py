import os, base64, json, subprocess, time
from flask import Flask, request, jsonify, render_template_string, session, redirect, url_for
from functools import wraps

app = Flask(__name__)
app.secret_key = 'ARVIVA_NEXUS_EMERGENCY'

# ENKEL INLOGGNING UTAN 2FA
USER_EMAIL = "admin"
USER_PASSWORD = "123"

def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if not session.get('authenticated'): return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        if request.form.get('email') == USER_EMAIL and request.form.get('password') == USER_PASSWORD:
            session['authenticated'] = True
            return redirect(url_for('home'))
    return '''
    <html><body style="background:#050505;color:#00ff88;font-family:sans-serif;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;">
    <form method="post" style="background:#111;padding:40px;border:1px solid #00ff88;border-radius:8px;width:300px;">
    <h2 style="text-align:center;">NEXUS EMERGENCY BYPASS</h2>
    User<br><input name="email" style="width:100%;background:#222;border:1px solid #333;color:#fff;padding:8px;margin-bottom:15px;" placeholder="admin">
    Pass<br><input type="password" name="password" style="width:100%;background:#222;border:1px solid #333;color:#fff;padding:8px;margin-bottom:15px;" placeholder="123">
    <button type="submit" style="width:100%;background:#00ff88;color:#000;border:none;padding:12px;font-weight:bold;cursor:pointer;">BYPASS LOGIN</button>
    </form></body></html>
    '''

@app.route('/')
@login_required
def home():
    with open(__file__, 'r') as f: code = f.read()
    return render_template_string('''
    <!DOCTYPE html><html><head><title>ARVIVA NEXUS OS</title>
    <style>
        body { background:#0a0a0a; color:#e0e0e0; font-family:monospace; margin:0; display:flex; height:100vh; }
        .sidebar { width:300px; background:#111; border-right:1px solid #222; padding:20px; }
        .main { flex:1; display:flex; flex-direction:column; }
        #editor { flex:1; padding:20px; background:#050505; color:#00ff88; outline:none; white-space:pre; overflow:auto; }
        .header { height:60px; background:#111; border-bottom:1px solid #222; display:flex; align-items:center; padding:0 20px; justify-content:space-between; }
        .btn { background:#00ff88; color:#000; border:none; padding:10px 20px; cursor:pointer; font-weight:bold; }
    </style></head>
    <body>
        <div class="sidebar"><h3>NEXUS CORE</h3><p style="color:#00ff88;">● ONLINE (BYPASS MODE)</p><hr><p>READY FOR DOMAINS</p></div>
        <div class="main">
            <div class="header"><span>/root/agent_server.py</span><button class="btn" onclick="save()">SYNC TO NEXUS</button></div>
            <div id="editor" contenteditable="true" spellcheck="false">{{code}}</div>
        </div>
        <script>
            function save() {
                fetch("/save", {method:"POST", body: document.getElementById("editor").innerText})
                .then(r=>r.text()).then(t => { alert("Nexus Synced: " + t); });
            }
        </script>
    </body></html>
    ''', code=code)

@app.route('/save', methods=['POST'])
@login_required
def save():
    code = request.data.decode()
    with open(__file__, 'w') as f: f.write(code)
    try:
        token = "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"
        url = f"https://Arviva-Admin:{token}@github.com/Arviva-Admin/arviva-nexus.git"
        subprocess.run(["git", "add", "."], check=True)
        subprocess.run(["git", "commit", "-m", "Bypass Update"], check=True)
        subprocess.run(["git", "push", url, "main", "--force"], check=True)
        return "SUCCESS"
    except Exception as e: return str(e)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
