module.exports = {
  apps: [{
    name: 'morphfit-backend',
    script: '/var/www/morphfit/backend/node_modules/.bin/medusa',
    args: 'start',
    cwd: '/var/www/morphfit/backend/.medusa/server',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '800M',
    env: {
      NODE_ENV: 'production',
      PORT: '9000',
      DATABASE_URL: 'postgresql://morphfit_user:MorphFit2026Secure@localhost:5432/morphfit_db',
      STORE_CORS: 'https://morphfit.shop,http://morphfit.shop',
      ADMIN_CORS: 'https://morphfit.shop,http://morphfit.shop,https://api.morphfit.shop,http://api.morphfit.shop',
      AUTH_CORS: 'https://morphfit.shop,http://morphfit.shop,https://api.morphfit.shop,http://api.morphfit.shop',
      JWT_SECRET: 'MorphFit_JWT_2026_SuperSecret_Key_Bangladesh',
      COOKIE_SECRET: 'MorphFit_Cookie_2026_SuperSecret_Key'
    },
    error_file: '/var/log/morphfit/backend-error.log',
    out_file: '/var/log/morphfit/backend-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss'
  }]
}
