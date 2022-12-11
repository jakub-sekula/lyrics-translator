export const formatDate = (timestamp) => {
  //   console.log(`Timestamp passed to formatDate: ${timestamp}`);
  //   console.log(`Timestamp isNaN: ${isNaN(timestamp)}`);

  const date = new Date(timestamp);
  //   console.log(`Date in formatDate: ${date}`);

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

  //   console.log(`Formatted date in formatDate: ${formattedDate}`);
  return formattedDate;
}

export const isExpired = (timestamp) => {
  return Date.now() > timestamp;
};
