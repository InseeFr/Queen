import { test, expect } from '@playwright/test';

test('Questionnaire Controles Numériques curseur', async ({ page }) => {
  const jsonLunatic = '/static/questionnaire/numerique/form.json';
  const serveur = 'http://localhost:5000';
  await page.goto(serveur + '/visualize');

  await page
    .getByPlaceholder('http://localhost:5000/static/questionnaire/simpsons/form.json')
    .fill(serveur + jsonLunatic);
  await page.getByRole('button', { name: 'Visualize', exact: true }).click();
  // Page 1
  await page.getByRole('button', { name: 'Continue' }).click();
  //Page 2
  await page
    .getByLabel(
      '➡ 1. Saisie d’un entier compris entre 0 et 100 - sans controle hors formatQNUM vaut : null'
    )
    .click();
  await page
    .getByLabel(
      '➡ 1. Saisie d’un entier compris entre 0 et 100 - sans controle hors formatQNUM vaut : null'
    )
    .fill('101');
  await page.getByRole('button', { name: 'Continue' }).click();

  await page.getByRole('button', { name: 'Back', exact: true }).click();
  await page
    .getByLabel(
      '➡ 1. Saisie d’un entier compris entre 0 et 100 - sans controle hors formatQNUM vaut : 101'
    )
    .click();
  await page
    .getByLabel(
      '➡ 1. Saisie d’un entier compris entre 0 et 100 - sans controle hors formatQNUM vaut : 101'
    )
    .click();
  await page
    .getByLabel(
      '➡ 1. Saisie d’un entier compris entre 0 et 100 - sans controle hors formatQNUM vaut : 101'
    )
    .fill('-101');
});
