@echo off
pushd %~dp0
set projectDir=%~dp0\..
echo projectDir is %projectDir%

cd %projectDir%
echo "calling npm shrinkwrap --dev..."
call npm shrinkwrap --dev

echo "generating oscg-cart-overrides..."
node %~dp0\generateOsscgCartOverrides.js %projectDir%\package.json > %projectDir%\osscg-cart-overrides.json
cd %~dp0/

if not exist %~dp0/ospo-witness-clients (
    echo "cloning ospo-witness-clients repo..."
    git clone https://github.com/Microsoft/ospo-witness-clients.git
) else (
    echo "echo ospo-witness-clients repo already exists.  Not cloning."
)    
cd ospo-witness-clients\npm
call npm install
echo "running ospo-witness-clients command..."
node index.js register -i %projectDir% -o .\ospo.out --url https://witness.azurewebsites.net/ -t Iwfr7h4amgd2rdk2755iqjykm2ovcqm5h2an5ohopa7ak5fmla3q
popd
goto :EOF
