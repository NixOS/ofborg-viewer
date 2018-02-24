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
yarn2nix.mkYarnPackage {
  name = "ofborg-viewer-web";
  src = ./.;
  packageJson = ./package.json;
  yarnLock = ./yarn.lock;
  yarnNix = ./yarn.nix;

  preConfigure = ''
    ${pkgs.gitMinimal}/bin/git rev-parse HEAD > .git-revision
  '';

  postInstall = ''
    export NODE_ENV=production
    rm -rf website
    yarn run preinstall
    mv website/ $out/website
  '';
}
