@echo OFF

set "INSTALL_TO=%3"

if "%INSTALL_TO%" == "" (
    cmd /c ng build --base-href ./ --prod "%1" 
) else (
    cmd /c scripts\build_and_zip.bat "%1" "%2"

    cmd /c del "%INSTALL_TO%"
    cmd /c copy "dist\%2.zip" "%INSTALL_TO%"
)


cmd /c npx -p typescript tsc -p "projects/%1/electron/tsconfig.json"
cmd /c npx electron-builder --config "projects/%1/electron/builder.json" build
cmd /c node scripts/zip_electron_project.js "%2"
