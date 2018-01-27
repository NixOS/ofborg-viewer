`ofborg-viewer`
===============

An as-light-as possible viewer for ofborg build logs.

Development use
---------------

```
 $ bin/webpack
```

Or with watcher:

```
 $ bin/webpack --watch
```

Building (production)
---------------------

```
 $ bin/webpack -p
```

Peculiarities
-------------

This uses the DOM directly and no fancy virtual dom thing, this anyway
is an append-mostly type thing.

This uses as few libraries as possible (and sane). Modern JS with ES6
makes it possible to write lean code when targetting modern browsers.
