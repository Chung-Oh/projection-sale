"use strict";

// Aplicando máscara de moeda em campos com valores flutuantes
$(document).ready(function(){
    $('.money').mask('000.000.000.000.000,00', {reverse: true});
});

// Toasts
const exibirToast = () => {
    document.querySelector('.toast-body').innerHTML = new Date();
    let toastElList = [].slice.call(document.querySelectorAll('.toast'))
    let toastList = toastElList.map(function(toastEl) {
        return new bootstrap.Toast(toastEl);
    });
    toastList.forEach(toast => toast.show());
};

// Tolltips informa ao usuário como preencher o campo flutuante
var inputElementQtdTotalProdutos = document.getElementById('QtdTotalProdutos');
var tooltipQtdTotalProdutos = new bootstrap.Tooltip(inputElementQtdTotalProdutos, {
    boundary: 'window'
});

var inputElementCustoUnitario = document.getElementById('custoUnitario');
var tooltipCustoUnitario = new bootstrap.Tooltip(inputElementCustoUnitario, {
    boundary: 'window'
});

var inputElementValorAtacado = document.getElementById('valorAtacado');
var tooltipValorAtacado = new bootstrap.Tooltip(inputElementValorAtacado, {
    boundary: 'window'
});

var inputElementValorVarejo = document.getElementById('valorVarejo');
var tooltipValorVarejo = new bootstrap.Tooltip(inputElementValorVarejo, {
    boundary: 'window'
});

var inputElementBtnLimparQtd = document.getElementById('btnLimparQtd');
var tooltipBtnLimparQtd = new bootstrap.Tooltip(inputElementBtnLimparQtd, {
    boundary: 'window'
});

var inputElementBtnLimparCusto = document.getElementById('btnLimparCusto');
var tooltipBtnLimparCusto = new bootstrap.Tooltip(inputElementBtnLimparCusto, {
    boundary: 'window'
});

var inputElementBtnLimparAtacado = document.getElementById('btnLimparAtacado');
var tooltipBtnLimparAtacado = new bootstrap.Tooltip(inputElementBtnLimparAtacado, {
    boundary: 'window'
});

var inputElementBtnLimparVarejo = document.getElementById('btnLimparVarejo');
var tooltipBtnLimparVarejo = new bootstrap.Tooltip(inputElementBtnLimparVarejo, {
    boundary: 'window'
});

// Botao limpar Todos Campos ao mesmo tempo
document.querySelector('#limpar').addEventListener('click', function() {
    const campos = document.querySelectorAll('input');
    campos.forEach(function(campo) {
        campo.value = null;
    });
    qtdTotalProdutosElement.focus();
});

// Limpa campo individualmente e focando em seguida
const limparCampo = id => {
    let campo = document.querySelector(id);
    campo.value = null;
    campo.focus();
};

// Campos do Form
const qtdTotalProdutosElement = document.querySelector('#QtdTotalProdutos');
const custoUnitarioElement    = document.querySelector('#custoUnitario');
const valorAtacadoElement     = document.querySelector('#valorAtacado');
const valorVarejoElement      = document.querySelector('#valorVarejo');
const todosCamposForm = [qtdTotalProdutosElement, custoUnitarioElement, valorAtacadoElement, valorVarejoElement];

// Evento quando submetido o Form
const calcular = () => {
    const qtdProdAtacado    = parseFloat(qtdTotalProdutosElement.value.replace('.', '').replace(',', '.'));
    const produtoCusto      = parseFloat(custoUnitarioElement.value.replace('.', '').replace(',', '.'));
    const valorVendaAtacado = parseFloat(valorAtacadoElement.value.replace('.', '').replace(',', '.'));
    const valorVarejo       = parseFloat(valorVarejoElement.value.replace('.', '').replace(',', '.'));
    projecaoVenda(qtdProdAtacado, produtoCusto, valorVendaAtacado, valorVarejo);
};

// Regra de negócio
const projecaoVenda = (qtdProdAtacado, produtoCusto, valorVendaAtacado, valorVarejo) => {
    const created = new Date().toString().replace(' GMT-0300 (Brasilia Standard Time)', '');
    let restanteProduto = qtdProdAtacado * produtoCusto / valorVendaAtacado;
    let lucroRestanteProdutoVarejo = restanteProduto * valorVarejo;
    restanteProduto = Math.round(restanteProduto);
    lucroRestanteProdutoVarejo = lucroRestanteProdutoVarejo.toFixed(2).toString().replace('.', ',');
    exibirAlert(restanteProduto, lucroRestanteProdutoVarejo);
    const args =  [
        qtdProdAtacado + ' uni(s)',
        'R$ ' + produtoCusto.toFixed(2).toString().replace('.', ','),
        'R$ ' + valorVendaAtacado.toFixed(2).toString().replace('.', ','),
        'R$ ' + valorVarejo.toFixed(2).toString().replace('.', ','),
        restanteProduto + ' uni(s)',
        'R$ ' + lucroRestanteProdutoVarejo,
        created
    ];
    preencherTabela(args);
};

let id = 0;
const preencherTabela = params => {
    document.querySelector('#tableHistoryContainer').classList.remove('d-none');
    const tbody = document.querySelector('tbody');
    let tr = document.createElement('tr');
    let tdID = document.createElement('td');
    tdID.innerHTML = ++id;
    tr.appendChild(tdID);
    for (let index = 0; index < 7; index++) {
        let td = document.createElement('td');
        td.innerHTML = params[index];
        tr.appendChild(td);
    }
    let tdBtn = document.createElement('td');
    let btnDelete = '<button type="button" class="btn btn-outline-danger btn-sm remover" onclick="removeRegistro(this)"><img src="icons/delete-24px.svg" alt="Limpar campo"></button>';
    tdBtn.innerHTML = btnDelete;
    tr.appendChild(tdBtn);
    tbody.prepend(tr);
};

// Alerta
const alert       = document.querySelector('#alert');
const bsAlert     = new bootstrap.Alert(alert);
const exibirAlert = (restanteProduto, lucroRestanteProdutoVarejo) => {
    alert.classList.add('show');
    document.querySelector('#alertDiv').appendChild(alert);
    document.querySelector('#alertSobraProduto').innerHTML = `Sobrou <strong>${restanteProduto}</strong> produto(s) para vender a varejo.`;
    document.querySelector('#alertLucroVarejo').innerHTML  = `Lucro de venda varejo <strong>R$ ${lucroRestanteProdutoVarejo}</strong>.`;
    alert.classList.remove('d-none');
};

// Validação campos Form
(function () {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')
    // Loop over them and prevent submission
    Array.prototype.slice.call(forms).forEach(function (form) {
        form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
                focusNoCampoVazio();
            } else {
                event.preventDefault();
                calcular();
                exibirToast();
            }
            form.classList.add('was-validated');
        }, false);
    });
})();

const focusNoCampoVazio = () => {
    todosCamposForm.forEach(function(campo) {
        if (campo.value === '') {
            campo.focus();
        }
    });
};

// Remove linha tabela
const removeRegistro = btn => {
    btn.parentNode.parentNode.remove()
};