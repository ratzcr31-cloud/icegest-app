const API_URL = 'https://icegest-api.onrender.com/api';
let estoque = []; 
let filtroSetorAtual = 'Geral'; 
let filtroCategoriaAtual = 'Todas'; 
let filtroStatusAtual = 'Todos';

// 💡 AGORA SÃO VARIÁVEIS VAZIAS, QUE SÃO PREENCHIDAS PELO SERVIDOR!
let categorias = [];
let temposValidade = {};
let setores = [];

let configPrefs = JSON.parse(localStorage.getItem('iceGest_prefs')) || { escuro: false, fonteGrande: false, dias: 7, bgUrl: "", tipoIcone: "emoji" };
let meuGraficoCategorias = null, meuGraficoBarras = null;

let configEmEdicao = { tipo: '', index: -1, nomeAntigo: '' };
let edicaoEmMassaIds = [];

const chatPadraoHTML = `<div style="background: var(--azul-claro); padding: 12px 15px; border-radius: 12px; align-self: flex-start; max-width: 85%; color: var(--texto); border-bottom-left-radius: 2px;"><b>Aurora ✨:</b> Olá! Sou a sua assistente pessoal. Diga-me o que quer atualizar ou envie as fotos das suas listas!</div>`;

const DICIONARIO_ICONES = {
    'emoji': {
        icegest: '🍦', dashboard: '📊', estoque: '📦', ia: '🤖', config: '⚙️', logout: '🚪',
        apagar: '🗑️', imprimir: '🖨️', edit: '✏️', info: '💬', add: '➕',
        ola: '👋', visao: '📈', monitoramento: '⏱️', tituloIa: '✨', anexo: '📎',
        aparencia: '🎨', pref: '⚙️', auroraCfg: '🤖', cat: '🏷️', setor: '📍',
        exportar: '📤', excel: '📊', pdf: '📄', lista: '🛒',
        statusOk: '✅', statusAtencao: '⚠️', statusVencido: '❌',
        uploadBg: '📂', removeBg: '🗑️'
    },
    'fontawesome': {
        icegest: '<i class="fa-solid fa-ice-cream" style="color: var(--pessego);"></i>',
        dashboard: '<i class="fa-solid fa-chart-pie"></i>',
        estoque: '<i class="fa-solid fa-boxes-stacked"></i>',
        ia: '<i class="fa-solid fa-robot"></i>',
        config: '<i class="fa-solid fa-gear"></i>',
        logout: '<i class="fa-solid fa-right-from-bracket"></i>',
        apagar: '<i class="fa-solid fa-trash"></i>',
        imprimir: '<i class="fa-solid fa-print"></i>',
        edit: '<i class="fa-solid fa-pen"></i>',
        info: '<i class="fa-solid fa-circle-info"></i>',
        add: '<i class="fa-solid fa-plus"></i>',
        ola: '<i class="fa-solid fa-hand-sparkles"></i>',
        visao: '<i class="fa-solid fa-chart-line"></i>',
        monitoramento: '<i class="fa-solid fa-stopwatch"></i>',
        tituloIa: '<i class="fa-solid fa-wand-magic-sparkles"></i>',
        anexo: '<i class="fa-solid fa-paperclip"></i>',
        aparencia: '<i class="fa-solid fa-palette"></i>',
        pref: '<i class="fa-solid fa-sliders"></i>',
        auroraCfg: '<i class="fa-solid fa-microchip"></i>',
        cat: '<i class="fa-solid fa-tags"></i>',
        setor: '<i class="fa-solid fa-location-dot"></i>',
        exportar: '<i class="fa-solid fa-file-export"></i>',
        excel: '<i class="fa-solid fa-file-excel"></i>',
        pdf: '<i class="fa-solid fa-file-pdf"></i>',
        lista: '<i class="fa-solid fa-cart-shopping"></i>',
        statusOk: '<i class="fa-solid fa-check"></i>',
        statusAtencao: '<i class="fa-solid fa-triangle-exclamation"></i>',
        statusVencido: '<i class="fa-solid fa-xmark"></i>',
        uploadBg: '<i class="fa-solid fa-folder-open"></i>',
        removeBg: '<i class="fa-solid fa-trash-can"></i>'
    },
    'material': {
        icegest: '<span class="material-symbols-outlined" style="color: var(--pessego); font-size: 20px;">icecream</span>',
        dashboard: '<span class="material-symbols-outlined" style="font-size: 20px;">pie_chart</span>',
        estoque: '<span class="material-symbols-outlined" style="font-size: 20px;">inventory_2</span>',
        ia: '<span class="material-symbols-outlined" style="font-size: 20px;">smart_toy</span>',
        config: '<span class="material-symbols-outlined" style="font-size: 20px;">settings</span>',
        logout: '<span class="material-symbols-outlined" style="font-size: 20px;">logout</span>',
        apagar: '<span class="material-symbols-outlined" style="font-size: 18px;">delete</span>',
        imprimir: '<span class="material-symbols-outlined" style="font-size: 18px;">print</span>',
        edit: '<span class="material-symbols-outlined" style="font-size: 18px;">edit</span>',
        info: '<span class="material-symbols-outlined" style="font-size: 18px;">info</span>',
        add: '<span class="material-symbols-outlined">add</span>',
        ola: '<span class="material-symbols-outlined">waving_hand</span>',
        visao: '<span class="material-symbols-outlined">trending_up</span>',
        monitoramento: '<span class="material-symbols-outlined">timer</span>',
        tituloIa: '<span class="material-symbols-outlined">auto_awesome</span>',
        anexo: '<span class="material-symbols-outlined" style="font-size: 16px;">attach_file</span>',
        aparencia: '<span class="material-symbols-outlined">palette</span>',
        pref: '<span class="material-symbols-outlined">tune</span>',
        auroraCfg: '<span class="material-symbols-outlined">memory</span>',
        cat: '<span class="material-symbols-outlined">label</span>',
        setor: '<span class="material-symbols-outlined">location_on</span>',
        exportar: '<span class="material-symbols-outlined" style="font-size: 18px;">outbox</span>',
        excel: '<span class="material-symbols-outlined" style="font-size: 16px;">table_view</span>',
        pdf: '<span class="material-symbols-outlined" style="font-size: 16px;">picture_as_pdf</span>',
        lista: '<span class="material-symbols-outlined" style="font-size: 16px;">shopping_cart</span>',
        statusOk: '<span class="material-symbols-outlined" style="font-size: 16px;">check</span>',
        statusAtencao: '<span class="material-symbols-outlined" style="font-size: 16px;">warning</span>',
        statusVencido: '<span class="material-symbols-outlined" style="font-size: 16px;">close</span>',
        uploadBg: '<span class="material-symbols-outlined" style="vertical-align: bottom; font-size: 18px;">folder_open</span>',
        removeBg: '<span class="material-symbols-outlined" style="vertical-align: bottom; font-size: 18px;">delete</span>'
    }
};

