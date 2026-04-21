# 🚀 Guía: Publicar en GitHub Pages

## Paso 1: Crear repositorio en GitHub

1. Ve a [github.com](https://github.com) y crea un nuevo repositorio:
   - Nombre: `glove-explicativo`
   - Descripción: "Sitio web educativo sobre el algoritmo GloVe de Stanford"
   - Public (para que sea visible)
   - **NO inicialices con README** (ya lo tienes)

2. Copia el URL del repositorio. Verás algo como:
   ```
   https://github.com/tu-usuario/glove-explicativo.git
   ```

## Paso 2: Configurar Git localmente

Abre terminal en la carpeta `D:/Topicos/glove-explicativo` y ejecuta:

```bash
# Inicializar repositorio
git init

# Agregar archivos
git add .

# Crear primer commit
git commit -m "Initial commit: GloVe explicativo con prácticas interactivas"

# Agregar repositorio remoto (reemplaza tu-usuario)
git remote add origin https://github.com/tu-usuario/glove-explicativo.git

# Cambiar rama a main (GitHub Pages requiere esto)
git branch -M main

# Subir a GitHub
git push -u origin main
```

## Paso 3: Habilitar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Haz clic en **Settings** (Configuración)
3. En la barra izquierda, selecciona **Pages**
4. Bajo "Source", selecciona:
   - Branch: **main**
   - Folder: **/ (root)**
5. Haz clic en **Save**

En unos segundos verás un mensaje diciendo que tu sitio está publicado en:
```
https://tu-usuario.github.io/glove-explicativo
```

## Paso 4: Actualizar el Footer (Opcional)

Edita `index.html` y busca la línea del footer (~750), cambia:
```html
<a href="https://github.com/tu-usuario/glove-explicativo" target="_blank">Ver en GitHub</a>
```

Reemplaza `tu-usuario` con tu nombre de usuario de GitHub.

Luego:
```bash
git add index.html
git commit -m "Update GitHub link in footer"
git push
```

## Paso 5: Verificar el sitio

- URL para ver el sitio: `https://tu-usuario.github.io/glove-explicativo`
- URL del repositorio: `https://github.com/tu-usuario/glove-explicativo`

## 📝 Cambios futuros

Para hacer cambios después de publicado:

```bash
# 1. Hacer cambios en archivos
# 2. Confirmar cambios
git add .
git commit -m "Descripción de los cambios"

# 3. Subir a GitHub
git push
```

GitHub Pages actualizará automáticamente en segundos.

## 🧪 Ejecutar pruebas localmente

Antes de hacer push, puedes ejecutar las pruebas para asegurarte de que todo funcione:

```bash
npm test
```

## ⚠️ Importante: Qué NO subir

El archivo `.gitignore` ya está configurado para NO subir:
- `node_modules/` — las dependencias se reinstalan automáticamente
- `.DS_Store` — archivos del sistema
- `coverage/` — reportes de pruebas

Estos archivos ya NO se subirán a GitHub.

## 🎉 ¡Listo!

Tu sitio estará live en GitHub Pages. Puedes compartir el URL con cualquiera y funcionará igual como si estuviera en un servidor.

**Ventajas:**
- ✅ Hosting gratis
- ✅ Dominio personalizado disponible
- ✅ SSL/HTTPS automático
- ✅ Actualizaciones instantáneas
- ✅ Control de versiones con Git

---

¿Preguntas? Revisa el README.md para más información sobre el proyecto.
