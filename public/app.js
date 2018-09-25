//Inicializador del elemento Slider
$("#rangoPrecio").ionRangeSlider({
  type: "double",
  grid: false,
  min: 0,
  max: 100000,
  from: 1000,
  to: 20000,
  prefix: "$"
})

function setSearch() {
  let busqueda = $('#checkPersonalizada')
  busqueda.on('change', (e) => {
    if (this.customSearch == false) {
      this.customSearch = true
    } else {
      this.customSearch = false
    }
    $("#rangoPrecio").val("")
    $("#ciudad").val("")
    $("#tipo").val("")
    $('#personalizada').toggleClass('invisible')
  })
}

setSearch()

// Funcion con objeto Seeker para la inicializacion del busquedas
var SeekerIni = function(document, window, undefined, $ ){
  var Seeker = {
      apiUrl:'/buildings',
      $btnFind: $("#buscar"),

      init: function(){
        var self = this
        this.getInfoFilters()
        this.findInfoBuildings()
      },

      getInfoFilters: function(){
        var self = this
        var endpoint = self.apiUrl + '/fillfilters'
        self.ajaxRequest(endpoint,'GET',{})
        .done(function(data){
          var fillfilters = data
          self.renderBuildingsFilters(fillfilters)
        }).fail(function(err){
          console.log(err)
        })
      },
      getInfoBuildings: function(){
        var self = this
        var endpoint = self.apiUrl + '/filters'
        var query = {}
        if($("#ciudad").val()!=""){
          query['city'] = $("#ciudad").val()
        }
        if($("#tipo").val()!=""){
          query['types'] = $("#tipo").val()
        }
        if($("#rangoPrecio").val()!=""){
          query['range_prices'] = $("#rangoPrecio").val()
        }

        self.ajaxRequest(endpoint,'GET',query)
        .done(function(data){
          var buildings = data
          self.renderBuildings(buildings)
        }).fail(function(err){
          console.log(err)
        })
      },
      ajaxRequest: function(url,type,data){
        return $.ajax({
          url:url,
          type:type,
          data:data
        })

      },
      findInfoBuildings: function(){
        var self = this
        self.$btnFind.on('click',function(){
          var buildingslist = $('.lista')
          buildingslist.empty()
          self.getInfoBuildings()
        })
      },
      renderBuildings: function(buildings){
        var self = this
        var buildingslist = $('.lista')
        var buildingsTemplate = 
          '<div class="card horizontal">'+
          '<div class="card-image">'+
            '<img src="img/home.jpg">'+
          '</div>'+
          '<div class="card-stacked">'+
            '<div class="card-content">'+
              '<div>'+
                '<b>Direccion: </b><p>:Direccion:</p>'+
              '</div>'+
              '<div>'+
                '<b>Ciudad: </b><p>:Ciudad:</p>'+
              '</div>'+
              '<div>'+
                '<b>Telefono: </b><p>:Telefono:</p>'+
              '</div>'+
              '<div>'+
                '<b>Código postal: </b><p>:Codigo_Postal:</p>'+
              '</div>'+
              '<div>'+
                '<b>Precio: </b><p>:Precio:</p>'+
              '</div>'+
              '<div>'+
                '<b>Tipo: </b><p>:Tipo:</p>'+
              '</div>'+
            '</div>'+
            '<div class="card-action right-align">'+
              '<a href="#">Ver más</a>'+
            '</div>'+
          '</div>'+
        '</div>'
        buildings.map(function(info){
          var newbuildings = 
                        buildingsTemplate
                        .replace(':Direccion:',info.Direccion)
                        .replace(':Ciudad:',info.Ciudad)
                        .replace(':Telefono:',info.Telefono)
                        .replace(':Codigo_Postal:',info.Codigo_Postal)
                        .replace(':Precio:',info.Precio)
                        .replace(':Tipo:',info.Tipo)
          buildingslist.append(newbuildings)
        })
      },
      renderBuildingsFilters: function(fillfilters){
        var self = this
        var citieslist = $('#ciudad')
        var typeslist = $('#tipo')

        fillfilters['cities'].map(function(info){
          citieslist.append(new Option(info, info))
        })

        fillfilters['types'].map(function(info){
          typeslist.append(new Option(info, info))
        })
      }
    }// end Seeker
    Seeker.init();
}

SeekerIni(document, window, undefined, jQuery );