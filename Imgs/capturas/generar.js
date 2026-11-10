// Genera capturas recreadas a partir de las fotos de Imgs/.
// Uso: node generar.js <directorio_salida>
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT = process.argv[2];
fs.mkdirSync(OUT, { recursive: true });

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* ---------------------------------------------------------------- terminal */
const termCss = `
body{margin:0;background:transparent;font-family:Inter,sans-serif}
.win{display:inline-block;border-radius:10px;overflow:hidden;box-shadow:0 0 0 1px #111,0 12px 30px rgba(0,0,0,.35);margin:24px;background:#2e2e2e}
.bar{height:34px;background:#3a3a3a;color:#ddd;font-size:13px;display:flex;align-items:center;justify-content:center;position:relative;border-bottom:1px solid #222}
.bar .btns{position:absolute;right:12px;display:flex;gap:8px}
.bar .btns i{width:13px;height:13px;border-radius:50%;background:#5a5a5a;display:block}
.bar .btns i:last-child{background:#e0553a}
pre{margin:0;padding:14px 18px 18px;color:#e8e8e8;font:14px/1.45 'DejaVu Sans Mono',monospace;white-space:pre}
.u{color:#8ae234;font-weight:bold}.d{color:#729fcf;font-weight:bold}
.c{background:#e8e8e8;color:#e8e8e8}
.hl{background:rgba(252,233,79,.18);display:inline-block;width:100%}
.err{color:#ef6b6b}.ok{color:#8ae234}
`;
const P = `<span class="u">professor@pc3-2nfpb</span>:<span class="d">~</span>$ `;
const CUR = `<span class="c">&nbsp;</span>`;
const term = (title, body, width) => `<!doctype html><html><head><meta charset="utf-8"><style>${termCss}</style></head>
<body><div class="win" style="width:${width}px"><div class="bar">${esc(title)}<span class="btns"><i></i><i></i><i></i></span></div><pre>${body}</pre></div></body></html>`;

const sw = (mode, cmd) => esc(`Switch3560${mode}#`) + esc(cmd);

/* p2-01 consola router */
const p2_01 = term('professor@pc3-2nfpb: ~', [
  P + 'sudo busybox microcom -s 9600 /dev/ttyUSB0',
  '[sudo] password for professor: ',
  '',
  'Router_SO>',
  'Router_SO>' + CUR,
  '', '',
].join('\n'), 760);

/* p2-04 telnet switch */
const p2_04 = term('professor@pc3-2nfpb: ~', [
  P + 'telnet 10.10.10.1',
  'Trying 10.10.10.1...',
  'Connected to 10.10.10.1.',
  "Escape character is '^]'.",
  '', '',
  'User Access Verification',
  '',
  'Password: ',
  'Switch3560>' + CUR,
  '',
].join('\n'), 760);

/* p2-05a crear VLAN */
const vlans = [['110', 'Servidors'], ['120', 'Comercial'], ['130', 'Administracio'], ['199', 'Gestio']];
const p2_05a = term('professor@pc3-2nfpb: ~ (telnet 10.10.10.1)', [
  sw('', 'configure terminal'),
  'Enter configuration commands, one per line.  End with CNTL/Z.',
  ...vlans.flatMap(([n, name]) => [sw('(config)', `vlan ${n}`), sw('(config-vlan)', `name ${name}`), sw('(config-vlan)', 'exit')]),
  sw('(config)', '') + CUR,
].join('\n'), 760);

/* p2-05b IPs VLAN */
const ips = { 110: '10.1.10.1', 120: '10.1.20.1', 130: '10.1.30.1', 199: '10.1.99.1' };
const p2_05b = term('professor@pc3-2nfpb: ~ (telnet 10.10.10.1)', [
  ...Object.entries(ips).flatMap(([n, ip]) => [
    sw('(config)', `interface vlan ${n}`),
    sw('(config-if)', `ip address ${ip} 255.255.255.0`),
    sw('(config-if)', 'no shutdown'),
    sw('(config-if)', 'exit'),
  ]),
  sw('(config)', '') + CUR,
].join('\n'), 760);

