# Subir a Roça Assombrada na Steam

1. Crie a conta em https://partner.steamgames.com (Steamworks), preencha os dados fiscais e bancários e pague a taxa do app (Steam Direct, US$ 100 por jogo).
2. No painel, crie o app. A Steam dá um **AppID** e você cria dois **depots** (um Windows e um Linux).
3. Troque `COLOQUE_O_APPID_AQUI` e `COLOQUE_O_DEPOT_..._AQUI` nos arquivos `.vdf` desta pasta.
4. Baixe do GitHub Actions os artefatos **RocaAssombrada-PC-Windows** e **RocaAssombrada-PC-Linux**, descompacte cada um numa pasta com esse mesmo nome, aqui ao lado dos `.vdf`.
5. Baixe o SteamCMD (vem no Steamworks SDK) e rode:
   `steamcmd +login SEU_USUARIO +run_app_build app_build.vdf +quit`
6. Em **Installation > General**, configure as opções de inicialização:
   - Windows: executável `RocaAssombrada.exe`
   - Linux: executável `RocaAssombrada`
7. As imagens da página da loja estão na pasta `../arte` (header, small, main, vertical, library, hero e logo).
