/* Roça Assombrada (versão separada): o básico que o jogo usa do "Última Escolha" — som sintetizado, voz e vibração. */
window.ROCA_SOLO = true;
const PI = Math.PI;
let AC = null, OUT, REV, NB, mudo = (() => { try { return localStorage.getItem("ra_mudo") === "1"; } catch (e) { return false; } })();
function initAudio() {
  if (AC) { AC.resume(); return; }
  AC = new (window.AudioContext || window.webkitAudioContext)();
  OUT = AC.createGain(); OUT.gain.value = mudo ? 0 : .9; OUT.connect(AC.destination);
  REV = AC.createConvolver();
  const len = AC.sampleRate * 2.6, ir = AC.createBuffer(2, len, AC.sampleRate);
  for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3); }
  REV.buffer = ir; const rg = AC.createGain(); rg.gain.value = .4; REV.connect(rg).connect(OUT);
  NB = AC.createBuffer(1, AC.sampleRate * 2, AC.sampleRate); const nd = NB.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
  document.addEventListener("visibilitychange", () => { document.hidden ? AC.suspend() : AC.resume(); });
}
function setAmb() {} function pararTudo() {}
window.alternarSom = () => { mudo = !mudo; try { localStorage.setItem("ra_mudo", mudo ? "1" : "0"); } catch (e) {} if (AC) OUT.gain.setTargetAtTime(mudo ? 0 : .9, AC.currentTime, .1); };
function vibrar(ms) { try { if (window.Android && Android.vibrar) Android.vibrar(Math.round(ms)); else if (navigator.vibrate) navigator.vibrate(ms); } catch (e) {} }
window.vozLigada = (() => { try { return localStorage.getItem("ra_voz") !== "0"; } catch (e) { return true; } })();
window.alternarVozSolo = () => { vozLigada = !vozLigada; try { localStorage.setItem("ra_voz", vozLigada ? "1" : "0"); } catch (e) {} if (!vozLigada) calar(); };
const vozNativa = () => !!(window.Android && Android.falar);
function narrar(t) {
  if (!vozLigada) return;
  if (vozNativa()) { try { Android.falar(t); } catch (e) {} return; }
  if (window.speechSynthesis) { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t); u.lang = "pt-BR"; u.rate = .95; u.pitch = .85; u.onstart = () => vozInicio(); u.onend = () => vozFim(); speechSynthesis.speak(u); }
}
function calar() { if (vozNativa()) { try { Android.calar(); } catch (e) {} } else if (window.speechSynthesis) speechSynthesis.cancel(); vozFim(); }
window.vozInicio = () => { if (AC && !mudo) OUT.gain.setTargetAtTime(.4, AC.currentTime, .25); };
window.vozFim = () => { if (AC && !mudo) OUT.gain.setTargetAtTime(.9, AC.currentTime, .5); };
window.vozPronta = () => {};
window.fpsAlvo = () => { try { const v = localStorage.getItem("pv_fps"); return v === "60" ? 60 : v === "24" ? 24 : 30; } catch (e) { return 30; } };
// botão voltar do Android e "sair do modo": aqui não existe outro menu, então volta para o menu da Roça
window.voltarAndroid = () => window.rocaVoltar ? rocaVoltar() : false;
window.abrirHub = () => { if (window.entrarRoca) entrarRoca(); };
window.pausarAndroid = () => {};
window.margensAndroid = () => {};
