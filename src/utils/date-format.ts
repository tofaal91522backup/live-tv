const DateFormat = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};
export default DateFormat;

// format date to only convert to date string
export const DateOnlyFormat = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
}
