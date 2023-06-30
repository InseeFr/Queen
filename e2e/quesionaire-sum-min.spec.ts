import { test, expect } from '@playwright/test';

test('Questionnaire Controles sum min curseur', async ({ page }) => {
  const jsonLunatic = '/static/questionnaire/sum-min/form.json';
  const serveur = 'http://localhost:5000';
  await page.goto(serveur + '/visualize');

  await page
    .getByPlaceholder('http://localhost:5000/static/questionnaire/simpsons/form.json')
    .fill(serveur + jsonLunatic);
  await page.getByRole('button', { name: 'Visualize', exact: true }).click();
  await expect(
    page
      .locator('div')
      .filter({
        hasText: 'QNONREG - sum, min dans une boucle et sur controle prénom et test filtre occurre',
      })
      .nth(4)
  ).toBeVisible();
  // Page 1
  await page.getByRole('button', { name: 'Continue' }).click();
  //Page 2
  await page.getByLabel('➡ 1. NB').click();
  await page.getByLabel('➡ 1. NB').fill('2');
  await page.getByRole('button', { name: 'Continue' }).click();

  await page.locator('[id="ksyjvi40-0\\ "]').click();
  await page.locator('[id="ksyjvi40-0\\ "]').fill('');
  await page.locator('div:nth-child(4) > .field > .lunatic-input').click();
  await page.locator('[id="ksyjvi40-1\\ "]').click();
  await page.locator('[id="ksyjvi40-1\\ "]').fill('');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Back', exact: true }).click();

  await page.locator('[id="ksyjvi40-0\\ "]').fill('A');
  await page.locator('[id="ksyjvi40-1\\ "]').fill('B');
  await page.getByRole('button', { name: 'FAST FORWARD' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByLabel('➡ 3. Age de l’individu : AAGE vaut : nullIND_MAJEUR :0').click();
  await page.getByLabel('➡ 3. Age de l’individu : AAGE vaut : nullIND_MAJEUR :0').fill('15');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page
    .locator('div')
    .filter({ hasText: /^➡ 3\. Age de l’individu : BAGE vaut : nullIND_MAJEUR :0$/ })
    .nth(3)
    .click();
  await page.getByLabel('➡ 3. Age de l’individu : BAGE vaut : nullIND_MAJEUR :0').fill('23');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByLabel('➡ 4. divers').click();
  await page.getByLabel('➡ 4. divers').fill('ras');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
});

test('Questionnaire Controles sum min raccourci/clavier', async ({ page }) => {
  const jsonLunatic = '/static/questionnaire/sum-min/form.json';
  const serveur = 'http://localhost:5000';
  await page.goto(serveur + '/visualize');

  await page
    .getByPlaceholder('http://localhost:5000/static/questionnaire/simpsons/form.json')
    .fill(serveur + jsonLunatic);
  await page.getByRole('button', { name: 'Visualize', exact: true }).click();
  // Page 1
  await page.getByRole('button', { name: 'Continue' }).click();
  //Page 2
  await page.getByLabel('➡ 1. NB').click();
  await page.getByLabel('➡ 1. NB').fill('2');
  await page.getByLabel('➡ 1. NB').press('Alt+Enter');
  await page.locator('body').press('Tab');
  await page
    .getByRole('button', { name: 'Back to the beginning of the questionnaire' })
    .press('Tab');
  await page.getByRole('button', { name: '〉I - S0' }).press('Tab');
  await page.locator('[id="ksyjvi40-0\\ "]').press('Tab');
  await page.locator('[id="ksyjvi40-1\\ "]').fill('');
  await page.locator('[id="ksyjvi40-1\\ "]').press('Shift+Tab');
  await page.locator('[id="ksyjvi40-0\\ "]').fill('A');
  await page.locator('[id="ksyjvi40-0\\ "]').press('Tab');
  await page.locator('[id="ksyjvi40-1\\ "]').fill('B');
  await page.locator('[id="ksyjvi40-1\\ "]').press('Tab');
  await page.getByRole('button', { name: 'Continue' }).press('Alt+Enter');
  await page.getByRole('button', { name: 'Continue' }).press('Alt+Enter');
  await page.locator('body').press('Tab');
  await page.getByRole('button', { name: 'Back', exact: true }).press('Tab');
  await page.getByLabel('➡ 3. Age de l’individu : AAGE vaut : nullIND_MAJEUR :0').click();
  await page.getByLabel('➡ 3. Age de l’individu : AAGE vaut : nullIND_MAJEUR :0').fill('23');
  await page.locator('body').press('Alt+Enter');
  await page.getByLabel('➡ 3. Age de l’individu : BAGE vaut : nullIND_MAJEUR :0').fill('17');
  await page.locator('body').press('Alt+Enter');
  await page.locator('body').press('Alt+Enter');
  await page.getByLabel('➡ 4. divers').click();
  await page.getByLabel('➡ 4. divers').fill('RAS');
  await page.getByLabel('➡ 4. divers').press('Alt+Enter');
  await page.locator('body').press('Alt+Enter');
  await page.locator('body').press('Alt+Enter');
  await page.locator('body').press('Alt+Enter');
});

test('Questionnaire Controles sum min navigation questions avec ajout', async ({ page }) => {
  const jsonLunatic = '/static/questionnaire/sum-min/form.json';
  const serveur = 'http://localhost:5000';
  await page.goto(serveur + '/visualize');

  await page
    .getByPlaceholder('http://localhost:5000/static/questionnaire/simpsons/form.json')
    .fill(serveur + jsonLunatic);
  await page.getByRole('button', { name: 'Visualize', exact: true }).click();
  expect(page.locator('#sequence-ksyjs7vy')).toBeVisible();
  // Page 1
  await page.getByRole('button', { name: 'Continue' }).click();
  //Page 2
  await page.getByLabel('➡ 1. NB').fill('2');
  expect(await page.getByLabel('➡ 1. NB').inputValue()).toEqual('2');
  await page.getByLabel('➡ 1. NB').press('Alt+Enter');
  await page.locator('body').press('Tab');
  await page
    .getByRole('button', { name: 'Back to the beginning of the questionnaire' })
    .press('Tab');
  await page.getByRole('button', { name: '〉I - S0' }).press('Tab');
  await page.locator('[id="ksyjvi40-0\\ "]').press('Tab');
  await page.locator('[id="ksyjvi40-1\\ "]').fill('');
  await page.locator('[id="ksyjvi40-1\\ "]').press('Shift+Tab');
  await page.locator('[id="ksyjvi40-0\\ "]').fill('A');
  await page.locator('[id="ksyjvi40-0\\ "]').press('Tab');
  await page.locator('[id="ksyjvi40-1\\ "]').fill('B');
  await page.locator('[id="ksyjvi40-1\\ "]').press('Tab');
  await page.getByRole('button', { name: 'Continue' }).press('Alt+Enter');
  await page.getByRole('button', { name: 'Continue' }).press('Alt+Enter');
  await page.locator('body').press('Tab');
  await page.getByRole('button', { name: 'Back', exact: true }).press('Tab');
  await page.getByLabel('➡ 3. Age de l’individu : AAGE vaut : nullIND_MAJEUR :0').click();
  await page.getByLabel('➡ 3. Age de l’individu : AAGE vaut : nullIND_MAJEUR :0').fill('23');
  await page.locator('body').press('Alt+Enter');
  await page.getByLabel('➡ 3. Age de l’individu : BAGE vaut : nullIND_MAJEUR :0').fill('17');
  await page.locator('body').press('Alt+Enter');
  await page.locator('body').press('Alt+Enter');
  await page.getByLabel('➡ 4. divers').click();
  await page.getByLabel('➡ 4. divers').fill('RAS');
  await page.getByLabel('➡ 4. divers').press('Alt+Enter');
  await page.locator('body').press('Alt+Enter');
  await page.locator('body').press('Alt+Enter');
  await page.locator('body').press('Alt+Enter');
  await page.getByRole('button', { name: 'Back', exact: true }).click();
  await page.getByRole('button', { name: 'Back', exact: true }).click();
  await page.getByRole('button', { name: 'Back', exact: true }).click();
  await page.getByRole('button', { name: 'Back', exact: true }).click();
  await page.getByRole('button', { name: 'Back', exact: true }).click();
  await page.getByLabel('➡ 3. Age de l’individu : BAGE vaut : 17IND_MAJEUR :0').click();
  await page.getByLabel('➡ 3. Age de l’individu : BAGE vaut : 17IND_MAJEUR :0').fill('18');
  await page.getByRole('button', { name: 'Back', exact: true }).click();
  await page.getByRole('button', { name: 'Back', exact: true }).click();
  await page.getByRole('button', { name: 'Back', exact: true }).click();
  await page.locator('[id="ksyjvi40-0\\ "]').click();

  await page.locator('[id="ksyjvi40-0\\ "]').fill('AA');
  await page.getByRole('button', { name: 'Back', exact: true }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Back', exact: true }).click({
    clickCount: 3,
  });
  await page.getByRole('button', { name: 'Back', exact: true }).click({
    clickCount: 3,
  });
  await page.getByRole('button', { name: 'Back', exact: true }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByLabel('➡ 1. NB').click();
  await page.getByLabel('➡ 1. NB').fill('3');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.locator('[id="ksyjvi40-2\\ "]').click();
  await page.locator('[id="ksyjvi40-2\\ "]').fill('C');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByLabel('➡ 3. Age de l’individu : AA').fill('18');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByLabel('➡ 3. Age de l’individu : B').click();
  await page.getByLabel('➡ 3. Age de l’individu : B').fill('19');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByLabel('➡ 3. Age de l’individu : C').click();
  await page.getByLabel('➡ 3. Age de l’individu : C').fill('22');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
});