/* p2-06 show vlan brief */
const vb = [
  ['10', 'gestio_profes', 'active', 'Gi0/10'], ['20', 'STORAGE_PROXMOX', 'active', 'Gi0/11'],
  ['30', 'VLAN_SERVIDORES'], ['50', 'DMZ'], ['100', 'RI_MGMT'], ['101', 'RI_Cretors'], ['102', 'RI_Scada'],
  ['103', 'RI_SGE'], ['104', 'RI_Iluminacion'], ['105', 'RI_Codificacion'], ['106', 'RI_Depuradora'],
  ['110', 'Servidors'], ['120', 'Comercial'], ['130', 'Administracio'], ['140', 'PRACTIQUES_ASIX2'],
  ...[141, 142, 143, 144, 145, 146, 147, 148, 149].map(n => [String(n), `VLAN0${n}`]),
  ['170', 'Seg_Int_Macrolan'], ['180', 'VLAN0180'], ['199', 'Gestio'],
  ['310', 'SERVIDOR-Sevilla'], ['320', 'RRHH-Sevilla'], ['330', 'DIRECCION-Sevilla'], ['399', 'GESTION-Sevilla'],
  ['410', 'VLAN0410', 'active', 'Gi0/45'], ['900', 'TRANSIT_2921'], ['901', 'TRANSIT_2901'],
  ['1002', 'fddi-default', 'act/unsup'], ['1003', 'token-ring-default', 'act/unsup'],
  ['1004', 'fddinet-default', 'act/unsup'], ['1005', 'trnet-default', 'act/unsup'],
];
const mine = new Set(['110', '120', '130', '199']);
const row = (id, name, st = 'active', ports = '') => (id.padEnd(5) + name.padEnd(33) + st.padEnd(10) + ports).trimEnd();
const defPorts = [
  'Gi0/1, Gi0/3, Gi0/4, Gi0/5, Gi0/6, Gi0/7', 'Gi0/8, Gi0/9, Gi0/12, Gi0/13, Gi0/14',
  'Gi0/15, Gi0/16, Gi0/17, Gi0/18, Gi0/19', 'Gi0/20, Gi0/21, Gi0/22, Gi0/23, Gi0/24',
  'Gi0/25, Gi0/26, Gi0/27, Gi0/28, Gi0/29', 'Gi0/30, Gi0/31, Gi0/32, Gi0/33, Gi0/34',
  'Gi0/35, Gi0/36, Gi0/37, Gi0/38, Gi0/39', 'Gi0/40, Gi0/41, Gi0/42, Gi0/43, Gi0/44',
  'Gi0/46, Gi0/49, Gi0/50, Gi0/51, Gi0/52',
];
const p2_06 = term('professor@pc3-2nfpb: ~ (telnet 10.10.10.1)', [
  sw('', 'show vlan brief'),
  '',
  'VLAN Name                             Status    Ports',
  '---- -------------------------------- --------- -------------------------------',
  row('1', 'default', 'active', defPorts[0]),
  ...defPorts.slice(1).map(p => ' '.repeat(48) + p),
  ...vb.map(r => { const s = esc(row(...r)); return mine.has(r[0]) ? `<span class="hl">${s}</span>` : s; }),
  sw('', '') + CUR,
].join('\n'), 900);

