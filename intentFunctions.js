//files
const dialog_functions = require('./dialogflow');

function makeAppointment(agent) {
    // Calculate appointment start and end datetimes (end = +1hr from start)
    const dateTimeStart = dialog_functions.convertParametersDate(agent.parameters.fecha, agent.parameters.hora);
    const dateTimeEnd = dialog_functions.addHours(dateTimeStart, 2);
    const dni = agent.parameters.dni;
    const pet = agent.parameters.pet;
    const appointmentTimeString = dateTimeStart.toLocaleString(
        'es-ES',
        { month: 'long', day: 'numeric', hour: 'numeric', timeZone: dialog_functions.timeZone }
    );
    // Check the availability of the time, and make an appointment if there is time on the calendar
    return dialog_functions.createCalendarEvent(dateTimeStart, dateTimeEnd, dni, pet).then((event) => {
      console.log('la infoooooo:',event);
      agent.add(`Ok, ${event.data.summary}, su cita está reservada, Los esperamos ʕᵔᴥᵔʔ. En el dia: ${appointmentTimeString}!.`);
    }).catch(() => {
        agent.add(`Lo siento no tenemos disponible ese horario ${appointmentTimeString}. Ingrese "menu" para volver a sacar un turno, en otro horario.`);
    });
  }

  function deleteAppointment (agent) {
    const dni = agent.parameters.dni;
    // Check the availibility of the time, and make an appointment if there is time on the calendar
    return dialog_functions.deleteEvent(dni).then(() => {
      agent.add('Ok, su turno fue eliminado satisfactoriamente. Ingrese "hola" si quiere entrar al menú del turnero.');
    }).catch(() => {
      agent.add('No se encontró el turno con dicho DNI, ingrese "hola" para volver al menú del turnero.');
    });
  }

  function updateAppointment(agent) {
    const dni = agent.parameters.dni;
    // Calculate appointment start and end datetimes (end = +1hr from start)
    const dateTimeStart = dialog_functions.convertParametersDate(agent.parameters.fecha, agent.parameters.hora);
    const dateTimeEnd = dialog_functions.addHours(dateTimeStart, 2);
    const appointmentTimeString = dateTimeStart.toLocaleString(
        'es-ES',
        { month: 'long', day: 'numeric', hour: 'numeric', timeZone: dialog_functions.timeZone }
    );
    // Update an User's event
    return dialog_functions.updateEvent(dateTimeStart, dateTimeEnd, dni).then(() => {
        agent.add(`Ok, tu cita fue actualizada. ${appointmentTimeString} está agendado!. Ingrese "hola" para volver al menú del turnero.`);
      }).catch(() => {
        agent.add('Si el dni fue correctamente ingresado, me temo que ese turno está ocupado. Porfavor ingrese "hola" para volver al menú del turnero.');
      });
  }

module.exports = {
    makeAppointment,
    deleteAppointment,
    updateAppointment,
}