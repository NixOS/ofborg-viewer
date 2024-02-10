{
  description = "ofborg-viewer is a web interface that aggregates the currently in-progress build logs made by ofborg.";

  outputs = { self, nixpkgs }: {
    packages.x86_64-linux.default = nixpkgs.legacyPackages.x86_64-linux.callPackage ./default.nix { };
  };
}
