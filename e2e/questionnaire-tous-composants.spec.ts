import { test, expect } from '@playwright/test';

test('Questionnaire Controles tous composants curseur', async ({ page }) => {
  const jsonLunatic = '/static/questionnaire/tous-composants/form.json';
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
      '➡ 1. Je suis le libellé de la question de type texte de longueur inférieure à 250 caractèresSo close no matter how far couldn’t be much more from the heart forever trust in who we are and nothing else matters <br/> never opened myself this way life is ours, we live it our way all these words I don’t just say and nothing else matters <br/> trust I seek and I find in you every day for us something new open mind for a different view and nothing else matters never cared for what they do never cared for what they know But I know so close no matter how far couldn’t be much more from the heart forever trusting who we are and nothing else matters never cared for what they do never cared for what they know And I know I never opened myself this way life is ours, we live it our way all these words I don’t just say and nothing else matters trust I seek and I find in you every day for us something new open mind for a different view and nothing else matters never cared for what they say never cared for games they play never cared for what they do'
    )
    .click();
  await page
    .getByLabel(
      '➡ 1. Je suis le libellé de la question de type texte de longueur inférieure à 250 caractèresSo close no matter how far couldn’t be much more from the heart forever trust in who we are and nothing else matters <br/> never opened myself this way life is ours, we live it our way all these words I don’t just say and nothing else matters <br/> trust I seek and I find in you every day for us something new open mind for a different view and nothing else matters never cared for what they do never cared for what they know But I know so close no matter how far couldn’t be much more from the heart forever trusting who we are and nothing else matters never cared for what they do never cared for what they know And I know I never opened myself this way life is ours, we live it our way all these words I don’t just say and nothing else matters trust I seek and I find in you every day for us something new open mind for a different view and nothing else matters never cared for what they say never cared for games they play never cared for what they do'
    )
    .fill('azert');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page
    .getByLabel(
      '➡ 2. Je suis le libellé de la question de type texte de longueur supérieure à 250 caractères.&#xd;Demain, dès l’aube, à l’heure où blanchit la campagne,&#xd;Je partirai. Vois-tu, je sais que tu m’attends. J’irai par la forêt, j’irai par la montagne. Je ne puis demeurer loin de toi plus longtemps.&#xd;Je marcherai les yeux fixés sur mes pensées, Sans rien voir au dehors, sans entendre aucun bruit, Seul, inconnu, le dos courbé, les mains croisées, Triste, et le jour pour moi sera comme la nuit.&#xd;Je ne regarderai ni l’or du soir qui tombe, Ni les voiles au loin descendant vers Harfleur, Et quand j’arriverai, je mettrai sur ta tombe Un bouquet de houx vert et de bruyère en fleur.Le champ de la réponse de type texte long est modifiable à la souris'
    )
    .click();
  await page
    .getByLabel(
      '➡ 2. Je suis le libellé de la question de type texte de longueur supérieure à 250 caractères.&#xd;Demain, dès l’aube, à l’heure où blanchit la campagne,&#xd;Je partirai. Vois-tu, je sais que tu m’attends. J’irai par la forêt, j’irai par la montagne. Je ne puis demeurer loin de toi plus longtemps.&#xd;Je marcherai les yeux fixés sur mes pensées, Sans rien voir au dehors, sans entendre aucun bruit, Seul, inconnu, le dos courbé, les mains croisées, Triste, et le jour pour moi sera comme la nuit.&#xd;Je ne regarderai ni l’or du soir qui tombe, Ni les voiles au loin descendant vers Harfleur, Et quand j’arriverai, je mettrai sur ta tombe Un bouquet de houx vert et de bruyère en fleur.Le champ de la réponse de type texte long est modifiable à la souris'
    )
    .fill(
      'rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr'
    );
  await page.getByRole('button', { name: 'Continue' }).click();
  await page
    .getByLabel(
      '➡ 3. Numérique entier sans unité - grand (max= 999999999)Variable utilisée dans le tableau question 22'
    )
    .click();
  await page
    .getByLabel(
      '➡ 3. Numérique entier sans unité - grand (max= 999999999)Variable utilisée dans le tableau question 22'
    )
    .fill('999,999,999');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page
    .getByLabel(
      '➡ 4. Numérique décimal sans unité (entre 0 et 1000.00)Controle par rapport à question 3 dont la valeur est :999999999Test : saisir un nombre plus grand que celui de la question 3 et vérifier affichage du controle'
    )
    .click();
  await page
    .getByLabel(
      '➡ 4. Numérique décimal sans unité (entre 0 et 1000.00)Controle par rapport à question 3 dont la valeur est :999999999Test : saisir un nombre plus grand que celui de la question 3 et vérifier affichage du controle'
    )
    .fill('30000');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page
    .getByLabel(
      "➡ 5. Numérique max 9999 avec[ unité](. 'l’unité choisie ici est le kilo euro mais je peux tester une infobulle un peu longue pour regarder') et infobulle sur le mot unité de cette question"
    )
    .click();
  await page
    .getByLabel(
      "➡ 5. Numérique max 9999 avec[ unité](. 'l’unité choisie ici est le kilo euro mais je peux tester une infobulle un peu longue pour regarder') et infobulle sur le mot unité de cette question"
    )
    .fill('7');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByLabel('➡ 6. Date jour').fill('2000-12-03');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('checkbox', { name: '➡ 7. Booléen' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page
    .getByRole('radio', {
      name: '7 [code7](. "My name is Bond, James Bond") le code 7 porte une infobulle',
    })
    .click();
  await page.getByRole('radio', { name: '6 code6' }).click();
  await page
    .locator('div')
    .filter({ hasText: /^1soleil$/ })
    .nth(1)
    .click();
  await page
    .getByRole('combobox', {
      name: '➡ 11. Question à choix unique - présentation liste déroulante',
    })
    .locator('div')
    .click();
  await page.getByText('55 — Meuse').click();
  await page
    .getByRole('combobox', {
      name: '➡ 11. Question à choix unique - présentation liste déroulante',
    })
    .locator('div')
    .click();
  await page.getByText('39 — Jura').click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page
    .getByLabel('➡ 12. Question à choix unique - présentation autocomplétion, par TS')
    .click();
  await page
    .getByLabel('➡ 12. Question à choix unique - présentation autocomplétion, par TS')
    .fill('mmm');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page
    .getByRole('checkbox', { name: '1 code1 : le libellé du code 1 contient **du gras**' })
    .click();
  await page
    .getByRole('checkbox', {
      name: '3 code3 : le libellé du code 3 contient **du gras** et *de l’italique*',
    })
    .click();
  await page
    .getByRole('checkbox', {
      name: '7 [code7](. "My name is Bond, James Bond") le code 7 porte une infobulle',
    })
    .click();
  await page
    .getByRole('checkbox', {
      name: '5 code5 : le libellé du code 5 contient des retours à la ligne ligne 2 ligne 3',
    })
    .click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page
    .getByRole('row', { name: 'choix 1' })
    .locator('div')
    .filter({ hasText: 'Oui' })
    .nth(3)
    .click();
  await page.getByRole('row', { name: 'choix 1' }).getByRole('radio', { name: 'Non' }).click();
  await page
    .getByRole('row', { name: 'choix 2' })
    .locator('div')
    .filter({ hasText: 'Oui' })
    .nth(3)
    .click();
  await page
    .getByRole('row', { name: '[choix 3](. "1 2 3 soleil")' })
    .getByRole('radio', { name: 'Ne sait pas' })
    .click();
  await page
    .getByRole('row', { name: 'choix 4' })
    .getByRole('radio', { name: 'Ne sait pas' })
    .click();
  await page
    .getByRole('row', { name: 'choix 4' })
    .getByRole('radio', { name: 'Ne sait pas' })
    .click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page
    .getByRole('row', { name: 'code1 : le libellé du code 1 contient **du gras**' })
    .getByRole('radio', { name: 'Oui' })
    .click();
  await page
    .getByRole('row', { name: 'code2 le libellé du code 2 contient *de l’italique*' })
    .getByRole('radio', { name: 'Oui' })
    .click();
  await page
    .getByRole('row', {
      name: 'code3 : le libellé du code 3 contient **du gras** et *de l’italique*',
    })
    .getByRole('radio', { name: 'Oui' })
    .click();
  await page
    .getByRole('row', { name: 'code4 : le libellé du code 4 contient du ***gras italique***' })
    .getByRole('radio', { name: 'Non' })
    .click();
  await page
    .getByRole('row', {
      name: 'code5 : le libellé du code 5 contient des retours à la ligne ligne 2 ligne 3',
    })
    .locator('div')
    .filter({ hasText: 'Non' })
    .nth(3)
    .click();
  await page
    .getByRole('row', { name: 'code6' })
    .locator('div')
    .filter({ hasText: 'Non' })
    .nth(3)
    .click();
  await page
    .getByRole('row', {
      name: '[code7](. "My name is Bond, James Bond") le code 7 porte une infobulle',
    })
    .locator('div')
    .filter({ hasText: 'Oui' })
    .nth(3)
    .click();
  await page
    .getByRole('row', {
      name: '[code7](. "My name is Bond, James Bond") le code 7 porte une infobulle',
    })
    .locator('div')
    .filter({ hasText: 'Oui' })
    .nth(3)
    .click();
  await page.getByRole('row', { name: 'code8' }).getByRole('radio', { name: 'Oui' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page
    .getByLabel(
      '➡ 16. Tableau TIC - répartition du nb habitants, comparaison question INTEGERRappel de la valeur collectée INTEGER = 999999999'
    )
    .click();
  await page
    .getByLabel(
      '➡ 16. Tableau TIC - répartition du nb habitants, comparaison question INTEGERRappel de la valeur collectée INTEGER = 999999999'
    )
    .fill('1');
  await page.getByRole('row', { name: 'de 16 à 17 ans' }).getByRole('spinbutton').fill('1');
  await page.getByRole('row', { name: 'de 16 à 17 ans' }).getByRole('spinbutton').click();
  await page.locator('#lunatic-table-td-l8u8d67h-2-1').click();
  await page.locator('#lunatic-table-td-l8u8d67h-2-1').click();
  await page.getByRole('row', { name: 'de 18 à 19 ans' }).getByRole('spinbutton').fill('1');
  await page.getByRole('row', { name: '20 et plus' }).getByRole('spinbutton').click();
  await page.getByRole('row', { name: '20 et plus' }).getByRole('spinbutton').fill('1');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page
    .getByLabel(
      '➡ 17. Tableau un axe simple, une mesure, sans unitéCOntrole sur somme des lignes > 100'
    )
    .click();
  await page
    .getByLabel(
      '➡ 17. Tableau un axe simple, une mesure, sans unitéCOntrole sur somme des lignes > 100'
    )
    .fill('11');
  await page.getByRole('row', { name: 'choix 2' }).locator('#jfkzltkm').click();
  await page.getByRole('row', { name: 'choix 2' }).locator('#jfkzltkm').fill('12');
  await page.getByRole('row', { name: '[choix 3](. "1 2 3 soleil")' }).locator('#jfkzltkm').click();
  await page
    .getByRole('row', { name: '[choix 3](. "1 2 3 soleil")' })
    .locator('#jfkzltkm')
    .fill('13');
  await page.getByRole('row', { name: 'choix 4' }).locator('#jfkzltkm').click();
  await page.getByRole('row', { name: 'choix 4' }).locator('#jfkzltkm').fill('14');
  await page.getByRole('row', { name: 'choix 5' }).locator('#jfkzltkm').click();
  await page.getByRole('row', { name: 'choix 5' }).locator('#jfkzltkm').fill('15');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByLabel('➡ 18. Tableau un axe simple, plusieurs mesures, sans unité').click();
  await page.getByLabel('➡ 18. Tableau un axe simple, plusieurs mesures, sans unité').fill('1');
  await page
    .getByRole('row', {
      name: 'choix 1 ➡ 18. Tableau un axe simple, plusieurs mesures, sans unité',
    })
    .getByRole('radio', { name: 'Oui' })
    .click();
  await page
    .getByRole('row', { name: 'choix 2' })
    .locator('div')
    .filter({ hasText: 'Oui' })
    .nth(3)
    .click();
  await page
    .getByRole('row', { name: 'choix 2' })
    .locator('div')
    .filter({ hasText: 'Oui' })
    .nth(3)
    .click();
  await page
    .getByRole('row', { name: 'choix 4' })
    .locator('div')
    .filter({ hasText: 'Oui' })
    .nth(3)
    .click();
  await page
    .getByRole('row', { name: 'choix 5' })
    .locator('div')
    .filter({ hasText: 'Non' })
    .nth(3)
    .click();
  await page.getByRole('row', { name: 'choix 2' }).getByRole('spinbutton').click();
  await page.getByRole('row', { name: 'choix 2' }).getByRole('spinbutton').click();
  await page.getByRole('row', { name: 'choix 2' }).getByRole('spinbutton').fill('2');
  await page
    .getByRole('row', { name: '[choix 3](. "1 2 3 soleil")' })
    .getByRole('spinbutton')
    .click();
  await page
    .getByRole('row', { name: '[choix 3](. "1 2 3 soleil")' })
    .getByRole('spinbutton')
    .fill('33');
  await page.getByRole('row', { name: 'choix 4' }).getByRole('spinbutton').click();
  await page.getByRole('row', { name: 'choix 4' }).getByRole('spinbutton').fill('44');
  await page.getByRole('row', { name: 'choix 5' }).getByRole('spinbutton').click();
  await page.getByRole('row', { name: 'choix 5' }).getByRole('spinbutton').fill('5');
  await page
    .getByRole('row', {
      name: 'choix 1 ➡ 18. Tableau un axe simple, plusieurs mesures, sans unité',
    })
    .getByRole('textbox')
    .click();
  await page
    .getByRole('row', {
      name: 'choix 1 ➡ 18. Tableau un axe simple, plusieurs mesures, sans unité',
    })
    .getByRole('textbox')
    .fill('fff');
  await page.getByRole('row', { name: 'choix 2' }).getByRole('textbox').click();
  await page.getByRole('row', { name: 'choix 2' }).getByRole('textbox').fill('az');
  await page.getByRole('row', { name: '[choix 3](. "1 2 3 soleil")' }).getByRole('textbox').click();
  await page
    .getByRole('row', { name: '[choix 3](. "1 2 3 soleil")' })
    .getByRole('textbox')
    .fill('fsger');
  await page.getByRole('row', { name: 'choix 4' }).getByRole('textbox').click();
  await page.getByRole('row', { name: 'choix 4' }).getByRole('textbox').fill('ergergre');
  await page.getByRole('row', { name: 'choix 4' }).getByRole('textbox').click();
  await page.getByRole('row', { name: 'choix 5' }).getByRole('textbox').click();
  await page.getByRole('row', { name: 'choix 5' }).getByRole('textbox').fill('gergregre');
  await page
    .getByRole('row', { name: '[choix 3](. "1 2 3 soleil")' })
    .locator('div')
    .filter({ hasText: 'Oui' })
    .nth(3)
    .click();
  await page
    .getByRole('row', { name: 'choix 2' })
    .locator('div')
    .filter({ hasText: 'Oui' })
    .nth(3)
    .click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByLabel('➡ 19. Tableau 2 axes - 1 mesure de type numérique, sans unité').click();
  await page.getByLabel('➡ 19. Tableau 2 axes - 1 mesure de type numérique, sans unité').fill('');
  await page.getByLabel('➡ 19. Tableau 2 axes - 1 mesure de type numérique, sans unité').click();
  await page.getByLabel('➡ 19. Tableau 2 axes - 1 mesure de type numérique, sans unité').fill('1');
  await page.locator('#lunatic-table-td-jfkzttm3-1-1 #jfkzttm3').click();
  await page.locator('#lunatic-table-td-jfkzttm3-1-1 #jfkzttm3').click();
  await page.locator('#lunatic-table-td-jfkzttm3-1-1 #jfkzttm3').fill('22');
  await page.locator('#lunatic-table-td-jfkzttm3-2-1 #jfkzttm3').click();
  await page.locator('#lunatic-table-td-jfkzttm3-2-1 #jfkzttm3').fill('33');
  await page.locator('#lunatic-table-td-jfkzttm3-3-1 #jfkzttm3').click();
  await page.locator('#lunatic-table-td-jfkzttm3-3-1 #jfkzttm3').fill('44');
  await page.locator('#lunatic-table-td-jfkzttm3-4-1 #jfkzttm3').click();
  await page.locator('#lunatic-table-td-jfkzttm3-4-1 #jfkzttm3').fill('55');
  await page.locator('#lunatic-table-td-jfkzttm3-5-1 #jfkzttm3').click();
  await page.locator('#lunatic-table-td-jfkzttm3-5-1 #jfkzttm3').fill('66');
  await page.locator('#lunatic-table-td-jfkzttm3-6-1 #jfkzttm3').click();
  await page.locator('#lunatic-table-td-jfkzttm3-6-1 #jfkzttm3').fill('77');
  await page.locator('#lunatic-table-td-jfkzttm3-7-1 #jfkzttm3').click();
  await page.locator('#lunatic-table-td-jfkzttm3-7-1 #jfkzttm3').fill('88');
  await page.locator('#lunatic-table-td-jfkzttm3-0-2 #jfkzttm3').click();
  await page.locator('#lunatic-table-td-jfkzttm3-0-2 #jfkzttm3').fill('1');
  await page.locator('#lunatic-table-td-jfkzttm3-0-2 #jfkzttm3').click();
  await page.locator('#lunatic-table-td-jfkzttm3-0-2 #jfkzttm3').fill('12');
  await page.locator('#lunatic-table-td-jfkzttm3-2-2 #jfkzttm3').click();
  await page.locator('#lunatic-table-td-jfkzttm3-1-2 #jfkzttm3').click();
  await page.locator('#lunatic-table-td-jfkzttm3-0-2 #jfkzttm3').click();
  await page.locator('#lunatic-table-td-jfkzttm3-0-2 #jfkzttm3').fill('122');
  await page.locator('#lunatic-table-td-jfkzttm3-1-2 #jfkzttm3').click();
  await page.locator('#lunatic-table-td-jfkzttm3-1-2 #jfkzttm3').fill('133');
  await page.locator('#lunatic-table-td-jfkzttm3-2-2 #jfkzttm3').fill('1');
  await page.locator('#lunatic-table-td-jfkzttm3-2-2 #jfkzttm3').click();
  await page.locator('#lunatic-table-td-jfkzttm3-2-2 #jfkzttm3').fill('144');
  await page.locator('#lunatic-table-td-jfkzttm3-3-2 #jfkzttm3').click();
  await page.locator('#lunatic-table-td-jfkzttm3-3-2 #jfkzttm3').fill('155');
  await page.locator('#lunatic-table-td-jfkzttm3-4-2 #jfkzttm3').click();
  await page.locator('#lunatic-table-td-jfkzttm3-4-2 #jfkzttm3').fill('156');
  await page.locator('#lunatic-table-td-jfkzttm3-5-2 #jfkzttm3').click();
  await page.locator('#lunatic-table-td-jfkzttm3-5-2 #jfkzttm3').fill('157');
  await page.locator('#lunatic-table-td-jfkzttm3-6-2 #jfkzttm3').click();
  await page.locator('#lunatic-table-td-jfkzttm3-6-2 #jfkzttm3').fill('158');
  await page.locator('#lunatic-table-td-jfkzttm3-7-2 #jfkzttm3').click();
  await page.locator('#lunatic-table-td-jfkzttm3-7-2 #jfkzttm3').fill('159');
  await page.locator('#lunatic-table-td-jfkzttm3-0-3 #jfkzttm3').click();
  await page.locator('#lunatic-table-td-jfkzttm3-0-3 #jfkzttm3').fill('123');
  await page.locator('#lunatic-table-td-jfkzttm3-1-3 #jfkzttm3').click();
  await page.locator('#lunatic-table-td-jfkzttm3-1-3 #jfkzttm3').fill('456');
  await page.locator('#lunatic-table-td-jfkzttm3-2-3').click();
  await page.locator('#lunatic-table-td-jfkzttm3-2-3 #jfkzttm3').fill('789');
  await page.locator('#lunatic-table-td-jfkzttm3-3-3 #jfkzttm3').click();
  await page.locator('#lunatic-table-td-jfkzttm3-3-3 #jfkzttm3').fill('912');
  await page.locator('#lunatic-table-td-jfkzttm3-4-3 #jfkzttm3').click();
  await page.locator('#lunatic-table-td-jfkzttm3-4-3 #jfkzttm3').fill('345');
  await page.locator('#lunatic-table-td-jfkzttm3-5-3 #jfkzttm3').click();
  await page.locator('#lunatic-table-td-jfkzttm3-5-3 #jfkzttm3').fill('678');
  await page.locator('#lunatic-table-td-jfkzttm3-6-3 #jfkzttm3').click();
  await page.locator('#lunatic-table-td-jfkzttm3-6-3 #jfkzttm3').fill('812');
  await page.locator('#lunatic-table-td-jfkzttm3-6-3 #jfkzttm3').click();
  await page.locator('#lunatic-table-td-jfkzttm3-6-3 #jfkzttm3').press('PageUp');
  await page.locator('#lunatic-table-td-jfkzttm3-6-3 #jfkzttm3').press('PageUp');
  await page.locator('#lunatic-table-td-jfkzttm3-6-3 #jfkzttm3').click();
  await page.locator('#lunatic-table-td-jfkzttm3-6-3 #jfkzttm3').press('Home');
  await page.locator('#lunatic-table-td-jfkzttm3-6-3 #jfkzttm3').press('Home');
  await page.locator('#lunatic-table-td-jfkzttm3-6-3 #jfkzttm3').click();
  await page.locator('#lunatic-table-td-jfkzttm3-6-3 #jfkzttm3').fill('891');
  await page.locator('#lunatic-table-td-jfkzttm3-7-3 #jfkzttm3').click();
  await page.locator('#lunatic-table-td-jfkzttm3-7-3 #jfkzttm3').fill('234');
  await page.locator('#lunatic-table-td-jfkzttm3-0-4 #jfkzttm3').click();
  await page.locator('#lunatic-table-td-jfkzttm3-0-4 #jfkzttm3').fill('4');
  await page.locator('#lunatic-table-td-jfkzttm3-1-4 #jfkzttm3').click();
  await page.locator('#lunatic-table-td-jfkzttm3-1-4 #jfkzttm3').fill('44');
  await page.locator('#lunatic-table-td-jfkzttm3-1-4 #jfkzttm3').click();
  await page.locator('#lunatic-table-td-jfkzttm3-2-4 #jfkzttm3').click();
  await page.locator('#lunatic-table-td-jfkzttm3-2-4 #jfkzttm3').fill('444');
  await page.locator('#lunatic-table-td-jfkzttm3-3-4 #jfkzttm3').click();
  await page.locator('#lunatic-table-td-jfkzttm3-3-4 #jfkzttm3').fill('4444');
  await page.locator('#lunatic-table-td-jfkzttm3-4-4').click();
  await page.locator('#lunatic-table-td-jfkzttm3-4-4 #jfkzttm3').fill('44444');
  await page.locator('#lunatic-table-td-jfkzttm3-5-4 #jfkzttm3').click();
  await page.locator('#lunatic-table-td-jfkzttm3-5-4 #jfkzttm3').fill('444444');
  await page.locator('#lunatic-table-td-jfkzttm3-6-4 #jfkzttm3').click();
  await page.locator('#lunatic-table-td-jfkzttm3-6-4 #jfkzttm3').fill('4444444');
  await page.locator('#lunatic-table-td-jfkzttm3-7-4 #jfkzttm3').click();
  await page.locator('#lunatic-table-td-jfkzttm3-7-4 #jfkzttm3').fill('44444444');
  await page.locator('#lunatic-table-td-jfkzttm3-0-5 #jfkzttm3').click();
  await page.locator('#lunatic-table-td-jfkzttm3-0-5 #jfkzttm3').fill('1');
  await page.locator('#lunatic-table-td-jfkzttm3-1-5 #jfkzttm3').click();
  await page.locator('#lunatic-table-td-jfkzttm3-1-5 #jfkzttm3').fill('1');
  await page.locator('#lunatic-table-td-jfkzttm3-2-5 #jfkzttm3').click();
  await page.locator('#lunatic-table-td-jfkzttm3-2-5 #jfkzttm3').fill('1');
  await page.locator('#lunatic-table-td-jfkzttm3-3-5 #jfkzttm3').click();
  await page.locator('#lunatic-table-td-jfkzttm3-3-5 #jfkzttm3').fill('1');
  await page.locator('#lunatic-table-td-jfkzttm3-4-5 #jfkzttm3').click();
  await page.locator('#lunatic-table-td-jfkzttm3-4-5 #jfkzttm3').fill('1');
  await page.locator('#lunatic-table-td-jfkzttm3-5-5 #jfkzttm3').click();
  await page.locator('#lunatic-table-td-jfkzttm3-5-5 #jfkzttm3').fill('1');
  await page.locator('#lunatic-table-td-jfkzttm3-6-5 #jfkzttm3').click();
  await page.locator('#lunatic-table-td-jfkzttm3-6-5 #jfkzttm3').fill('1');
  await page.locator('#lunatic-table-td-jfkzttm3-7-5 #jfkzttm3').click();
  await page.locator('#lunatic-table-td-jfkzttm3-7-5 #jfkzttm3').fill('1');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByLabel('➡ 20. Tableau 1 axe avec hiérarchie , 1 mesure, avec unité').click();
  await page.getByLabel('➡ 20. Tableau 1 axe avec hiérarchie , 1 mesure, avec unité').fill('11');
  await page.getByRole('row', { name: 'code 1 2 k€' }).locator('#jfkzrwce').click();
  await page.getByRole('row', { name: 'code 1 2 k€' }).locator('#jfkzrwce').fill('12');
  await page.getByRole('row', { name: 'code2 code 2 1 k€' }).locator('#jfkzrwce').click();
  await page.getByRole('row', { name: 'code2 code 2 1 k€' }).locator('#jfkzrwce').fill('21');
  await page.getByRole('row', { name: 'code 2 2 k€' }).locator('#jfkzrwce').click();
  await page.getByRole('row', { name: 'code 2 2 k€' }).locator('#jfkzrwce').fill('22');
  await page.getByRole('row', { name: 'code 2 3 k€' }).locator('#jfkzrwce').click();
  await page.getByRole('row', { name: 'code 2 3 k€' }).locator('#jfkzrwce').fill('23');
  await page.getByRole('row', { name: 'code 3 k€' }).locator('#jfkzrwce').click();
  await page.getByRole('row', { name: 'code 3 k€' }).locator('#jfkzrwce').fill('30');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page
    .getByLabel('➡ 21. Tableau dynamique jusque 5 lignes, 2 mesures dont une unité A CREER')
    .click();
  await page
    .getByLabel('➡ 21. Tableau dynamique jusque 5 lignes, 2 mesures dont une unité A CREER')
    .fill('444');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByLabel('➡ 22. Quel est votre prénom ? Controle sur prénom vide').click();
  await page.getByLabel('➡ 22. Quel est votre prénom ? Controle sur prénom vide').fill('mehdi');
  await page
    .getByLabel('➡ 22. Quel est votre prénom ? Controle sur prénom vide')
    .press('Control+a');
  await page.getByLabel('➡ 22. Quel est votre prénom ? Controle sur prénom vide').fill('annie');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByLabel('➡ 23. Quelle est votre adresse email ?').click();
  await page.getByLabel('➡ 23. Quelle est votre adresse email ?').fill('annie@insee.fr');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('radio', { name: '1 Oui' }).click();
  await page
    .getByLabel(
      '➡ 25. annie, quelle est votre date de naissance ?Format année : AAAAControle sur age et fait d’être majeurAGE calculé : null'
    )
    .fill('2000-12-05');
  await page.locator('.makeStyles-mainTile-31').click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('radio', { name: '2 Femme' }).click();
  await page
    .getByLabel(
      '➡ 27. Question masquée par défaut, qui s’affiche lorsque l’individu coche majeurSi a coché Homme, la question 33 disparaitra'
    )
    .click();
  await page
    .getByLabel(
      '➡ 27. Question masquée par défaut, qui s’affiche lorsque l’individu coche majeurSi a coché Homme, la question 33 disparaitra'
    )
    .fill('majeur');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page
    .getByLabel('➡ 28. Question affichée par défaut, filtrée si l’individu est un homme')
    .click();
  await page
    .getByLabel('➡ 28. Question affichée par défaut, filtrée si l’individu est un homme')
    .fill('femme');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page
    .getByLabel('➡ 29. Combien de personnes vivent dans votre logement, y compris vous ?')
    .fill('2');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page
    .getByLabel('➡ 30. Combien avez vous d’enfants à charge ?Controle sur nb enfantsNb adultes : 2')
    .click();
  await page
    .getByLabel('➡ 30. Combien avez vous d’enfants à charge ?Controle sur nb enfantsNb adultes : 2')
    .fill('0');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByLabel('➡ 31. Nom').first().fill('annie');
  await page.getByLabel('➡ 32. Age entre 0 et 100').first().fill('23');
  await page.getByLabel('➡ 31. Nom').nth(1).click();
  await page.getByLabel('➡ 31. Nom').nth(1).fill('singed');
  await page.getByLabel('➡ 32. Age entre 0 et 100').nth(1).fill('36');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page
    .getByLabel(
      '➡ 33. annie, quelle est votre taille en centimètres ?Controle sur taille - si taille < 80'
    )
    .click();
  await page
    .getByLabel(
      '➡ 33. annie, quelle est votre taille en centimètres ?Controle sur taille - si taille < 80'
    )
    .fill('153');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page
    .getByLabel(
      '➡ 33. singed, quelle est votre taille en centimètres ?Controle sur taille - si taille < 80'
    )
    .click();
  await page
    .getByLabel(
      '➡ 33. singed, quelle est votre taille en centimètres ?Controle sur taille - si taille < 80'
    )
    .fill('186');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
});
