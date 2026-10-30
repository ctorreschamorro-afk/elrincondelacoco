# Supermercado Online Curicó - Enterprise Architecture

Sistema completo de E-commerce Multi-servicio optimizado para alta concurrencia, ventas por volumen/peso, integración con Transbank Webpay Plus y cobertura de despacho exclusiva en Curicó.

## Requisitos Previos

- Docker Server 20.10+
- Docker Compose v2+
- Dominio configurado en Cloudflare (para Cloudflare Tunnel)

## Despliegue Rápido (Producción)

1. Clonar el repositorio y configurar variables de entorno:
   ```bash
   cp .env.example .env