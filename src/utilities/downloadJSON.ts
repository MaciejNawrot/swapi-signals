export const downloadJSON = (data: any, name: string) => {
  const jsonString = JSON.stringify({ data });
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name}.json`;
  a.click();
  window.URL.revokeObjectURL(url);
}