/* p2-07 show ip interface brief */
const ipb = [
  ['Vlan1', 'unassigned', 'NVRAM', 'administratively down', 'down'],
  ['Vlan10', '10.10.10.1', 'NVRAM', 'up', 'up'], ['Vlan20', '10.20.20.1', 'NVRAM', 'up', 'up'],
  ['Vlan30', '10.30.30.1', 'NVRAM', 'up', 'up'],
  ['Vlan110', '10.1.10.1', 'manual', 'up', 'down'], ['Vlan120', '10.1.20.1', 'manual', 'up', 'down'],
  ['Vlan130', '10.1.30.1', 'manual', 'up', 'down'], ['Vlan140', '10.20.140.1', 'NVRAM', 'up', 'up'],
  ['Vlan199', '10.1.99.1', 'manual', 'up', 'down'], ['Vlan310', 'unassigned', 'unset', 'up', 'down'],
  ['Vlan410', '10.4.10.254', 'manual', 'up', 'up'],
  ...Array.from({ length: 12 }, (_, i) => {
    const up = i + 1 === 2 || i + 1 === 10;
    return [`GigabitEthernet0/${i + 1}`, 'unassigned', 'unset', up ? 'up' : 'down', up ? 'up' : 'down'];
  }),
];
const ipRow = (i, ip, m, st, pr) => (i.padEnd(23) + ip.padEnd(16) + 'YES ' + m.padEnd(7) + st.padEnd(22) + pr).trimEnd();
const p2_07 = term('professor@pc3-2nfpb: ~ (telnet 10.10.10.1)', [
  sw('', 'show ip interface brief'),
  'Interface              IP-Address      OK? Method Status                Protocol',
  ...ipb.map(r => { const s = esc(ipRow(...r)); return ['Vlan110', 'Vlan120', 'Vlan130', 'Vlan199'].includes(r[0]) ? `<span class="hl">${s}</span>` : s; }),
  '<span style="color:#888">[...] (salida recortada)</span>',
].join('\n'), 900);

/* p2-08 asignar puertos */
const p2_08 = term('professor@pc3-2nfpb: ~ (telnet 10.10.10.1)', [
  ...[['1', '110'], ['2', '120'], ['3', '130'], ['4', '199']].flatMap(([g, v]) => [
    sw('(config)', `interface GigabitEthernet 0/${g}`),
    sw('(config-if)', 'switchport mode access'),
    sw('(config-if)', `switchport access vlan ${v}`),
    sw('(config-if)', 'no shutdown'),
    sw('(config-if)', 'exit'),
  ]),
  sw('(config)', 'end'),
  sw('', 'write memory'),
  'Building configuration...',
  '<span class="ok">[OK]</span>',
  sw('', '') + CUR,
].join('\n'), 760);

/* ------------------------------------------------------- instalador Proxmox */
const p2_02 = `<!doctype html><html><head><meta charset="utf-8"><style>
body{margin:0;font-family:'DejaVu Sans',sans-serif;background:#fff}
.top{height:70px;background:#000;display:flex;align-items:center;padding:0 28px;color:#fff;font:bold 30px Inter,sans-serif;letter-spacing:3px}
.top b{color:#e57000}
.top span{margin-left:auto;font:300 22px Inter,sans-serif;letter-spacing:0}
.main{padding:30px 60px 20px}
h1{color:#e57000;text-align:center;font-size:34px;margin:6px 0 26px}
p{font-size:16px;margin:0 0 22px}
table{border-collapse:collapse;width:100%;font-size:16px}
th{background:#e57000;color:#fff;text-align:left;padding:8px 12px}
td{padding:6px 12px;border-bottom:1px solid #eee}
td:first-child{width:38%}
.hl td{background:#fff4e8;font-weight:bold}
.chk{margin:26px 0 0;text-align:right;font-size:15px}
.chk i{display:inline-block;width:14px;height:14px;background:#2a7fdb;border-radius:3px;vertical-align:-2px;margin-right:6px;color:#fff;font:bold 11px/14px sans-serif;text-align:center;font-style:normal}
.foot{display:flex;justify-content:space-between;padding:18px 60px 26px;border-top:1px solid #ddd;margin-top:20px}
.btn{padding:8px 22px;border:1px solid #bbb;border-radius:4px;font-size:15px;background:#f5f5f5}
.btn.pri{background:#e57000;color:#fff;border-color:#e57000}
</style></head><body style="width:900px">
<div class="top">PRO<b>X</b>MO<b>X</b><span>Proxmox VE Installer</span></div>
<div class="main">
<h1>Summary</h1>
<p><b>Please confirm</b> the displayed information. Once you press the <b>Install</b> button, the installer will begin to partition your drive(s) and extract the required files.</p>
<table><tr><th>Option</th><th>Value</th></tr>
<tr><td>Filesystem:</td><td>ext4</td></tr>
<tr><td>Disk(s):</td><td>/dev/sda</td></tr>
<tr><td>Country:</td><td>Spain</td></tr>
<tr><td>Timezone:</td><td>Europe/Madrid</td></tr>
<tr><td>Keymap:</td><td>es</td></tr>
<tr><td>Management Interface:</td><td>nic2</td></tr>
<tr class="hl"><td>Hostname:</td><td>sede</td></tr>
<tr class="hl"><td>IP CIDR:</td><td>10.1.10.2/24</td></tr>
<tr><td>Gateway:</td><td>172.16.2.1</td></tr>
<tr><td>DNS:</td><td>8.8.8.8</td></tr>
</table>
<div class="chk"><i>✓</i>Automatically reboot after successful installation</div>
</div>
<div class="foot"><span class="btn">Abort</span><span><span class="btn">Previous</span> <span class="btn pri">Install</span></span></div>
</body></html>`;

