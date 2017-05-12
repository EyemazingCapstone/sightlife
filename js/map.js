$(function () {


  var center;
  var hash;
  var pos;
  var id;
  var layer;
  var marker;
  var latlng = [10, 0];
  var zoom = 2;
  var activeLayer = 0;
  var map = L.mapbox.map('map', null, {
    maxZoom: 5,
    minZoom: 1,
    worldCopyJump: true,
    closePopupOnClick: false
  });
  var baseLayer = L.mapbox.tileLayer('pulitzercenter.2xgsoj0r');
  var gridLayer = L.mapbox.gridLayer(null);//'pulitzercenter.traffic-deaths-07312013');
  var country;
  var deathsTable = {
    template: '{{#D_RATE}}<strong>{{{COUNTRY_}}}</strong><br>{{^D_RATE}}No data{{/D_RATE}}' + '{{#D_RATE}}<span class="rate">{{{D_RATE}}}</span> deaths per 100,000 people<br>{{/D_RATE}}' + '<table>' + '<tr><td colspan="2">Reported: {{{D_CRUDE}}}</td><td colspan="3">Estimated: {{{D_EST}}}</td></tr>' + '<tr class="mode-key">' + '<td class="cars breakdown"><span class="val">Cars</span></td>' + '<td class="motorcycles breakdown"><span class="val">Motorcycles</span></td>' + '<td class="cyclists breakdown"><span class="val">Cyclists</span></td>' + '<td class="peds breakdown"><span class="val">Peds</span></td>' + '<td class="other breakdown"><span class="val">Other</span></td>' + '</tr>' + '<tr class="mode-val">' + '<td class="breakdown">{{^N4_WHEEL}}-{{/N4_WHEEL}}{{#N4_WHEEL}}{{{N4_WHEEL}}}%{{/N4_WHEEL}}</td>' + '<td class="breakdown">{{^N3_2_WHEEL}}-{{/N3_2_WHEEL}}{{#N3_2_WHEEL}}{{{N3_2_WHEEL}}}%{{/N3_2_WHEEL}}</td>' + '<td class="breakdown">{{^CYCLISTS}}-{{/CYCLISTS}}{{#CYCLISTS}}{{{CYCLISTS}}}%{{/CYCLISTS}}</td>' + '<td class="breakdown">{{^PEDS}}-{{/PEDS}}{{#PEDS}}{{{PEDS}}}%{{/PEDS}}</td>' + '<td class="breakdown">{{^OTHER}}-{{/OTHER}}{{#OTHER}}{{{OTHER}}}%{{/OTHER}}</td>' + '<tr class="laws">' + '<td colspan="2">Law</td>' + '<td colspan="3">Enforcement<sup>*</sup></td>' + '</tr>' + '<tr>' + '<td colspan="2">Speed</td>' + '<td class="val-{{{SPEED_EN}}}" colspan="3">{{^SPEED_EN}}-{{/SPEED_EN}}{{#SPEED_EN}}{{{SPEED_EN}}}{{/SPEED_EN}}</td>' + '</tr>' + '<tr>' + '<td colspan="2">Helmet</td>' + '<td class="val-{{{HELMET_EN}}}" colspan="3"><span ">{{^HELMET_EN}}-{{/HELMET_EN}}{{#HELMET_EN}}{{{HELMET_EN}}}{{/HELMET_EN}}</td>' + '</tr>' + '<tr>' + '<td colspan="2">Seat-belt</td>' + '<td class="val-{{{SEATBELT_E}}}" colspan="3">{{^SEATBELT_E}}-{{/SEATBELT_E}}{{#SEATBELT_E}}{{{SEATBELT_E}}}{{/SEATBELT_E}}</td>' + '</tr>' + '<tr>' + '<td colspan="2">Alcohol</td>' + '<td class="val-{{{DRINK_EN}}}" colspan="3">{{^DRINK_EN}}-{{/DRINK_EN}}{{#DRINK_EN}}{{{DRINK_EN}}}{{/DRINK_EN}}</td>' + '</tr>' + '<tr>' + '</table>' + '<span class="footnote">* Scale 0-10, respondent consensus</span>' + '{{/D_RATE}}' + '{{#DATE}}<br/><span class="footnote">Data from {{{DATE}}}</span>{{/DATE}}'
  };

  $.getJSON('json/countries.geo.json', function(e) {
    var gjLayer = L.geoJson(e);
    $.getJSON('json/whodata2015.json',
      function(WHOdata2015) {
        map.on('click mousemove', function(e) {
          var results = leafletPip.pointInLayer(e.latlng, gjLayer);
          if (results.length > 0 && results[0].feature.id in WHOdata2015 && $('#info').is(':visible')) {
            if (e.type === "click") {
              $(".map-tooltip:eq(1)")
              .addClass('closable');
            }
            if (e.type === "click" || !$(".map-tooltip:eq(1)").is('.closable')) {
              $(".map-tooltip-content")
              .html(L.mapbox.template(deathsTable.template,
                WHOdata2015[results[0].feature.id])
              );
            }
            $(".map-tooltip:eq(1)")
            .show();
          } else {
            if (e.type === "click" || !$(".map-tooltip:eq(1)").is('.closable')) {
              $(".map-tooltip:eq(1)")
              .removeClass('closable')
              .hide();
            }
          }
        });
     });
  });

  var gridControl = L.mapbox.gridControl(gridLayer, deathsTable);
  var markers = new L.MarkerClusterGroup({
    spiderfyDistanceMultiplier: 3,
    maxClusterRadius: 40,
    disableClusteringAtZoom: 6,
    zoomToBoundsOnClick: false
  });
  var pointer = L.marker([0, 0], {
    icon: L.mapbox.marker.icon({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [0, 0]
      },
      properties: {}
    })
  });

  var storyIcon = L.icon({
    iconUrl: 'css/images/story-icon.png',
    iconSize: [20, 20]
  });



  $.ajax({
    type: "GET",
    dataType: "json",
    url: "json/tour.json",
    success: function (tour) {

      var c = 1;
      var r = -1;
      $('.layer-caption').append(tour[0]['title'] + tour[0]['body']);
      Shadowbox.init({
        overlayOpacity: 0.8,
        autoplayMovies: 'true'
      });

      $('.next-btn').click(function () {

        lat = tour[c]['lat'];
        lng = tour[c]['lon'];
        zoom = tour[c]['zoom'];
        marker = tour[c]['marker'];
        id = tour[c]['id'];
        layer = tour[c]['layer'];

        if (c == -1) {
          c = 0;
        }


        if (marker == 1) {
          map.addLayer(pointer);
        } else {
          map.removeLayer(pointer);
        }

        if (map.hasLayer(country)) {
          map.removeLayer(country);
        }

        if (layer) {
          country = L.mapbox.tileLayer(layer);
          map.addLayer(country);
        }

        $('body').attr("id", "fact-" + id);
        $('.map-tooltip').hide();
        pointer.setLatLng(L.latLng([lat, lng]));
        $('.layer-caption').empty();
        $('.layer-caption').append(tour[c]['title'] + tour[c]['body']);
        map.setView([lat, lng], zoom);
        $('.prev-btn').show();
        Shadowbox.init({
          skipSetup: true
        });
        Shadowbox.setup();
        if (id == 27) {
          $('.next-btn').hide();
        }

        c++;
        r++;
      });



      $('.prev-btn').click(function () {
        if (r == -1) {
          r = 0;
        }


        lat = tour[r]['lat'];
        lon = tour[r]['lon'];
        zoom = tour[r]['zoom'];
        marker = tour[r]['marker'];
        id = tour[r]['id'];
        layer = tour[r]['layer'];


        if (marker == 1) {
          map.addLayer(pointer);
        } else {
          map.removeLayer(pointer);
        }

        if (map.hasLayer(country)) {
          map.removeLayer(country);
        }

        if (layer) {
          country = L.mapbox.tileLayer(layer);
          map.addLayer(country);
        }

        $('body').attr("id", "fact-" + id);
        $('.map-tooltip').hide();
        pointer.setLatLng(L.latLng([lat, lng]));
        lat = tour[r]['lat'];
        lng = tour[r]['lon'];
        zoom = tour[r]['zoom'];
        $('.layer-caption').empty();
        $('.layer-caption').append(tour[r]['title'] + tour[r]['body']);
        Shadowbox.init({
          overlayOpacity: 0.8,
          autoplayMovies: 'true'
        });
        map.setView([lat, lng], zoom);
        $('.next-btn').show();
        Shadowbox.init({
          skipSetup: true
        });
        Shadowbox.setup();
        if (id == 0) {
          $('.prev-btn').hide();
        }

        c = r + 1;
        r--;
      });


    }
  });




  $.ajax({
    type: "GET",
    dataType: "jsonp", 
    url: "http://pulitzercenter.org/services/rest/traffic",
    success: function (data) {

      for (var i = 0; i < data.length; i++) {

        if (data[i]['latitude']) {
          var a = data[i];
          var title = '<h2><a target="#" href="http://pulitzercenter.org/node/' + data[i]['nid'] + '">' + data[i]['node_title'] + '</a></h2>';
          var slides = new Array();
          for (var n = 0; n < a['image'].length; n++) {
            var img = data[i]['image'][n];
            // console.log(data[i]['image'][n]);
            slides.push('<li>' + img + '</li>');
          }
          var images = data[i]['image']
          var image = '<div class="flexslider"><ul class="slides">' + slides + '</ul></div>';
          var summary = data[i]['summary'];
          var link = '<a id="view-story" target=#" href="http://pulitzercenter.org/node/' + data[i]['nid'] + '">View story</a>';
          var marker = L.marker(new L.LatLng(a['latitude'], a['longitude']), {
            icon: storyIcon
          });


          marker.bindPopup(title + image + summary + link, {
            autoPan: true
          });
          markers.addLayer(marker);
        }
      }
      map.addLayer(markers);

      $('.loading').hide();
    }
  });




  $(document).ready(function () {
    $('a.mapbox-share').click(function () {
      $('.mapbox-share-facebook').attr('href', 'https://www.facebook.com/sharer.php?u=http%3A%2F%2Froadskillmap.com&t=undefined');
      $('.mapbox-share-twitter').attr('href', 'http://twitter.com/intent/tweet?status=undefined%0Ahttp%3A%2F%2Froadskillmap.com');
    });
  });




  map.addLayer(baseLayer);
  map.addLayer(gridLayer);
  map.addControl(gridControl);
  map.setView(latlng, zoom);
  map.addControl(L.mapbox.shareControl());




  if (window.location.hash) {
    pos = window.location.hash.split('#')[1];
    hash = pos.split(',');
    latlng = new Array(hash[0], hash[1]);
    zoom = hash[2];
    map.setView(latlng, zoom);
  }




  map.on('popupopen', function (e) {
    $('#info').hide();
    $('.map-tooltip').hide();
    $('.flexslider').flexslider({
      animation: "fade",
      slideshowSpeed: 3000,
      directionNav: true,
      controlNav: false
    });
  });
  map.on('popupclose', function (e) {
    $('#info').show();
    $('#info-open').hide();
  });
  markers.on('clusterclick', function (e) {
    e.layer.spiderfy();
  });
  markers.on('click', function (e) {
    zoom = map.getZoom()
    if (zoom < 4) {
      pos = e.layer.getLatLng();
      lat = pos.lat + 20;
      lng = pos.lng;
    } else if (zoom == 4) {
      pos = e.layer.getLatLng();
      lat = pos.lat + 10;
      lng = pos.lng;
    } else {
      pos = e.layer.getLatLng();
      lat = pos.lat + 5;
      lng = pos.lng;
    }
    map.panTo(new L.LatLng(lat, lng));
  });



  $('#twitter').hover(function () {
    $(this).css("top", "-5px");
  }, function () {
    $(this).css("top", "-262px");
  });
  map.on('drag', function (e) {
    $('#twitter').css("top", "-262px");
  });




  $(document).on("click", "a.map-move", function (e) {
    e.preventDefault();
    $('#pointer').hide();
    var move_lat = $(this).data('lat');
    var move_lon = $(this).data('lon');
    var move_zoom = $(this).data('zoom');
    var move_layer = $(this).data('layer');

    if (map.hasLayer(country)) {
      map.removeLayer(country);
    }

    if (layer) {
      country = L.mapbox.tileLayer(move_layer);
      map.addLayer(country);
    }

    map.setView([move_lat, move_lon], move_zoom);
  });
  $('#info-close').click(function () {
    $('#info').hide();
    $('#info-open').show();
  });
  $('#info-open').click(function () {
    $('#info').show();
    $('#info-open').hide();
  });




  map.on('drag', function (e) {
    _updateHash();
    center = map.getCenter();
    if (center.lat > 85.0 || center.lat < -85.0) {
      map.panTo(new L.LatLng(0, 0));
    }
  });
  map.on('zoomend', function (e) {
    _updateHash();
  });

  function _updateHash() {
    center = map.getCenter();
    zoom = map.getZoom();
    pos = '#' + center.lat + ',' + center.lng + ',' + zoom;
    window.location.hash = pos;
    $('#fullscreen').attr("href", '/' + pos);
    // console.log(latlng);
  }



});
