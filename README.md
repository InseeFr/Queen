# Queen

Web application for the management of questionnaires powered by Lunatic (https://github.com/InseeFr/Lunatic)

![Build](https://github.com/InseeFr/Queen/actions/workflows/release.yml/badge.svg)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=InseeFr_Queen&metric=coverage)](https://sonarcloud.io/dashboard?id=InseeFr_Queen)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=InseeFr_Queen&metric=alert_status)](https://sonarcloud.io/dashboard?id=InseeFr_Queen)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A demo of this application can be found by the following [this link](https://queen.dev.insee.io/queen/questionnaire/simpsons2020x00/survey-unit/11).

## Quick start :

You can choose your configuration in the configuration.json file.
There are three environments variables :

| Variable           | Value                                                                           | Default                       |
| ------------------ | ------------------------------------------------------------------------------- | ----------------------------- |
| QUEEN_URL          | Final URL of the Queen application                                              | http://localhost:5000         |
| QUEEN_API_URL      | URL of the [back-office of Queen](https://github.com/InseeFr/Queen-Back-Office) | https://queen-bo.dev.insee.io |
| authenticationType | The mode of authentication: 'NONE' or 'OIDC'                                    | NONE                          |

### With node :

For node : default values of the configuration are defined in [configuration.json](public/configuration.json) file.

- `yarn`
- `yarn start`
- Queen will be available to http://localhost:5000
  (Go to http://localhost:5000/queen/questionnaire/simpsons2020x00/survey-unit/11 to see a example)

### With docker :

- `docker run -p 5000:80 -t inseefr/queen`
- Queen will be available to http://localhost:5000
  (Go to http://localhost:5000/queen/questionnaire/simpsons2020x00/survey-unit/11 to see a example)

For docker : default values of the configuration are defined in [.env](.env) file.

To override environments variables you can do :

- `docker run -p 80:80 -e QUEEN_URL=http://override.value.com -e QUEEN_API_URL=... -e authenticationType=... -t inseefr/queen`

### As Web Component (micro-frontend)

If Queen is deployed at `http://localhost:5000`, just add this line to your `index.html` to load Queen :

```html
<script src="http://localhost:5000/entry.js"></script>
```

And to use Queen, add the `queen-app` tag :

```html
<queen-app></queen-app>
```

## Full documentation

The documentation can be found in the [docs](https://github.com/InseeFr/Queen/tree/master/docs) folder and browsed [online](https://inseefr.github.io/Queen).
