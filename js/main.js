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
     options()
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
          checked: ['R', 'D', 'ID']
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

/*

function filtrar() {

     let partido = Array.from(document.querySelectorAll('input[name=checkbox]:checked')).map(elt => elt.value) //array con los checkboxes checkeados
     let estado = Array.from(document.querySelector('select[name=dropdown-estados]')).filter(opt => opt.selected).map(opt => opt.value) //array de la opcion seleccionada

     let filtrados = [];

     for (let i = 0; i < app.miembros.length; i++) {

          if (partido.includes(app.miembros[i].party) && (estado.includes(app.miembros[i].state) || estado == "All")) { //filtra utilizando los checkboxes y el dropdown pero los suma
               filtrados.push(app.miembros[i])
          }
     }
     console.log(filtrados);
     app.filtrados = filtrados
}

*/