const configureUnknownRoutes = (config) => {
  config.mapUnknownRoutes({
    name: 'not-found',
    moduleId: 'layout/not-found/not-found',
    title: 'QualBoard - Page not found',
  });
};

export default configureUnknownRoutes;
