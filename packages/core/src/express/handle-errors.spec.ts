// std
import { strictEqual } from 'assert';

// 3p
import * as express from 'express';
import * as request from 'supertest';

// FoalTS
import { handleErrors } from './handle-errors';

describe('handleErrors', () => {

  describe('should return an error-handling middleware which', () => {

    const default500page = '<html><head><title>INTERNAL SERVER ERROR</title></head><body>'
    + '<h1>500 - INTERNAL SERVER ERROR</h1></body></html>';

    it('should log the error stack with the given log function.', () => {
      let str = '';
      const logFn = (msg: string) => str = msg;
      const err = new Error();

      const middleware = handleErrors(false, logFn);

      const app = express();
      app.use((req, res, next) => { throw err; });
      app.use(middleware);
      return request(app)
        .get('/')
        .then(res => {
          strictEqual(str, err.stack);
        });
    });

    it('should send a response with a 500 status.', () => {
      const app = express();
      app.use((req, res, next) => { throw new Error(); });
      app.use(handleErrors(false, () => {}));
      return request(app)
        .get('/')
        .expect(500);
    });

    it('should send the default html 500 page with no stack if debug is false.', () => {
      const app = express();
      app.use((req, res, next) => { throw new Error(); });
      app.use(handleErrors(false, () => {}));

      return request(app)
        .get('/')
        .expect(500)
        .expect(default500page);
    });

    it('should send the debug html 500 page with a stack if debug is true.', () => {
      const err = new Error('This is an error');

      const app = express();
      app.use((req, res, next) => { throw err; });
      app.use(handleErrors(true, () => {}));

      return request(app)
        .get('/')
        .expect(500)
        .then(response => {
          strictEqual(response.text.includes('Error: This is an error'), true);
          strictEqual(response.text.includes('at Context.it'), true);
          strictEqual(
            response.text.includes(
              'You are seeing this error because you have settings.debug set to true in your configuration file.'
            ),
            true,
          );
        });
    });

  });

});