function atualizarIconesDaInterface() {
    const tema = configPrefs.tipoIcone || 'emoji';
    const icones = DICIONARIO_ICONES[tema];

    const setIcon = (id, iconStr) => { const el = document.getElementById(id); if (el) el.innerHTML = iconStr; };

    setIcon('icon-icegest', icones.icegest); setIcon('icon-icegest-login', icones.icegest); setIcon('icon-icegest-cad', icones.icegest);
    setIcon('icon-dashboard', icones.dashboard); setIcon('icon-estoque', icones.estoque); setIcon('icon-ia', icones.ia);
    setIcon('icon-config', icones.config); setIcon('icon-logout', icones.logout); setIcon('btnFab', icones.add);
    setIcon('icon-ola', icones.ola); setIcon('icon-visao', icones.visao); setIcon('icon-monitoramento', icones.monitoramento);
    setIcon('icon-titulo-ia', icones.tituloIa); setIcon('icon-anexo', icones.anexo); setIcon('icon-aparencia', icones.aparencia);
    setIcon('icon-pref', icones.pref); setIcon('icon-aurora-cfg', icones.auroraCfg); setIcon('icon-cat', icones.cat);
    setIcon('icon-setor', icones.setor); setIcon('icon-exportar', icones.exportar);
    setIcon('icon-upload-bg', icones.uploadBg); setIcon('icon-remove-bg', icones.removeBg);

    const searchInput = document.getElementById('inputPesquisa');
    if (searchInput) {
        if (tema === 'fontawesome') {
            searchInput.placeholder = '\uf002 Pesquisar item...';
            searchInput.style.fontFamily = "'Segoe UI', 'Font Awesome 6 Free'";
            searchInput.style.fontWeight = '900';
        } else {
            searchInput.placeholder = '🔍 Pesquisar item...';
            searchInput.style.fontFamily = "'Segoe UI', sans-serif";
            searchInput.style.fontWeight = 'normal';
        }
    }

    if(document.getElementById('btn-export-excel')) document.getElementById('btn-export-excel').innerHTML = `${icones.excel} Exportar para Excel`;
    if(document.getElementById('btn-export-pdf')) document.getElementById('btn-export-pdf').innerHTML = `${icones.pdf} Gerar Relatório PDF`;
    if(document.getElementById('btn-export-lista')) document.getElementById('btn-export-lista').innerHTML = `${icones.lista} Lista de Compras Inteligente`;

    if (document.getElementById('tela-estoque') && document.getElementById('tela-estoque').classList.contains('active')) { atualizarTabela(); }
    verificarBotoesMassa(); atualizarUIConfiguracoes(); atualizarPainelVencimentos();
}

function getAuthHeaders(isFormData = false) {
    const token = sessionStorage.getItem('iceGest_token');
    const headers = { 'Authorization': `Bearer ${token}` };
    if (!isFormData) { headers['Content-Type'] = 'application/json'; }
    return headers;
}

function tratarErroAuth(res) {
    if (res.status === 401 || res.status === 403) {
        alert("A sua sessão expirou ou o acesso foi negado. Por favor, faça login novamente.");
        fazerLogout(); throw new Error("Não autorizado");
    }
}

// ==========================================
// 💡 NOVA FUNÇÃO: CARREGAR CONFIGURAÇÕES GLOBAIS DO SERVIDOR
// ==========================================
async function carregarDadosGlobais() {
    try {
        const [resCat, resSet] = await Promise.all([
            fetch(API_URL + '/categorias', { headers: getAuthHeaders() }),
            fetch(API_URL + '/setores', { headers: getAuthHeaders() })
        ]);
        
        if (resCat.ok && resSet.ok) {
            const dataCat = await resCat.json();
            const dataSet = await resSet.json();
            
            categorias = dataCat.map(c => c.nome);
            temposValidade = {};
            dataCat.forEach(c => temposValidade[c.nome] = c.diasAviso);
            
            setores = dataSet.map(s => s.nome);
            atualizarUIConfiguracoes();
        }
    } catch (e) {
        console.error("Erro ao carregar configurações globais da base de dados:", e);
    }
}

async function carregarEstoque() { 
    try { 
        const r = await fetch(API_URL + '/estoque', { headers: getAuthHeaders() }); 
        tratarErroAuth(r);
        estoque = await r.json(); 
        atualizarTabela(); atualizarDashboard(); atualizarPainelVencimentos(); 
    } catch (e) { console.error("Erro ao carregar estoque", e); } 
}

function alternarSidebar() {
    const sidebar = document.getElementById('sidebar'); sidebar.classList.toggle('recolhida');
    const estado = sidebar.classList.contains('recolhida') ? 'sim' : 'nao'; localStorage.setItem('iceGest_sidebar_recolhida', estado);
}

function toggleMenu() { document.getElementById('sidebar').classList.toggle('aberta'); document.getElementById('menuOverlay').classList.toggle('aberta'); }

function alternarTelaAuth() {
    const formLogin = document.getElementById('form-login'); const formCadastro = document.getElementById('form-cadastro');
    document.getElementById('erroLogin').style.display = 'none'; document.getElementById('erroCadastro').style.display = 'none'; document.getElementById('sucessoCadastro').style.display = 'none';
    if (formLogin.style.display === 'none') { formLogin.style.display = 'block'; formCadastro.style.display = 'none'; } else { formLogin.style.display = 'none'; formCadastro.style.display = 'block'; }
}

