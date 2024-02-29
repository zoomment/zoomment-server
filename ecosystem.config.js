module.exports = {
  name: 'ZOOMMENT',
  script: './dist/index.js',
  error_file: './logs/err.log',
  out_file: './logs/out.log',
  max_memory_restart: '4G',
  exec_mode: 'cluster',
  autorestart: true,
  time: true,
  logDateFormat: 'YYYY-MM-DD HH:mm Z',
  watch: false
};
