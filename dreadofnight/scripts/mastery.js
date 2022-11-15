Hooks.on("createChatMessage", (data, options, flags, id) => {
    updateChatMessage(data, options, flags);

});

function updateChatMessage(data, options, flags) {

    let actorId = data.speaker.actor;
    let actor = game.actors.get(actorId);
    let content = data.content;
    let rolltype;
    if (content.includes("Strength")) rolltype = 'str';
    if (content.includes("Agility")) rolltype = "agi";
    if (content.includes("Influence")) rolltype = "inf";
    if (content.includes("Wits")) rolltype = "wit";
    if (content.includes("Arcane")) rolltype = "arc";
    if (content.includes("Luck")) rolltype = "luk";

    let actorStat = actor.system.stats[rolltype];
    if (actorStat.toggle) {
        let mastery = actor.system.attrTop.hold.value;
        let searchString = `<div class="dice-formula">2d6 + 1 + 0</div>`;
        let replaceString = `<div class="dice-formula">2d6 + 1 + ${mastery}</div>;`;
        content = content.replace(searchString, replaceString);
        let searchString2 = `</em></div>`;
        let replaceString2 = ` Mastery (+${mastery})</em></div>`;
        content = content.replace(searchString2, replaceString2);
        let rolltotal = content.substr(content.indexOf('"dice-total">') + 13, 2);
        if (!Number(rolltotal)) {
            rolltotal = content.substr(content.indexOf('"dice-total">') + 13, 1);
        }
        let newtotal = Number(rolltotal) + Number(mastery);
        
        let searchString3 = `<h4 class="dice-total">${rolltotal}</h4>`;
        let replaceString3 = `<h4 class="dice-total">${newtotal}</h4>`;
        content = content.replace(searchString3, replaceString3);

        let searchString4 = "";
        let replaceString4 = "";
        let searchString5 = "";
        let replaceString5 = "";

        if (rolltotal < 8) {
            searchString4 = `<div class="row result failure">
        <div class="result-label">Task failure</div>`;
            searchString5 = `<div class="roll failure">`
        } else if (rolltotal >= 8 && rolltotal < 11) {
            searchString4 = `<div class="row result partial">
        <div class="result-label">Partial success</div>`;
            searchString5 = `<div class="roll partial">`
        } else if (rolltotal >= 11 && rolltotal < 13) {
            searchString4 = `<div class="row result success">
        <div class="result-label">Task success</div>`;
            searchString5 = `<div class="roll success">`

        } else if (
            rolltotal >= 13
        ) {
            searchString4 = `<div class="row result critical">
        <div class="result-label">Superior success!</div>`;
            searchString5 = `<div class="roll critical">`

        }
        switch (true) {
            case (newtotal < 8): {
                replaceString4 = `<div class="row result failure">
        <div class="result-label">Task failure</div>`;
                replaceString5 = `<div class="roll failure">`

            }
            break;
            case (8 <= newtotal && newtotal < 11): {

                replaceString4 = `<div class="row result partial">
        <div class="result-label">Partial success</div>`;
                replaceString5 = `<div class="roll partial">`

            }
            break;
            case (11 <= newtotal && newtotal < 13): {

                replaceString4 = `<div class="row result success">
        <div class="result-label">Task success</div>`;
                replaceString5 = `<div class="roll success">`

            }
            break;
            case (13 <= newtotal): {
                replaceString4 = `<div class="row result critical">
        <div class="result-label">Superior success!</div>`;
                replaceString5 = `<div class="roll critical">`

            }
            break;
        }

        content = content.replace(searchString4, replaceString4);
        content = content.replace(searchString5, replaceString5);


        let chatMessage = game.messages.get(data._id);
        chatMessage.update({
            content: content
        }, {
            ishookflag: true
        });

    }

}