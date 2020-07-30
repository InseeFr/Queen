const loadQueen = async () => {
  console.log('Loading queen');
  const QUEEN_URL = new URL(document.currentScript.src).origin;
  window.localStorage.setItem('QUEEN_URL', QUEEN_URL);

  const manifest = await fetch(`${QUEEN_URL}/asset-manifest.json`);
  const { entrypoints } = await manifest.json();

  entrypoints.forEach(scriptUrl => {
    if (scriptUrl.endsWith('.js')) {
      const script = document.createElement('script');
      script.src = `${QUEEN_URL}/${scriptUrl}`;
      script.async = true;
      document.body.appendChild(script);
    }
  });
};
loadQueen();
