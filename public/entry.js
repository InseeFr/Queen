const loadQueen = async () => {
  console.log('Loading queen');
  const queenUrl = new URL(document.currentScript.src).origin;
  window.localStorage.setItem('QUEEN_URL', queenUrl);

  const manifest = await fetch(`${queenUrl}/asset-manifest.json`);
  const { entrypoints } = await manifest.json();

  entrypoints.forEach(scriptUrl => {
    if (scriptUrl.endsWith('.js')) {
      const script = document.createElement('script');
      script.src = `${queenUrl}/${scriptUrl}`;
      script.async = true;
      document.body.appendChild(script);
    }
  });
};
loadQueen();