/* ------------------------------------------------------------ esquema red */
const p2_03 = `<!doctype html><html><head><meta charset="utf-8"><style>
body{margin:0;background:#fff;font-family:Inter,sans-serif}
</style></head><body style="width:1000px">
<svg width="1000" height="560" viewBox="0 0 1000 560" xmlns="http://www.w3.org/2000/svg" font-family="Inter, sans-serif">
  <rect x="10" y="10" width="980" height="540" rx="14" fill="#fbe3df" stroke="#d9534f" stroke-width="2"/>
  <rect x="740" y="30" width="230" height="90" rx="8" fill="#fff" stroke="#d9534f"/>
  <text x="855" y="60" text-anchor="middle" fill="#c9302c" font-size="20" font-weight="600">Equip 1 · Seu València</text>
  <text x="855" y="96" text-anchor="middle" fill="#c9302c" font-size="24" font-weight="700">10.1.0.0/16</text>

  <g transform="translate(40,60)">
    <rect width="370" height="190" rx="8" fill="#fff" stroke="#d9534f"/>
    <text x="16" y="34" fill="#c9302c" font-size="16" font-weight="700">VLAN</text>
    <text x="80" y="34" fill="#c9302c" font-size="16" font-weight="700">Departament</text>
    <text x="215" y="34" fill="#c9302c" font-size="16" font-weight="700">Xarxa</text>
    <line x1="12" y1="46" x2="358" y2="46" stroke="#f0b8b4"/>
    ${[['110', 'Servidors', '10.1.10.0/24'], ['120', 'Comercial', '10.1.20.0/24'], ['130', 'Administració', '10.1.30.0/24'], ['199', 'Gestió', '10.1.99.0/24']]
      .map((r, i) => `<text x="16" y="${80 + i * 32}" font-size="16" fill="#333">${r[0]}</text><text x="80" y="${80 + i * 32}" font-size="16" fill="#333">${r[1]}</text><text x="215" y="${80 + i * 32}" font-size="16" fill="#333" font-family="DejaVu Sans Mono">${r[2]}</text>`).join('')}
  </g>

  <!-- switch -->
  <g transform="translate(600,250)">
    <rect width="300" height="90" rx="8" fill="#fff" stroke="#555" stroke-width="1.5"/>
    <text x="150" y="26" text-anchor="middle" font-size="14" fill="#333" font-weight="600">Switch Catalyst 3560 · ports 1-10</text>
    ${Array.from({ length: 10 }, (_, i) => `<rect x="${20 + i * 26.5}" y="42" width="22" height="30" rx="2" fill="#eef1f4" stroke="#555"/><text x="${31 + i * 26.5}" y="62" text-anchor="middle" font-size="11" fill="#555">${i + 1}</text>`).join('')}
  </g>

  <!-- links -->
  <g stroke="#7b4fd6" stroke-width="2.5" fill="none">
    <path d="M330 345 L600 318"/>
    <path d="M550 130 L640 250"/>
    <path d="M345 480 L660 340"/>
    <path d="M780 400 L760 340"/>
  </g>

  <!-- servidor -->
  <g transform="translate(200,280)">
    <rect width="130" height="150" rx="6" fill="#fff" stroke="#333" stroke-width="1.5"/>
    <text x="65" y="32" text-anchor="middle" font-size="18" font-weight="700" fill="#222">SRV-VLC</text>
    <text x="65" y="56" text-anchor="middle" font-size="12" fill="#555">Proxmox «sede»</text>
    <text x="65" y="74" text-anchor="middle" font-size="12" fill="#555" font-family="DejaVu Sans Mono">10.1.10.2</text>
    ${[95, 112, 129].map(y => `<rect x="20" y="${y}" width="90" height="10" rx="2" fill="#e6e6e6"/>`).join('')}
  </g>

  ${[[470, 80, 'COMERCIAL 1', false], [265, 450, 'ADMINISTRACIÓ', false], [740, 400, 'COMERCIAL 2', true]].map(([x, y, label, vm]) => `
  <g transform="translate(${x},${y})">
    ${vm
      ? `<rect x="0" y="0" width="80" height="50" rx="4" fill="#173a6b"/><text x="40" y="33" text-anchor="middle" fill="#fff" font-size="18" font-weight="700">VM</text><path d="M-10 54 h100 l-8 8 h-84 z" fill="#173a6b"/>`
      : `<rect x="0" y="0" width="80" height="54" rx="5" fill="#173a6b"/><rect x="6" y="6" width="68" height="40" rx="2" fill="#2c5aa0"/><rect x="34" y="54" width="12" height="10" fill="#173a6b"/><rect x="22" y="64" width="36" height="5" rx="2" fill="#173a6b"/>`}
    <text x="40" y="92" text-anchor="middle" font-size="16" font-weight="600" fill="#222">${label}</text>
  </g>`).join('')}
</svg></body></html>`;

