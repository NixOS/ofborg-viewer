Work-in-progress
================

This is a work-in-progress logs watcher.

It can't do much right now.

The plan is to integrate it with web-stomp and listen to logs.

The goal is to make this as clean and dependency-free as possible.

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

This doesn't use libraries for the simple stuff.
