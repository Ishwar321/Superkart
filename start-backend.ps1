# PowerShell script to start Spring Boot backend
Write-Host "Starting Spring Boot Backend..." -ForegroundColor Green

# Set working directory
Set-Location "d:\springboot+react\Kart-Project\kart-eCommerce"

# Set environment variables to bypass path issues
$env:MAVEN_USER_HOME = "C:\temp\maven"
$env:M2_HOME = "C:\temp\maven"

# Try to start using Java directly if Maven wrapper fails
try {
    Write-Host "Attempting to start with Maven wrapper..." -ForegroundColor Yellow
    
    # Use cmd to run the wrapper to avoid PowerShell path issues
    cmd /c "mvnw.cmd spring-boot:run"
}
catch {
    Write-Host "Maven wrapper failed. Trying alternative method..." -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "Press any key to continue..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
