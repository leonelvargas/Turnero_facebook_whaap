const ChatbotUser = require('./Models/ChatbotUsers');

function saveUserData (agent) {
    // Check the availibility of the time, and make an appointment if there is time on the calendar
    return savedata_inDB(agent).then(() => {
      agent.add('Ok, su información fué guardada satisfactoriamente. Ingrese "menu" para sacar un turno con Nosotros (ᵔᴥᵔ)');
    }).catch(() => {
      agent.add('Ese DNI ya se encuentra registrado, ingrese "hola" para volver al inicio, para completar el formulario con otro DNI.');
    });
  }

  const savedata_inDB = (agent) => {
    return new Promise((resolve, reject) => {
      //create the ChatBot object
        console.log('inicia saveUserData with DNI');
        let chatbotUser = new ChatbotUser({
          Name_pet: agent.parameters.pet,
          type_pet: agent.parameters.raza,
          Name_user: agent.parameters.nombre,
          direction_user: agent.parameters.direction,
          phone_number_user: agent.parameters.tel,
          dni_user: agent.parameters.dni
        });
        chatbotUser.save((err, res) => {
          console.log(res);
          err ? reject(err) : resolve(res);
        });
      });
    };

module.exports = {
    saveUserData,
}