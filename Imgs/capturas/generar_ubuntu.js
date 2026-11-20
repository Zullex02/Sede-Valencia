// Genera las capturas recreadas de la instalación de Ubuntu Server (consola de Proxmox).
// Uso: node generar_ubuntu.js <directorio_salida>
// Cambia los valores de CONFIG si no coinciden con vuestra instalación y vuelve a generar.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const CONFIG = {
  version: '24.04 LTS',
  kernel: '6.8.0-31-generic',
  vm: 'Ubuntu-Server',
  nombre: 'Administrador',
  host: 'srv-ubuntu',
  usuario: 'admin',
  iface: 'ens18',
  subred: '10.1.10.0/24',
  ip: '10.1.10.3',
  gw: '10.1.10.1',
  dns: '8.8.8.8',
  disco: '32.000G',
};
const C = CONFIG;

const OUT = process.argv[2];
fs.mkdirSync(OUT, { recursive: true });

const W = 80; // columnas
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const pad = (s, n) => s + ' '.repeat(Math.max(0, n - s.length));
const center = s => ' '.repeat(Math.max(0, Math.floor((W - s.length) / 2))) + s;

// marcas: {{sel:texto}} -> resaltado naranja, {{hdr:texto}} -> cabecera, {{dim:texto}} -> gris
const mark = line => esc(line)
  .replace(/\{\{sel:(.*?)\}\}/g, '<span class="sel">$1</span>')
  .replace(/\{\{dim:(.*?)\}\}/g, '<span class="dim">$1</span>')
  .replace(/\{\{ok:(.*?)\}\}/g, '<span class="ok">$1</span>')
  .replace(/\{\{b:(.*?)\}\}/g, '<b>$1</b>');

const css = `
body{margin:0;padding:30px;background:transparent;font-family:Inter,sans-serif}
.win{display:inline-block;border-radius:10px;overflow:hidden;box-shadow:0 0 0 1px #111,0 12px 30px rgba(0,0,0,.35);background:#000}
.bar{height:34px;background:#3a3a3a;color:#ddd;font-size:13px;display:flex;align-items:center;justify-content:center;position:relative;border-bottom:1px solid #222}
.bar .btns{position:absolute;right:12px;display:flex;gap:8px}
.bar .btns i{width:13px;height:13px;border-radius:50%;background:#5a5a5a;display:block}
.bar .btns i:last-child{background:#e0553a}
pre{margin:0;color:#e6e6e6;font:15px/1.5 'DejaVu Sans Mono',monospace;white-space:pre;background:#000}
.hdr{display:block;background:#e95420;color:#fff;font-weight:bold}
.body{padding:0 0 10px}
.sel{background:#e95420;color:#fff}
.dim{color:#8a8a8a}
.ok{color:#8ae234}
.u{color:#8ae234;font-weight:bold}.d{color:#729fcf;font-weight:bold}
.c{background:#e6e6e6}
`;
const page = (body) => `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>
<div class="win"><div class="bar">${esc(`${C.vm} - Consola (noVNC) · Proxmox VE`)}<span class="btns"><i></i><i></i><i></i></span></div>${body}</div></body></html>`;

// Pantalla del instalador (subiquity): cabecera naranja + 24 líneas + botones
const installer = (title, lines, buttons = ['Hecho', 'Atrás'], help = true) => {
  const head = pad(center(title), W - 11) + (help ? '[ Ayuda ] ' : '').padStart(11);
  const rows = lines.slice();
  while (rows.length < 20) rows.push('');
  const btnLines = buttons.map((b, i) => {
    const t = `[ ${pad(b, Math.max(14, ...buttons.map(x => x.length)))} ]`;
    const sp = ' '.repeat(Math.floor((W - t.length) / 2));
    return sp + (i === 0 ? `{{sel:${t}}}` : t);
  });
  return page(`<pre><span class="hdr">${esc(pad(head, W))}</span><div class="body">${['', ...rows, '', ...btnLines, ''].map(l => mark(pad(l, W))).join('\n')}</div></pre>`);
};

const ind = (n, s) => ' '.repeat(n) + s;

const screens = {};

screens['p4-ubuntu-01-idioma'] = installer('Willkommen! Bienvenue! Welcome! Добро пожаловать! Welkom!', [
  ind(2, 'Use UP, DOWN and ENTER keys to select your language.'),
  '',
  ...['Asturianu', 'Bahasa Indonesia', 'Català', 'Deutsch', 'English', 'English (UK)']
    .map(l => ind(24, `[ ${pad(l, 26)} ▸ ]`)),
  ind(24, `{{sel:[ ${pad('Español', 26)} ▸ ]}}`),
  ...['Français', 'Galego', 'Hrvatski', 'Latviešu', 'Lietuviškai', 'Magyar', 'Nederlands']
    .map(l => ind(24, `[ ${pad(l, 26)} ▸ ]`)),
], [], true);

