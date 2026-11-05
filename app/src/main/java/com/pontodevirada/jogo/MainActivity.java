package com.pontodevirada.jogo;

import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.ApplicationInfo;
import android.window.OnBackInvokedDispatcher;

import com.android.billingclient.api.AcknowledgePurchaseParams;
import com.android.billingclient.api.BillingClient;
import com.android.billingclient.api.BillingClientStateListener;
import com.android.billingclient.api.BillingFlowParams;
import com.android.billingclient.api.BillingResult;
import com.android.billingclient.api.PendingPurchasesParams;
import com.android.billingclient.api.ProductDetails;
import com.android.billingclient.api.Purchase;
import com.android.billingclient.api.QueryProductDetailsParams;
import com.android.billingclient.api.QueryPurchasesParams;
import android.os.Build;
import android.os.Bundle;
import android.os.VibrationEffect;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import android.speech.tts.Voice;
import android.os.Vibrator;
import android.view.DisplayCutout;
import android.view.View;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.webkit.WebViewAssetLoader;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Locale;

public class MainActivity extends Activity {

    private static final String INICIO = "https://appassets.androidplatform.net/assets/www/index.html";
    private WebView web;
    private int[] margens = {0, 0, 0, 0};
    private boolean carregou = false;
    private TextToSpeech voz;
    private boolean vozPronta = false;
    private final List<Voice> vozesPt = new ArrayList<>();

    /* Loja (Google Play Billing): compra única que libera os modos infinitos */
    private static final String PRODUTO = "premium_modos";
    private BillingClient loja;
    private ProductDetails produto;
    private String preco = "";
    private boolean premiumAtivo = false;
    private boolean testeLiberado = false;
    private SharedPreferences prefs;

