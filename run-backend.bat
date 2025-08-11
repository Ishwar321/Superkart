@echo off
setlocal
set "MAVEN_USER_HOME=C:\temp\maven"
set "USER=tempuser"
set "USERPROFILE=C:\temp"
cd /d "d:\springboot+react\Kart-Project\kart-eCommerce"

REM Set JAVA_HOME to Java 21
set "JAVA_HOME=C:\Program Files\Java\jdk-21"
set PATH=%JAVA_HOME%\bin;%PATH%

echo Using JAVA_HOME: %JAVA_HOME%
java -version
echo Starting Spring Boot application...
echo Using temporary user profile to bypass path issues...
call mvnw.cmd spring-boot:run
pause