screens['p4-ubuntu-02-teclado'] = installer('Configuración del teclado', [
  ind(2, 'Seleccione la distribución del teclado conectado al sistema, si es'),
  ind(2, 'posible. Seleccione «Identificar teclado» para detectarla.'),
  '',
  '',
  ind(14, `Distribución:  [ ${pad('Spanish', 30)} ▾ ]`),
  '',
  ind(14, `     Variante:  [ ${pad('Spanish', 30)} ▾ ]`),
  '',
  '',
  ind(30, '[ Identificar teclado ]'),
]);

screens['p4-ubuntu-03-tipo-instalacion'] = installer('Elija el tipo de instalación', [
  ind(2, 'Elija la base para la instalación.'),
  '',
  ind(4, '{{sel:(X)}} Ubuntu Server'),
  ind(8, '{{dim:La versión predeterminada tiene un conjunto seleccionado de paquetes}}'),
  ind(8, '{{dim:que proporcionan una experiencia cómoda para operar su servidor.}}'),
  '',
  ind(4, '( ) Ubuntu Server (minimized)'),
  ind(8, '{{dim:Versión adaptada para un tamaño en ejecución mínimo, pensada para}}'),
  ind(8, '{{dim:entornos donde no se espera que un humano inicie sesión.}}'),
  '',
  ind(2, 'Opciones adicionales:'),
  '',
  ind(4, '[ ] Buscar controladores de terceros'),
]);

screens['p4-ubuntu-04-red-ipv4'] = installer('Conexiones de red', [
  ind(6, (t => '┌' + '─'.repeat(Math.floor((66 - t.length) / 2)) + t + '─'.repeat(Math.ceil((66 - t.length) / 2)) + '┐')(` Editar la configuración IPv4 de ${C.iface} `)),
  ind(6, '│' + ' '.repeat(66) + '│'),
  ind(6, '│' + pad(`   Método IPv4:            [ ${pad('Manual', 14)} ▾ ]`, 66) + '│'),
  ind(6, '│' + ' '.repeat(66) + '│'),
  ind(6, '│' + pad(`   Subred:                 ${C.subred}`, 66) + '│'),
  ind(6, '│' + pad(`   Dirección:              ${C.ip}`, 66) + '│'),
  ind(6, '│' + pad(`   Puerta de enlace:       ${C.gw}`, 66) + '│'),
  ind(6, '│' + pad(`   Servidores de nombres:  ${C.dns}`, 66) + '│'),
  ind(6, '│' + pad('   {{dim:Direcciones IP, separadas por comas}}', 66 + 8) + '│'),
  ind(6, '│' + pad('   Dominios de búsqueda:', 66) + '│'),
  ind(6, '│' + ' '.repeat(66) + '│'),
  ind(6, '│' + pad('                {{sel:[ Guardar    ]}}      [ Cancelar   ]', 66 + 8) + '│'),
  ind(6, '│' + ' '.repeat(66) + '│'),
  ind(6, '└' + '─'.repeat(66) + '┘'),
], [], true);

screens['p4-ubuntu-05-red'] = installer('Conexiones de red', [
  ind(2, 'Configure al menos una interfaz que este servidor pueda usar para'),
  ind(2, 'comunicarse con otras máquinas, y que preferiblemente proporcione'),
  ind(2, 'acceso a las actualizaciones.'),
  '',
  ind(4, '  NOMBRE   TIPO  NOTAS'),
  ind(4, `{{sel:[ ${pad(C.iface, 8)} eth   -${' '.repeat(42)} ▸ ]}}`),
  ind(4, `    static  ${C.ip}/24`),
  ind(4, '    {{dim:Red Hat, Inc. Virtio network device}}'),
  '',
  ind(4, '[ Crear bond ▸ ]'),
]);

screens['p4-ubuntu-06-almacenamiento'] = installer('Configuración de almacenamiento guiada', [
  ind(2, 'Configure un diseño de almacenamiento guiado o cree uno personalizado:'),
  '',
  ind(2, '{{sel:(X)}} Usar un disco entero'),
  '',
  ind(10, `[ /dev/sda  local disk  ${C.disco}${' '.repeat(18)} ▾ ]`),
  '',
  ind(10, '[X] Configurar este disco como un grupo LVM'),
  '',
  ind(14, '[ ] Cifrar el grupo LVM con LUKS'),
  '',
  ind(2, '( ) Diseño de almacenamiento personalizado'),
]);

