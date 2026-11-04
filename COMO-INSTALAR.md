# Última Escolha · como gerar e instalar no Android

O projeto já está pronto. Só falta compilar o APK (o arquivo de instalação do Android).
Escolha um dos dois caminhos.

---

## Caminho A · Pelo GitHub (não precisa instalar nada no PC)

1. Crie uma conta grátis em **github.com** (se ainda não tiver).
2. Clique em **New repository**, dê o nome `ponto-de-virada` e clique em **Create repository**.
3. Na página do repositório, clique em **uploading an existing file**.
4. Descompacte o zip no PC, abra a pasta `PontoDeVirada` e arraste **tudo que está dentro dela**
   (as pastas `app`, `gradle`, `.github` e os arquivos `build.gradle`, `settings.gradle` etc.)
   para a página. Clique em **Commit changes**.
   - A pasta `.github` fica oculta no Windows. No Explorador de Arquivos, ative
     **Exibir > Itens ocultos** antes de arrastar.
5. Abra a aba **Actions**. O processo **Gerar APK** começa sozinho e leva uns 4 minutos.
   - Se aparecer um botão pedindo para ativar os workflows, clique nele.
   - Se a pasta `.github` não subiu: em **Actions**, clique em **set up a workflow yourself**,
     cole o conteúdo do arquivo `.github/workflows/gerar-apk.yml` e salve.
6. Quando ficar verde, clique na execução e, em **Artifacts**, baixe **UltimaEscolha-APK**.
   Dentro do zip está o `app-debug.apk`.

## Caminho B · Pelo Android Studio no PC

1. Instale o **Android Studio**: developer.android.com/studio
2. **File > Open** e escolha a pasta `PontoDeVirada`. Espere o Gradle terminar de sincronizar
   (na primeira vez ele baixa bastante coisa).
3. **Build > Build App Bundle(s) / APK(s) > Build APK(s)**. Quando terminar, clique em **locate**:
   o arquivo fica em `app/build/outputs/apk/debug/app-debug.apk`.
   - Ou ative a **Depuração USB** no celular, conecte no cabo e clique em ▶ **Run**:
     o jogo instala e abre direto.

---

## Instalar no celular

1. Passe o `app-debug.apk` para o celular (cabo USB, Google Drive ou mande para você mesmo no WhatsApp).
2. Toque no arquivo. O Android vai pedir para **permitir instalar apps desta fonte**: permita.
3. Se o Play Protect avisar que o app é desconhecido, toque em **Instalar mesmo assim**.
   Isso acontece com qualquer app que não veio da Play Store.

## O que o app tem

- Tela cheia, sem barras do sistema (deslize da borda para mostrar).
- Funciona **sem internet**: fontes, sons e animações estão dentro do app.
- **Botão voltar** do celular abre o menu de fases. No menu, fecha o app.
- **Vibração** nas batidas, impactos, itens e escolhas.
- A tela não apaga enquanto você joga.
- Os finais descobertos ficam salvos no celular.

## Editar ou criar histórias

As histórias estão em `app/src/main/assets/www/index.html`, nos blocos `APAGAO`, `ONIBUS` e `ABISMO`.
O começo do código explica cada campo. Depois de editar:
- no GitHub, suba o arquivo novo e o APK é gerado de novo sozinho;
- no Android Studio, é só gerar o APK outra vez.

Para atualizar o jogo no celular, instale o APK novo por cima. O progresso continua salvo.
