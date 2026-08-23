#!/bin/sh
set -e

echo "==> Aguardando o banco de dados MySQL iniciar em $DB_HOST:$DB_PORT..."

while ! php -r "try { new PDO('mysql:host=' . getenv('DB_HOST') . ';port=' . getenv('DB_PORT') . ';dbname=' . getenv('DB_DATABASE'), getenv('DB_USERNAME'), getenv('DB_PASSWORD')); exit(0); } catch (Exception \$e) { exit(1); }" 2>/dev/null; do
    echo "MySQL ainda não está disponível. Aguardando 2 segundos..."
    sleep 2
done

echo "==> Conexão com MySQL estabelecida com sucesso!"

# Ensure storage directories and permissions
mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views storage/app/public/members bootstrap/cache
chmod -R 777 storage bootstrap/cache

echo "==> Instalando dependências do Composer..."
composer install --no-interaction --prefer-dist

# Generate APP_KEY if empty
if [ -z "$APP_KEY" ]; then
    echo "==> Gerando APP_KEY..."
    php artisan key:generate --force
fi

# Run migrations
echo "==> Executando migrações..."
php artisan migrate --force

# Run seeders
echo "==> Executando seeders..."
php artisan db:seed --force || echo "Seeders já executados ou erro ignorável."

# Create storage link
echo "==> Criando link do storage..."
php artisan storage:link --force || true

echo "==> Iniciando o servidor Laravel na porta 8000..."
exec php artisan serve --host=0.0.0.0 --port=8000