/* --------------------------------------------------------- web de Proxmox */
const pveCss = `
body{margin:0;font:13px 'DejaVu Sans',sans-serif;color:#222;background:#fff}
.browser{background:#ececec;border-bottom:1px solid #ccc;padding:8px 12px;display:flex;gap:10px;align-items:center}
.browser .tab{background:#fff;padding:5px 12px;border-radius:6px 6px 0 0;font-size:12px}
.url{flex:1;background:#fff;border:1px solid #ccc;border-radius:6px;padding:5px 10px;font-size:12px;color:#444}
.url .ns{color:#777;margin-right:8px}
.hdr{height:42px;display:flex;align-items:center;gap:14px;padding:0 12px;border-bottom:1px solid #d0d0d0}
.logo{font:bold 19px Inter,sans-serif;letter-spacing:1px;color:#444}.logo b{color:#e57000}
.logo small{font:400 13px 'DejaVu Sans';letter-spacing:0;color:#666;margin-left:6px}
.search{width:180px;height:20px;border:1px solid #ccc}
.hdr .r{margin-left:auto;display:flex;gap:6px}
.b{border:1px solid #c5c5c5;background:#f6f6f6;padding:4px 10px;border-radius:3px;font-size:12px}
.b.blue{background:#3892d4;border-color:#3892d4;color:#fff}
.wrap{display:flex;height:600px;position:relative}
.side{width:250px;border-right:1px solid #d0d0d0;padding:6px 0}
.side .h{padding:4px 10px;color:#666;border-bottom:1px solid #e5e5e5;margin-bottom:4px}
.tree div{padding:3px 10px;white-space:nowrap}
.tree .sel{background:#c2ddf2}
.content{flex:1;padding:8px 12px;color:#999}
.shade{position:absolute;inset:0;background:rgba(255,255,255,.55)}
.dlg{position:absolute;left:50%;top:44%;transform:translate(-50%,-50%);background:#fff;border:1px solid #b5b8c8;box-shadow:0 4px 18px rgba(0,0,0,.25);border-radius:3px}
.dlg .t{padding:8px 12px;color:#3892d4;font-size:14px;border-bottom:1px solid #e3e3e3;display:flex}
.dlg .t span{margin-left:auto;color:#999}
.tabs{display:flex;gap:2px;padding:8px 10px 0;border-bottom:1px solid #d0d0d0}
.tabs div{padding:5px 10px;color:#333}.tabs .on{background:#3892d4;color:#fff;border-radius:2px 2px 0 0}.tabs .off{color:#aaa}
.body{padding:12px 14px;display:grid;grid-template-columns:1fr 1fr;gap:6px 28px}
.f{display:grid;grid-template-columns:130px 1fr;align-items:center;min-height:26px}
.f label{color:#333}
.in{border:1px solid #c5c5c5;padding:3px 18px 3px 6px;min-height:15px;background:#fff;position:relative;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.in.dd:after{content:'⌄';position:absolute;right:6px;top:-1px;color:#888}
.in.dis,.f.dis label{color:#aaa;border-color:#e2e2e2}
.cb{width:12px;height:12px;border:1px solid #999;display:inline-block;font:bold 11px/12px sans-serif;text-align:center;color:#3892d4}
.ft{display:flex;align-items:center;gap:8px;padding:8px 12px;border-top:1px solid #e3e3e3}
.ft .sp{flex:1}
.sec{grid-column:1/3;color:#333;font-weight:bold;margin-top:4px}
`;
const fld = (l, v, o = {}) => `<div class="f${o.dis ? ' dis' : ''}"><label>${l}</label>${o.cb !== undefined ? `<span class="cb">${o.cb ? '✓' : ''}</span>` : `<div class="in${o.dd ? ' dd' : ''}${o.dis ? ' dis' : ''}">${v}</div>`}</div>`;
const tree = (sel, lang = 'es') => lang === 'en'
  ? `<div class="h">Server View</div><div class="tree"><div>▣ Datacenter</div></div>`
  : `<div class="h">Vista por servidor</div><div class="tree"><div>▣ Centro de datos</div><div style="padding-left:24px"${sel === 'sede' ? ' class="sel"' : ''}>▪ sede</div>
     <div style="padding-left:42px">⋮⋮ localnetwork (sede)</div><div style="padding-left:42px"${sel === 'local' ? ' class="sel"' : ''}>▤ local (sede)</div><div style="padding-left:42px">▤ local-lvm (sede)</div></div>`;
