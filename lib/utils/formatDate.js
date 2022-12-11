export default function formatDate(timestamp) {

  const date = new Date(timestamp);

  const formattedDate =
    "Date: " +
    date.getDate() +
    "/" +
    (date.getMonth() + 1) +
    "/" +
    date.getFullYear() +
    " " +
    date.getHours() +
    ":" +
    date.getMinutes() +
    ":" +
    date.getSeconds();
	
  return formattedDate;
}
