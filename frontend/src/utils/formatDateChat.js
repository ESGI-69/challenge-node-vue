export default (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
};