const pve = ({ url, sel, lang, content = '', dialog, width = 1200 }) => `<!doctype html><html><head><meta charset="utf-8"><style>${pveCss}</style></head><body style="width:${width}px">
<div class="browser"><span class="tab">sede - Proxmox Virtual Environment</span><div class="url"><span class="ns">⚠ Not Secure</span>https://${url}</div></div>
<div class="hdr"><span class="logo">PRO<b>X</b>MO<b>X</b><small>Virtual Environment 8.4.0</small></span><span class="search"></span>
<span class="r">${lang === 'en' ? '<span class="b">Documentation</span>' : '<span class="b">Documentación</span><span class="b blue">Crear VM</span><span class="b blue">Crear CT</span><span class="b">root@pam</span>'}</span></div>
<div class="wrap"><div class="side">${tree(sel, lang)}</div><div class="content">${content}</div><div class="shade"></div>${dialog}</div></body></html>`;

const vmTabs = on => `<div class="tabs">${['General', 'SO', 'Sistema', 'Discos', 'CPU', 'Memoria', 'Red', 'Confirmar']
  .map((t, i) => `<div class="${t === on ? 'on' : i > ['General', 'SO', 'Sistema', 'Discos'].indexOf(on) ? 'off' : ''}">${t}</div>`).join('')}</div>`;
const vmFoot = first => `<div class="ft"><span>❔ Ayuda</span><span class="sp"></span><span>Avanzado <span class="cb">✓</span></span>${first ? '' : '<span class="b blue">Atrás</span>'}<span class="b blue">Siguiente</span></div>`;
const vmDlg = (on, body, h = 330) => `<div class="dlg" style="width:${on === 'Discos' ? 900 : 760}px"><div class="t">Crear: Máquina virtual<span>⊗</span></div>${vmTabs(on)}<div style="min-height:${h}px">${body}</div>${vmFoot(on === 'General')}</div>`;
const pveUrl = '10.1.10.2:8006/#v1:0:=node%2Fsede';

