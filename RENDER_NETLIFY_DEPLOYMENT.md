# Guía de Despliegue en Render y Netlify

## 📋 Resumen del Error

El frontend en Netlify intenta conectarse a `https://voluntariado-e7o4.onrender.com/eventos` pero recibe un **404**. Esto usualmente significa:

1. **El backend no está sirviendo la ruta correctamente** - Problemas de CORS o rutas relativas en producción
2. **Variables de entorno no configuradas** - El backend necesita valores específicos
3. **El puerto no está expuesto** - Render tiene restricciones especiales

## 🔧 Solución

### PASO 1: Configura Variables de Entorno en Render

En tu panel de Render:

1. Ve a tu **servicio del backend** (`voluntariado-e7o4.onrender.com`)
2. Ve a **Settings** → **Environment**
3. Agrega estas variables de entorno:

```
PORT=8080
DB_USERNAME=jsobero
DB_PASSWORD=8N@2mQK@8wBb.Wu
APP_BASE_URL=https://voluntariado-e7o4.onrender.com
CORS_ORIGINS=http://localhost:4200,https://majestic-creponne-8619c7.netlify.app
```

### PASO 2: Verifica la conexión a la base de datos

Asegúrate de que las credenciales de la base de datos en `application.properties` coincidan:

```properties
spring.datasource.url=jdbc:mysql://mysql-jsobero.alwaysdata.net:3306/jsobero_voluntariado?useSSL=false&serverTimezone=UTC
spring.datasource.username=jsobero
spring.datasource.password=8N@2mQK@8wBb.Wu
```

### PASO 3: Deployment en Render

Asegúrate de que Render está usando el build correcto:

1. **En Render Dashboard:**
   - Servicio: `voluntariado-backend`
   - Build command: `./mvnw clean package -DskipTests`
   - Start command: `java -jar target/voluntariado-0.0.1-SNAPSHOT.jar`
   - Plan: Al menos "Starter" para que no se duerma

2. **O si usas un `render.yaml`:**

```yaml
services:
  - type: web
    name: voluntariado-backend
    env: java
    buildCommand: ./mvnw clean package -DskipTests
    startCommand: java -jar target/voluntariado-0.0.1-SNAPSHOT.jar
    envVars:
      - key: PORT
        value: "8080"
      - key: APP_BASE_URL
        value: "https://voluntariado-e7o4.onrender.com"
      - key: CORS_ORIGINS
        value: "http://localhost:4200,https://majestic-creponne-8619c7.netlify.app"
```

### PASO 4: Test de Endpoints

Una vez deployado, verifica que los endpoints funcionan:

```bash
# Desde tu navegador o terminal
curl -H "Origin: https://majestic-creponne-8619c7.netlify.app" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS \
  https://voluntariado-e7o4.onrender.com/eventos

# Debería retornar 200 OK con headers CORS
```

O directamente:
```bash
curl https://voluntariado-e7o4.onrender.com/eventos
```

### PASO 5: Frontend - Verifica la configuración

Tu `environment.ts` ya está bien:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://voluntariado-e7o4.onrender.com'
};
```

Si aún tienes problemas, agrega logs:

```typescript
// En cualquier componente
cargarEventos(): void {
  const url = `${environment.apiUrl}/eventos`;
  console.log('📡 Intentando conectar a:', url);
  
  this.http.get<Evento[]>(url).subscribe({
    next: (eventos) => {
      console.log('✅ Eventos recibidos:', eventos);
    },
    error: (err) => {
      console.error('❌ Error:', err);
      console.error('Status:', err.status);
      console.error('URL completa:', err.url);
    }
  });
}
```

## 🚀 Solución Rápida: Redeploy

Si ya hiciste los cambios anteriores, simplemente:

1. En Render, ve a tu servicio backend
2. Haz clic en **"Manual Deploy"** → **"Deploy Latest Commit"**
3. Espera a que se complete (5-10 minutos)
4. Recarga el frontend en Netlify

## ❓ Si Sigue Sin Funcionar

### Verifica los logs de Render:

En el panel de Render:
- Servicio → **Logs**
- Busca errores como "404", "CORS", "Connection refused"

### Posibles causas:

1. **CORS bloqueado:**
   - Verifica que `CORS_ORIGINS` incluya exactamente tu URL de Netlify
   - No agregar `http://` o `https://` incorrectamente

2. **Base de datos inaccesible:**
   - Verifica credenciales en `application.properties`
   - Comprueba que `mysql-jsobero.alwaysdata.net` está accesible desde Render

3. **Rutas relativas de imágenes:**
   - Si el 404 es para `/uploads/...`, es un problema diferente
   - Las imágenes necesitan `APP_BASE_URL` configurado correctamente

## 📸 Para las Imágenes

Las imágenes tampoco se mostrarán hasta que configure esto:

```properties
# application.properties
app.base-url=https://voluntariado-e7o4.onrender.com
```

Y en Render, la carpeta `uploads/` debe estar en:
- `/mnt/data/uploads/` (si usas persistent disk)
- O almacenada en otra ubicación y mapeada en Render

Para archivos persistentes en Render, considera usar:
- **Render Disk** (Almacenamiento persistente)
- **AWS S3** (Recomendado para producción)
- **Firebase Storage**

## ✅ Checklist Final

- [ ] Variables de entorno en Render configuradas
- [ ] Base de datos accesible desde Render
- [ ] `CORS_ORIGINS` incluye la URL de Netlify exactamente
- [ ] Backend deployado (Manual Deploy)
- [ ] Test de endpoints con `curl` funciona
- [ ] Frontend refresca después de cambios del backend
- [ ] Imágenes muestran la URL correcta en el navegador
