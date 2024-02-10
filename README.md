# `ofborg-viewer`

An as-light-as-possible viewer for ofborg build logs.

## Development use

```console
 $ nix develop
 $ npm install
 $ npm run dev
```

## Building (production)

```console
 $ nix build .
```

## Peculiarities

This uses the DOM directly and no fancy virtual DOM thing; this anyway is an append-mostly type thing.

This uses as few libraries as possible (and sane). Modern JS with ES6
makes it possible to write lean code when targeting modern browsers.
