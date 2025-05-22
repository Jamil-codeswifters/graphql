function requireAuth(context) {
  if (!context.user || !context.user.userId) {
    throw new Error('Authentication required');
  }
  return context.user.userId;
}

module.exports = { requireAuth };
