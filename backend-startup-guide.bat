@echo off
setlocal enabledelayedexpansion

echo ========================================
echo    SPRING BOOT BACKEND STARTUP
echo ========================================
echo.

cd /d "d:\springboot+react\Kart-Project\kart-eCommerce"
echo Current directory: %CD%
echo.

echo Checking Java installation...
java -version
if %ERRORLEVEL% neq 0 (
    echo ERROR: Java is not installed or not in PATH
    pause
    exit /b 1
)
echo Java is available!
echo.

echo ========================================
echo OPTION 1: Manual IDE Startup (Recommended)
echo ========================================
echo Please follow these steps:
echo 1. Open IntelliJ IDEA or Eclipse
echo 2. Import Maven project from: %CD%
echo 3. Find the main application class (likely *Application.java)
echo 4. Right-click and select "Run"
echo 5. Backend will start on http://localhost:9090
echo.

echo ========================================
echo OPTION 2: Install Maven and Run
echo ========================================
echo If you have Maven installed globally, you can run:
echo mvn clean spring-boot:run
echo.

echo ========================================
echo OPTION 3: Direct JAR execution (if built)
echo ========================================
echo If the project is built, you can run:
echo java -jar target/*.jar
echo.

echo ========================================
echo Current Project Status:
echo ========================================
echo - Frontend is running on http://localhost:5174
echo - Backend needs to start on http://localhost:9090
echo - CORS is configured for both ports
echo.

echo Press any key to try Maven wrapper (might fail due to path issues)...
pause

echo Attempting Maven wrapper...
mvnw.cmd spring-boot:run

pause
