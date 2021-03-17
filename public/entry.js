const loadQueen = async () => {
  console.log('Loading queen');
  try {
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
    console.log('Queen was successfully loaded');
  } catch (error) {
    console.error(error);
    console.error('Failed to load Queen as Web Component');
  }
};
loadQueen();
