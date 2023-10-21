@echo OFF


cmd /c npx -p typescript tsc -p "projects/%1/electron/tsconfig.json"