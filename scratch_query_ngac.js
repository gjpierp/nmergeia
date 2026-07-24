process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

async function run() {
  const url = 'https://api.safi-ngac.local/api/v1/menu';
  try {
    const res = await fetch(url, { 
      method: 'POST', 
      headers: { 
        'x-app-code': 'nmergeia',
        'Authorization': 'Bearer ' + 'FAKE_TOKEN',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ contexto: 'nmergeia' })
    });
    console.log(`  -> Status: ${res.status}`);
    const text = await res.text();
    console.log(`  Response snippet: ${text.substring(0, 300)}`);
  } catch (e) {
    console.log(`  -> Failed: ${e.message}`);
  }
}

run();
