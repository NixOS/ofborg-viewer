{ buildNpmPackage, nodejs_20, gitMinimal }:
buildNpmPackage {
  version = (builtins.fromJSON (builtins.readFile ./package.json)).version;
  pname = "ofborg-viewer";

  buildInputs = [
    nodejs_20
  ];

  src = ./.;
  npmDepsHash = "sha256-0Pp1/7tIpzlSan8vTBo5tKcFJTNxiyDPTNFfbFh6OCc=";

  # When building from git repo, add the revision to the source.
  # The build process will use it.
  preConfigure = ''
    if [ -d .git ]; then
      ${gitMinimal}/bin/git rev-parse HEAD > .git-revision
    fi
  '';

  installPhase = ''
    mkdir $out
    npm run build
    cp -rT dist $out
  '';
}
