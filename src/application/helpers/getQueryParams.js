export default (rawQueryParams) => {
  let params = {};
  // rawQueryParams.substr(1) - remove "?" sign, then split by "&" to find all key=value pairs
  rawQueryParams.substr(1).split("&").forEach(pair => {
    if (pair === "") return;
    // split pair to two parts - key and value
    const parts = pair.split("=");
    // add key and value to the object params
    params[parts[0]] = parts[1] && decodeURIComponent(parts[1].replace(/\+/g, " "));
  });
  return params;
}