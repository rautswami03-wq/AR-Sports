@echo off
:: Self-elevation to Administrator
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
if '%errorlevel%' NEQ '0' (
    echo Requesting Administrative Privileges...
    goto UACPrompt
) else ( goto gotAdmin )

:UACPrompt
    echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
    echo UAC.ShellExecute "%~s0", "", "", "runas", 1 >> "%temp%\getadmin.vbs"
    "%temp%\getadmin.vbs"
    exit /B

:gotAdmin
    if exist "%temp%\getadmin.vbs" ( del "%temp%\getadmin.vbs" )
    pushd "%CD%"
    CD /D "%~dp0"

title Wi-Fi & Network Performance Optimizer
color 0b

echo ================================================================
echo             QUALCOMM QCA9377 WI-FI OPTIMIZER
echo ================================================================
echo.

echo [1/6] Locking Wi-Fi to 5 GHz High-Speed Band...
powershell -NoProfile -Command "Set-NetAdapterAdvancedProperty -Name 'Wi-Fi' -DisplayName 'Preferred Band' -DisplayValue '3 - Prefer 5GHz band' -ErrorAction SilentlyContinue"

echo [2/6] Eliminating Wi-Fi Ping Spikes (Setting Roaming Aggressiveness to Lowest)...
powershell -NoProfile -Command "Set-NetAdapterAdvancedProperty -Name 'Wi-Fi' -DisplayName 'Roaming aggressiveness' -DisplayValue '1.Lowest' -ErrorAction SilentlyContinue"

echo [3/6] Setting Ultra-Fast Cloudflare DNS (1.1.1.1 / 1.0.0.1)...
powershell -NoProfile -Command "Set-DnsClientServerAddress -InterfaceAlias 'Wi-Fi' -ServerAddresses @('1.1.1.1','1.0.0.1','8.8.8.8') -ErrorAction SilentlyContinue"

echo [4/6] Tuning Windows TCP Stack for Gaming & Streaming...
netsh int tcp set global autotuninglevel=normal >nul 2>&1
netsh int tcp set global ecncapability=enabled >nul 2>&1
netsh int tcp set supplemental template=internet congestionprovider=cubic >nul 2>&1

echo [5/6] Disabling Wi-Fi Power Savings (Stops adapter sleep drops)...
powershell -NoProfile -Command "Get-CimInstance Win32_NetworkAdapter -Filter \"NetConnectionID='Wi-Fi'\" | ForEach-Object { $pnp = Get-CimInstance MSPower_DeviceEnable -Namespace root\wmi -Filter \"InstanceName='$($_.PNPDeviceID)_0'\"; if ($pnp) { $pnp.Enable = $false; Set-CimInstance $pnp } }" >nul 2>&1

echo [6/6] Flushing DNS & Resetting ARP Cache...
ipconfig /flushdns >nul 2>&1
arp -d * >nul 2>&1

echo.
echo ================================================================
echo   SUCCESS: Wi-Fi Optimization Complete!
echo ================================================================
echo.
powershell -NoProfile -Command "Write-Host '--- CURRENT WI-FI CONFIGURATION ---' -ForegroundColor Yellow; Get-NetAdapterAdvancedProperty -Name 'Wi-Fi' | Select-Object DisplayName, DisplayValue; Get-DnsClientServerAddress -InterfaceAlias 'Wi-Fi' -AddressFamily IPv4 | Select-Object InterfaceAlias, ServerAddresses"
echo.
pause
