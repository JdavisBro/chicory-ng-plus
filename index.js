// Hello :)


// Default Paint for when paint is being reset
const defaultPaint = '{ "1_0_0.paint": "eJztl7EOgCAMBfnT\/v\/mwoyJiQ42YNOCPPTdZqLHhQBqSuSPlIMNUlicVAen8BmZViiNHJewX6GuyDGhCTUG8LKhEFOY4QtDwly5cAlbe9oqtJwL\/sLFhAJf+C2hTCuMbr3xhWOE8nah+XyxCrsXUkjhnWvVwhZSSOFkoViFop9tvBbOu40\/4LUvaj0e4hxSuK6QEEIIibAD5br8dA==" }';
const defaultFour = {"progress":1,"color_part_2":16777215,"got_None":1,"stamp_3":1,"stamp_1":1,"color_part_0":16777215,"clothes":"Overalls","stamp_2":1,"new_props":[],"playtime":3.1961329999999997,"prop_basicbed":1,"stamp_0":1,"color_part_1":16777215,"got_Overalls":1,"hat":"Bandana","got_Bandana":1,"events_active":{},"save_date":44473.67195023148,"hair":"Simple","expression":"","timelapse_data":{}}
const defaultFurnature = '{ "basicbed": { "x": 980.0, "lvl": "1_0_1", "flip": 0.0, "time": 44473.674079861113568767905235291, "y": 560.0 } }'

var savedata = [];
var carry = {"paint":true,"clothing":true,"litter":true,"animals":true,"stamp":true,"furniture":true,"art":true}

document.getElementById("filein").onchange = function(){ // Save loaded.
    var file = this.files[0];
    var reader = new FileReader();
    reader.onload = function(progressEvent){
        savedata = this.result.split("\n");
        savedata[3] = JSON.parse(savedata[3])
    };
    reader.readAsText(file);
}

function checkCheckboxes() {
    for (const key in carry) {
        carry[key] = document.getElementById(key+"carry").checked;
    }
}

function updateSave() {
    checkCheckboxes();
    var newFour = defaultFour;
    if (!carry["paint"]) {
        savedata[18] = defaultPaint;
        newFour["power_water"] = 1;
    }
    if (carry["paint"] || carry["art"]) { // Timelapse data
        newFour["timelapse_data"] = {};
        for (const key in savedata[3]["timelapse_data"]) {
            if (key.startsWith("class")) { // Class timelapse data
                if (carry["art"]) {
                    newFour["timelapse_data"][key] = savedata[3]["timelapse_data"][key];
                }
            } else { // Something else hopefully paint lol
                if (carry["paint"]) {
                    newFour["timelapse_data"][key] = savedata[3]["timelapse_data"][key];
                }
            }
        }
    }
    for (const key in savedata[3]) { // Line 4 stuff
        if (key.startsWith("custom")) { // Always carry custom colours
            newFour[key] = savedata[3][key];
        }
        if (key == dog_color_locked) {
            newFour[key] = savedata[3][key];
        }
        if (carry["paint"]) {
            if (key.endsWith("color_0") || key.endsWith("color_1") || key.includes("_sky_")) {
                newFour[key] = savedata[3][key];
            }
        }
        if (carry["clothing"]) {
            if (key.startsWith("got_") || key.startsWith("gift_")) {
                newFour[key] = 1;
            } else if (key.startsWith("color_part_")) {
                newFour[key] = savedata[3][key];
            }
        }
        if (carry["litter"]) {
            if (key.startsWith("found_litter_") || key.startsWith("found_all_litter_") || key.startsWith("foundlitter")) {
                newFour[key] = 1;
            }
        }
        if (carry["animals"]) {
            if (key.startsWith("found_animal_")) {
                newFour[key] = 1;
            }
        }
        if (carry["stamp"]) {
            if (key.startsWith("stamp_")) {
                newFour[key] = 1;
            }
        }
        if (carry["furniture"]) {
            if (key.startsWith("prop")) {
                newFour[key] = 1;
            }
        }
        if (carry["art"] && key == "art_classes_completed") {
            newFour[key] = savedata[3][key]
        }
    }
    if (carry["clothing"]) {
        newFour["hat"] = savedata[3]["hat"];
        newFour["clothes"] = savedata[3]["clothes"];
    }
    newFour["name"] = savedata[3]["name"]
    if (!carry["furniture"]) {
        savedata[9] = defaultFurnature
    }
    savedata[0] = 0;savedata[1] = 0;savedata[2] = 1;
    savedata[4] = 960;savedata[5] = 540;savedata[6] = '{}';
    console.log(newFour)
    savedata[3] = newFour;

}

function downloadSave() {
    if (!savedata) {
        return // Perhaps show an error.
    }
    updateSave();
    savedata[3] = JSON.stringify(savedata[3]);
    var myBlob = new Blob([savedata.join("\n")], {type: 'text/plain'});
    var anchor = document.createElement("a");
    anchor.download = "_playdata";
    anchor.href = window.URL.createObjectURL(myBlob);
    anchor.click();
    savedata = [];
}