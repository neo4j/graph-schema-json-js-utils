import { parser } from './test2parser.js';

function main() {
    //Hämtar de kommandoradsargument som skickas till programmet (process.argv).
    //Eftersom de två första argumenten är programmet (nodejs) och filen som körs
    //(test2index.js) tas dessa argument bort med hjälp av slice-metoden.
    let args = process.argv.slice(2);
    
    //Listvariabeln argv tilldelas de återstående argumenten, som bör vara sökvägen 
    //till inmatningsfilen och sökvägen till schemafilen.

    //Om argv inte innehåller minst två objekt, ekas ett användningsmeddelande 
    //till konsolen och funktionen återgår.
    if(args.length < 2) {
        
        console.log('USAGE: node test2index.js test-files/good.json test-files/schema.json');
        return;
    }

    let [inputFile, schemaFile] = args;

    console.log('input file: ${inputFile}');
    console.log('schema file: ${schemaFile}');

    let json = parser( inputFile, schemaFile);

    if( !json){
        console.error('[ERROR] inpit not valide');
        return;
    }

    console.log(JSON.stringify(json,null,2));

}

main();