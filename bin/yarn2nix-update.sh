#!/usr/bin/env nix-shell
#!nix-shell -p bash -p git -p nix-prefetch-git -i bash

set -eux
set -o pipefail

nix-prefetch-git https://github.com/moretea/yarn2nix.git > yarn2nix.json

rm -rf scratch
mkdir scratch

(
    cd scratch

    git clone git@github.com:moretea/yarn2nix.git

    (
        cd yarn2nix
        nix-build . -A yarn2nix
    )
)

./scratch/yarn2nix/result/bin/yarn2nix > yarn.nix
rm -rf scratch
