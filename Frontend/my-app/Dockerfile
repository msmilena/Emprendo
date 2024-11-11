# Usar una imagen base de Node.js
FROM node:14

# Establecer el directorio de trabajo en /app
WORKDIR /app

# Copiar package.json y package-lock.json al directorio de trabajo
COPY package*.json ./

# Instalar las dependencias del proyecto
RUN npm install

# Instalar la dependencia faltante
RUN npm install firebase
RUN npm install --save-dev @babel/plugin-proposal-private-property-in-object

# Copiar el resto de los archivos de la aplicación al directorio de trabajo
COPY . .

# Corregir errores de Prettier y ESLint
RUN npx prettier --write .
RUN npx eslint --fix .

# Construir la aplicación para producción
RUN npm run build

# Instalar un servidor HTTP estático para servir el contenido
RUN npm install -g serve

# Exponer el puerto que usará la aplicación
EXPOSE 5000

# Comando para ejecutar la aplicación
CMD ["serve", "-s", "build", "-l", "5000"]