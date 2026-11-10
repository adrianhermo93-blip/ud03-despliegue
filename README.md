# UD03 - Despliegue con contenedores y pipeline

Aplicación Node 20 (Express) que cuenta visitas en PostgreSQL. Se levanta con Docker Compose y se publica con Apache como proxy inverso en http://adrian.local.

## Despliegue

    git clone https://github.com/adrianhermo93-blip/ud03-despliegue.git
    cd ud03-despliegue
    docker compose up -d --build
    cp adrian.local.conf /etc/apache2/sites-available/
    a2enmod proxy proxy_http
    a2ensite adrian.local.conf
    systemctl reload apache2
    sed -i '1i 127.0.0.1 adrian.local' /etc/hosts
    curl -I http://adrian.local/

## Pipeline

GitHub Actions (.github/workflows/ci.yml): descargar código, instalar dependencias, tests y construir la imagen. Si los tests fallan, la imagen no se construye.
