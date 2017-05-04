#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
pushd $DIR
projectDir=$DIR/..
echo "projectDir is $projectDir"

cd $projectDir
echo "calling npm shrinkwrap --dev..."
npm shrinkwrap --dev

echo "generating oscg-cart-overrides..."
node $DIR/generateOsscgCartOverrides.js $projectDir/package.json > $projectDir/osscg-cart-overrides.json
cd $DIR

if [ -d  $DIR/ospo-witness-clients]; then
    echo "cloning ospo-witness-clients repo..."
    git clone https://github.com/Microsoft/ospo-witness-clients.git
else
    echo "echo ospo-witness-clients repo already exists.  Not cloning."
fi

cd ospo-witness-clients/npm
call npm install
echo "running ospo-witness-clients command..."
node index.js register -i $projectDir -o ./ospo.out --url https://witness.azurewebsites.net/ -t Iwfr7h4amgd2rdk2755iqjykm2ovcqm5h2an5ohopa7ak5fmla3q
popd
