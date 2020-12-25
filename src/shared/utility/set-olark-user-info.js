export function setOlarkUserInfo({
  email = null,
  firstName = null,
  lastName = null,
} = {}) {
  if (!window.olark || typeof window.olark !== 'function') {
    return;
  }
  
  if (firstName && firstName.trim() && lastName && lastName.trim()) {
    window.olark('api.visitor.updateFullName', {
      fullName: `${firstName} ${lastName}`,
    });
  }
  
  window.olark('api.visitor.updateEmailAddress', {
    emailAddress: email,
  });
}
