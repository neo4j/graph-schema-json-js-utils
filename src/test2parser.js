//ajv is for validating your data by comparing to
//JSON schema object you made with typescript-json-schema
import readFileSync from "fs";
import Ajv from "ajv";

const ajv = new Ajv();
//const Ajv = require("ajv");

//Definierar en funktion kallad parser som tar emot två argument: 
//en sökväg till en inmatningsfil och en sökväg till en schemafil.
export function parser( inputFile, schemaFile) {

    //Definierar en funktion för att läsa JSON-filer från disken och 
    //sedan analysera de råa filuppgifterna till ett objekt för användning i JavaScript.
    function readJsonFile(file) {
        let raw = readFileSync(file);
        return JSON.parse(raw);

    }

    //Kallar funktionen två gånger för att konvertera både 
    //inmatningsfilen och schemafilen till objekt.
    let input = readJsonFile(inputFile);
    let schema = readJsonFile(schemaFile);

    //Skickar de två objekten till metoden avj.validate
    const isValid = ajv.validate(schema, input);

    //Om metoden returnerar falskt, kommer isValid att vara falskt, ett fel kommer 
    //att eka till konsolen och funktionen kommer att returnera odefinierad.
    if(!isValid) {
        console.error(JSON.stringify(ajv.errors, null, 2));
        return undefined;
    }

    console.info('[INFO] valid!');

    return input;

}