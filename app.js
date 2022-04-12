const { guardarDB, leerDB } = require('./helpers/guardarArchivo');
const { inquirerMenu, pausa, leerInput, listarTareaBorrar, confirmar, mostrarListadoCheckList } = require('./helpers/inquirer');
const Tarea = require('./models/tarea');
const Tareas = require('./models/tareas');

require('colors');

/* const { mostrarMenu, pausa } = require('./helpers/mensajes'); */

const main = async() => {

    let opt = '';
    const tareas = new Tareas();
    const tareasDB = leerDB();

    if (tareasDB) {
        tareas.cargarTareasFromArray(tareasDB);
    }

    do {
        // Imprimir el menú
        opt = await inquirerMenu();
        console.log({ opt });

        switch (opt) {
            case '1':
                // crear Tarea
                const desc = await leerInput('Descripción:');
                tareas.crearTarea(desc);
                break;

            case '2':
                tareas.listadoCompleto();
                break;

            case '3':
                //Listar Tareas Completadas
                tareas.listarPendientesCompletadas();
                break;

            case '4':
                //Listar Tareas Pendientes
                tareas.listarPendientesCompletadas(false);
                break;

            case '5':
                //Completado | Pendiente
                const ids = await mostrarListadoCheckList(tareas.listadoArr);
                tareas.toggleCompletadas(ids);
                break;

            case '6':
                //Borrar Tareas
                const id = await listarTareaBorrar(tareas.listadoArr);
                if (id !== '0') {
                    const resp = await confirmar('¿Está Seguro?');
                    if (resp) {
                        tareas.borrarTarea(id);
                        console.log('Tarea borrada Correctamente'.green);
                    }
                }

                break;
        }

        guardarDB(tareas.listadoArr);

        await pausa();

    } while (opt !== '0');


}

main();