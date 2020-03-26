const stateMapping = [
    {possibleNames: ["dc", "washington dc"], standardizedName: "district of columbia"},

];

/**
 * Takes a state name and gives back the standardized name, if a change is needed
 */
function standardizeStateName(stateName) {
    const possibleMapping = stateMapping.filter(mapping => mapping.possibleNames.indexOf(stateName) >= 0);
    return (possibleMapping.length == 1 ? possibleMapping[0].standardizedName : stateName.toLowerCase());
}

module.exports = {
    standardizeStateName
}
