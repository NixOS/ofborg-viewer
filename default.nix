{ pkgs ? import <nixpkgs> {} }:
with pkgs;
stdenv.mkDerivation rec {
  name = "ofborg-logviewer-env";
  buildInputs = [
    nodejs-6_x
    yarn
  ];

  passthru = {
    # Allows use of a tarball URL.
    release = (import ./release.nix {inherit pkgs;});
  };
}
