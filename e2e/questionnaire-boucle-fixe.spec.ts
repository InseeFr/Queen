import { test, expect } from '@playwright/test';

test('Questionnaire Boucle fixe curseur', async ({ page }) => {
  const jsonLunatic = '/static/questionnaire/boucle-fixe/form.json';
  const serveur = 'http://localhost:5000';
  await page.goto(serveur + '/visualize');

  await page
    .getByPlaceholder('http://localhost:5000/static/questionnaire/simpsons/form.json')
    .fill(serveur + jsonLunatic);
  await page.getByRole('button', { name: 'Visualize', exact: true }).click();
  // Page 1
  await page.getByRole('button', { name: 'Continue' }).click();
  //Page 2
  await page.getByLabel('➡ 1. PRENOMAjout d’un contrôle sur prénom vide').click();
  await page.getByLabel('➡ 1. PRENOMAjout d’un contrôle sur prénom vide').fill('AAA');
  await page.getByRole('button', { name: 'Ajoute un prénom' }).click();
  await page.getByLabel('➡ 1. PRENOMAjout d’un contrôle sur prénom vide').nth(1).click();
  await page.getByLabel('➡ 1. PRENOMAjout d’un contrôle sur prénom vide').nth(1).fill('BBB');
  await page.getByRole('button', { name: 'Ajoute un prénom' }).click();
  await page.getByLabel('➡ 1. PRENOMAjout d’un contrôle sur prénom vide').nth(2).click();
  await page.getByLabel('➡ 1. PRENOMAjout d’un contrôle sur prénom vide').nth(2).fill('CCC');
  await page.getByRole('button', { name: 'Ajoute un prénom' }).click();
  await page.getByLabel('➡ 1. PRENOMAjout d’un contrôle sur prénom vide').nth(3).click();
  await page.getByLabel('➡ 1. PRENOMAjout d’un contrôle sur prénom vide').nth(3).fill('DDD');
  await page.getByRole('button', { name: 'Remove row' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page
    .getByLabel(
      '➡ 2. Q1 de AAAFiltre pour affichage de Q2 : Q2 affichée si Q1 = A, donc à testerContrôle sur Q1 vide'
    )
    .click();
  await page
    .getByLabel(
      '➡ 2. Q1 de AAAFiltre pour affichage de Q2 : Q2 affichée si Q1 = A, donc à testerContrôle sur Q1 vide'
    )
    .click();
  await page
    .getByLabel(
      '➡ 2. Q1 de AAAFiltre pour affichage de Q2 : Q2 affichée si Q1 = A, donc à testerContrôle sur Q1 vide'
    )
    .fill('a');
  await page
    .getByLabel(
      '➡ 2. Q1 de AAAFiltre pour affichage de Q2 : Q2 affichée si Q1 = A, donc à testerContrôle sur Q1 vide'
    )
    .fill('A');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByLabel('➡ 3. Affichage de Q2 si Q1 = A - rappel du prénom : AAA').click();
  await page.getByLabel('➡ 3. Affichage de Q2 si Q1 = A - rappel du prénom : AAA').fill('AAA');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page
    .getByLabel(
      '➡ 2. Q1 de BBBFiltre pour affichage de Q2 : Q2 affichée si Q1 = A, donc à testerContrôle sur Q1 vide'
    )
    .click();

  await page
    .getByLabel(
      '➡ 2. Q1 de BBBFiltre pour affichage de Q2 : Q2 affichée si Q1 = A, donc à testerContrôle sur Q1 vide'
    )
    .fill('a');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page
    .getByLabel(
      '➡ 2. Q1 de CCCFiltre pour affichage de Q2 : Q2 affichée si Q1 = A, donc à testerContrôle sur Q1 vide'
    )
    .click();
  await page
    .getByLabel(
      '➡ 2. Q1 de CCCFiltre pour affichage de Q2 : Q2 affichée si Q1 = A, donc à testerContrôle sur Q1 vide'
    )
    .fill('A');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByLabel('➡ 3. Affichage de Q2 si Q1 = A - rappel du prénom : CCC').click();
  await page.getByLabel('➡ 3. Affichage de Q2 si Q1 = A - rappel du prénom : CCC').fill('CCC');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByLabel('➡ 4. Décrire un produitContrôle sur P1 vide').click();
  await page.getByLabel('➡ 4. Décrire un produitContrôle sur P1 vide').fill('P1');
  await page.getByLabel('➡ 5. Avis sur produit').click();
  await page.getByLabel('➡ 5. Avis sur produit').fill('RASS');
  await page.getByRole('button', { name: 'Ajouter un produit' }).click();
  await page.locator('div:nth-child(7) > .field > .lunatic-input').click();
  await page.locator('div:nth-child(7) > .field > .lunatic-input').click();
  await page.getByLabel('➡ 4. Décrire un produitContrôle sur P1 vide').nth(1).fill('p2');
  await page.getByLabel('➡ 5. Avis sur produit').nth(1).click();
  await page.getByLabel('➡ 5. Avis sur produit').nth(1).fill('ras');
  await page.getByRole('button', { name: 'Ajouter un produit' }).click();
  await page.getByLabel('➡ 4. Décrire un produitContrôle sur P1 vide').nth(2).click();
  await page.getByLabel('➡ 4. Décrire un produitContrôle sur P1 vide').nth(2).fill('p3');
  await page.locator('div:nth-child(12) > .field > .lunatic-input').click();
  await page.locator('div:nth-child(12) > .field > .lunatic-input').click();
  await page.getByLabel('➡ 5. Avis sur produit').nth(2).fill('remquarq');
  await page.getByRole('button', { name: 'Remove row' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByLabel('➡ 6. NBon vérifie que la formule cast-string-NB est ok :null').click();
  await page.getByLabel('➡ 6. NBon vérifie que la formule cast-string-NB est ok :null').fill('2');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.locator('[id="kwupruv2-0\\ "]').click();
  await page.locator('[id="kwupruv2-0\\ "]').fill('AAA');
  await page.locator('[id="kwupruv2-1\\ "]').click();
  await page.locator('[id="kwupruv2-1\\ "]').fill('BBB');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByLabel('➡ 8. AGE de AAAContrôle sur AGE vide').click();
  await page.getByLabel('➡ 8. AGE de AAAContrôle sur AGE vide').fill('23');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByLabel('➡ 8. AGE de BBBContrôle sur AGE vide').click();
  await page.getByLabel('➡ 8. AGE de BBBContrôle sur AGE vide').fill('30');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
});

test('Questionnaire Boucle fixe raccourci/clavier', async ({ page }) => {
  const jsonLunatic = '/static/questionnaire/boucle-fixe/form.json';
  const serveur = 'http://localhost:5000';
  await page.goto(serveur + '/visualize');

  await page
    .getByPlaceholder('http://localhost:5000/static/questionnaire/simpsons/form.json')
    .fill(serveur + jsonLunatic);
  await page.getByRole('button', { name: 'Visualize', exact: true }).click();
  // Page 1
  await page.getByRole('button', { name: 'Continue' }).click();
  //Page 2
  await page.getByLabel('➡ 1. PRENOMAjout d’un contrôle sur prénom vide').click();
  await page.getByLabel('➡ 1. PRENOMAjout d’un contrôle sur prénom vide').fill('A');
  await page.getByLabel('➡ 1. PRENOMAjout d’un contrôle sur prénom vide').press('Tab');
  await page.getByRole('button', { name: 'Ajoute un prénom' }).press('Tab');
  await page.getByRole('button', { name: 'Continue' }).press('Enter');
  await page
    .getByLabel(
      '➡ 2. Q1 de AFiltre pour affichage de Q2 : Q2 affichée si Q1 = A, donc à testerContrôle sur Q1 vide'
    )
    .click();
  await page
    .getByLabel(
      '➡ 2. Q1 de AFiltre pour affichage de Q2 : Q2 affichée si Q1 = A, donc à testerContrôle sur Q1 vide'
    )
    .fill('a');
  await page
    .getByLabel(
      '➡ 2. Q1 de AFiltre pour affichage de Q2 : Q2 affichée si Q1 = A, donc à testerContrôle sur Q1 vide'
    )
    .press('Alt+Enter');
  await page.locator('body').press('Alt+Enter');
  await page.locator('body').press('Tab');
  await page.getByRole('button', { name: 'Back', exact: true }).press('Tab');
  await page.getByRole('button', { name: 'Next' }).press('Tab');
  await page.getByLabel('➡ 4. Décrire un produitContrôle sur P1 vide').click();
  await page.getByLabel('➡ 4. Décrire un produitContrôle sur P1 vide').fill('p1');
  await page.getByLabel('➡ 4. Décrire un produitContrôle sur P1 vide').press('Tab');
  await page.getByLabel('➡ 5. Avis sur produit').fill('p2');
  await page.getByLabel('➡ 5. Avis sur produit').press('Tab');
  await page.getByRole('button', { name: 'Ajouter un produit' }).press('Enter');
  await page.getByRole('button', { name: 'Ajouter un produit' }).press('Tab');
  await page.getByRole('button', { name: 'Remove row' }).press('Shift+Tab');
  await page.getByRole('button', { name: 'Ajouter un produit' }).press('Shift+Tab');
  await page.getByLabel('➡ 5. Avis sur produit').nth(1).press('Shift+Tab');
  await page.getByLabel('➡ 4. Décrire un produitContrôle sur P1 vide').nth(1).fill('p2');
  await page.getByLabel('➡ 4. Décrire un produitContrôle sur P1 vide').nth(1).press('Tab');
  await page.getByLabel('➡ 5. Avis sur produit').nth(1).fill('ras');
  await page.getByLabel('➡ 5. Avis sur produit').nth(1).press('Tab');
  await page.getByRole('button', { name: 'Ajouter un produit' }).press('Tab');
  await page.getByRole('button', { name: 'Remove row' }).press('Shift+Tab');
  await page.getByRole('button', { name: 'Ajouter un produit' }).press('Enter');
  await page.getByRole('button', { name: 'Ajouter un produit' }).press('Shift+Tab');
  await page.getByLabel('➡ 5. Avis sur produit').nth(2).press('Shift+Tab');
  await page.getByLabel('➡ 4. Décrire un produitContrôle sur P1 vide').nth(2).fill('p3');
  await page.getByLabel('➡ 4. Décrire un produitContrôle sur P1 vide').nth(2).press('Shift+Tab');
  await page.getByLabel('➡ 5. Avis sur produit').nth(1).press('Tab');
  await page.getByLabel('➡ 4. Décrire un produitContrôle sur P1 vide').nth(2).press('Tab');
  await page.getByLabel('➡ 5. Avis sur produit').nth(2).press('Tab');
  await page.getByRole('button', { name: 'Ajouter un produit' }).press('Tab');
  await page.getByRole('button', { name: 'Remove row' }).press('Enter');
  await page.getByRole('button', { name: 'Remove row' }).press('Tab');
  await page.getByRole('button', { name: 'Continue' }).press('Alt+Enter');
  await page.getByRole('button', { name: 'Continue' }).press('Alt+Enter');
  await page.locator('body').press('Tab');
  await page.getByRole('button', { name: 'Back', exact: true }).press('Tab');
  await page.getByLabel('➡ 6. NB').click();
  await page.getByLabel('➡ 6. NB').fill('3');
  await page.locator('body').press('Alt+Enter');
  await page.locator('[id="kwupruv2-0\\ "]').fill('A');
  await page.locator('[id="kwupruv2-0\\ "]').press('Tab');
  await page.locator('[id="kwupruv2-1\\ "]').fill('B');
  await page.locator('[id="kwupruv2-1\\ "]').press('Tab');
  await page.locator('[id="kwupruv2-2\\ "]').fill('C');
  await page.locator('body').press('Alt+Enter');
  await page.getByLabel('➡ 8. AGE de A').fill('11');
  await page.getByLabel('➡ 8. AGE de A').press('Alt+Enter');
  await page.getByLabel('➡ 8. AGE de B').fill('25');
  await page.locator('body').press('Alt+Enter');
  await page.getByLabel('➡ 8. AGE de C').fill('33');

  await page.locator('body').press('Alt+Enter');
  await page.locator('body').press('Alt+Enter');
});
