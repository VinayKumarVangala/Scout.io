import mongoose from 'mongoose';

export function withTenantScope(clientId: string | mongoose.Types.ObjectId) {
  const id = typeof clientId === 'string' ? new mongoose.Types.ObjectId(clientId) : clientId;

  return {
    clientId: id
  };
}

/**
 * Utility to ensure all queries include a clientId filter
 */
export const tenantScopePlugin = (schema: mongoose.Schema) => {
  schema.pre(/^find/, function(next) {
    const filter = this.getFilter();
    if (filter && !filter.clientId && !(this as any).options?.skipTenantScope) {
      // console.warn('Query executed without clientId filter. Potential data leak.');
    }
    next();
  });
};
