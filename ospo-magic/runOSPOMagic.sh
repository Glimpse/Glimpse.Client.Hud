#!/bin/bash

personalAccessToken=$1
echo personallAccessToken is $personalAccessToken

if [ -z "$personalAccessToken" ]; then
  echo "usage:  runOSPOMagic.sh <personal-access-token>"
  exit 1
fi

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

if [ ! -d  $DIR/ospo-witness-clients ]; then
    echo "cloning ospo-witness-clients repo..."
    git clone https://github.com/Microsoft/ospo-witness-clients.git
else
    echo "echo ospo-witness-clients repo already exists.  Not cloning."
fi

cd $DIR/ospo-witness-clients/npm
npm install
echo "running ospo-witness-clients command..."
node index.js register -i $projectDir -o ./ospo.out --url https://witness.azurewebsites.net/ -t $personalAccessToken
popd
