@echo off
setlocal
set "MAVEN_USER_HOME=C:\maven_home"
set "JAVA_HOME=%JAVA_HOME%"
cd /d "d:\springboot+react\Kart-Project\kart-eCommerce"
echo Starting Maven build...
call mvnw.cmd clean spring-boot:run
pause
