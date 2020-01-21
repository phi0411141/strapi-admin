module.exports = {
  administrator: {
    actions: {
      create: 'Admin.create',
      update: 'Admin.update',
    },
  },
  ADMIN: {
    pluginsToHide: ['content-type-builder'],
  },
  MANAGER: {
    pluginsToHide: ['content-type-builder', 'users-permissions'],
  },
  STAFF: {
    pluginsToHide: ['content-type-builder', 'users-permissions'],
  },
};
