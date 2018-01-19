with import <nixpkgs> {};
stdenv.mkDerivation rec {
	name = "qidigo-env";
	# Makes those dependencies available in the environment.
	buildInputs = [
		nodejs-6_x           # Lock to 6.x
		yarn                 # Much better than npm
    ];
}
