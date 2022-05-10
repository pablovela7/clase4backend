const fs = require("fs");

/**
 * Lee un array de objetos dentro de un archivo, retorna un array de objetos json
 * @param {string} fileName
 * @returns Array de objetos contenido en el archivo
 */
const fileToArray = async (fileName) => {
  try {
    //leer archivo y cargarlo en array
    //devolver array
    return JSON.parse(await fs.promises.readFile(fileName));
  } catch (error) {
    console.log("Se produjo un error!");
    throw error;
  }
};

/**
 * Escribe el array completo en un archivo
 * @param {string} fileName
 * @param {obj} array
 */
const arrayToFile = async (fileName, array) => {
  try {
    //leer archivo y cargarlo en array
    await fs.promises.writeFile(fileName, JSON.stringify(array));
  } catch (error) {
    throw error;
  }
};

/**
 * Crea un archivo nuevo con el nombre recibido por parametro
 * @param {string} fileName
 */
const createEmptyFile = async (fileName) => {
  try {
    //leer archivo y cargarlo en array
    await fs.promises.writeFile(fileName, "[]");
  } catch (e) {
    throw error;
  }
};

/**
 * Valida que exista el archivo, si no existe lo crea llamando a createEmptyFile(fileName)
 * @param {string} fileName 
 */
const fileChecker = async (fileName) => {
  //chequeo que el archivo exista si no existe lo creo
  const stats = fs.existsSync(fileName);

  if (stats == false) {
    console.log(`Creo archivo vacio: ${fileName}`);
    await createEmptyFile(fileName);
  }
};

class Contenedor {
  constructor(fileName) {
    this.fileName = fileName;
  }

  /**
   * Guarda agrega un objeto al archivo y devuleve su id
   * @param {string} obj 
   * @returns Id del objeto guardado
   */
  async save(obj) {
    try {
      //chequeo que el archivo exista si no existe lo creo
      await fileChecker(this.fileName);

      //lee el archivo y lo guardia en un array
      let array = await fileToArray(this.fileName);
      let longitud = array.length;
      let index = 0;
      //Valido que el archivo contenga objetos
      if (longitud == 0) {
        index = 1;
      } else {
        //sumar uno al id del ultimo elemento y agregarlo al id del objeto
        index = array[longitud - 1].id + 1;
      }

      obj.id = index;
      array.push(obj);
      //escribir archivo
      await arrayToFile(this.fileName, array);
      //devolver id
      return obj.id;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Selecciona un objeto del archivo y lo devuleve
   * @param {int} id 
   * @returns Devuelve el objeto si lo encuentra
   */
  async getById(id) {
    try {

      await fileChecker(this.fileName);

      let array = await fileToArray(this.fileName);

      array = array.filter((x) => {
        return x.id == id;
      });

      return array[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lee el archivo y lo devuelve completo
   * @returns Devuelve todos los objetos del archivo
   */
  async getAll() {
    try {
      await fileChecker(this.fileName);

  
      return  fileToArray(this.fileName);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Borra el objeto con le id seleccionado en el archivo
   * @param {int} id 
   */
  async deleteById(id) {
    try {
      
      await fileChecker(this.fileName);
     
      let array = await fileToArray(this.fileName);
     
      array = array.filter((x) => {
        return x.id != id;
      });
      await arrayToFile(this.fileName, array);
    } catch (error) {
      throw error;
    }
  }


  /**
   * Borra todos los objetos del archivo llamado a createEmptyFile(this.fileName)
   */
  async deleteAll() {
    await createEmptyFile(this.fileName);
  }
}

async function main() {
  try {

    let objeto = {
      title: "",
      price: 0.0,
      thumbnail: "",
      id: 0,
    };

    objeto.title = "Producto1";
    objeto.price = 9.99;
    objeto.thumbnail = "http://URI";


    productos = new Contenedor("productos.txt");

    console.log('Llamo a save 11 veces');

    console.log(await productos.save(objeto));
    console.log(await productos.save(objeto));
    console.log(await productos.save(objeto));
    console.log(await productos.save(objeto));
    console.log(await productos.save(objeto));
    console.log(await productos.save(objeto));
    console.log(await productos.save(objeto));
    console.log(await productos.save(objeto));
    console.log(await productos.save(objeto));
    console.log(await productos.save(objeto));
    console.log(await productos.save(objeto));

    console.log('Traigo el elemento con id 8');

    console.log(await productos.getById(8));

    console.log('Borro el elemento con el ID 10');

    await productos.deleteById(10);

    console.log('Agrego un nuevo elemento');

    console.log(await productos.save(objeto));


    console.log('Traigo todos');
    console.log(await productos.getAll());


    console.log('Borro el elemento con el ID 8');

    await productos.deleteById(8);


    console.log('Agrego un nuevo elemento');

    console.log(await productos.save(objeto));

    console.log('Traigo todos para validar que no se repita ningun id');
    console.log(await productos.getAll());



    console.log('Vacio el archivo');
    await productos.deleteAll();


  } catch (error) {
    console.log("El error es: ", error);
  }
}

main();