async function fazerCadastro() {
    const user = document.getElementById('cadUser').value; const pass = document.getElementById('cadPass').value;
    const msgErro = document.getElementById('erroCadastro'); const msgSucesso = document.getElementById('sucessoCadastro');
    msgErro.style.display = 'none'; msgSucesso.style.display = 'none';
    if(!user || !pass) { msgErro.innerText = "Por favor, preencha todos os campos!"; msgErro.style.display = 'block'; return; }
    try {
        const res = await fetch(API_URL + '/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user, pass }) });
        const data = await res.json();
        if (res.ok) { msgSucesso.innerText = data.message; msgSucesso.style.display = 'block'; document.getElementById('cadUser').value = ""; document.getElementById('cadPass').value = ""; setTimeout(alternarTelaAuth, 1500); } 
        else { msgErro.innerText = data.error; msgErro.style.display = 'block'; }
    } catch (error) { msgErro.innerText = "Erro ao ligar ao servidor Node.js."; msgErro.style.display = 'block'; }
}

async function fazerLogin() {
    const user = document.getElementById('loginUser').value; const pass = document.getElementById('loginPass').value;
    const msgErro = document.getElementById('erroLogin'); msgErro.style.display = 'none';
    if(!user || !pass) { msgErro.innerText = "Preencha utilizador e senha!"; msgErro.style.display = 'block'; return; }
    try {
        const res = await fetch(API_URL + '/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user, pass }) });
        const data = await res.json();
        if (res.ok) {
            sessionStorage.setItem('iceGest_logado', 'sim'); sessionStorage.setItem('iceGest_userLogado', data.user); sessionStorage.setItem('iceGest_token', data.token); 
            document.getElementById('tela-login').style.display = 'none'; document.getElementById('app-completo').style.display = 'flex'; iniciarAplicacao();
        } else { msgErro.innerText = data.error; msgErro.style.display = 'block'; }
    } catch (error) { msgErro.innerText = "Erro de ligação. O servidor está ligado?"; msgErro.style.display = 'block'; }
}

function verificarLogin() {
    const estaLogado = sessionStorage.getItem('iceGest_logado'); const token = sessionStorage.getItem('iceGest_token');
    if (estaLogado === 'sim' && token) { document.getElementById('tela-login').style.display = 'none'; document.getElementById('app-completo').style.display = 'flex'; iniciarAplicacao(); } 
    else { atualizarIconesDaInterface(); }
}

function fazerLogout() { sessionStorage.removeItem('iceGest_logado'); sessionStorage.removeItem('iceGest_userLogado'); sessionStorage.removeItem('iceGest_token'); window.location.reload(); }

async function iniciarAplicacao() {
    const nomeUsuario = sessionStorage.getItem('iceGest_userLogado') || "Admin"; 
    document.getElementById('nomeUsuarioTopo').innerText = `👤 ${nomeUsuario}`; document.getElementById('nomeBoasVindas').innerText = nomeUsuario;
    if (localStorage.getItem('iceGest_sidebar_recolhida') === 'sim') { document.getElementById('sidebar').classList.add('recolhida'); }
    
    carregarConfiguracoes(); 
    
    // 💡 Carrega os dados globais do servidor antes de desenhar as telas!
    await carregarDadosGlobais();
    carregarEstoque(); 
    
    definirFraseDoDia(); carregarChatIA(); atualizarIconesDaInterface(); 
    
    const apiKeySalva = localStorage.getItem('iceGest_apiKey'); if(apiKeySalva) { document.getElementById('inputApiKey').value = apiKeySalva; }
    const abaSalva = localStorage.getItem('iceGest_abaAtual') || 'dashboard'; const menuElemento = document.getElementById(`menu-${abaSalva}`);
    if (menuElemento) { mudarAbaMenu(menuElemento, abaSalva); } else { mudarAbaMenu(document.getElementById('menu-dashboard'), 'dashboard'); }
}

function mudarAbaMenu(el, tela) { 
    document.querySelectorAll('.sidebar .menu-item').forEach(i => i.classList.remove('active')); el.classList.add('active'); 
    document.querySelectorAll('.content').forEach(t => t.classList.remove('active')); 
    document.querySelector('.topbar').style.display = tela === 'estoque' ? 'flex' : 'none'; document.getElementById('btnFab').style.display = tela === 'estoque' ? 'flex' : 'none'; 
    document.getElementById(`tela-${tela}`).classList.add('active'); localStorage.setItem('iceGest_abaAtual', tela);
    if(window.innerWidth <= 768) { document.getElementById('sidebar').classList.remove('aberta'); document.getElementById('menuOverlay').classList.remove('aberta'); }
    if(tela === 'dashboard') atualizarDashboard(); if(tela === 'estoque') atualizarTabela();
}

function carregarChatIA() { const chatSalvo = localStorage.getItem('iceGest_chatIA'); document.getElementById('chatHistorico').innerHTML = chatSalvo ? chatSalvo : chatPadraoHTML; const chatEl = document.getElementById("chatHistorico"); chatEl.scrollTop = chatEl.scrollHeight; }
function salvarChatIA() { const html = document.getElementById('chatHistorico').innerHTML; localStorage.setItem('iceGest_chatIA', html); }
function limparChatIA() { if(confirm("Tem a certeza que deseja limpar o histórico com a Aurora?")) { localStorage.removeItem('iceGest_chatIA'); document.getElementById('chatHistorico').innerHTML = chatPadraoHTML; } }

async function enviarParaIA() { 
    const inputPergunta = document.getElementById("perguntaIAReal"); const inputImagem = document.getElementById("imagemIA"); const btn = document.getElementById("btnEnviarIA"); const chat = document.getElementById("chatHistorico"); 
    const apiKey = localStorage.getItem('iceGest_apiKey'); if (!apiKey) { alert("Configure a API Key da Aurora!"); return; }
    const pergunta = inputPergunta.value.trim(); const imagensFiles = inputImagem.files; if (!pergunta && imagensFiles.length === 0) return; 
    let mensagemUsuario = pergunta ? pergunta : "Analise os arquivos em anexo."; if (imagensFiles.length > 0) { mensagemUsuario += ` <i>(🖼️ ${imagensFiles.length} Anexo(s))</i>`; }
    chat.innerHTML += `<div style="background: var(--fundo); padding: 12px 15px; border-radius: 12px; align-self: flex-end; max-width: 85%; border: 1px solid var(--borda); color: var(--texto); border-bottom-right-radius: 2px;"><b>Você:</b> ${mensagemUsuario}</div>`; salvarChatIA(); 
    inputPergunta.value = ""; inputImagem.value = ""; document.getElementById("nomeArquivoIA").innerText = ""; btn.innerText = "Pensando..."; btn.disabled = true; chat.scrollTop = chat.scrollHeight;

    try {
        const formData = new FormData(); formData.append("pergunta", pergunta); formData.append("apiKey", apiKey); formData.append("estoqueAtual", JSON.stringify(estoque)); formData.append("categoriasAtuais", JSON.stringify(categorias)); formData.append("setoresAtuais", JSON.stringify(setores));
        for (let i = 0; i < imagensFiles.length; i++) { formData.append("imagens", imagensFiles[i]); }
        const resposta = await fetch(API_URL + '/chat', { method: 'POST', headers: getAuthHeaders(true), body: formData });
        tratarErroAuth(resposta); const dados = await resposta.json();
        
        if(resposta.ok) {
            chat.innerHTML += `<div style="background: var(--azul-claro); padding: 12px 15px; border-radius: 12px; align-self: flex-start; max-width: 85%; color: var(--texto); border-bottom-left-radius: 2px;"><b>Aurora ✨:</b> ${dados.message}</div>`; 
            if (dados.configuracoes || dados.produtosAdicionados) {
                // A Aurora ajudou com produtos/categorias! Recarregamos do servidor para garantir atualização global.
                await carregarDadosGlobais();
                await carregarEstoque();
            }
        } else { chat.innerHTML += `<div style="background: #ffcccc; padding: 12px 15px; border-radius: 12px; align-self: flex-start; max-width: 85%; color: #333; border-bottom-left-radius: 2px;"><b>Aurora (Erro) ⚠️:</b> ${dados.error || 'Erro desconhecido'}</div>`; }
        salvarChatIA();
    } catch (erro) { 
        if (erro.message !== "Não autorizado") { chat.innerHTML += `<div style="background: #ffcccc; padding: 12px 15px; border-radius: 12px; align-self: flex-start; max-width: 85%; color: #333; border-bottom-left-radius: 2px;"><b>Sistema ❌:</b> Erro de comunicação.</div>`; salvarChatIA(); } 
    } finally { btn.innerText = "Enviar"; btn.disabled = false; chat.scrollTop = chat.scrollHeight; }
}

function alternarTodosChecks(source) { const checkboxes = document.querySelectorAll('.check-item'); checkboxes.forEach(cb => cb.checked = source.checked); verificarBotoesMassa(); }
function verificarBotoesMassa() {
    const checkboxes = document.querySelectorAll('.check-item:checked'); const btnApagar = document.getElementById('btnApagarMassa'); const btnImprimir = document.getElementById('btnImprimirMassa');
    const tema = configPrefs.tipoIcone || 'emoji'; const icones = DICIONARIO_ICONES[tema];
    if(checkboxes.length > 0) { btnApagar.style.display = 'inline-block'; btnApagar.innerHTML = `${icones.apagar} Apagar ${checkboxes.length}`; btnImprimir.style.display = 'inline-block'; btnImprimir.innerHTML = `${icones.imprimir} Etiquetas`; } else { btnApagar.style.display = 'none'; document.getElementById('checkTodos').checked = false; btnImprimir.style.display = 'none'; }
}

async function apagarSelecionados() {
    const checkboxes = document.querySelectorAll('.check-item:checked'); if (checkboxes.length === 0) return;
    if(confirm(`Tem certeza absoluta que deseja apagar ${checkboxes.length} item(ns)?`)) {
        try {
            const promessas = Array.from(checkboxes).map(cb => fetch(`${API_URL}/estoque/${cb.value}`, { method: 'DELETE', headers: getAuthHeaders() }));
            const respostas = await Promise.all(promessas); respostas.forEach(tratarErroAuth);
            document.getElementById('checkTodos').checked = false; verificarBotoesMassa(); carregarEstoque();
        } catch (error) { if(error.message !== "Não autorizado") alert("Ocorreu um erro ao apagar alguns itens."); }
    }
}

function prepararSelectsMassa() {
    document.getElementById('categoriaItem').innerHTML = `<option value="MANTER">-- Manter Atual --</option><option value="">-- Sem Categoria --</option>` + categorias.map(c => `<option value="${c}">${c}</option>`).join('');
    document.getElementById('setorItem').innerHTML = `<option value="MANTER">-- Manter Atual --</option>` + setores.map(s => `<option value="${s}">${s}</option>`).join('');
    document.getElementById("unidadeItem").innerHTML = `<option value="MANTER">-- Manter Atual --</option><option value="Kg">Kg</option><option value="Litros">Litros</option><option value="Un">Unidade</option><option value="Cx">Caixa</option>`;
}

function fecharModalObservacao() { document.getElementById("modalObservacao").classList.remove('show'); setTimeout(() => { document.getElementById("idProdutoObs").value = ""; document.getElementById("textoObservacao").value = ""; document.getElementById("imgRefObs").src = ""; }, 300); }
function abrirModalObservacao(id) {
    const produto = estoque.find(p => p.id === id);
    if(produto) { 
        document.getElementById("idProdutoObs").value = produto.id; document.getElementById("textoObservacao").value = produto.observacao || ""; 
        const divImg = document.getElementById("containerImagemRef"); const imgTag = document.getElementById("imgRefObs");
        if (produto.imagemUrl && produto.imagemUrl.trim() !== "") { imgTag.src = produto.imagemUrl; divImg.style.display = "block"; } else { divImg.style.display = "none"; }
        document.getElementById("modalObservacao").classList.add('show'); 
    }
}

async function salvarObservacaoRapida() {
    const id = parseInt(document.getElementById("idProdutoObs").value); const texto = document.getElementById("textoObservacao").value; const produto = estoque.find(p => p.id === id);
    if(!produto) return; const dados = { ...produto, observacao: texto };
    try {
        const resposta = await fetch(`${API_URL}/estoque/${id}`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(dados) });
        tratarErroAuth(resposta); if(resposta.ok) { fecharModalObservacao(); carregarEstoque(); } else { alert("Erro ao salvar observação!"); }
    } catch(erro) { if(erro.message !== "Não autorizado") alert("Erro de comunicação com o servidor!"); }
}

function abrirModal() { document.getElementById("modalCadastro").classList.add('show'); }
function fecharModal() { 
    const m = document.getElementById("modalCadastro"); m.classList.remove('show'); 
    setTimeout(() => { 
        document.getElementById("formAdicionar").reset(); document.getElementById("idItem").value = ""; document.getElementById("tituloModal").innerText = "Novo Produto"; document.getElementById("nomeItem").disabled = false; document.getElementById("nomeItem").placeholder = ""; document.getElementById("nomeItem").required = true; document.getElementById("estoqueItem").required = true; document.getElementById("estoqueItem").placeholder = ""; document.getElementById("validadeItem").required = true;
        if(document.getElementById("obsItem")) { document.getElementById("obsItem").parentNode.style.display = "block"; document.getElementById("obsItem").value = ""; }
        if(document.getElementById("imagemItem")) { document.getElementById("imagemItem").parentNode.style.display = "block"; document.getElementById("imagemItem").value = ""; }
        atualizarUIConfiguracoes(); document.getElementById("unidadeItem").innerHTML = `<option value="Kg">Kg</option><option value="Litros">Litros</option><option value="Un">Unidade</option><option value="Cx">Caixa</option>`;
    }, 300); 
}

function editarItem(id) { 
    const checkboxes = document.querySelectorAll('.check-item:checked'); const checkedIds = Array.from(checkboxes).map(cb => parseInt(cb.value));
    if (checkedIds.length > 1 && checkedIds.includes(id)) {
        edicaoEmMassaIds = checkedIds; document.getElementById("idItem").value = "MASSA"; document.getElementById("tituloModal").innerText = `Editar ${checkedIds.length} Produtos`; document.getElementById("nomeItem").value = ""; document.getElementById("nomeItem").placeholder = "Múltiplos selecionados"; document.getElementById("nomeItem").disabled = true; document.getElementById("nomeItem").required = false; prepararSelectsMassa(); document.getElementById("estoqueItem").value = ""; document.getElementById("estoqueItem").required = false; document.getElementById("estoqueItem").placeholder = "Deixe branco p/ manter"; document.getElementById("validadeItem").value = ""; document.getElementById("validadeItem").required = false;
        if(document.getElementById("obsItem")) { document.getElementById("obsItem").parentNode.style.display = "none"; } if(document.getElementById("imagemItem")) { document.getElementById("imagemItem").parentNode.style.display = "none"; } abrirModal();
    } else {
        edicaoEmMassaIds = []; const p = estoque.find(x => x.id === id); 
        if(p) { 
            document.getElementById("idItem").value = p.id; document.getElementById("nomeItem").value = p.item; document.getElementById("nomeItem").placeholder = ""; document.getElementById("nomeItem").disabled = false; document.getElementById("nomeItem").required = true; atualizarUIConfiguracoes(); document.getElementById("unidadeItem").innerHTML = `<option value="Kg">Kg</option><option value="Litros">Litros</option><option value="Un">Unidade</option><option value="Cx">Caixa</option>`; document.getElementById("categoriaItem").value = p.categoria === "Default" ? "" : p.categoria; document.getElementById("setorItem").value = p.setor; document.getElementById("estoqueItem").value = p.estFinal; document.getElementById("estoqueItem").required = true; document.getElementById("estoqueItem").placeholder = ""; document.getElementById("unidadeItem").value = p.unidade; document.getElementById("validadeItem").value = p.validade; document.getElementById("validadeItem").required = true;
            if(document.getElementById("obsItem")) { document.getElementById("obsItem").value = p.observacao || ""; document.getElementById("obsItem").parentNode.style.display = "block"; }
            if(document.getElementById("imagemItem")) { document.getElementById("imagemItem").value = p.imagemUrl || ""; document.getElementById("imagemItem").parentNode.style.display = "block"; }
            document.getElementById("tituloModal").innerText = "Editar Produto"; abrirModal(); 
        } 
    }
}

async function salvarItem(e) { 
    e.preventDefault(); 
    const id = document.getElementById("idItem").value; 
    
    // 💡 TRUQUE: Congelamos o botão para impedir duplo-clique acidental
    const btnSalvar = e.target.querySelector('button[type="submit"]') || document.activeElement;
    if (btnSalvar) {
        btnSalvar.disabled = true;
        btnSalvar.innerText = "A guardar...";
    }

    if (id === "MASSA") {
        // ... (resto do teu código de massa mantém-se igual)
        const novaCategoria = document.getElementById("categoriaItem").value; 
        const novoSetor = document.getElementById("setorItem").value; 
        const novoEstoque = document.getElementById("estoqueItem").value; 
        const novaUnidade = document.getElementById("unidadeItem").value; 
        const novaValidade = document.getElementById("validadeItem").value;
        try {
            const promessas = edicaoEmMassaIds.map(itemId => {
                const itemAtual = estoque.find(x => x.id === itemId); if (!itemAtual) return Promise.resolve();
                let catFinal = novaCategoria === "MANTER" ? itemAtual.categoria : novaCategoria; if (!catFinal || catFinal.trim() === "") catFinal = "Default";
                const dados = { item: itemAtual.item, categoria: catFinal, setor: novoSetor === "MANTER" ? itemAtual.setor : novoSetor, unidade: novaUnidade === "MANTER" ? itemAtual.unidade : novaUnidade, estInicial: novoEstoque !== "" ? novoEstoque : itemAtual.estInicial, estFinal: novoEstoque !== "" ? novoEstoque : itemAtual.estFinal, validade: novaValidade !== "" ? novaValidade : itemAtual.validade, observacao: itemAtual.observacao, imagemUrl: itemAtual.imagemUrl };
                return fetch(`${API_URL}/estoque/${itemId}`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(dados) });
            });
            const respostas = await Promise.all(promessas); respostas.forEach(tratarErroAuth);
            document.getElementById('checkTodos').checked = false; verificarBotoesMassa(); fecharModal(); carregarEstoque();
        } catch (erro) { 
            if(erro.message !== "Não autorizado") alert("Erro ao salvar edições em massa!"); 
        } finally {
            if (btnSalvar) { btnSalvar.disabled = false; btnSalvar.innerText = "Salvar"; }
        }
        return;
    }

    let categoriaSelecionada = document.getElementById("categoriaItem").value; if (!categoriaSelecionada || categoriaSelecionada.trim() === "") categoriaSelecionada = "Default";
    const dados = { item: document.getElementById("nomeItem").value, categoria: categoriaSelecionada, setor: document.getElementById("setorItem").value, unidade: document.getElementById("unidadeItem").value, estInicial: document.getElementById("estoqueItem").value, estFinal: document.getElementById("estoqueItem").value, validade: document.getElementById("validadeItem").value, observacao: document.getElementById("obsItem") ? document.getElementById("obsItem").value : "", imagemUrl: document.getElementById("imagemItem") ? document.getElementById("imagemItem").value : "" }; 
    
    try { 
        let resposta; 
        if (id) { 
            resposta = await fetch(`${API_URL}/estoque/${id}`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(dados) }); 
        } else { 
            resposta = await fetch(API_URL + '/estoque', { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(dados) }); 
        }
        tratarErroAuth(resposta); 
        if (!resposta.ok) { 
            const erroServidor = await resposta.json(); alert("Atenção! Erro no servidor: " + erroServidor.error); return; 
        }
        fecharModal(); 
        carregarEstoque(); 
    } catch (erro) { 
        if(erro.message !== "Não autorizado") alert(`Erro de comunicação com o servidor!`); 
    } finally {
        // 💡 Devolvemos a vida ao botão caso haja um erro ou o utilizador abra o modal de novo
        if (btnSalvar) { btnSalvar.disabled = false; btnSalvar.innerText = "Salvar"; }
    }
}