screens['p4-ubuntu-07-resumen-discos'] = installer('Configuración de almacenamiento', [
  ind(2, 'RESUMEN DEL SISTEMA DE ARCHIVOS'),
  '',
  ind(4, '  PUNTO DE MONTAJE   TAMAÑO    TIPO        TIPO DE DISPOSITIVO'),
  ind(4, '{{sel:[ /                  14.498G   new ext4    new LVM logical volume      ▸ ]}}'),
  ind(4, '[ /boot              2.000G    new ext4    new partition of local disk ▸ ]'),
  ind(4, '[ /boot/efi          1.000G    new fat32   new partition of local disk ▸ ]'),
  '',
  ind(2, 'DISPOSITIVOS DISPONIBLES'),
  '',
  ind(4, '  DISPOSITIVO                    TIPO               TAMAÑO'),
  ind(4, '[ ubuntu-vg (new)                LVM volume group   28.997G ▸ ]'),
  ind(4, '  libre                                             14.499G'),
  '',
  ind(2, 'DISPOSITIVOS USADOS'),
  '',
  ind(4, `[ /dev/sda                       local disk         ${C.disco} ▸ ]`),
]);

screens['p4-ubuntu-08-perfil'] = installer('Configuración del perfil', [
  ind(2, 'Introduzca el nombre de usuario y la contraseña que usará para iniciar'),
  ind(2, 'sesión en el sistema.'),
  '',
  ...[['Su nombre:', C.nombre], ['Nombre de su servidor:', C.host], ['', '{{dim:Nombre para comunicarse con otros equipos.}}'],
      ['Elija un nombre de usuario:', C.usuario], ['Elija una contraseña:', '********'], ['Confirme su contraseña:', '********']]
    .flatMap(([l, v]) => l ? ['', `${l.padStart(30)}  ${v}`] : [`${''.padStart(30)}  ${v}`]),
]);

screens['p4-ubuntu-09-ssh'] = installer('Configuración de SSH', [
  ind(2, 'Puede elegir instalar el paquete del servidor OpenSSH para permitir el'),
  ind(2, 'acceso remoto seguro a su servidor.'),
  '',
  ind(10, '{{sel:[X]}}  Instalar servidor OpenSSH'),
  '',
  ind(10, '[X]  Permitir autenticación por contraseña sobre SSH'),
  '',
  ind(10, `Importar identidad SSH:  [ ${pad('No', 14)} ▾ ]`),
  ind(10, '{{dim:Puede importar sus claves SSH desde GitHub o Launchpad.}}'),
]);

screens['p4-ubuntu-10-instalacion-completa'] = installer('¡Instalación completa!', [
  '  ┌' + '─'.repeat(74) + '┐',
  ...[
    'configuring apt',
    'installing system',
    'final system configuration',
    '  configuring locale',
    '  configuring keyboard',
    '  configuring network',
    '  installing openssh-server',
    '  configuring cloud-init',
    '  restoring apt configuration',
    'downloading and installing security updates',
    'copying logs to installation target',
    'subiquity/Late/run',
  ].map(l => '  │ ' + pad(l, 64) + '{{ok:  done}}' + '   │'),
  '  └' + '─'.repeat(74) + '┘',
], ['Reiniciar ahora', 'Ver el registro completo'], true);

// Primer arranque: consola de texto
const P = `<span class="u">${C.usuario}@${C.host}</span>:<span class="d">~</span>$ `;
const term = lines => page(`<pre style="padding:12px 16px 16px">${lines.join('\n')}</pre>`);
screens['p4-ubuntu-11-primer-inicio'] = term([
  esc(`Ubuntu ${C.version} ${C.host} tty1`),
  '',
  esc(`${C.host} login: ${C.usuario}`),
  'Password:',
  esc(`Welcome to Ubuntu ${C.version} (GNU/Linux ${C.kernel} x86_64)`),
  '',
  ' * Documentation:  https://help.ubuntu.com',
  ' * Management:     https://landscape.canonical.com',
  ' * Support:        https://ubuntu.com/pro',
  '',
  P + 'hostnamectl hostname',
  esc(C.host),
  P + 'ip -br address',
  'lo               UNKNOWN        127.0.0.1/8 ::1/128',
  esc(`${pad(C.iface, 16)} UP             ${C.ip}/24`),
  P + 'lsblk',
  'NAME                      MAJ:MIN RM  SIZE RO TYPE MOUNTPOINTS',
  'sda                         8:0    0   32G  0 disk',
  '├─sda1                      8:1    0    1G  0 part /boot/efi',
  '├─sda2                      8:2    0    2G  0 part /boot',
  '└─sda3                      8:3    0   29G  0 part',
  '  └─ubuntu--vg-ubuntu--lv 252:0    0 14.5G  0 lvm  /',
  P + '<span class="c">&nbsp;</span>',
]);

(async () => {
  const browser = await chromium.launch();
  const pg = await browser.newPage({ deviceScaleFactor: 2, viewport: { width: 1100, height: 1000 } });
  for (const [name, html] of Object.entries(screens)) {
    await pg.setContent(html, { waitUntil: 'load' });
    await pg.evaluate(() => document.fonts.ready);
    const b = await (await pg.$('.win')).boundingBox();
    await pg.screenshot({ path: path.join(OUT, `${name}.png`), omitBackground: true,
      clip: { x: b.x - 20, y: b.y - 14, width: b.width + 40, height: b.height + 40 } });
    console.log('ok', name);
  }
  await browser.close();
})();
