module.exports = {
  apps: [{
    name: 'fixedfocused',
    script: '.output/server/index.mjs',
    cwd: '/var/www/new-site',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      NUXT_PUBLIC_SITE_URL: 'https://fixedfocused-designs.ro',
      NUXT_SMTP_HOST: 'smtp.gmail.com',
      NUXT_SMTP_PORT: '587',
      NUXT_SMTP_USER: 'ciprian.radulescu85@gmail.com',
      NUXT_SMTP_PASS: 'qnpn wakt ngor rrdi'
    }
  }]
}