    @Override
    protected void onCreate(Bundle estado) {
        super.onCreate(estado);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        final WebViewAssetLoader carregador = new WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();

        web = new WebView(this);
        web.setBackgroundColor(0xFF0B0E14);
        web.setVerticalScrollBarEnabled(false);
        web.setHorizontalScrollBarEnabled(false);
        web.setOverScrollMode(View.OVER_SCROLL_NEVER);

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setAllowFileAccess(false);
        s.setSupportZoom(false);
        // ignora o "tamanho da fonte" do Android, que estourava o layout do jogo
        s.setTextZoom(100);
        s.setUseWideViewPort(true);
        s.setLoadWithOverviewMode(false);

        web.addJavascriptInterface(new Ponte(), "Android");
        web.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest req) {
                return carregador.shouldInterceptRequest(req.getUrl());
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                carregou = true;
                enviarMargens();
            }
        });

        // a WebView costuma informar 0 no env(safe-area-inset-*); manda as margens do recorte da câmera pro jogo
        getWindow().getDecorView().setOnApplyWindowInsetsListener((v, insets) -> {
            int t = 0, b = 0, l = 0, r = 0;
            if (Build.VERSION.SDK_INT >= 28) {
                DisplayCutout dc = insets.getDisplayCutout();
                if (dc != null) { t = dc.getSafeInsetTop(); b = dc.getSafeInsetBottom(); l = dc.getSafeInsetLeft(); r = dc.getSafeInsetRight(); }
            }
            float d = getResources().getDisplayMetrics().density;
            margens = new int[]{Math.round(t / d), Math.round(b / d), Math.round(l / d), Math.round(r / d)};
            enviarMargens();
            return v.onApplyWindowInsets(insets);
        });

        setContentView(web);
        prefs = getSharedPreferences("loja", MODE_PRIVATE);
        premiumAtivo = prefs.getBoolean("premium", false);
        testeLiberado = depurando() && prefs.getBoolean("teste", false);
        iniciarLoja();
        // Android 13+: gesto/botão de voltar (o onBackPressed antigo não é mais chamado no Android 16)
        if (Build.VERSION.SDK_INT >= 33) getOnBackInvokedDispatcher().registerOnBackInvokedCallback(OnBackInvokedDispatcher.PRIORITY_DEFAULT, this::voltar);
        iniciarVoz();
        telaCheia();

        if (estado != null) web.restoreState(estado);
        else web.loadUrl(INICIO);
    }

    private boolean depurando() { return (getApplicationInfo().flags & ApplicationInfo.FLAG_DEBUGGABLE) != 0; }

    private void iniciarLoja() {
        loja = BillingClient.newBuilder(this)
                .setListener((resultado, compras) -> {
                    int c = resultado.getResponseCode();
                    if (c == BillingClient.BillingResponseCode.OK && compras != null) processarCompras(compras, true);
                    else if (c == BillingClient.BillingResponseCode.ITEM_ALREADY_OWNED) { marcarPremium(true); js("window.premiumComprado && premiumComprado()"); }
                    else if (c == BillingClient.BillingResponseCode.USER_CANCELED) js("window.premiumErro && premiumErro('cancelado')");
                    else js("window.premiumErro && premiumErro('erro')");
                })
                .enablePendingPurchases(PendingPurchasesParams.newBuilder().enableOneTimeProducts().build())
                .enableAutoServiceReconnection()
                .build();
        loja.startConnection(new BillingClientStateListener() {
            @Override public void onBillingSetupFinished(BillingResult r) {
                if (r.getResponseCode() != BillingClient.BillingResponseCode.OK) return;
                // restaura compras já feitas (troca de celular, reinstalação)
                loja.queryPurchasesAsync(QueryPurchasesParams.newBuilder().setProductType(BillingClient.ProductType.INAPP).build(), (br, lista) -> {
                    if (br.getResponseCode() != BillingClient.BillingResponseCode.OK) return;
                    boolean tem = false;
                    for (Purchase p : lista) if (p.getProducts().contains(PRODUTO) && p.getPurchaseState() == Purchase.PurchaseState.PURCHASED) tem = true;
                    if (!tem) marcarPremium(false); // reembolso ou compra cancelada
                    processarCompras(lista, false);
                });
                List<QueryProductDetailsParams.Product> itens = new ArrayList<>();
                itens.add(QueryProductDetailsParams.Product.newBuilder().setProductId(PRODUTO).setProductType(BillingClient.ProductType.INAPP).build());
                loja.queryProductDetailsAsync(QueryProductDetailsParams.newBuilder().setProductList(itens).build(), (br, res) -> {
                    if (br.getResponseCode() != BillingClient.BillingResponseCode.OK || res.getProductDetailsList().isEmpty()) return;
                    produto = res.getProductDetailsList().get(0);
                    if (produto.getOneTimePurchaseOfferDetails() != null) preco = produto.getOneTimePurchaseOfferDetails().getFormattedPrice();
                    js("window.precoPremium && precoPremium(" + JSONObject.quote(preco) + ")");
                });
            }
            @Override public void onBillingServiceDisconnected() { }
        });
    }

    private void processarCompras(List<Purchase> compras, boolean agora) {
        for (Purchase p : compras) {
            if (!p.getProducts().contains(PRODUTO)) continue;
            if (p.getPurchaseState() == Purchase.PurchaseState.PURCHASED) {
                marcarPremium(true);
                if (agora) js("window.premiumComprado && premiumComprado()");
                // a Play devolve o dinheiro se a compra não for confirmada em 3 dias
                if (!p.isAcknowledged()) loja.acknowledgePurchase(AcknowledgePurchaseParams.newBuilder().setPurchaseToken(p.getPurchaseToken()).build(), r -> { });
            } else if (p.getPurchaseState() == Purchase.PurchaseState.PENDING && agora) js("window.premiumErro && premiumErro('pendente')");
        }
    }

    private void marcarPremium(boolean v) { premiumAtivo = v; prefs.edit().putBoolean("premium", v).apply(); }

    private void voltar() {
        web.evaluateJavascript("window.voltarAndroid ? voltarAndroid() : false", valor -> {
            if (!"true".equals(valor)) finish();
        });
    }

    /* Narração: voz do próprio Android (Google TTS), em português do Brasil */
    private void iniciarVoz() {
        voz = new TextToSpeech(this, status -> {
            if (status != TextToSpeech.SUCCESS) return;
            int r = voz.setLanguage(new Locale("pt", "BR"));
            if (r == TextToSpeech.LANG_MISSING_DATA || r == TextToSpeech.LANG_NOT_SUPPORTED) r = voz.setLanguage(new Locale("pt"));
            vozPronta = r != TextToSpeech.LANG_MISSING_DATA && r != TextToSpeech.LANG_NOT_SUPPORTED;
            // tom e velocidade naturais: mudar o tom deixa a voz mais robótica
            voz.setSpeechRate(1.12f);
            voz.setPitch(1.0f);
            // escolhe a voz em português mais natural instalada (as "network"/neurais do Google primeiro)
            try {
                for (Voice v : voz.getVoices()) {
                    if (!"pt".equals(v.getLocale().getLanguage())) continue;
                    if (v.getFeatures() != null && v.getFeatures().contains(TextToSpeech.Engine.KEY_FEATURE_NOT_INSTALLED)) continue;
                    vozesPt.add(v);
                }
                Collections.sort(vozesPt, (a, b) -> Integer.compare(nota(b), nota(a)));
                if (!vozesPt.isEmpty()) voz.setVoice(vozesPt.get(0));
            } catch (Exception e) { /* aparelho sem lista de vozes: usa a padrão */ }
            voz.setOnUtteranceProgressListener(new UtteranceProgressListener() {
                @Override public void onStart(String id) { js("window.vozInicio && vozInicio()"); }
                @Override public void onDone(String id) { if ("fim".equals(id)) js("window.vozFim && vozFim()"); }
                @Override public void onError(String id) { js("window.vozFim && vozFim()"); }
            });
            js("window.vozPronta && vozPronta(" + vozPronta + ")");
        });
    }

    private static int nota(Voice v) {
        int n = v.getQuality();
        if ("BR".equalsIgnoreCase(v.getLocale().getCountry())) n += 1000;
        if (v.isNetworkConnectionRequired() || v.getName().contains("network")) n += 300;
        return n;
    }

    private void js(String codigo) {
        runOnUiThread(() -> { if (web != null) web.evaluateJavascript(codigo, null); });
    }

    private void enviarMargens() {
        if (web == null || !carregou) return;
        web.evaluateJavascript("window.margensAndroid && margensAndroid(" + margens[0] + "," + margens[1] + "," + margens[2] + "," + margens[3] + ")", null);
    }

    private void telaCheia() {
        if (Build.VERSION.SDK_INT >= 30) {
            getWindow().setDecorFitsSystemWindows(false);
            WindowInsetsController c = getWindow().getInsetsController();
            if (c != null) {
                c.hide(WindowInsets.Type.systemBars());
                c.setSystemBarsBehavior(WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
            }
        } else {
            getWindow().getDecorView().setSystemUiVisibility(
                    View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                            | View.SYSTEM_UI_FLAG_FULLSCREEN
                            | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                            | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                            | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                            | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN);
        }
    }

    @Override
    public void onWindowFocusChanged(boolean foco) {
        super.onWindowFocusChanged(foco);
        if (foco) telaCheia();
    }

    /* Botão voltar: abre o menu do jogo; no menu, fecha o app */
    @Override
    public void onBackPressed() { voltar(); }

    @Override
    protected void onPause() {
        web.evaluateJavascript("window.pausarAndroid && pausarAndroid(true)", null);
        if (voz != null) voz.stop();
        web.onPause();
        super.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        web.onResume();
        web.evaluateJavascript("window.pausarAndroid && pausarAndroid(false)", null);
    }

    @Override
    protected void onSaveInstanceState(Bundle estado) {
        super.onSaveInstanceState(estado);
        web.saveState(estado);
    }

    @Override
    protected void onDestroy() {
        if (loja != null) loja.endConnection();
        if (voz != null) voz.shutdown();
        if (web != null) web.destroy();
        super.onDestroy();
    }

    /* Ponte JavaScript → Android: vibração nas batidas e impactos */
    public class Ponte {
        @JavascriptInterface
        public boolean vozDisponivel() { return vozPronta; }

        @JavascriptInterface
        public boolean premium() { return premiumAtivo || testeLiberado; }

        @JavascriptInterface
        public boolean depuracao() { return depurando(); }

        @JavascriptInterface
        public String precoPremium() { return preco; }

        @JavascriptInterface
        public void liberarTeste() { if (depurando()) { testeLiberado = true; prefs.edit().putBoolean("teste", true).apply(); } }

        @JavascriptInterface
        public boolean comprarPremium() {
            if (loja == null || produto == null || !loja.isReady()) return false;
            runOnUiThread(() -> {
                List<BillingFlowParams.ProductDetailsParams> l = new ArrayList<>();
                l.add(BillingFlowParams.ProductDetailsParams.newBuilder().setProductDetails(produto).build());
                loja.launchBillingFlow(MainActivity.this, BillingFlowParams.newBuilder().setProductDetailsParamsList(l).build());
            });
            return true;
        }

        @JavascriptInterface
        public void falar(String texto) {
            if (voz == null || !vozPronta) return;
            // fala frase por frase, com uma pausa curta entre elas: soa bem mais natural
            String[] frases = texto.replace("…", "... ").split("(?<=[.!?:;])\\s+");
            voz.stop();
            for (int i = 0; i < frases.length; i++) {
                String f = frases[i].trim();
                if (f.isEmpty()) continue;
                boolean ultima = i == frases.length - 1;
                voz.speak(f, TextToSpeech.QUEUE_ADD, null, ultima ? "fim" : "f" + i);
                if (!ultima) voz.playSilentUtterance(f.endsWith(",") ? 120 : 260, TextToSpeech.QUEUE_ADD, "p" + i);
            }
        }

        @JavascriptInterface
        public void calar() { if (voz != null) voz.stop(); }

        @JavascriptInterface
        public String vozes() {
            JSONArray a = new JSONArray();
            try {
                for (Voice v : vozesPt) {
                    JSONObject o = new JSONObject();
                    o.put("nome", v.getName());
                    o.put("internet", v.isNetworkConnectionRequired() || v.getName().contains("network"));
                    o.put("br", "BR".equalsIgnoreCase(v.getLocale().getCountry()));
                    a.put(o);
                }
            } catch (Exception e) { }
            return a.toString();
        }

        @JavascriptInterface
        public void usarVoz(String nome) {
            if (voz == null) return;
            for (Voice v : vozesPt) if (v.getName().equals(nome)) { voz.setVoice(v); return; }
        }

        @JavascriptInterface
        public void vibrar(int ms) {
            Vibrator v = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
            if (v == null || !v.hasVibrator()) return;
            long dur = Math.max(1, Math.min(ms, 800));
            if (Build.VERSION.SDK_INT >= 26) v.vibrate(VibrationEffect.createOneShot(dur, VibrationEffect.DEFAULT_AMPLITUDE));
            else v.vibrate(dur);
        }
    }
}