const p3_01 = pve({
  url: '10.1.10.2:8006/#v1:0:18:4', lang: 'en',
  dialog: `<div class="dlg" style="width:360px"><div class="t">Proxmox VE Login</div><div style="padding:10px 12px;display:grid;gap:6px">
  ${fld('User name:', 'root')}${fld('Password:', '••••••••')}${fld('Realm:', 'Linux PAM standard authentication', { dd: 1 })}${fld('Language:', 'English - English', { dd: 1 })}
  </div><div class="ft"><span class="sp"></span>Save User name: <span class="cb"></span><span class="b blue">Login</span></div></div>`,
});

const p3_02 = pve({
  url: '10.1.10.2:8006/#v1:0:=storage%2Fsede%2Flocal', sel: 'local',
  content: `<div style="color:#333;margin-bottom:8px">Almacenamiento 'local' en el nodo 'sede'</div>
  <div style="display:flex;gap:16px"><div style="width:150px;line-height:2;color:#555">Resumen<br>Respaldos<br><span style="background:#c2ddf2;display:block">Imágenes ISO</span>Plantillas de CT<br>Permisos</div>
  <div><span class="b">Cargar</span> <span class="b">Descargar desde URL</span> <span class="b" style="color:#aaa">Eliminar</span></div></div>`,
  dialog: `<div class="dlg" style="width:420px"><div class="t">Cargar<span>⊗</span></div><div style="padding:10px 12px;display:grid;gap:6px">
  ${fld('Archivo:', 'C:\\fakepath\\ubuntu-25.04-desktop-amd64.iso', { dis: 1 })}${fld('Nombre del archivo:', 'ubuntu-25.04-desktop-amd64.iso', { dis: 1 })}
  ${fld('Tamaño del archivo:', '<b>5.85 GiB</b>')}${fld('Tipo MIME:', 'application/vnd.efi.iso')}
  ${fld('Algoritmo de hash:', 'None', { dis: 1, dd: 1 })}${fld('Suma de control:', 'Ninguno', { dis: 1 })}
  <div style="background:#fff8d6;padding:6px 8px;border:1px solid #f0e0a0">Las subidas se almacenarán temporalmente en '/var/tmp/', asegúrate de que hay suficiente espacio libre.</div>
  <div style="border:1px solid #c5c5c5;height:20px;position:relative"><div style="width:18.67%;height:100%;background:#3892d4"></div><span style="position:absolute;inset:0;text-align:center;line-height:20px">18.67% (1.09 GiB)</span></div>
  </div><div class="ft"><span class="sp"></span><span class="b blue">Abortar</span><span class="b" style="color:#aaa">Cargar</span></div></div>`,
});

const p3_03 = pve({
  url: pveUrl, sel: 'sede',
  dialog: vmDlg('General', `<div class="body">${fld('Nodo:', 'sede', { dd: 1 })}${fld('Conjunto de recursos:', '', { dd: 1 })}${fld('VM ID:', '100')}<div></div>${fld('Nombre:', 'Ubuntu-Cliente')}</div>`),
});

const p3_04 = pve({
  url: pveUrl, sel: 'sede',
  dialog: vmDlg('SO', `<div class="body">
  <div><div style="margin-bottom:6px">◉ Usar imagen de disco (ISO) de CD/DVD</div>
  <div style="padding-left:22px">${fld('Almacenamiento:', 'local', { dd: 1 })}${fld('Imagen ISO:', 'ubuntu-25.04-desktop-amd64.iso', { dd: 1 })}</div>
  <div style="margin-top:8px">○ Usar lector físico de CD/DVD</div><div style="margin-top:6px">○ No usar ningún medio</div></div>
  <div><div style="margin-bottom:6px">Sistema operativo del Guest:</div>${fld('Tipo:', 'Linux', { dd: 1 })}${fld('Versión:', '6.x - 2.6 Kernel', { dd: 1 })}</div>
  </div>`),
});

