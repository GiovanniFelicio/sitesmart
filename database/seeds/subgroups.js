
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

        {id_sbr_groups: 6, name: 'Planejamento e alinhamento da expectativa de vendas'},
        {id_sbr_groups: 6, name: 'Pré-venda'},
        {id_sbr_groups: 6, name: 'Realização da venda'},
        {id_sbr_groups: 6, name: 'Comissionamento'},
        {id_sbr_groups: 6, name: 'Análise de desempenho de vendas'},
        {id_sbr_groups: 6, name: 'Gestão de relacionamento com clientes'},

        {id_sbr_groups: 7, name: 'Planejamento e Alinhamento dos Serviços'},
        {id_sbr_groups: 7, name: 'Realização dos Serviços'},
        {id_sbr_groups: 7, name: 'Realização da venda'},
        {id_sbr_groups: 7, name: 'Análise de Resultados'},

        {id_sbr_groups: 8, name: 'Formação de carga'},
        {id_sbr_groups: 8, name: 'Separação e expedição'},
        {id_sbr_groups: 8, name: 'Acertos da distribuição'},
        {id_sbr_groups: 8, name: 'Análise do desempenho da distribuição'},

        {id_sbr_groups: 9, name: 'Planejamento e provisões dos gastos'},
        {id_sbr_groups: 9, name: 'Controle das contas a pagar'},
        {id_sbr_groups: 9, name: 'Acertos da distribuição'},
        {id_sbr_groups: 9, name: 'Realização dos pagamentos'},
        {id_sbr_groups: 9, name: 'Análise dos gastos'},

        {id_sbr_groups: 10, name: 'Provisão das receitas'},
        {id_sbr_groups: 10, name: 'Controle das contas a receber'},
        {id_sbr_groups: 10, name: 'Prevenção da inadimplência'},
        {id_sbr_groups: 10, name: 'Realização das baixas dos recebimentos'},
        {id_sbr_groups: 10, name: 'Análise das receitas'},

        {id_sbr_groups: 11, name: 'Controle das contas Caixa e Bancos'},
        {id_sbr_groups: 11, name: 'Análise de fluxo de caixa'},
        {id_sbr_groups: 11, name: 'Controle orçamentário'},
        {id_sbr_groups: 11, name: 'Análise de desempenho do negócio'},


        {id_sbr_groups: 12, name: 'Análises para elaboração da estratégia'},
        {id_sbr_groups: 12, name: 'Elaboração e desdobramento da estratégia'},
        {id_sbr_groups: 12, name: 'Análise dos resultados estratégicos'},

        {id_sbr_groups: 13, name: 'Remuneração e benefícios'},
        {id_sbr_groups: 13, name: 'Recrutamento e seleção'},
        {id_sbr_groups: 13, name: 'Treinamento e desenvolvimento'},
        {id_sbr_groups: 13, name: 'Avaliação de desempenho'},
        {id_sbr_groups: 13, name: 'Desligamentos'},
        {id_sbr_groups: 13, name: 'Departamento pessoal'},
        {id_sbr_groups: 13, name: 'Indicadores de pessoal'},
      
        {id_sbr_groups: 14, name: 'Procedimentos contábeis'},
        {id_sbr_groups: 14, name: 'Procedimentos fiscais'},
        {id_sbr_groups: 14, name: 'Análises fiscais e contábeis'},

        {id_sbr_groups: 15, name: 'Identificação dos bens patrimoniais'},
        {id_sbr_groups: 15, name: 'Controle dos bens patrimoniais'},
        {id_sbr_groups: 15, name: 'Inventário dos bens patrimoniais'},
        {id_sbr_groups: 15, name: 'Análises patrimoniais'}

      ]);
    });
};
