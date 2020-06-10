[![Build Status](https://travis-ci.org/InseeFr/Queen.svg?branch=master)](https://travis-ci.org/InseeFr/Queen)

# Queen

Web application for the management of questionnaires powered by Lunatic (https://github.com/InseeFr/Lunatic)

A demo of this application can be found by the following [this link](https://queen.demo.dev.sspcloud.fr/queen/questionnaire/simpsons2020x00/survey-unit/11).

## Quick start :

You can choose your configuration in the configuration.json file.
There are three environments variables :

| Variable                  | Value                                                                           | Default                               |
| ------------------------- | ------------------------------------------------------------------------------- | ------------------------------------- |
| QUEEN_URL                 | Final URL of the Queen application                                              | http://localhost:5000                 |
| QUEEN_API_URL             | URL of the [back-office of Queen](https://github.com/InseeFr/Queen-Back-Office) | https://queen-bo.demo.dev.sspcloud.fr |
| QUEEN_AUTHENTICATION_MODE | The mode of authentication. Currently, Queen is supporting 'anonymous'          | anonymous                             |

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

- `docker run -p 80:80 -e QUEEN_URL=http://override.value.com -e QUEEN_API_URL=... -e QUEEN_AUTHENTICATION_MODE=... -t inseefr/queen`

### As Web Component (micro-frontend)

If Queen is deployed at `http://localhost:5000`, just add this line to your `index.html` to load Queen :

```html
<script src="http://localhost:5000/entry.js"></script>
```

And to use Queen, add the `queen-app` tag :

```html
<queen-app></queen-app>
```
