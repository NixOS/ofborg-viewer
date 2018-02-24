{ pkgs ? import <nixpkgs> {} }:
let
  yarn2nix = import (pkgs.fetchFromGitHub (let
    revs = builtins.fromJSON (builtins.readFile ./yarn2nix.json);
  in {
    owner = "moretea";
    repo = "yarn2nix";

    inherit (revs) rev sha256;
  })) { inherit pkgs; };
in
yarn2nix.mkYarnPackage rec {
  version = (builtins.fromJSON (builtins.readFile ./package.json)).version;
  name = "ofborg-viewer-web-${version}";
  src = ./.;
  packageJson = ./package.json;
  yarnLock = ./yarn.lock;
  yarnNix = ./yarn.nix;

  # When building from git repo, add the revision to the source.
  # The build process will use it.
  preConfigure = ''
    if [ -d .git ]; then
      ${pkgs.gitMinimal}/bin/git rev-parse HEAD > .git-revision
    fi
  '';

  postInstall = ''
    export NODE_ENV=production
    rm -rf website
    yarn run preinstall
    mv website/ $out/website
  '';
}
