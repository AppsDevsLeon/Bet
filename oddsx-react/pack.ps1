param(
  [string]$Src  = "C:\Users\Sandra\themeforest-ow5bJzeM-oddsx-sports-betting-website-react-next-js-template\oddsx\oddsx-react",
  [string]$Dest = "C:\Users\Sandra\oddsx-react.zip"
)

$timestamp = Get-Date -Format 'yyyyMMdd_HHmmss'
$TempRoot  = Join-Path $env:TEMP "oddsx_pack_$timestamp"

$ExcludeDirs  = @('node_modules','.git','.next','dist','build','coverage','out','tmp','temp')
$ExcludeFiles = @('*.map','*.log','*.tmp','*.bak')

if (Test-Path $TempRoot) { Remove-Item $TempRoot -Recurse -Force }
New-Item -ItemType Directory -Path $TempRoot | Out-Null

$robocopyArgs = @($Src,$TempRoot,'/MIR','/R:0','/W:0','/NFL','/NDL','/NJH','/NJS','/NP','/XD') + $ExcludeDirs + @('/XF') + $ExcludeFiles
$rc = Start-Process -FilePath robocopy.exe -ArgumentList $robocopyArgs -NoNewWindow -PassThru -Wait
if ($rc.ExitCode -gt 7) { Write-Error "ROBOCOPY falló con código $($rc.ExitCode)"; exit 1 }

if (Test-Path $Dest) { Remove-Item $Dest -Force }
Compress-Archive -Path (Join-Path $TempRoot '*') -DestinationPath $Dest -Force

Write-Host "✅ ZIP creado: $Dest"
Remove-Item $TempRoot -Recurse -Force
