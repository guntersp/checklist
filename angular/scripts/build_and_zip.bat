@echo OFF

cmd /c ng build --configuration production "%1"
cmd /c node scripts/zip_project.js "%2"
