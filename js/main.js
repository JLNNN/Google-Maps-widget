var gmapswidget = {
    defaultZoom : 13,

    loadGMaps : function() {
        if ($("div.gmap").length > 0) {
            $.getScript("http://maps.google.com/maps/api/js?sensor=true&callback=gmapswidget._showGMaps", function(data, textStatus, jqxhr) {
                // loaded
            });
        }
    },

    _showGMaps : function() {
        function initMap(x, y, i, z) {
            var map, style = [];
            var center = new google.maps.LatLng(x, y);
            var settings = {
                mapTypeId : google.maps.MapTypeId.ROADMAP,
                zoom : z,
                center : center,
                styles : style,
                scrollwheel : false
            };

            map = new google.maps.Map(document.getElementsByClassName('gmap')[i], settings);

            function attachSecretMessage(marker, message) {
                var infowindow = new google.maps.InfoWindow({
                    content : message
                });
                google.maps.event.addListener(marker, 'click', function() {
                    infowindow.open(map, marker);
                });
            }

            $("div.gmarker[data-gmap-gmarker-id='" + i + "']").each(function(j, el) {
                var xP = $(el).data("gmarker-coords").split(",")[0];
                var yP = $(el).data("gmarker-coords").split(",")[1];

                var marker = new google.maps.Marker({
                    position : new google.maps.LatLng(xP, yP),
                    title : $(el).data("gmarker-title"),
                    animation : google.maps.Animation.DROP,
                    map : map
                });

                marker.setTitle(marker.title.toString());
                attachSecretMessage(marker, $(el).html());
            });

            google.maps.event.addDomListener(window, "resize", function() {
                var center = map.getCenter();
                google.maps.event.trigger(map, "resize");
                map.setCenter(center);
            });
        }

        function touchToEnable(element) {
            element.append("<div class='tapToEnable'></div>");

            $("div.tapToEnable").click(function() {
                $(this).toggleClass("open");
            });
        }

        $("div.gmap").each(function(i, el) {
            $(el).find("> div.gmarker").attr("data-gmap-gmarker-id", i);
            $(el).after($(this).find("> div.gmarker").hide());

            var x = $(el).data("gmap-coords").split(",")[0];
            var y = $(el).data("gmap-coords").split(",")[1];

            zoomstufe = parseInt($(el).data("gmap-coords").split(",")[2]) || gmapswidget.defaultZoom;

            if (zoomstufe < 1) {
                zoomstufe = gmapswidget.defaultZoom;
            }

            initMap(x, y, i, zoomstufe);

            touchToEnable($(el));
        });
    }
};

$(function() {
    gmapswidget.loadGMaps();
});
