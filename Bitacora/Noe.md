# 📔 Diario de trabajo · Noé Guerola Mas

| | |
|---|---|
| **Rol** | Cap de projecte |
| **Substitut** | Alex Martínez Hervás |
| **Bitácora del grupo** | [Setmanal.md](./Setmanal.md) |

## Índice

- [Semana del 12 al 16 de octubre · Organización en subgrupos](#semana-del-12-al-16-de-octubre)
- [Semana del 19 al 23 de octubre · Reparto de tareas y reinstalación de Proxmox](#semana-del-19-al-23-de-octubre)
- [Semana del 2 al 6 de noviembre · Máquinas virtuales](#semana-del-2-al-6-de-noviembre)
- [Resumen de responsabilidades](#resumen-de-responsabilidades)

---

## Semana del 12 al 16 de octubre

> **Organización del equipo en dos subgrupos** · Trabajo del grupo: [Práctica 2](./Setmanal.md#semana-12-18-de-octubre)

### Qué he hecho

Al asumir el cargo de responsable del grupo, he dividido el equipo en **dos subgrupos** con funciones diferenciadas:

| Subgrupo | Función |
|---|---|
| 🔍 **Investigación** | Investigar los pasos futuros y documentar los procedimientos necesarios para consultarlos y aplicarlos cuando haga falta. |
| 🛠️ **Instalación** | Instalar y configurar los elementos necesarios para llevar a cabo la práctica. |

### Por qué

- **Planificar mejor** el trabajo y anticiparnos a posibles problemas.
- **Trabajar en paralelo**: la investigación y la instalación avanzan de forma simultánea, optimizando el tiempo disponible.
- **Aprender de todo**: los subgrupos **rotan cada semana**, de modo que todos los integrantes participan en ambas áreas y adquieren conocimientos y habilidades diferentes.

---

## Semana del 19 al 23 de octubre

> **Reparto de tareas y reinstalación de Proxmox** · Trabajo del grupo: [MV Ubuntu en Proxmox](./Setmanal.md#semana-19-25-de-octubre)

### Qué he hecho

- **Supervisión del equipo:** he seguido el trabajo de cada integrante para repartir las tareas de forma equitativa, teniendo en cuenta las capacidades, los conocimientos y las cualidades de cada persona.
- **Reinstalación del servidor Proxmox:** necesaria para continuar con la configuración del entorno de trabajo.

### Resultado

- Un reparto de tareas que mejora la organización, favorece la colaboración y permite que cada miembro contribuya de forma eficaz.
- Un servidor Proxmox limpio que sirve de base para las siguientes instalaciones y configuraciones.

---

## Semana del 2 al 6 de noviembre

> **Instalación de las máquinas virtuales**

### Qué he hecho

- **Coordinación:** he dirigido las operaciones del equipo para recopilar información sobre el estado del trabajo.
- **Instalación de tres máquinas virtuales** en Proxmox:

| Máquina virtual | Función | Estado |
|---|---|---|
| Ubuntu Server | Servidor Linux | 🟡 Configuración en curso |
| Linux Mint | Cliente Linux | 🟡 Configuración en curso |
| Windows Server 2025 | Servidor Windows | 🟠 Con incidencias |

### Problemas encontrados

| Problema | Detalle | Estado |
|---|---|---|
| Controlador de discos | Durante la instalación de Windows Server 2025 el instalador no detectaba los discos. | En revisión |
| Formateo de discos | Dificultades para formatear los discos mediante directivas de Windows. | En revisión |

### Pendiente

- [ ] Terminar la configuración de Ubuntu Server.
- [ ] Terminar la configuración de Linux Mint.
- [ ] Resolver las incidencias de discos y terminar la configuración de Windows Server 2025.

---

## Resumen de responsabilidades

Como cap de projecte, mis tareas principales durante el proyecto han sido:

1. **Organizar** el equipo (subgrupos de investigación e instalación con rotación semanal).
2. **Repartir** las tareas de forma equitativa según el perfil de cada integrante.
3. **Supervisar y coordinar** el trabajo del grupo.
4. **Participar en la parte técnica**: reinstalación de Proxmox e instalación de las máquinas virtuales.
