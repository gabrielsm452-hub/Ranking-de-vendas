let vendedores = [];
let ultimoPrimeiro = null;

let dadosSalvos = localStorage.getItem("ranking");
if (dadosSalvos) vendedores = JSON.parse(dadosSalvos);

function adicionarVendedor() {
    let nome = document.getElementById("nome").value.trim();
    let loja = document.getElementById("loja").value.trim();
    let fotoInput = document.getElementById("foto");

    if(nome === "" || loja === "") return alert("Preencha nome e loja");

    let existente = vendedores.find(v => v.nome.toLowerCase() === nome.toLowerCase());
    if (existente) return alert("Vendedor já existe.");

    if (fotoInput.files[0]) {
        let reader = new FileReader();
        reader.onload = e => {
            vendedores.push({nome, loja, valor:0, foto:e.target.result});
            atualizarRanking();
        };
        reader.readAsDataURL(fotoInput.files[0]);
    } else {
        vendedores.push({nome, loja, valor:0, foto:""});
        atualizarRanking();
    }

    document.getElementById("nome").value = "";
    document.getElementById("loja").value = "";
    document.getElementById("foto").value = "";
}

function editarNome(i, novoNome){
    if(novoNome.trim()==="") return;
    vendedores[i].nome = novoNome.trim();
    atualizarRanking();
}

function editarValor(i, novoValor){
    let valor = parseFloat(novoValor);
    if(isNaN(valor)) return;
    vendedores[i].valor = valor;
    atualizarRanking();
}

function atualizarRanking() {

    vendedores.sort((a,b)=>b.valor-a.valor);

    if (vendedores[0] && vendedores[0].nome !== ultimoPrimeiro) {
        mostrarCampeao(vendedores[0]);
        ultimoPrimeiro = vendedores[0].nome;
    }

    document.getElementById("primeiro").innerHTML =
        vendedores[0] ? `
        <div class="campeao-card">
            ${vendedores[0].foto ? `<img src="${vendedores[0].foto}" class="foto-campeao">` : ""}
            <div>${vendedores[0].nome}</div>
            <div class="loja-badge">${vendedores[0].loja}</div>
            <div>
                ${vendedores[0].valor.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}
            </div>
        </div>` : "---";

    document.getElementById("segundo").innerHTML =
        vendedores[1] ? vendedores[1].nome : "---";

    document.getElementById("terceiro").innerHTML =
        vendedores[2] ? vendedores[2].nome : "---";

    let listaHTML="";
    vendedores.forEach((v,i)=>{
        listaHTML+=`
        <div class="card">
            <button class="botao-remover" onclick="removerVendedor(${i})">-</button>

            <input type="text" class="nome-input" value="${v.nome}"
                onkeydown="if(event.key==='Enter'){editarNome(${i}, this.value)}">

            <div class="loja-badge">${v.loja}</div>

            <input type="number" class="valor-input" value="${v.valor}"
                onkeydown="if(event.key==='Enter'){editarValor(${i}, this.value)}">
        </div>`;
    });

    document.getElementById("lista").innerHTML=listaHTML;

    localStorage.setItem("ranking", JSON.stringify(vendedores));
}

function removerVendedor(i){
    if(confirm("Remover vendedor?")){
        vendedores.splice(i,1);
        atualizarRanking();
    }
}

function mostrarCampeao(vendedor){

    let overlay = document.getElementById("overlayCampeao");
    let conteudo = document.getElementById("overlayConteudo");

    conteudo.innerHTML = `
        ${vendedor.foto ? `<img src="${vendedor.foto}" class="overlay-foto">` : ""}
        <h2>${vendedor.nome}</h2>
        <div class="loja-badge">${vendedor.loja}</div>
        <p>${vendedor.valor.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}</p>
    `;

    overlay.style.display="flex";

    setTimeout(()=>{
        overlay.style.display="none";
    },4000);
}

atualizarRanking();
