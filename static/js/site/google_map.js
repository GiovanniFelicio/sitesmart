'use strict';

//import $ from '/Users/PC/Desktop/Giovanni/site-smart/js/jquery.min';
var google;
var getJSON = function (url, sucesso, erro) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.open("GET", url, true);
    httpRequest.responseType = "json";
    httpRequest.addEventListener("readystatechange", function (event) {
      if (httpRequest.readyState == 4) {
        if (httpRequest.status == 200) {
          if (sucesso) sucesso(httpRequest.response);
        } else {
          if (erro) erro(httpRequest.status, httpRequest.statusText);
        }
      }
    });

    httpRequest.send();
  }
function init() {
    // Basic options for a simple Google Map
    // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
    // var myLatlng = new google.maps.LatLng(40.71751, -73.990922);
    var myLatlng = new google.maps.LatLng(-24.95534800, -53.45194400);
    // 39.399872
    // -8.224454

    var mapOptions = {
        // How zoomed in you want the map to start at (always required)
        zoom: 4,

        // The latitude and longitude to center the map (always required)
        center: myLatlng,

        // How you would like to style the map.
        scrollwheel: false,
        styles: [{ 'featureType': 'administrative.land_parcel', 'elementType': 'all', 'stylers': [{ 'visibility': 'off' }] }, { 'featureType': 'landscape.man_made', 'elementType': 'all', 'stylers': [{ 'visibility': 'off' }] }, { 'featureType': 'poi', 'elementType': 'labels', 'stylers': [{ 'visibility': 'off' }] }, { 'featureType': 'road', 'elementType': 'labels', 'stylers': [{ 'visibility': 'simplified' }, { 'lightness': 20 }] }, { 'featureType': 'road.highway', 'elementType': 'geometry', 'stylers': [{ 'hue': '#f49935' }] }, { 'featureType': 'road.highway', 'elementType': 'labels', 'stylers': [{ 'visibility': 'simplified' }] }, { 'featureType': 'road.arterial', 'elementType': 'geometry', 'stylers': [{ 'hue': '#fad959' }] }, { 'featureType': 'road.arterial', 'elementType': 'labels', 'stylers': [{ 'visibility': 'off' }] }, { 'featureType': 'road.local', 'elementType': 'geometry', 'stylers': [{ 'visibility': 'simplified' }] }, { 'featureType': 'road.local', 'elementType': 'labels', 'stylers': [{ 'visibility': 'simplified' }] }, { 'featureType': 'transit', 'elementType': 'all', 'stylers': [{ 'visibility': 'off' }] }, { 'featureType': 'water', 'elementType': 'all', 'stylers': [{ 'hue': '#a1cdfc' }, { 'saturation': 30 }, { 'lightness': 49 }] }]
    };

    // Get the HTML DOM element that will contain your map
    // We are using a div with id='map' seen below in the <body>
    var mapElement = document.getElementById('map');

    // Create the Google Map using out element and options defined above
    var map = new google.maps.Map(mapElement, mapOptions);

    var addresses = ['RUA ANTONIO VICTOR MAXIMIANO,PARQUE INDUSTRIAL II,107 -  85825000 - Santa Tereza do Oeste - PR',
        'RUA CAROLINA FLORENCE,JD NOSSA SRA AUXILIADORA,1472, - 13073076 - Campinas -SP',
        'R.CONDE DE BONFIM,TIJUCA,255, LJ122/123/124 SAENS PENA MED.C.TIJUCA - 20520051 - Rio de Janeiro - RJ',
        'RUA SAO LUIZ,SANTANA,560, - 90620170 - Porto Alegre - RS',
        'RUA VERGUEIRO,VILA MARIANA,3339, - 04101300 - São Paulo - SP',
        'RUA DES. WESTPHALEN,REBOUCAS,1186, - 80230100 - Curitiba - PR',
        'AV. BRASIL,SANTA EFIGENIA,883, - 30140000 - Belo Horizonte - MG',
        'R ALEIXO NETTO,SANTA LUCIA,322, SALA 704 - 29056100 - Vitoria - ES',
        'R DOM AQUINO,CENTRO,2202, - 79002182 - Campo Grande - MS',
        'RUA ANDRADE NEVES,SANTA CRUZ,2098, - 85015210 - Guarapuava - PR',
        'RUA GENERAL ARCY DA ROCHA NOBREGA,Jardim America,1210, - 95040000 - Caxias do Sul - RS',
        'R TABIRA,BOA VISTA,251, SALA 01 A - 50050330 - Recife - PE',
        'AV INDEPENDENCIA,CENTRO,400, - 14010210 - Ribeirão Preto - SP',
        'BRASILIO MACHADO,CENTRO,261, - 09715140 - São Bernardo do Campo - SP',
        'R TOME CAVALCANTE, AREIA BRANCA,261, - 56330055 - Petrolina - PE',
        'AVENIDA FRANKLIN FERRAZ,CANDEIAS,772 - 45028706 - Vitoria da Conquista - BA',
        'AV. JURACY MAGALHAES JR.,HORTO FLORESTAL,879- 40295090 - Salvador - BA',
        'AV. GETULIO VARGAS, PARQUE JARDIM EUROPA, 21-100 - 17017383 - Bauru - SP',
        'AV PRESIDENTE VARGAS,SETOR CENTRAL,80 - 75901040 - Rio Verde - GO',
        'R NEO ALVES MARTINS,ZONA 03,1058, - 87050110 - Maringá - PR',
        'R SANTOS SARAIVA, ESTREITO, 469,  EDIFICIO HENRIQUE DEUCHER - 88070100 - Florianópolis - SC'
    ];

    for (var x = 0; x < addresses.length; x++) {
        getJSON('http://maps.googleapis.com/maps/api/geocode/json?address=' + addresses[x] + '&sensor=false', (data) => {
            var p = data.results[0].geometry.location;
            var latlng = new google.maps.LatLng(p.lat, p.lng);
            var maker = new google.maps.Marker({
                position: latlng,
                map: map,
                icon: 'images/icone_place_filiais.png'
            });
            maker();
        });
        // $.getJSON('http://maps.googleapis.com/maps/api/geocode/json?address=' + addresses[x] + '&sensor=false', null, (data) => {
        //     var p = data.results[0].geometry.location;
        //     var latlng = new google.maps.LatLng(p.lat, p.lng);
        //     var maker = new google.maps.Marker({
        //         position: latlng,
        //         map: map,
        //         icon: 'images/icone_place_filiais.png'
        //     });
        //     maker();
        // });
    }
    getJSON('http://maps.googleapis.com/maps/api/geocode/json?address=RUA BARAO DO CERRO AZUL,CENTRO,1252 - 85801080 - Cascavel - PR', (data) => {
        console.log(data.results);
        var p = data.results[0].geometry.location;
        var latlng = new google.maps.LatLng(p.lat, p.lng);

        var maker = new google.maps.Marker({
            position: latlng,
            map: map,
            icon: '/images/icone_place_sede.png'
        });
        maker();
    });
    // $.getJSON('http://maps.googleapis.com/maps/api/geocode/json?address=RUA BARAO DO CERRO AZUL,CENTRO,1252 - 85801080 - Cascavel - PR', null, (data) => {
    //     var p = data.results[0].geometry.location;
    //     var latlng = new google.maps.LatLng(p.lat, p.lng);

    //     var maker = new google.maps.Marker({
    //         position: latlng,
    //         map: map,
    //         icon: '/images/icone_place_sede.png'
    //     });
    //     maker();
    // });
}
google.maps.event.addDomListener(window, 'load', init);