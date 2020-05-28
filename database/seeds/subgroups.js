
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('sbr_groups_sub').del()
    .then(function () {
      // Inserts seed entries
      return knex('sbr_groups_sub').insert([
        {id_sbr_groups: 1, name: 'Análise da necessidade de compras'},
        {id_sbr_groups: 1, name: 'Realização da compra'},
        {id_sbr_groups: 1, name: 'Recebimento de compras'},
        {id_sbr_groups: 1, name: 'Análise de desempenho de compras'},

        {id_sbr_groups: 2, name: 'Planejamento e alinhamento das expectativas de produção'},
        {id_sbr_groups: 2, name: 'Controle de produção'},
        {id_sbr_groups: 2, name: 'Realização da produção'},
        {id_sbr_groups: 2, name: 'Desempenho da produção'},

        {id_sbr_groups: 3, name: 'Apuração de custos'},
        {id_sbr_groups: 3, name: 'Formação de preço de venda'},

        {id_sbr_groups: 4, name: 'Organização de estoques'},
        {id_sbr_groups: 4, name: 'Controle de avarias'},
        {id_sbr_groups: 4, name: 'Balanço e inventário'},
        {id_sbr_groups: 4, name: 'Análise do estoque'},

        {id_sbr_groups: 5, name: 'Organização do armazém'},
        {id_sbr_groups: 5, name: 'Recebimento de mercadorias'},
        {id_sbr_groups: 5, name: 'Separação de mercadorias'},
        {id_sbr_groups: 5, name: 'Expedição de mercadorias'},
      ]);
    });
};
