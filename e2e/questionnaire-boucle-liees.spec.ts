import { test, expect } from '@playwright/test';

test('Questionnaire boucle liées curseur', async ({ page }) => {
  const jsonLunatic = '/static/questionnaire/boucle-liees/form.json';
  const serveur = 'http://localhost:5000';
  await page.goto(serveur + '/visualize');

  await page
    .getByPlaceholder('http://localhost:5000/static/questionnaire/simpsons/form.json')
    .fill(serveur + jsonLunatic);
  await page.getByRole('button', { name: 'Visualize', exact: true }).click();
  // Page 1
  await page.getByRole('button', { name: 'Continue' }).click();
  //Page 2
  await page.getByRole('radio', { name: '1 Oui' }).click();
  await page.getByRole('radio', { name: '2 Non' }).click();
  await page.getByLabel('➡ 3. NBHAB : controle si > 5').click();
  await page.getByLabel('➡ 3. NBHAB : controle si > 5').fill('6');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.locator('[id="kyn41vx2-0\\ "]').click();
  await page.locator('[id="kyn41vx2-0\\ "]').fill('A');
  await page.locator('[id="kyn41vx2-1\\ "]').click();
  await page.locator('[id="kyn41vx2-1\\ "]').fill('B');
  await page.locator('[id="kyn41vx2-2\\ "]').click();
  await page.locator('[id="kyn41vx2-2\\ "]').fill('C');
  await page.locator('[id="kyn41vx2-3\\ "]').click();
  await page.locator('[id="kyn41vx2-3\\ "]').fill('D');
  await page.locator('[id="kyn41vx2-4\\ "]').click();
  await page.locator('[id="kyn41vx2-4\\ "]').fill('E');
  await page.locator('[id="kyn41vx2-5\\ "]').click();
  await page.locator('[id="kyn41vx2-5\\ "]').fill('F');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('radio', { name: '1 Oui' }).click();
  await page.getByRole('radio', { name: '1 Oui' }).click();
  await page
    .getByLabel(
      '➡ 7. Montant entre 0 et 100 pour l’individu AContrôles : un vérifie que saisie inférieure à 10'
    )
    .click();
  await page
    .getByLabel(
      '➡ 7. Montant entre 0 et 100 pour l’individu AContrôles : un vérifie que saisie inférieure à 10'
    )
    .fill('36');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page
    .getByRole('group', { name: '➡ 5. Q1 de B Controle si Q1INDIV vide' })
    .locator('div')
    .nth(3)
    .click();
  await page.getByRole('radio', { name: '2 Non' }).click();
  await page
    .getByLabel(
      '➡ 7. Montant entre 0 et 100 pour l’individu BContrôles : un vérifie que saisie inférieure à 10'
    )
    .click();
  await page
    .getByLabel(
      '➡ 7. Montant entre 0 et 100 pour l’individu BContrôles : un vérifie que saisie inférieure à 10'
    )
    .fill('64');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('radio', { name: '1 Oui' }).click();
  await page
    .getByRole('group', { name: '➡ 6. Q2 de C controle si Q1 = 1 et Q2 = 1' })
    .locator('div')
    .nth(3)
    .click();
  await page
    .getByLabel(
      '➡ 7. Montant entre 0 et 100 pour l’individu CContrôles : un vérifie que saisie inférieure à 10'
    )
    .click();
  await page
    .getByLabel(
      '➡ 7. Montant entre 0 et 100 pour l’individu CContrôles : un vérifie que saisie inférieure à 10'
    )
    .fill('99');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('radio', { name: '2 Non' }).click();
  await page.getByRole('radio', { name: '2 Non' }).click();
  await page
    .getByLabel(
      '➡ 7. Montant entre 0 et 100 pour l’individu DContrôles : un vérifie que saisie inférieure à 10'
    )
    .click();
  await page
    .getByLabel(
      '➡ 7. Montant entre 0 et 100 pour l’individu DContrôles : un vérifie que saisie inférieure à 10'
    )
    .fill('641');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('radio', { name: '1 Oui' }).click();
  await page.getByRole('radio', { name: '2 Non' }).click();
  await page
    .getByLabel(
      '➡ 7. Montant entre 0 et 100 pour l’individu EContrôles : un vérifie que saisie inférieure à 10'
    )
    .click();
  await page
    .getByLabel(
      '➡ 7. Montant entre 0 et 100 pour l’individu EContrôles : un vérifie que saisie inférieure à 10'
    )
    .fill('11');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('radio', { name: '2 Non' }).click();
  await page.getByRole('radio', { name: '1 Oui' }).click();
  await page
    .getByLabel(
      '➡ 7. Montant entre 0 et 100 pour l’individu FContrôles : un vérifie que saisie inférieure à 10'
    )
    .click();
  await page
    .getByLabel(
      '➡ 7. Montant entre 0 et 100 pour l’individu FContrôles : un vérifie que saisie inférieure à 10'
    )
    .fill('145');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByLabel('➡ 8. FIN').click();
  await page.getByLabel('➡ 8. FIN').fill('F');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
});
test('Questionnaire boucle liées  raccourci/clavier', async ({ page }) => {
  const jsonLunatic = '/static/questionnaire/boucle-liees/form.json';
  const serveur = 'http://localhost:5000';
  await page.goto(serveur + '/visualize');

  await page
    .getByPlaceholder('http://localhost:5000/static/questionnaire/simpsons/form.json')
    .fill(serveur + jsonLunatic);
  await page.getByRole('button', { name: 'Visualize', exact: true }).click();
  // Page 1
  await page.getByRole('button', { name: 'Continue' }).click();
  //Page 2
  await page.locator('.makeStyles-activeView-32').click();
  await page.locator('body').press('1');
  await page.locator('body').press('2');
  await page.getByLabel('➡ 3. NBHAB : controle si > 5').fill('6');
  await page.getByLabel('➡ 3. NBHAB : controle si > 5').press('Alt+Enter');
  await page.locator('body').press('Tab');
  await page.locator('[id="kyn41vx2-0\\ "]').fill('A');
  await page.locator('[id="kyn41vx2-0\\ "]').press('Tab');
  await page.locator('[id="kyn41vx2-1\\ "]').fill('B');
  await page.locator('[id="kyn41vx2-1\\ "]').press('Tab');
  await page.locator('[id="kyn41vx2-2\\ "]').fill('C');
  await page.locator('[id="kyn41vx2-2\\ "]').press('Tab');
  await page.locator('[id="kyn41vx2-3\\ "]').fill('D');
  await page.locator('[id="kyn41vx2-3\\ "]').press('Tab');
  await page.locator('[id="kyn41vx2-4\\ "]').fill('E');
  await page.locator('[id="kyn41vx2-4\\ "]').press('Tab');
  await page.locator('[id="kyn41vx2-5\\ "]').fill('F');
  await page.locator('[id="kyn41vx2-5\\ "]').press('Tab');
  await page.getByRole('button', { name: 'Continue' }).press('Alt+Enter');
  await page.locator('body').press('1');
  await page.locator('body').press('1');
  await page.locator('.makeStyles-lunatic-57').click();
  await page.locator('body').press('Tab');
  await page
    .getByLabel(
      '➡ 7. Montant entre 0 et 100 pour l’individu AContrôles : un vérifie que saisie inférieure à 10'
    )
    .fill('22');
  await page
    .getByLabel(
      '➡ 7. Montant entre 0 et 100 pour l’individu AContrôles : un vérifie que saisie inférieure à 10'
    )
    .press('Alt+Enter');
  await page.locator('body').press('1');
  await page.locator('body').press('2');
  await page.locator('.makeStyles-lunatic-57').click();
  await page.locator('body').press('Tab');
  await page
    .getByLabel(
      '➡ 7. Montant entre 0 et 100 pour l’individu BContrôles : un vérifie que saisie inférieure à 10'
    )
    .fill('66');
  await page
    .getByLabel(
      '➡ 7. Montant entre 0 et 100 pour l’individu BContrôles : un vérifie que saisie inférieure à 10'
    )
    .press('Alt+Enter');
  await page.locator('body').press('2');
  await page.locator('body').press('1');
  await page.locator('body').press('Tab');
  await page
    .getByLabel(
      '➡ 7. Montant entre 0 et 100 pour l’individu CContrôles : un vérifie que saisie inférieure à 10'
    )
    .fill('54');

  await page.locator('body').press('Alt+Enter');
  await page.locator('body').press('2');
  await page.locator('body').press('1');
  await page.getByLabel('➡ 7. Montant entre 0 et 100 pour l’individu D').fill('88');
  await page.locator('body').press('Alt+Enter');
  await page.locator('body').press('2');
  await page.locator('body').press('1');
  await page.getByLabel('➡ 7. Montant entre 0 et 100 pour l’individu E').fill('97');
  await page.getByLabel('➡ 7. Montant entre 0 et 100 pour l’individu E').press('Alt+Enter');
  await page.locator('body').press('2');
  await page.locator('body').press('2');
  await page.getByLabel('➡ 7. Montant entre 0 et 100 pour l’individu F').fill('97');
  await page.getByLabel('➡ 7. Montant entre 0 et 100 pour l’individu F').press('Alt+Enter');
  await page.locator('body').press('Tab');
  await page.getByLabel('➡ 8. FIN').fill('FFF');
  await page.getByLabel('➡ 8. FIN').press('Alt+Enter');
  await page.locator('body').press('Alt+Enter');
  await page.locator('body').press('Alt+Enter');
});