async function deletarItem(id) { if(confirm("Apagar?")) { const res = await fetch(`${API_URL}/estoque/${id}`, { method: 'DELETE', headers: getAuthHeaders() }); tratarErroAuth(res); carregarEstoque(); } }

function filtrarTabelaSetor(s, el) { document.querySelectorAll('.abas .aba').forEach(a => a.classList.remove('active')); el.classList.add('active'); filtroSetorAtual = s; atualizarTabela(); }

function atualizarTabela() {
    const tbody = document.getElementById("corpo-tabela"); tbody.innerHTML = ""; const hoje = new Date(); hoje.setHours(0,0,0,0); const termoPesquisa = document.getElementById('inputPesquisa').value.toLowerCase();
    const tema = configPrefs.tipoIcone || 'emoji'; const icones = DICIONARIO_ICONES[tema];
    
    const estoqueFiltrado = estoque.filter(p => {
        const setorSafe = p.setor || ''; const confereSetor = (filtroSetorAtual === 'Geral' || setorSafe.toLowerCase() === filtroSetorAtual.toLowerCase());
        const catProduto = (p.categoria && p.categoria.trim() !== "") ? p.categoria : "Default"; const confereCategoria = (filtroCategoriaAtual === 'Todas' || catProduto.toLowerCase() === filtroCategoriaAtual.toLowerCase());
        const conferePesquisa = p.item.toLowerCase().includes(termoPesquisa);
        const difDias = Math.ceil((new Date(p.validade) - hoje) / (1000 * 3600 * 24)); const diasAlerta = temposValidade[catProduto] || configPrefs.dias;
        let statusAvaliado = 'Valido'; if (difDias < 0) statusAvaliado = 'Vencido'; else if (difDias <= diasAlerta) statusAvaliado = 'Atencao';
        const confereStatus = (filtroStatusAtual === 'Todos' || statusAvaliado === filtroStatusAtual); return confereSetor && confereCategoria && conferePesquisa && confereStatus;
    });

    estoqueFiltrado.forEach(produto => {
        const catProduto = (produto.categoria && produto.categoria.trim() !== "") ? produto.categoria : "Default"; const difDias = Math.ceil((new Date(produto.validade) - hoje) / (1000 * 3600 * 24)); const diasAlerta = temposValidade[catProduto] || configPrefs.dias;
        let stat = difDias < 0 ? `<span class="status vencido">${icones.statusVencido} Vencido</span>` : (difDias <= diasAlerta ? `<span class="status alerta">${icones.statusAtencao} Atenção</span>` : `<span class="status ok">${icones.statusOk} Válido</span>`);
        let textoDiasRestantes = ""; if (difDias > 1) { textoDiasRestantes = `${difDias} dias`; } else if (difDias === 1) { textoDiasRestantes = `1 dia`; } else if (difDias === 0) { textoDiasRestantes = `<span style="color: var(--atencao); font-weight: bold;">Vence Hoje</span>`; } else { textoDiasRestantes = `<span style="color: var(--perigo);">- ${Math.abs(difDias)} dias</span>`; }

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td style="text-align: center;"><input type="checkbox" class="check-item" value="${produto.id}" onchange="verificarBotoesMassa()"></td>
            <td><strong>${produto.item}</strong></td><td>${catProduto}</td>
            <td style="text-align: center;">${produto.estFinal} ${produto.unidade}</td>
            <td style="text-align: center;">${produto.setor || '-'}</td>
            <td style="text-align: center;">${produto.validade.split('-').reverse().join('/')}</td>
            <td style="text-align: center;">${textoDiasRestantes}</td><td style="text-align: center;">${stat}</td>
            <td style="text-align: center;"><span class="icon-obs" style="font-size: 18px; cursor: pointer;" title="Ver Detalhes/Imagem" onclick="abrirModalObservacao(${produto.id})">${icones.info}</span></td>
            <td style="text-align: center; white-space: nowrap;"><button class="btn-icon" onclick="editarItem(${produto.id})" title="Editar">${icones.edit}</button><button class="btn-icon" onclick="deletarItem(${produto.id})" title="Apagar">${icones.apagar}</button></td>
        `;
        tbody.appendChild(tr);
    });
    verificarBotoesMassa();
}

function filtrarTabelaStatus(status) { filtroStatusAtual = status; atualizarTabela(); } function filtrarTabelaCategoria(c) { filtroCategoriaAtual = c; atualizarTabela(); }

function atualizarPainelVencimentos() { 
    const painel = document.getElementById("painel-vencimentos"); painel.innerHTML = ""; const hoje = new Date(); hoje.setHours(0,0,0,0); let itensAlerta = [];
    const tema = configPrefs.tipoIcone || 'emoji'; const icones = DICIONARIO_ICONES[tema];

    estoque.forEach(p => { 
        const catProduto = (p.categoria && p.categoria.trim() !== "") ? p.categoria : "Default"; const dif = Math.ceil((new Date(p.validade) - hoje) / (1000 * 3600 * 24)); const diasAlerta = temposValidade[catProduto] || configPrefs.dias;
        if (dif <= diasAlerta) { itensAlerta.push({ produto: p, dif: dif }); } 
    }); 
    itensAlerta.sort((a, b) => a.dif - b.dif);
    
    if (itensAlerta.length > 0) {
        itensAlerta.forEach(item => {
            const p = item.produto; const dif = item.dif; const div = document.createElement('div'); div.className = dif < 0 ? 'item-vencimento' : 'item-vencimento alerta'; 
            const bolinhaPulsante = dif < 0 ? '<span class="pulso-vermelho" title="Atenção Urgente!"></span>' : '';
            const textoStatus = dif < 0 ? `${icones.statusVencido} VENCIDO` : `${icones.statusAtencao} Vence em ${dif} dias`;
            div.innerHTML = `<h3>${bolinhaPulsante}${p.item}</h3><p>${p.estFinal} ${p.unidade} (📍 ${p.setor})</p><p>${p.validade.split('-').reverse().join('/')}</p><p><b>${textoStatus}</b></p>`; painel.appendChild(div);
        });
    } else { painel.innerHTML = `<p style='color: gray; padding: 10px;'>${icones.statusOk} Nenhum alerta de validade no momento. Tudo limpo!</p>`; }
}

function atualizarDashboard() { 
    const contCat = {}; const contSetor = {}; let vencidos = 0; let atencao = 0; const hoje = new Date(); hoje.setHours(0,0,0,0); 
    estoque.forEach(p => { 
        const catProduto = (p.categoria && p.categoria.trim() !== "") ? p.categoria : "Default"; contCat[catProduto] = (contCat[catProduto] || 0) + 1; const setorProduto = (p.setor && p.setor.trim() !== "") ? p.setor : "Geral"; contSetor[setorProduto] = (contSetor[setorProduto] || 0) + 1;
        const dif = Math.ceil((new Date(p.validade) - hoje) / (1000 * 3600 * 24)); const alerta = temposValidade[catProduto] || configPrefs.dias; if (dif < 0) vencidos++; else if (dif <= alerta) atencao++; 
    }); 
    
    document.getElementById('cards-resumo').innerHTML = `
        <div class="card" style="border-left: 4px solid var(--azul-primario); padding: 15px;"><h4 style="color: gray; font-size: 12px; text-transform: uppercase;">Total de Registros</h4><p style="font-size: 28px; font-weight: bold; color: var(--texto); margin-top: 5px;">${estoque.length}</p></div>
        <div class="card" style="border-left: 4px solid var(--atencao); padding: 15px;"><h4 style="color: gray; font-size: 12px; text-transform: uppercase;">Em Atenção</h4><p style="font-size: 28px; font-weight: bold; color: #b38f00; margin-top: 5px;">${atencao}</p></div>
        <div class="card" style="border-left: 4px solid var(--perigo); padding: 15px;"><h4 style="color: gray; font-size: 12px; text-transform: uppercase;">Vencidos</h4><p style="font-size: 28px; font-weight: bold; color: var(--perigo); margin-top: 5px;">${vencidos}</p></div>`; 
    
    if (meuGraficoCategorias) meuGraficoCategorias.destroy(); if (meuGraficoBarras) meuGraficoBarras.destroy(); 
    meuGraficoCategorias = new Chart(document.getElementById('graficoCategorias').getContext('2d'), { type: 'doughnut', data: { labels: Object.keys(contCat), datasets: [{ data: Object.values(contCat), backgroundColor: ['#2A81CB', '#FFD3B6', '#4CAF50', '#FFD93D', '#FF6B6B'] }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: document.body.classList.contains('dark-mode') ? '#E0E0E0' : '#333' } } } } }); 
    const setoresNomes = Object.keys(contSetor); const dadosValidos = []; const dadosAtencao = []; const dadosVencidos = [];
    setoresNomes.forEach(setor => {
        let v = 0, a = 0, e = 0; estoque.filter(p => (p.setor && p.setor.trim() !== "" ? p.setor : "Geral") === setor).forEach(p => { const catProduto = (p.categoria && p.categoria.trim() !== "") ? p.categoria : "Default"; const dif = Math.ceil((new Date(p.validade) - hoje) / (1000 * 3600 * 24)); const alerta = temposValidade[catProduto] || configPrefs.dias; if (dif < 0) e++; else if (dif <= alerta) a++; else v++; });
        dadosValidos.push(v); dadosAtencao.push(a); dadosVencidos.push(e);
    });
    const textColor = document.body.classList.contains('dark-mode') ? '#E0E0E0' : '#333';
    meuGraficoBarras = new Chart(document.getElementById('graficoBarras').getContext('2d'), { type: 'bar', data: { labels: setoresNomes, datasets: [ { label: 'Válidos', data: dadosValidos, backgroundColor: '#6EE1E1', barThickness: 35 }, { label: 'Em Atenção', data: dadosAtencao, backgroundColor: '#45B7D1', barThickness: 35 }, { label: 'Vencidos', data: dadosVencidos, backgroundColor: '#2A81CB', borderRadius: {topLeft: 8, topRight: 8}, barThickness: 35 } ] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, position: 'bottom', labels: {boxWidth: 12, color: textColor} } }, scales: { x: { stacked: true, grid: {display: false}, ticks: { color: textColor } }, y: { stacked: true, beginAtZero: true, ticks: { color: textColor }, grid: { color: document.body.classList.contains('dark-mode') ? '#333' : '#e0e0e0' } } } } }); 
}

function exportarParaPDF() {
    const { jsPDF } = window.jspdf; const doc = new jsPDF(); doc.setFontSize(18); doc.text("Relatório de Estoque - IceGest", 14, 20); doc.setFontSize(11); doc.text(`Gerado em: ${new Date().toLocaleDateString()}`, 14, 28); const hoje = new Date(); hoje.setHours(0,0,0,0);
    const corpoTabelaPDF = estoque.map(p => { const catProduto = (p.categoria && p.categoria.trim() !== "") ? p.categoria : "Default"; const difDias = Math.ceil((new Date(p.validade) - hoje) / (1000 * 3600 * 24)); const diasAlerta = temposValidade[catProduto] || configPrefs.dias; let stat = difDias < 0 ? 'Vencido' : (difDias <= diasAlerta ? `Atenção (${difDias}d)` : 'Ok'); return [p.item, catProduto, `${p.estFinal} ${p.unidade}`, p.setor, p.validade.split('-').reverse().join('/'), stat]; });
    doc.autoTable({ startY: 35, head: [['Produto', 'Categoria', 'Qtd', 'Setor', 'Validade', 'Status']], body: corpoTabelaPDF, theme: 'grid', headStyles: { fillColor: [42, 129, 203] } }); doc.save("Relatorio_IceGest.pdf");
}

function exportarParaExcel() { let csv = "Item,Categoria,Setor,Estoque,Validade,Observacao\n"; const hoje = new Date(); hoje.setHours(0,0,0,0); estoque.forEach(r => { const catProduto = (r.categoria && r.categoria.trim() !== "") ? r.categoria : "Default"; csv += `${r.item},${catProduto},${r.setor},${r.estFinal},${r.validade},${r.observacao || ""}\n`; }); const link = document.createElement("a"); link.href = encodeURI("data:text/csv;charset=utf-8," + csv); link.download = "estoque.csv"; link.click(); }

function gerarListaCompras() {
    const hoje = new Date(); hoje.setHours(0,0,0,0); let itensParaComprar = [];
    estoque.forEach(p => { const catProduto = p.categoria || "Default"; const difDias = Math.ceil((new Date(p.validade) - hoje) / (1000 * 3600 * 24)); const diasAlerta = temposValidade[catProduto] || configPrefs.dias; if (difDias <= diasAlerta) { itensParaComprar.push(`- [ ] ${p.item} (📍 ${p.setor}) - ${difDias < 0 ? 'VENCIDO' : 'Quase a Vencer'}`); } });
    if (itensParaComprar.length === 0) { alert("O estoque está ótimo! Não há itens vencidos ou a vencer para comprar."); return; }
    const textoLista = `🛒 *Lista de Compras IceGest* 🛒\nData: ${hoje.toLocaleDateString('pt-BR')}\n\n${itensParaComprar.join('\n')}`; navigator.clipboard.writeText(textoLista).then(() => { alert("Lista de compras gerada e copiada com sucesso! Cole no WhatsApp ou no seu Bloco de Notas.\n\n" + textoLista); }).catch(err => { alert("Erro ao copiar. Aqui está a lista:\n\n" + textoLista); });
}

function imprimirEtiquetas() {
    const checkboxes = document.querySelectorAll('.check-item:checked'); if (checkboxes.length === 0) return;
    let conteudoHTML = `<html><head><title>Imprimir Etiquetas</title><style>body { font-family: Arial, sans-serif; margin: 0; padding: 20px; display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; align-items: start; } .etiqueta { border: 2px solid #000; padding: 15px; text-align: center; border-radius: 8px; page-break-inside: avoid; display: flex; flex-direction: column; align-items: center; } .img-etiqueta { width: 100px; height: 100px; object-fit: contain; margin-bottom: 10px; } .titulo { font-weight: bold; font-size: 18px; margin-bottom: 5px; text-transform: uppercase; } .info { font-size: 14px; margin: 2px 0; color: #333; } .validade { font-size: 16px; font-weight: bold; margin-top: 10px; padding-top: 10px; border-top: 1px dashed #000; width: 100%; }</style></head><body>`;
    checkboxes.forEach(cb => { const p = estoque.find(x => x.id === parseInt(cb.value)); if (p) { let imagemHtml = (p.imagemUrl && p.imagemUrl.trim() !== "") ? `<img src="${p.imagemUrl}" class="img-etiqueta">` : ""; conteudoHTML += `<div class="etiqueta">${imagemHtml}<div class="titulo">${p.item}</div><div class="info">Setor: ${p.setor || '-'}</div><div class="info">Cat: ${p.categoria}</div><div class="validade">Validade: ${p.validade.split('-').reverse().join('/')}</div></div>`; } });
    conteudoHTML += '</body></' + 'script>'; conteudoHTML += '<scr' + 'ipt>window.onload = function() { setTimeout(function() { window.print(); }, 800); }</scr' + 'ipt></html>';
    const janelaImpressao = window.open('', '', 'width=800,height=600'); janelaImpressao.document.write(conteudoHTML); janelaImpressao.document.close();
}

function definirFraseDoDia() { const frases = ["O sucesso é a soma de pequenos esforços.", "Organização é o lucro de amanhã.", "Inove nos sabores, controle as validades!"]; document.getElementById('fraseMotivacional').innerText = `"${frases[new Date().getDate() % frases.length]}"`; }

function salvarChaveAPI() { const apiKey = document.getElementById('inputApiKey').value; localStorage.setItem('iceGest_apiKey', apiKey); alert("Chave API salva com sucesso! A Aurora agora está ativa."); }

function carregarConfiguracoes() { 
    document.getElementById('checkDarkMode').checked = configPrefs.escuro; document.getElementById('checkFonteGrande').checked = configPrefs.fonteGrande; document.getElementById('inputDiasAlerta').value = configPrefs.dias; 
    if(document.getElementById('inputBgUrl')) { document.getElementById('inputBgUrl').value = configPrefs.bgUrl || ""; }
    if(document.getElementById('comboTipoIcone')) { document.getElementById('comboTipoIcone').value = configPrefs.tipoIcone || "emoji"; }
    aplicarPreferenciasVisuais(); atualizarUIConfiguracoes(); 
}

function salvarPreferencias() { 
    configPrefs.escuro = document.getElementById('checkDarkMode').checked; configPrefs.fonteGrande = document.getElementById('checkFonteGrande').checked; configPrefs.dias = parseInt(document.getElementById('inputDiasAlerta').value); 
    if(document.getElementById('inputBgUrl')) { configPrefs.bgUrl = document.getElementById('inputBgUrl').value.trim(); }
    if(document.getElementById('comboTipoIcone')) { configPrefs.tipoIcone = document.getElementById('comboTipoIcone').value; }
    localStorage.setItem('iceGest_prefs', JSON.stringify(configPrefs)); 
    aplicarPreferenciasVisuais(); atualizarIconesDaInterface(); atualizarTabela(); atualizarPainelVencimentos(); 
}

function aplicarPreferenciasVisuais() { 
    if(configPrefs.escuro) document.body.classList.add('dark-mode'); else document.body.classList.remove('dark-mode'); 
    if(configPrefs.fonteGrande) document.body.classList.add('large-font'); else document.body.classList.remove('large-font'); 
    if (configPrefs.bgUrl && configPrefs.bgUrl !== "") { document.documentElement.style.setProperty('--bg-img', `url('${configPrefs.bgUrl}')`); } else { document.documentElement.style.setProperty('--bg-img', 'none'); }
    if(document.getElementById('app-completo').style.display === 'flex' && document.getElementById('tela-dashboard').classList.contains('active')) atualizarDashboard();
}

function atualizarUIConfiguracoes() {
    const tema = configPrefs.tipoIcone || 'emoji'; const icones = DICIONARIO_ICONES[tema];
    const ulCat = document.getElementById('listaUiCategorias'); ulCat.innerHTML = ''; 
    categorias.forEach((c, i) => { const tempo = temposValidade[c] || configPrefs.dias; ulCat.innerHTML += `<li>${c} <span style="color: gray; font-size: 12px;">(Aviso: ${tempo} dias)</span> <div><button class="btn-icon" onclick="editarCategoria(${i})">${icones.edit}</button><button class="btn-icon" onclick="apagarCategoria(${i})">${icones.apagar}</button></div></li>`; });
    
    const ulSet = document.getElementById('listaUiSetores'); ulSet.innerHTML = ''; 
    setores.forEach((s, i) => { ulSet.innerHTML += `<li>${s} <div><button class="btn-icon" onclick="editarSetor(${i})">${icones.edit}</button><button class="btn-icon" onclick="apagarSetor(${i})">${icones.apagar}</button></div></li>` });
    
    document.getElementById('categoriaItem').innerHTML = `<option value="">-- Sem Categoria --</option>` + categorias.map(c => `<option value="${c}">${c}</option>`).join(''); document.getElementById('setorItem').innerHTML = setores.map(s => `<option value="${s}">${s}</option>`).join('');
    const containerAbas = document.getElementById('abas-filtro'); let abasHTML = `<div class="aba ${filtroSetorAtual === 'Geral' ? 'active' : ''}" onclick="filtrarTabelaSetor('Geral', this)">Geral</div>`; setores.forEach(s => abasHTML += `<div class="aba ${filtroSetorAtual === s ? 'active' : ''}" onclick="filtrarTabelaSetor('${s}', this)">${s}</div>`); containerAbas.innerHTML = abasHTML;
    const comboFiltro = document.getElementById('comboFiltroCategoria'); comboFiltro.innerHTML = `<option value="Todas">Filtro: Todas</option><option value="Default">Filtro: Default</option>` + categorias.map(c => `<option value="${c}">${c}</option>`).join(''); comboFiltro.value = filtroCategoriaAtual;
}

function fecharModalEdicao() { document.getElementById("modalEdicaoConfig").classList.remove('show'); setTimeout(() => { document.getElementById("formEdicaoConfig").reset(); }, 300); }
function editarCategoria(index) { const catAntiga = categorias[index]; configEmEdicao = { tipo: 'categoria', index: index, nomeAntigo: catAntiga }; document.getElementById("tituloModalEdicao").innerText = "Editar Categoria"; document.getElementById("labelNomeEdicao").innerText = "Nome da Categoria"; document.getElementById("inputNomeEdicao").value = catAntiga; document.getElementById("grupoDiasEdicao").style.display = "block"; document.getElementById("inputDiasEdicao").value = temposValidade[catAntiga] || configPrefs.dias; document.getElementById("inputDiasEdicao").required = true; document.getElementById("modalEdicaoConfig").classList.add('show'); }
function editarSetor(index) { const setorAntigo = setores[index]; configEmEdicao = { tipo: 'setor', index: index, nomeAntigo: setorAntigo }; document.getElementById("tituloModalEdicao").innerText = "Editar Setor"; document.getElementById("labelNomeEdicao").innerText = "Nome do Setor"; document.getElementById("inputNomeEdicao").value = setorAntigo; document.getElementById("grupoDiasEdicao").style.display = "none"; document.getElementById("inputDiasEdicao").required = false; document.getElementById("modalEdicaoConfig").classList.add('show'); }

// 💡 FUNÇÕES ATUALIZADAS PARA COMUNICAR COM O SERVIDOR
async function salvarEdicaoConfig(e) {
    e.preventDefault(); const novoNome = document.getElementById("inputNomeEdicao").value.trim() || "Default";
    try {
        if (configEmEdicao.tipo === 'categoria') { 
            const novoTempo = parseInt(document.getElementById("inputDiasEdicao").value) || configPrefs.dias; 
            await fetch(`${API_URL}/categorias/${configEmEdicao.nomeAntigo}`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify({ novoNome, diasAviso: novoTempo }) });
        } else if (configEmEdicao.tipo === 'setor') { 
            await fetch(`${API_URL}/setores/${configEmEdicao.nomeAntigo}`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify({ novoNome }) });
        }
        fecharModalEdicao(); await carregarDadosGlobais(); atualizarTabela(); atualizarPainelVencimentos(); atualizarDashboard();
    } catch(erro) { alert("Erro ao editar!"); }
}

async function adicionarCategoria() { 
    const inputNovo = document.getElementById('novaCategoria'); const inputTempo = document.getElementById('tempoValidadeCat'); 
    const nome = inputNovo.value.trim(); const dias = parseInt(inputTempo.value) || configPrefs.dias; 
    if (nome) { 
        const res = await fetch(API_URL + '/categorias', { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify({ nome, diasAviso: dias }) });
        if(res.ok) { inputNovo.value = ''; inputTempo.value = ''; await carregarDadosGlobais(); atualizarTabela(); atualizarPainelVencimentos(); } else { alert("Erro: Esta categoria já existe no servidor!"); }
    } 
}

async function apagarCategoria(i) { 
    const cat = categorias[i]; 
    if(confirm(`Deseja apagar a categoria "${cat}" para todos os utilizadores?`)) {
        await fetch(`${API_URL}/categorias/${cat}`, { method: 'DELETE', headers: getAuthHeaders() });
        await carregarDadosGlobais(); atualizarTabela(); atualizarPainelVencimentos();
    }
}

async function adicionarSetor() { 
    const i = document.getElementById('novoSetor'); 
    if (i.value.trim()) { 
        const res = await fetch(API_URL + '/setores', { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify({ nome: i.value.trim() }) });
        if(res.ok) { i.value = ''; await carregarDadosGlobais(); } else { alert("Erro: Este setor já existe no servidor!"); }
    } 
}

async function apagarSetor(i) { 
    const set = setores[i]; 
    if(confirm(`Deseja apagar o setor "${set}" para todos os utilizadores?`)) {
        await fetch(`${API_URL}/setores/${set}`, { method: 'DELETE', headers: getAuthHeaders() });
        await carregarDadosGlobais();
    }
}

function carregarImagemLocal(input) {
    if (input.files && input.files[0]) {
        const leitor = new FileReader();
        leitor.onload = function(e) {
            try { configPrefs.bgUrl = e.target.result; if(document.getElementById('inputBgUrl')) document.getElementById('inputBgUrl').value = ""; localStorage.setItem('iceGest_prefs', JSON.stringify(configPrefs)); aplicarPreferenciasVisuais();
            } catch (erro) { alert("⚠️ A imagem é muito pesada! Escolha uma mais leve."); }
        };
        leitor.readAsDataURL(input.files[0]);
    }
}

function removerFundo() {
    configPrefs.bgUrl = ""; if(document.getElementById('inputBgUrl')) document.getElementById('inputBgUrl').value = ""; if(document.getElementById('inputBgFile')) document.getElementById('inputBgFile').value = "";
    localStorage.setItem('iceGest_prefs', JSON.stringify(configPrefs)); aplicarPreferenciasVisuais();
}

verificarLogin();