
exports.seed = function(knex) {
  return knex('sbr_groups').del()
    .then(function () {
      return knex('sbr_groups').insert([
        {name: 'COMPRAS'},
        {name: 'PRODUÇÃO'},
        {name: 'PRECIFICAÇÃO'},
        {name: 'ESTOCAGEM'},
        {name: 'WMS'},
        {name: 'VENDAS'},
        {name: 'PRESTAÇÃO DE SERVIÇOS'},
        {name: 'DISTRIBUIÇÃO'},
        {name: 'PAGAMENTOS'},
        {name: 'RECEBIMENTOS'},
        {name: 'GESTÃO FINANCEIRA'},
        {name: 'GESTÃO ESTRATÉGICA'},
        {name: 'GESTÃO DE PESSOAS'},
        {name: 'FISCAL E CONTÁBIL'},
        {name: 'CONTROLE PATRIMONIAL'},
      ]);
    });
};
