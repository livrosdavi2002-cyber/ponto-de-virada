#!/bin/sh
# junta os arquivos compartilhados com o jogo principal (roca.js, fontes e PeerJS) na pasta www da Roça
set -e
cd "$(dirname "$0")"
J=../app/src/main/assets/www
cp "$J/roca.js" www/roca.js
mkdir -p www/lib www/fonts
cp "$J/lib/peerjs.min.js" "$J/lib/peerjs-LICENSE.txt" "$J/lib/three.min.js" "$J/lib/three-LICENSE.txt" www/lib/
cp "$J"/fonts/*.woff2 www/fonts/
