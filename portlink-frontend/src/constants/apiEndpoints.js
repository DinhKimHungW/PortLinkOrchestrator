const endpoints = {
  auth: {
    login: '/auth/login',
    me: '/auth/me',
  },
  schedule: {
    active: '/schedule/active',
    list: '/schedule',
    recalc: '/engine/recalculate',
  },
  incidents: '/incidents',
  logs: '/logs',
  logsExport: '/logs/export.csv',
  kpis: '/kpis',
  assets: '/assets',
  visits: '/visits',
  tasks: '/tasks',
};

export default endpoints;
