var miInicializador = {
    method: 'GET',
    headers: {
        "X-API-Key": "UMgfcovPjJCaPC8M1tETQ9KP8zSTrzjAc9acZ2gH"
    },
    mode: 'cors',
    cache: 'default'
};

function fetchJson(url, init) {
    return fetch(url, init).then(function (response) {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
    });
}

fetchJson('https://api.propublica.org/congress/v1/116/senate/members.json', miInicializador).then(json => {
    app.miembros = json.results[0].members
    console.log(app.miembros);
    stats();
}).catch(function (error) {
    console.log("Error :c", error)
});

var app = new Vue({
    el: '#app',
    data: {
        message: '',
        miembros: [],
        filtrados: [],
        statistics: {

            republican: 0, //54
            democrat: 0, //45
            independent: 0, //2
            repvotedwithpct: 0,
            demvotedwithpct: 0,
            idvotedwithpct: 0,
            mostEngaged: [],
            leastEngaged: [],
            mostLoyal: [],
            leastLoyal: [],

        }
    }
})


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////CANTIDADES DE REPRESENTANTES POR PARTIDO////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function stats() {
    app.statistics.republican = app.miembros.filter(member => member.party == "R");
    app.statistics.democrat = app.miembros.filter(member => member.party == "D");
    app.statistics.independent = app.miembros.filter(member => member.party == "ID");
    app.statistics.repvotedwithpct = porcentajes(app.statistics.republican);
    app.statistics.demvotedwithpct = porcentajes(app.statistics.democrat);
    app.statistics.idvotedwithpct = porcentajes(app.statistics.independent);
    app.statistics.mostEngaged = engaged();
    app.statistics.leastEngaged = engaged2();
    app.statistics.mostLoyal = loyalty();
    app.statistics.leastLoyal = loyalty2();
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////PORCENTAJES DE VOTOS CON EL PARTIDO/////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function porcentajes(x) {
    let i = x.map(member => member.votes_with_party_pct).reduce((a, b) => (a + b) || 0)
    return (i / x.length);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////MOST ENGAGED//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function engaged() {
    let i = app.miembros.sort((a, b) => a.missed_votes_pct - b.missed_votes_pct);
    return i.slice(0, (0.1 * i.length));
}

/*function imprimirMostEngaged() {
    let i = engaged().map(member => "<tr>" + "<td>" + member.first_name + " " + member.last_name + "</td>" + "<td>" + member.missed_votes + "</td>" + "<td>" + member.missed_votes_pct + '%' + "</td></tr>").join("");
    return i;
}*/

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////LEAST ENGAGED/////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function engaged2() {
    let i = app.miembros.sort((a, b) => a.missed_votes_pct - b.missed_votes_pct).reverse();
    return i.slice(0, (0.1 * i.length));
}

/*function imprimirLeastEngaged() {
    let i = statistics.leastEngaged.map(member => "<tr>" + "<td>" + member.first_name + " " + member.last_name + "</td>" + "<td>" + member.missed_votes + "</td>" + "<td>" + member.missed_votes_pct + '%' + "</td></tr>").join("");
    return i;
}*/

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////PARTY LOYALTY/////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function loyalty() {
    let i = app.miembros.sort((a, b) => a.votes_with_party_pct - b.votes_with_party_pct); //most loyal
    return i.reverse().slice(0, (0.1 * i.length));
}

/*function imprimirMostLoyal() {
    let i = statistics.mostLoyal.map(member => "<tr>" + "<td>" +
        member.first_name + " " + member.last_name + "</td>" + "<td>" + ((member.votes_with_party_pct * member.total_votes) / 100) + "</td>" + "<td>" + member.votes_with_party_pct + '%' + "</td></tr>").join("")
    return i;
}*/

function loyalty2() {
    let i = app.miembros.sort((a, b) => a.votes_with_party_pct - b.votes_with_party_pct); //least loyal
    return i.slice(0, (0.1 * i.length));
}

/*function imprimirLeastLoyal() {
    let i = statistics.leastLoyal.map(member => "<tr>" + "<td>" +
        member.first_name + " " + member.last_name + "</td>" + "<td>" + ((member.votes_with_party_pct * member.total_votes) / 100) + "</td>" + "<td>" + member.votes_with_party_pct + '%' + "</td></tr>").join("")
    return i;
}*/

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////AGREGO LOS DATOS AL HTML//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
function print() {
    document.getElementById('rep-number').innerHTML = statistics.republican.length
    document.getElementById('dem-number').innerHTML = statistics.democrat.length
    document.getElementById('id-number').innerHTML = statistics.independent.length
    document.getElementById('rep-voted-with').innerHTML = statistics.repvotedwithpct
    document.getElementById('dem-voted-with').innerHTML = statistics.demvotedwithpct
    document.getElementById('id-voted-with').innerHTML = statistics.idvotedwithpct
}


function existe() {
    let selectorDeId = document.querySelector('#leastEngaged', '#mostEngaged');
    if (selectorDeId == null) {
        document.getElementById('mostLoyal').innerHTML = imprimirMostLoyal()
        document.getElementById('leastLoyal').innerHTML = imprimirLeastLoyal()
    } else {
        document.getElementById('leastEngaged').innerHTML = imprimirLeastEngaged()
        document.getElementById('mostEngaged').innerHTML = imprimirMostEngaged()
    }
}
*/