const p3_05 = pve({
  url: pveUrl, sel: 'sede',
  dialog: vmDlg('Sistema', `<div class="body">
  ${fld('Tarjeta gráfica:', 'Por defecto', { dd: 1 })}${fld('Controlador SCSI:', 'VirtIO SCSI single', { dd: 1 })}
  ${fld('Máquina:', 'Por defecto (i440fx)', { dd: 1 })}${fld('Qemu Agent:', '', { cb: false })}
  <div class="sec">Firmware</div>
  ${fld('BIOS:', 'OVMF (UEFI)', { dd: 1 })}${fld('Agregar TPM:', '', { cb: false })}
  ${fld('Agregar disco EFI:', '', { cb: true })}<div></div>
  ${fld('Almacenamiento EFI:', 'local-lvm', { dd: 1 })}<div></div>
  ${fld('Formato:', 'Imagen de disco en bruto (raw)', { dis: 1, dd: 1 })}<div></div>
  ${fld('Preinscribir las llaves:', '', { cb: true })}
  </div>`),
});

const p3_06 = pve({
  url: pveUrl, sel: 'sede',
  dialog: vmDlg('Discos', `<div style="display:flex;min-height:330px">
  <div style="width:110px;border-right:1px solid #e3e3e3;padding:8px"><div style="background:#c2ddf2;padding:4px 6px">scsi0</div></div>
  <div style="flex:1"><div class="tabs" style="border:0"><div class="on">Disco</div><div>Ancho de banda</div></div>
  <div class="body" style="grid-template-columns:1.1fr 1fr">
  ${fld('Bus/Dispositivo:', 'SCSI &nbsp;&nbsp;│ 0', { dd: 1 })}${fld('Caché:', 'Por defecto (No hay caché)', { dd: 1 })}
  ${fld('Controlador SCSI:', 'VirtIO SCSI single', {})}${fld('Descartar:', '', { cb: false })}
  ${fld('Almacenamiento:', 'local-lvm', { dd: 1 })}${fld('IO thread:', '', { cb: true })}
  ${fld('Tamaño de disco (GiB):', '<b>32</b>')}<div></div>
  ${fld('Formato:', 'Imagen de disco en bruto (raw)', { dis: 1, dd: 1 })}<div></div>
  <div class="sec" style="border-top:1px solid #ccc;font-weight:normal;padding-top:6px"></div>
  ${fld('Emulación de SSD:', '', { cb: false })}${fld('Respaldo:', '', { cb: true })}
  ${fld('Sólo lectura:', '', { cb: false })}${fld('Saltar replicación:', '', { cb: false })}
  <div></div>${fld('IO asíncrono:', 'Por defecto (io_uring)', { dd: 1 })}
  </div></div></div>`, 0),
});

const pages = {
  'p2-01-consola-router': p2_01, 'p2-02-resumen-proxmox': p2_02, 'p2-03-esquema-vlan': p2_03,
  'p2-04-telnet-switch': p2_04, 'p2-05a-crear-vlan': p2_05a, 'p2-05b-ip-vlan': p2_05b,
  'p2-06-show-vlan-brief': p2_06, 'p2-07-show-ip-interface-brief': p2_07, 'p2-08-asignar-puertos': p2_08,
  'p3-01-login-proxmox': p3_01, 'p3-02-subir-iso': p3_02, 'p3-03-crear-mv': p3_03,
  'p3-04-seleccion-iso': p3_04, 'p3-05-sistema': p3_05, 'p3-06-disco': p3_06,
};

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 2, viewport: { width: 1300, height: 1800 } });
  for (const [name, html] of Object.entries(pages)) {
    await page.setContent(html, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const win = await page.$('.win');
    if (win) {
      const b = await win.boundingBox();
      await page.screenshot({ path: path.join(OUT, `${name}.png`), omitBackground: true,
        clip: { x: b.x - 20, y: b.y - 14, width: b.width + 40, height: b.height + 40 } });
    } else {
      await (await page.$('body')).screenshot({ path: path.join(OUT, `${name}.png`) });
    }
    console.log('ok', name);
  }
  await browser.close();
})();
