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

fetchJson('https://api.propublica.org/congress/v1/116/house/members.json', miInicializador).then(json => {
     app.miembros = json.results[0].members
     console.log(app.miembros);
     stats();
     options();
     app.filtrar();
}).catch(function (error) {
     console.log("Error :c", error)
});

var app = new Vue({
     el: '#app',
     data: {
          message: '',
          miembros: [],
          filtrados: [],
          opciones: [],
          selected: 'All',
          checked: ['R', 'D', 'ID'],
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
     },
     methods: {
          filtrar: function () {

               let partido = Array.from(document.querySelectorAll('input[name=checkbox]:checked')).map(elt => elt.value) //array con los checkboxes checkeados
               let estado = app.selected

               let filtrados = [];

               for (let i = 0; i < app.miembros.length; i++) {

                    if (partido.includes(app.miembros[i].party) && (estado == app.miembros[i].state || estado == "All")) { //filtra utilizando los checkboxes y el dropdown pero los suma
                         filtrados.push(app.miembros[i])
                    }
               }
               console.log(filtrados);
               app.filtrados = filtrados
          }
     }
})

function options() {
     let aux = ['All']
     for (let i = 0; i < app.miembros.length; i++) {
          aux.push(app.miembros[i].state)
     }
     app.opciones = aux.filter((el, index) => aux.indexOf(el) === index)
}

function stats() {
     app.statistics.republican = app.miembros.filter(member => member.party == "R");
     app.statistics.democrat = app.miembros.filter(member => member.party == "D");
     app.statistics.independent = app.miembros.filter(member => member.party == "ID");
     app.statistics.repvotedwithpct = porcentajes(app.statistics.republican);
     app.statistics.demvotedwithpct = porcentajes(app.statistics.democrat);
     //app.statistics.idvotedwithpct = porcentajes(app.statistics.independent);
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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////LEAST ENGAGED/////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function engaged2() {
     let i = app.miembros.sort((a, b) => a.missed_votes_pct - b.missed_votes_pct).reverse();
     return i.slice(0, (0.1 * i.length));
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////PARTY LOYALTY/////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function loyalty() {
     let i = app.miembros.sort((a, b) => a.votes_with_party_pct - b.votes_with_party_pct); //most loyal
     return i.reverse().slice(0, (0.1 * i.length));
}



function loyalty2() {
     let i = app.miembros.sort((a, b) => a.votes_with_party_pct - b.votes_with_party_pct); //least loyal
     return i.slice(0, (0.1 * i.length));
}