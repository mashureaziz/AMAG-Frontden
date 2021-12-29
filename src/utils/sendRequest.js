// Send Fetch request
export async function sendRequest(url, method, content) {
  let init;
  if (method === 'GET') {
    init = {
      method,
    };
  } else {
    init = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(content),
    };
  }
  const response = await fetch(url, init);
  return response;
}
// send.then((data) => {
//   setAudits(data.audits);
//   const { name, region, description, latitude, longitude } = data;
//   setDefaultValues({ name, region, description, latitude, longitude });
//   setFetching(false);
// });
// } else {
// setFetching(false);
// }
// }
// Send fetch request
// export async function doRequest(siteId, isNew, content) {
//   let method = 'POST';
//   let url = `${process.env.REACT_APP_BASE_URL}/api/v1/site`;
//   if (!isNew) {
//     method = 'PUT';
//     url = `${process.env.REACT_APP_BASE_URL}/api/v1/site/${siteId}`;
//   }
//   const response = await sendRequest(
//     url,
//     method, content
//   );
//   if (response.ok) {
//     const data = await response.json();
//     return data;
//   }
//   return 'Something went wrong';
// }
