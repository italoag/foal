# CSRF protection

FoalTS includes a CSRF protection. It is enabled by default and makes your app require a csrf token on POST, PUT, PATCH and DELETE requests.

## Retreive the csrf token

You can get the csrf token by calling the `csrfToken` method of the context `request`. It is then easy to send the token to the client upon page rendering.

```typescript
import { Get, render } from '@foal/core';

export class ViewController {
  @Get('/')
  index(ctx) {
    return render('./templates/index.html', {
      csrfToken: ctx.request.csrfToken()
    }, __dirname);
  }
}
```

```html
<html>
  <head></head>
  <body>
    <form action="POST">
      <input style="display: none" name="_csrf" value="<%= csrfToken %>">
      <input name="foobar">
      <button type="submit">Submit</button>
    </form>
  </body>
</html>
```

## Send the csrf token

You have several ways to specify the csrf token when making a request:
- in the body with the name `_csrf`,
- in the query with the name `_csrf`,
- or in one of these headers: `CSRF-Token`, `XSRF-Token`, `X-CSRF-Token` or `X-XSRF-Token`.

If the token is incorrect or is not provided then the server responds with a 403 status and the message `Bad csrf token`.

## Enable or disable the csrf protection

You can enable / disable the protection by setting the property `settings.csrf` to true / false in `config/default.json`. You can also use the environment variable `SETTINGS_CSRF`.

When the CSRF protection is disabled, `ctx.request.csrfToken` returns the string `"CSRF protection disabled."`.
