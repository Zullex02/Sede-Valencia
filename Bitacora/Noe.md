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
- [Práctica 4 · Windows Server 2025 y DHCP](#practica-4)
- [Estado actual del proyecto](#estado-actual)
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
| Ubuntu Server | Servidor Linux | ✅ Instalada y configurada |
| Linux Mint | Cliente Linux | ✅ Instalada y configurada |
| Windows Server 2025 | Servidor Windows | ✅ Instalada y configurada |

### Problemas encontrados

| Problema | Detalle | Estado |
|---|---|---|
| Controlador de discos | Durante la instalación de Windows Server 2025 el instalador no detectaba los discos. | ✅ Solucionado |
| Formateo de discos | Dificultades para formatear los discos mediante directivas de Windows. | ✅ Solucionado |

### Resultado

- [x] Configuración de Ubuntu Server terminada ([ver instalación](./Setmanal.md#instalacion-ubuntu-server)).
- [x] Configuración de Linux Mint terminada.
- [x] Incidencias de discos resueltas y Windows Server 2025 configurado.

---

<a id="practica-4"></a>

## Práctica 4 · Windows Server 2025 y DHCP

> **Despliegue de servicios con Windows Server 2025** · ✅ **Completada** · Trabajo del grupo: [Práctica 4](./Setmanal.md#practica-4)

### Qué he hecho

- **Coordinación:** he organizado al equipo para cubrir las seis tareas de la práctica y he seguido su avance.
- **Cierre de incidencias:** los problemas de discos de Windows Server 2025 de la semana anterior quedaron resueltos, lo que nos permitió completar la instalación y la configuración del servidor.

### Resultado

| Tarea | Estado |
|---|---|
| Planificación de la infraestructura | ✅ |
| Instalación de Windows Server 2025 (UEFI/GPT) | ✅ |
| Configuración del almacenamiento | ✅ |
| Configuración TCP/IP | ✅ |
| Servicio DHCP | ✅ |
| DHCP no autorizado en Ubuntu Server y DHCP Snooping | ✅ |

La práctica 4 se ha realizado **de forma completa**.

---

<a id="estado-actual"></a>

## Estado actual del proyecto

> **20 de noviembre de 2026** · 🟢 **Estado correcto**

- Todas las prácticas hasta la fecha están terminadas y no quedan incidencias abiertas.
- El siguiente objetivo del grupo es **mejorar las VLAN** de la sede. Como cap de projecte, me encargo de repartir y supervisar estas tareas ([líneas de trabajo](./Setmanal.md#estado-actual)).

---

## Resumen de responsabilidades

Como cap de projecte, mis tareas principales durante el proyecto han sido:

1. **Organizar** el equipo (subgrupos de investigación e instalación con rotación semanal).
2. **Repartir** las tareas de forma equitativa según el perfil de cada integrante.
3. **Supervisar y coordinar** el trabajo del grupo.
4. **Participar en la parte técnica**: reinstalación de Proxmox e instalación de las máquinas virtuales.
5. **Hacer seguimiento de las incidencias** hasta resolverlas y mantener actualizado el estado del proyecto.
