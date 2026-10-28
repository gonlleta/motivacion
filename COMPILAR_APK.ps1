$ErrorActionPreference = "Stop"
$ProjectDir = $PSScriptRoot
$ToolsDir = Join-Path $ProjectDir ".android-fast-builder"
$BuildWorkDir = Join-Path $ToolsDir "work"
New-Item -ItemType Directory -Force -Path $BuildWorkDir | Out-Null

$Aapt2Exe = Join-Path $ToolsDir "aapt2-bin\aapt2.exe"
$AndroidJar = Join-Path $ToolsDir "android.jar"
$EcjJar = Join-Path $ToolsDir "ecj.jar"
$DxJar = Join-Path $ToolsDir "dx.jar"
$UberSignerJar = Join-Path $ToolsDir "uber-apk-signer.jar"

$MainDir = Join-Path $ProjectDir "android\app\src\main"
$ResZip = Join-Path $BuildWorkDir "compiled_res.zip"
$GenJavaDir = Join-Path $BuildWorkDir "gen"
$UnsignedApk = Join-Path $BuildWorkDir "unsigned.apk"
New-Item -ItemType Directory -Force -Path $GenJavaDir | Out-Null

Write-Host "[1/4] Copiando aplicacion actualizada en assets..." -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path "$MainDir\assets" | Out-Null
Copy-Item (Join-Path $ProjectDir "app-standalone.html") "$MainDir\assets\index.html" -Force

Write-Host "[2/4] Compilando recursos y Widget con AAPT2..." -ForegroundColor Cyan
if (Test-Path $ResZip) { Remove-Item $ResZip -Force }
if (Test-Path $UnsignedApk) { Remove-Item $UnsignedApk -Force }

& $Aapt2Exe compile --dir "$MainDir\res" -o $ResZip
& $Aapt2Exe link -o $UnsignedApk `
    -I $AndroidJar `
    --manifest "$MainDir\AndroidManifest.xml" `
    -A "$MainDir\assets" `
    --java $GenJavaDir `
    --min-sdk-version 24 `
    --target-sdk-version 28 `
    $ResZip

Write-Host "[3/4] Compilando codigo Java (MainActivity + ImpulsoWidgetProvider) a DEX..." -ForegroundColor Cyan
$ClassesDir = Join-Path $BuildWorkDir "classes"
if (Test-Path $ClassesDir) { Remove-Item $ClassesDir -Recurse -Force }
New-Item -ItemType Directory -Force -Path $ClassesDir | Out-Null

$JavaFiles = @(
    "$GenJavaDir\com\impulso\motivacion\R.java",
    "$MainDir\java\com\impulso\motivacion\MainActivity.java",
    "$MainDir\java\com\impulso\motivacion\ImpulsoWidgetProvider.java"
)

java -jar $EcjJar -1.6 -source 1.6 -target 1.6 -bootclasspath $AndroidJar -d $ClassesDir $JavaFiles

$DexFile = Join-Path $BuildWorkDir "classes.dex"
if (Test-Path $DexFile) { Remove-Item $DexFile -Force }
java -cp $DxJar com.android.dx.command.Main --dex --output=$DexFile $ClassesDir

# Insertar classes.dex en el APK
Add-Type -AssemblyName System.IO.Compression.FileSystem
$Zip = [System.IO.Compression.ZipFile]::Open($UnsignedApk, 'Update')
$ExistingDex = $Zip.Entries | Where-Object { $_.FullName -eq "classes.dex" }
if ($ExistingDex) { $ExistingDex.Delete() }
[System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($Zip, $DexFile, "classes.dex") | Out-Null
$Zip.Dispose()

Write-Host "[4/4] Alineando y firmando Impulso-Motivacion.apk (Esquemas V1 + V2 + V3)..." -ForegroundColor Cyan
java -jar $UberSignerJar -a $UnsignedApk --out $BuildWorkDir

$SignedApk = Join-Path $BuildWorkDir "unsigned-aligned-debugSigned.apk"
$FinalApk = Join-Path $ProjectDir "Impulso-Motivacion.apk"
$PublicApk = Join-Path $ProjectDir "public\Impulso-Motivacion.apk"

Copy-Item $SignedApk $FinalApk -Force
Copy-Item $SignedApk $PublicApk -Force

Write-Host "=====================================================" -ForegroundColor Green
Write-Host " ¡APK COMPILADO Y FIRMADO CON EXITO! " -ForegroundColor Green
Write-Host " Archivo: $FinalApk" -ForegroundColor Yellow
Write-Host " Descarga Wi-Fi directa: http://192.168.0.48:5173/Impulso-Motivacion.apk" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Green
