const knex = require('../database');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');
const Moment = require('moment');
const BeansQn = require('../beans/QuestionsBean');

module.exports = {
  async index(req, res, next) {
    try {
      var id = cryptr.decrypt(req.params.id);
      var questions = await knex("sbr_groups_sub_qn").where("id_sbr_groups_sub", id);
      var navData = await knex.select('gp.name as gp_name', 'sub.name as sub_name', 'gp.id as id_group')
                                  .from('sbr_groups_sub as sub')
                                  .join('sbr_groups as gp')
                                  .where('sub.id', id)
                                  .whereRaw(`gp.id = sub.id_sbr_groups`).first();

      var {gp_name, sub_name, id_group} = navData;
      questions.forEach((e) => {
        e.number = e.id;
        e.id = cryptr.encrypt(e.id);
        e.created_at = Moment(e.created_at).format("DD-MM-Y  H:m:ss");
      });
      var models = await knex("sbr_groups_sub_qn_models");
      return res.render("questions/questions", {
        layout: "default",
        questions: questions,
        reference: req.params.id,
        models: models,
        gp_name: gp_name,
        sub_name: sub_name,
        id_group: cryptr.encrypt(id_group)
      });
    } catch (error) {
      console.log(error);
      req.flash("error_msg", "Error interno");
      res.redirect(req.header("Referer") || "/");
    }
  },
  async create(req, res, next) {
    var errors = [];
    var error_msg = "";
    try {
      if (!req.body.question || typeof req.body.question == undefined || req.body.question == null ) {
        errors.push("Questão Inválida");
      }
      try {
        if ((await BeansQn.findQuestion(req.body.question)) == true) {
          req.flash("error_msg", "Esta questão já existe");
          res.redirect(req.header("Referer") || "/");
        }
      } catch (error) {
        req.flash("error_msg", "Error interno");
        res.redirect(req.header("Referer") || "/");
      }
      if ( !req.body.reference || typeof req.body.reference == undefined || req.body.reference == null ) {
        errors.push("Erro de referência");
      }
      if ( !req.body.modelsCheck || typeof req.body.modelsCheck == undefined || req.body.modelsCheck == null || req.body.modelsCheck.length <= 0 ) {
        errors.push("Modelos inválidos");
      }
      if ( !req.body.value || typeof req.body.value == undefined || req.body.value == null || req.body.value.length <= 0 ) {
        errors.push("Valores inválidos");
      }
      if (errors.length > 0) {
        errors.forEach((e) => {
          error_msg += e + ", ";
        });
        req.flash("error_msg", error_msg);
        res.redirect(req.header("Referer") || "/");
      } else {
        try {
          var { question, reference, modelsCheck, value } = req.body;
          if (modelsCheck.length != value.length) {
            throw "Quantidade de models diferente da quantia de valor";
          }
          var idSub = cryptr.decrypt(reference);
          var subgroup = await knex("sbr_groups_sub")
            .where("id", idSub)
            .first();
          var insertQuest = await knex("sbr_groups_sub_qn").insert({
            id_sbr_groups: subgroup.id_sbr_groups,
            id_sbr_groups_sub: idSub,
            question: question,
          });
          modelsCheck.forEach(async (id, i) => {
            await knex("sbr_groups_sub_qn_models_aux").insert({
              id_sbr_groups_sub_qn: insertQuest,
              id_sbr_groups_sub_qn_models: id,
              value: value[i] || 0,
            });
          });
          req.flash("success_msg", "Questão adicionada");
          return res.redirect(req.header("Referer") || "/");
        } catch (error) {
          req.flash("error_msg", "Erro ao adicionar questão");
          return res.redirect(req.header("Referer") || "/");
        }
      }
    } catch (error) {
      req.flash("error_msg", error);
      return res.redirect(req.header("Referer") || "/");
    }
  },
  async save(req, res, next) {
    try {
      if ( !req.body.idQuestion || typeof req.body.idQuestion == undefined || req.body.idQuestion == null
      ) {
        return res.send("0");
      } 
      else if ( !req.body.answer || typeof req.body.answer == undefined || req.body.answer == null ) {
        return res.send("0");
      } 
      else if ( !req.body.qnr || typeof req.body.qnr == undefined || req.body.qnr == null ) {
        return res.send("0");
      } 
      else {
        var { idQuestion, answer, qnr } = req.body;
        var savedQuests;
        try {
          savedQuests = await knex("sbr_groups_sub_qn_answers")
            .where("id_sbr_groups_sub_qn", idQuestion)
            .where("id_sbr_qnr", qnr);
          getQnr = await knex("sbr_groups_sub_qn_answers").where( "id_sbr_qnr", qnr);
          if (getQnr.length <= 0) {
            updatedQnr = await knex("sbr_qnr")
              .where("id", req.body.qnr)
              .update({
                status: 2,
              });
          }
          if (savedQuests.length > 0) {
            saveQuest = await knex("sbr_groups_sub_qn_answers")
              .where("id_sbr_groups_sub_qn", idQuestion)
              .where("id_sbr_qnr", qnr)
              .update({
                id_sbr_groups_sub_qn_models: answer,
              });
          } else {
            saveQuest = await knex("sbr_groups_sub_qn_answers").insert({
              id_sbr_groups_sub_qn: idQuestion,
              id_sbr_qnr: qnr,
              id_sbr_groups_sub_qn_models: answer,
            });
          }

          if (saveQuest) {
            return res.send("1");
          } else {
            return res.send("0");
          }
        } catch (e) {
          return res.send("0");
        }
      }
    } catch (error) {
      return res.send("0");
    }
  },
  async delete(req, res, next) {
    var idEncrypt = req.params.id;
    var date = new Date();
    var currentDate = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() +  " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    try {
      var idDecrypt = cryptr.decrypt(idEncrypt);
      var questionUp = await knex("sbr_groups_sub_qn")
        .where("id", idDecrypt)
        .update({
          "sbr_groups_sub_qn.deleted_at": currentDate,
        });

      if (questionUp) {
        return res.send("1");
      } else {
        return res.send("0");
      }
    } catch (e) {
      return res.send("0");
    }
  },
  async getmodel(req, res, next) {
    var id = req.params.id;
    try {
      var models = await knex.select("aux.id", "m.model", "aux.value", "aux.deleted_at")
                                  .from("sbr_groups_sub_qn_models as m")
                                  .join("sbr_groups_sub_qn_models_aux as aux")
                                  .whereRaw(`aux.id_sbr_groups_sub_qn = ${id}`)
                                  .whereRaw("m.id = aux.id_sbr_groups_sub_qn_models");
      for (let i = 0; i < models.length; i++) {
          check = await BeansQn.checkIfUseModel(models[i].id);
          if (check.length <= 0) {
              models[i].canDel = 1;
          }
          else {
              models[i].canDel = 0;
          }
      }
      let {question} = await knex('sbr_groups_sub_qn').where('id', id).pluck('question').first();
      if (models) {
          return res.send([models, question]);
      } else {
          return res.send("0");
      }
    } catch (e) {
      return res.send("0");
    }
  },
  async updateModel(req, res, next) {
    var errors = [];
    var error_msg = "";
    try {
        if (!req.body.reference || typeof req.body.reference == undefined || req.body.reference == null) {
            errors.push("Referência inválida");
        } else if ( !req.body.value || typeof req.body.value == undefined || req.body.value == null || req.body.value.length <= 0) {
            errors.push("Valores inválidos");
        } else if (!req.body.model || typeof req.body.model == undefined || req.body.model == null ||req.body.value.length <= 0) {
          errors.push("Modelos inválidos"); 
        } else if (!req.body.question || typeof req.body.question == undefined || req.body.question == null) {
          errors.push("Questão inválida"); 
        } else if (req.body.value.length != req.body.model.length) {
            errors.push("Valores e modelos incompatíveis");
        }
        if (errors.length > 0) {
            errors.forEach((e) => {
            error_msg += e + ", ";
            });
            req.flash("error_msg", error_msg);
            res.redirect(req.header("Referer") || "/groups");
        } else {
            try {
              var { value, model, reference } = req.body;
              model.forEach(async (m, i) => {
                  (value[i] > 100) ? val = 100 : val = value[i];
                  await knex("sbr_groups_sub_qn_models_aux")
                  .where("id_sbr_groups_sub_qn", req.body.reference)
                  .where("id_sbr_groups_sub_qn_models", m)
                  .update({
                      value: val,
                  });
              });
              quest = await knex('sbr_groups_sub_qn')
                              .where('id', req.body.reference)
                              .update({ question: req.body.question });
              req.flash("success_msg", "Atualizado com sucesso !!");
              return res.redirect(req.header("Referer") || "/groups");
            }
            catch (error) {
              req.flash("error_msg", "Error durante a atualização !!");
              res.redirect(req.header("Referer") || "/groups");
            }
        }
    } catch (e) {
      return res.send("0");
    }
  },
  async deleteModel(req, res, next) {
    try {
        var id = req.params.id;
        var type = req.params.type;
        console.log(type)
        if (type == 0) {
            var delModel = await knex("sbr_groups_sub_qn_models_aux")
                                    .where("id", id)
                                    .update({
                                        deleted_at: null,
                                    });
            if (delModel) {
                return res.send('2');
            }
        }
        else if(type == 1){
            var date = new Date();
            var currentDate = date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
            var check = await BeansQn.checkIfUseModel(id);
            
            if (check.length <= 0) {
                var delModel = await knex("sbr_groups_sub_qn_models_aux")
                                    .where("id", id)
                                    .update({
                                        deleted_at: currentDate,
                                    });
                if (delModel) {
                    return res.send('1')
                }
            }
            else {
                return res.send('Não pode ser deletado')
            }
            
        }
        return res.send("0");
    } catch (error) {
        console.log(error)
        return res.send('0');
    }
  },
  async details(req, res, next) {
    try {
      var idqnr = cryptr.decrypt(req.params.idqnr);
      var idgroup = req.params.idsubgroup;
      let qnr = await knex("sbr_groups_sub_qn_qnr")
        .where("id_sbr_qnr", idqnr)
        .pluck("id_sbr_groups_sub_qn");
      var subgroups = await BeansQn.totalSubgroups(qnr, idgroup, idqnr);
      return res.send(subgroups);
    } catch (error) {
      console.log(error);
      return res.send('0');
    }
  },
};
